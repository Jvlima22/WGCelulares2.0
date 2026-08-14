import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { services, whatsappLink } from "@/data/catalog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { maskPhone, onlyDigits } from "@/lib/format";

const marcas = ["Apple / iPhone", "Samsung", "Xiaomi", "Motorola", "LG", "Outra"];
const urgencias = [
  { value: "hoje", label: "Preciso hoje" },
  { value: "essa_semana", label: "Essa semana" },
  { value: "sem_pressa", label: "Sem pressa" },
];
const simNao = ["Sim", "Não", "Não sei"];

const steps = ["Aparelho", "Problema", "Contato"] as const;

export function QuoteWidget({ serviceSlug }: { serviceSlug?: string }) {
  const { session, profile } = useAuth();
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");

  const [issue, setIssue] = useState("");
  const [details, setDetails] = useState("");
  const [urgency, setUrgency] = useState("essa_semana");
  const [turnsOn, setTurnsOn] = useState("");
  const [screenWorks, setScreenWorks] = useState("");
  const [water, setWater] = useState("");

  const [customerName, setCustomerName] = useState(profile?.full_name ?? "");
  const [customerPhone, setCustomerPhone] = useState(profile?.phone ?? "");
  const [bestTime, setBestTime] = useState("");
  const [consent, setConsent] = useState(true);

  const message = [
    "Olá! Quero um orçamento na WG Celulares.",
    `Aparelho: ${brand || "-"} ${model || ""} ${color ? `(${color})` : ""}`.trim(),
    `Problema: ${issue || "-"}`,
    details ? `Detalhes: ${details}` : "",
    `Urgência: ${urgencias.find((u) => u.value === urgency)?.label ?? "-"}`,
    turnsOn ? `Liga: ${turnsOn}` : "",
    screenWorks ? `Tela funciona: ${screenWorks}` : "",
    water ? `Contato com água: ${water}` : "",
    `Nome: ${customerName || "-"}`,
    bestTime ? `Melhor horário: ${bestTime}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  function validate(index: number) {
    if (index === 0) {
      if (!brand) return "Selecione a marca do aparelho.";
      if (model.trim().length < 2) return "Informe o modelo do aparelho.";
    }
    if (index === 1 && !issue) return "Selecione o problema principal.";
    if (index === 2) {
      if (customerName.trim().length < 3) return "Informe seu nome.";
      if (onlyDigits(customerPhone).length < 10) return "Informe um WhatsApp com DDD.";
      if (!consent) return "Autorize o contato por WhatsApp para enviar o orçamento.";
    }
    return null;
  }

  function next() {
    const error = validate(step);
    if (error) {
      toast.error(error);
      return;
    }
    setStep((s) => Math.min(s + 1, 2));
  }

  async function submit() {
    const error = validate(2);
    if (error) {
      toast.error(error);
      return;
    }
    setSending(true);
    const { error: dbError } = await supabase.from("quote_requests").insert({
      user_id: session?.user.id ?? null,
      service_slug: serviceSlug ?? null,
      brand,
      model: model.trim(),
      device_color: color,
      issue_type: issue,
      issue_details: details,
      urgency,
      turns_on: turnsOn,
      screen_works: screenWorks,
      water_contact: water,
      customer_name: customerName.trim(),
      customer_phone: customerPhone,
      best_time: bestTime,
      whatsapp_consent: consent,
    });
    setSending(false);
    if (dbError) {
      toast.error("Não foi possível registrar seu orçamento. Tente pelo WhatsApp.");
      return;
    }
    toast.success("Orçamento enviado! Abrindo o WhatsApp...");
    window.open(whatsappLink(message), "_blank", "noopener");
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card md:p-8">
      <h3 className="text-xl font-bold">Orçamento guiado</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Três passos rápidos e um técnico responde no WhatsApp com o valor e o prazo.
      </p>

      <ol className="mt-6 flex items-center gap-3">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <span className={`hidden text-xs font-medium sm:block ${i === step ? "" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <Label className="text-xs font-semibold">Marca</Label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {marcas.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="q-modelo" className="text-xs font-semibold">
              Modelo
            </Label>
            <Input
              id="q-modelo"
              className="mt-1.5"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="ex: iPhone 13 Pro"
            />
          </div>
          <div>
            <Label htmlFor="q-cor" className="text-xs font-semibold">
              Cor (opcional)
            </Label>
            <Input
              id="q-cor"
              className="mt-1.5"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="ex: grafite"
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Problema principal</Label>
              <Select value={issue} onValueChange={setIssue}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.slug} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="Outro problema">Outro problema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Urgência</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {urgencias.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <SmallSelect label="O aparelho liga?" value={turnsOn} onChange={setTurnsOn} />
            <SmallSelect label="A tela funciona?" value={screenWorks} onChange={setScreenWorks} />
            <SmallSelect label="Teve contato com água?" value={water} onChange={setWater} />
          </div>

          <div>
            <Label htmlFor="q-detalhes" className="text-xs font-semibold">
              Conte o que aconteceu (opcional)
            </Label>
            <Textarea
              id="q-detalhes"
              className="mt-1.5"
              rows={3}
              maxLength={600}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="ex: caiu no chão e a tela ficou com manchas"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="q-nome" className="text-xs font-semibold">
                Nome
              </Label>
              <Input
                id="q-nome"
                className="mt-1.5"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="q-tel" className="text-xs font-semibold">
                WhatsApp
              </Label>
              <Input
                id="q-tel"
                className="mt-1.5"
                inputMode="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(maskPhone(e.target.value))}
                placeholder="(11) 90000-0000"
              />
            </div>
            <div>
              <Label htmlFor="q-horario" className="text-xs font-semibold">
                Melhor horário
              </Label>
              <Input
                id="q-horario"
                className="mt-1.5"
                value={bestTime}
                onChange={(e) => setBestTime(e.target.value)}
                placeholder="ex: à tarde"
              />
            </div>
          </div>
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
            <span>Autorizo a WG Celulares a entrar em contato pelo WhatsApp sobre este orçamento.</span>
          </label>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft className="size-4" /> Voltar
        </Button>
        {step < 2 ? (
          <Button variant="hero" onClick={next}>
            Continuar <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button variant="hero" onClick={() => void submit()} disabled={sending}>
            {sending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
            Enviar orçamento
          </Button>
        )}
      </div>
    </div>
  );
}

function SmallSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs font-semibold">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1.5">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {simNao.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
