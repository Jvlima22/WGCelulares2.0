import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  QrCode,
  Store,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { CreditCardVisual } from "@/components/site/CreditCardVisual";
import {
  isValidEmail,
  maskCardNumber,
  maskDocument,
  maskExpiry,
  maskPhone,
  maskZip,
  onlyDigits,
} from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | WG Celulares" },
      {
        name: "description",
        content: "Finalize sua compra em 3 passos com entrega para todo o Brasil ou retirada na loja em Cotia.",
      },
      { property: "og:title", content: "Checkout | WG Celulares" },
      { property: "og:description", content: "Pagamento por Pix ou cartão, entrega ou retirada na loja." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const steps = ["Identificação", "Entrega", "Pagamento"] as const;

type Fulfillment = "entrega" | "retirada";
type Payment = "pix" | "cartao";

function CheckoutPage() {
  const { items, subtotal, shipping, clear } = useCart();
  const { session, profile } = useAuth();

  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");

  // Step 2
  const [fulfillment, setFulfillment] = useState<Fulfillment>("entrega");
  const [zip, setZip] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  // Step 3
  const [payment, setPayment] = useState<Payment>("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [installments, setInstallments] = useState(1);

  useEffect(() => {
    if (session) {
      setEmail((v) => v || (session.user.email ?? ""));
      setName((v) => v || (profile?.full_name ?? ""));
      setPhone((v) => v || (profile?.phone ?? ""));
      setDocument((v) => v || (profile?.document ?? ""));
    }
  }, [session, profile]);

  const frete = fulfillment === "retirada" ? 0 : shipping;
  const totalBase = subtotal + frete;
  const discount = payment === "pix" ? totalBase * 0.05 : 0;
  const total = totalBase - discount;

  const installmentOptions = useMemo(
    () => [1, 2, 3].map((n) => ({ n, label: `${n}x de ${formatBRL(total / n)} sem juros` })),
    [total],
  );

  async function lookupZip(value: string) {
    const digits = onlyDigits(value);
    if (digits.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = (await res.json()) as {
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
        erro?: boolean;
      };
      if (data.erro) return;
      setStreet(data.logradouro ?? "");
      setDistrict(data.bairro ?? "");
      setCity(data.localidade ?? "");
      setUf(data.uf ?? "");
    } catch {
      /* best effort */
    }
  }

  function validateStep(index: number) {
    if (index === 0) {
      if (name.trim().length < 3) return "Informe seu nome completo.";
      if (!isValidEmail(email)) return "Informe um e-mail válido.";
      if (onlyDigits(phone).length < 10) return "Informe um telefone com DDD.";
      if (onlyDigits(document).length < 11) return "Informe um CPF ou CNPJ válido.";
      return null;
    }
    if (index === 1) {
      if (fulfillment === "retirada") return null;
      if (onlyDigits(zip).length !== 8) return "Informe um CEP válido.";
      if (!street.trim() || !number.trim() || !district.trim() || !city.trim() || !uf.trim())
        return "Complete os dados do endereço de entrega.";
      return null;
    }
    if (payment === "cartao") {
      if (onlyDigits(cardNumber).length < 15) return "Número do cartão incompleto.";
      if (cardName.trim().length < 3) return "Informe o nome impresso no cartão.";
      if (cardExpiry.length !== 5) return "Informe a validade no formato MM/AA.";
      if (cardCvv.length < 3) return "Informe o CVV.";
    }
    return null;
  }

  function next() {
    const error = validateStep(step);
    if (error) {
      toast.error(error);
      return;
    }
    setStep((s) => Math.min(s + 1, 2));
  }

  async function submit() {
    const error = validateStep(2);
    if (error) {
      toast.error(error);
      return;
    }
    setSaving(true);
    const payload = {
      user_id: session?.user.id ?? null,
      customer_name: name.trim(),
      customer_email: email.trim(),
      customer_phone: phone,
      customer_document: document,
      fulfillment,
      shipping_address:
        fulfillment === "entrega"
          ? { zip, street, number, complement, district, city, state: uf }
          : null,
      payment_method: payment,
      items: items.map((i) => ({ slug: i.slug, name: i.name, qty: i.qty, price: i.price, variant: i.variant ?? null })),
      subtotal,
      shipping: frete,
      discount,
      total,
    };

    let reference = `WG${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    if (session) {
      const { data, error: dbError } = await supabase
        .from("orders")
        .insert(payload)
        .select("reference")
        .single();
      if (dbError) {
        setSaving(false);
        toast.error("Não foi possível registrar o pedido. Tente novamente.");
        return;
      }
      reference = (data as { reference: string }).reference;
    }
    setSaving(false);
    clear();
    setDone(reference);
  }

  if (done) {
    return (
      <div className="container-wg flex flex-col items-center py-24 text-center">
        <CheckCircle2 className="size-14 text-success" />
        <h1 className="mt-5 text-3xl font-bold">Pedido confirmado!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Número do pedido: <strong className="text-foreground">{done}</strong>
        </p>
        <p className="mt-3 max-w-md text-muted-foreground">
          Vamos confirmar os detalhes pelo WhatsApp. Este é um checkout de demonstração: nenhuma cobrança foi
          realizada.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button variant="hero" size="lg" asChild>
            <Link to="/loja">Continuar comprando</Link>
          </Button>
          {session && (
            <Button variant="outline" size="lg" asChild>
              <Link to="/conta" search={{ aba: "pedidos" }}>
                Ver meus pedidos
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-wg flex flex-col items-center py-24 text-center">
        <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
        <Button variant="hero" size="lg" className="mt-6" asChild>
          <Link to="/loja">Ver produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wg py-14">
      <h1 className="text-3xl font-bold">Finalizar compra</h1>

      {!session && (
        <p className="mt-3 text-sm text-muted-foreground">
          Você está comprando como visitante.{" "}
          <Link to="/auth" search={{ redirect: "/checkout" }} className="font-semibold text-primary hover:underline">
            Entre na sua conta
          </Link>{" "}
          para salvar o pedido no histórico.
        </p>
      )}

      <ol className="mt-8 flex items-center gap-3">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              {i + 1}
            </button>
            <span className={`hidden text-sm font-medium sm:block ${i === step ? "" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {step === 0 && (
            <section className="rounded-2xl border bg-card p-6 shadow-card">
              <h2 className="text-lg font-bold">Identificação</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field id="nome" label="Nome completo" value={name} onChange={setName} />
                <Field id="email" label="E-mail" type="email" value={email} onChange={setEmail} />
                <Field id="tel" label="Telefone" value={phone} onChange={(v) => setPhone(maskPhone(v))} />
                <Field
                  id="doc"
                  label="CPF / CNPJ"
                  value={document}
                  onChange={(v) => setDocument(maskDocument(v))}
                />
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="rounded-2xl border bg-card p-6 shadow-card">
              <h2 className="text-lg font-bold">Entrega</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <OptionCard
                  active={fulfillment === "entrega"}
                  onClick={() => setFulfillment("entrega")}
                  icon={<Truck className="size-5 text-primary" />}
                  title="Entrega"
                  subtitle="Todo o Brasil · grátis acima de R$150"
                />
                <OptionCard
                  active={fulfillment === "retirada"}
                  onClick={() => setFulfillment("retirada")}
                  icon={<Store className="size-5 text-primary" />}
                  title="Retirar na loja"
                  subtitle="Open Mall The Square, Cotia/SP"
                />
              </div>

              {fulfillment === "entrega" && (
                <div className="mt-6 grid gap-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <Field
                      id="cep"
                      label="CEP"
                      value={zip}
                      onChange={(v) => {
                        const masked = maskZip(v);
                        setZip(masked);
                        void lookupZip(masked);
                      }}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <Field id="rua" label="Rua" value={street} onChange={setStreet} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field id="num" label="Número" value={number} onChange={setNumber} />
                  </div>
                  <div className="sm:col-span-4">
                    <Field id="compl" label="Complemento" value={complement} onChange={setComplement} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field id="bairro" label="Bairro" value={district} onChange={setDistrict} />
                  </div>
                  <div className="sm:col-span-3">
                    <Field id="cidade" label="Cidade" value={city} onChange={setCity} />
                  </div>
                  <div className="sm:col-span-1">
                    <Field id="uf" label="UF" value={uf} onChange={(v) => setUf(v.toUpperCase().slice(0, 2))} />
                  </div>
                </div>
              )}
            </section>
          )}

          {step === 2 && (
            <section className="rounded-2xl border bg-card p-6 shadow-card">
              <h2 className="text-lg font-bold">Pagamento</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <OptionCard
                  active={payment === "pix"}
                  onClick={() => setPayment("pix")}
                  icon={<QrCode className="size-5 text-primary" />}
                  title="Pix"
                  subtitle="5% de desconto à vista"
                />
                <OptionCard
                  active={payment === "cartao"}
                  onClick={() => setPayment("cartao")}
                  icon={<CreditCard className="size-5 text-primary" />}
                  title="Cartão de crédito"
                  subtitle="Em até 3x sem juros"
                />
              </div>

              {payment === "cartao" && (
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <CreditCardVisual
                    number={cardNumber}
                    name={cardName}
                    expiry={cardExpiry}
                    cvv={cardCvv}
                    flipped={flipped}
                  />
                  <div className="grid gap-4">
                    <Field
                      id="cardnum"
                      label="Número do cartão"
                      value={cardNumber}
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      onFocus={() => setFlipped(false)}
                      onChange={(v) => setCardNumber(maskCardNumber(v))}
                    />
                    <Field
                      id="cardname"
                      label="Nome impresso"
                      value={cardName}
                      placeholder="Como está no cartão"
                      onFocus={() => setFlipped(false)}
                      onChange={(v) => setCardName(v.toUpperCase())}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        id="cardexp"
                        label="Validade"
                        value={cardExpiry}
                        placeholder="MM/AA"
                        inputMode="numeric"
                        onFocus={() => setFlipped(false)}
                        onChange={(v) => setCardExpiry(maskExpiry(v))}
                      />
                      <Field
                        id="cardcvv"
                        label="CVV"
                        value={cardCvv}
                        placeholder="000"
                        inputMode="numeric"
                        onFocus={() => setFlipped(true)}
                        onBlur={() => setFlipped(false)}
                        onChange={(v) => setCardCvv(onlyDigits(v).slice(0, 4))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Parcelamento</Label>
                      <div className="mt-1.5 grid gap-2">
                        {installmentOptions.map((opt) => (
                          <button
                            key={opt.n}
                            type="button"
                            onClick={() => setInstallments(opt.n)}
                            className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                              installments === opt.n ? "border-primary bg-accent" : "hover:bg-muted"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {payment === "pix" && (
                <div className="mt-6 rounded-xl border border-dashed p-6 text-center">
                  <QrCode className="mx-auto size-10 text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    O código Pix é enviado por WhatsApp assim que o pedido é confirmado. Você garante{" "}
                    <strong className="text-success">{formatBRL(discount)}</strong> de desconto.
                  </p>
                </div>
              )}

              <p className="mt-4 text-xs text-muted-foreground">
                Checkout de demonstração: nenhum pagamento é processado nesta versão e nenhum dado de cartão é
                armazenado.
              </p>
            </section>
          )}

          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ArrowLeft className="size-4" /> Voltar
            </Button>
            {step < 2 ? (
              <Button variant="hero" size="lg" onClick={next}>
                Continuar <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button variant="hero" size="lg" onClick={() => void submit()} disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" />} Confirmar pedido
              </Button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6 shadow-card lg:sticky lg:top-32">
          <h2 className="text-lg font-bold">Resumo do pedido</h2>
          <div className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <div key={`${i.slug}-${i.variant ?? ""}`} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {i.qty}× {i.name}
                </span>
                <span>{formatBRL(i.price * i.qty)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatBRL(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frete</span>
              <span>{frete === 0 ? "Grátis" : formatBRL(frete)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Desconto Pix</span>
                <span>-{formatBRL(discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatBRL(total)}</span>
            </div>
            {payment === "cartao" && (
              <p className="text-xs text-muted-foreground">
                ou {installments}x de {formatBRL(total / installments)} sem juros
              </p>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary">Garantia de 90 dias</Badge>
            <Badge variant="secondary">Ambiente seguro</Badge>
          </div>
        </aside>
      </div>
    </div>
  );
}

function OptionCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
        active ? "border-primary bg-accent" : "hover:bg-muted"
      }`}
    >
      {icon}
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{subtitle}</span>
      </span>
    </button>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.ComponentProps<typeof Input>, "id" | "value" | "onChange">) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
      </Label>
      <Input
        id={id}
        className="mt-1.5"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </div>
  );
}
