import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  MapPin,
  Package,
  Plus,
  Trash2,
  UserRound,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { maskDocument, maskPhone, maskZip } from "@/lib/format";
import { whatsappLink } from "@/data/catalog";

type Tab = "perfil" | "enderecos" | "pedidos";
type Search = { aba?: Tab };

export const Route = createFileRoute("/conta")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const aba = search['aba'];
    return aba === "enderecos" || aba === "pedidos" || aba === "perfil" ? { aba } : {};
  },
  head: () => ({
    meta: [
      { title: "Minha conta | WG Celulares" },
      {
        name: "description",
        content: "Área do cliente WG Celulares: dados pessoais, endereços salvos e histórico de pedidos.",
      },
      { property: "og:title", content: "Minha conta | WG Celulares" },
      { property: "og:description", content: "Área do cliente WG Celulares." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ContaPage,
});

type Address = {
  id: string;
  label: string | null;
  zip: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
  is_default: boolean;
};

type Order = {
  id: string;
  reference: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: { name: string; qty: number }[];
};

const statusLabels: Record<string, string> = {
  aguardando_pagamento: "Aguardando pagamento",
  pago: "Pago",
  em_separacao: "Em separação",
  enviado: "Enviado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function ContaPage() {
  const { aba } = useSearch({ from: "/conta" });
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/auth", search: { redirect: "/conta" }, replace: true });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="container-wg flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container-wg py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Minha conta</h1>
        <p className="mt-1 text-sm text-muted-foreground">{session.user.email}</p>
      </header>

      <Tabs
        value={aba ?? "perfil"}
        onValueChange={(v) => void navigate({ to: "/conta", search: { aba: v as Tab } })}
      >
        <TabsList>
          <TabsTrigger value="perfil" className="gap-2">
            <UserRound className="size-4" /> Perfil
          </TabsTrigger>
          <TabsTrigger value="enderecos" className="gap-2">
            <MapPin className="size-4" /> Endereços
          </TabsTrigger>
          <TabsTrigger value="pedidos" className="gap-2">
            <Package className="size-4" /> Pedidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-8">
          <ProfileSection />
        </TabsContent>
        <TabsContent value="enderecos" className="mt-8">
          <AddressSection userId={session.user.id} />
        </TabsContent>
        <TabsContent value="pedidos" className="mt-8">
          <OrdersSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileSection() {
  const { profile, user, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ? maskPhone(profile.phone) : "");
    setDocument(profile?.document ? maskDocument(profile.document) : "");
  }, [profile]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName.trim(), phone, document });
    setBusy(false);
    if (error) {
      toast.error("Não foi possível salvar seus dados.");
      return;
    }
    await refreshProfile();
    toast.success("Dados atualizados!");
  }

  return (
    <form onSubmit={save} className="max-w-xl space-y-4 rounded-2xl border bg-card p-6 shadow-card">
      <div>
        <Label htmlFor="p-name" className="text-xs font-semibold">
          Nome completo
        </Label>
        <Input id="p-name" className="mt-1.5" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-phone" className="text-xs font-semibold">
            Telefone
          </Label>
          <Input
            id="p-phone"
            className="mt-1.5"
            value={phone}
            inputMode="tel"
            onChange={(e) => setPhone(maskPhone(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="p-doc" className="text-xs font-semibold">
            CPF / CNPJ
          </Label>
          <Input
            id="p-doc"
            className="mt-1.5"
            value={document}
            inputMode="numeric"
            onChange={(e) => setDocument(maskDocument(e.target.value))}
          />
        </div>
      </div>
      <Button type="submit" variant="hero" disabled={busy}>
        {busy && <Loader2 className="size-4 animate-spin" />} Salvar alterações
      </Button>
    </form>
  );
}

const emptyAddress = {
  label: "Casa",
  zip: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
};

function AddressSection({ userId }: { userId: string }) {
  const [items, setItems] = useState<Address[]>([]);
  const [form, setForm] = useState(emptyAddress);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    setItems((data as Address[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function lookupZip(value: string) {
    const digits = value.replace(/\D/g, "");
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
      setForm((f) => ({
        ...f,
        street: data.logradouro ?? f.street,
        district: data.bairro ?? f.district,
        city: data.localidade ?? f.city,
        state: data.uf ?? f.state,
      }));
    } catch {
      /* CEP lookup is best-effort */
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.zip || !form.street || !form.number || !form.district || !form.city || !form.state) {
      toast.error("Preencha todos os campos obrigatórios do endereço.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("addresses").insert({
      ...form,
      user_id: userId,
      is_default: items.length === 0,
    });
    setBusy(false);
    if (error) {
      toast.error("Não foi possível salvar o endereço.");
      return;
    }
    setForm(emptyAddress);
    setShowForm(false);
    toast.success("Endereço salvo!");
    void load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) {
      toast.error("Não foi possível remover o endereço.");
      return;
    }
    toast.success("Endereço removido.");
    void load();
  }

  async function makeDefault(id: string) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    void load();
  }

  if (loading) {
    return <Loader2 className="size-5 animate-spin text-muted-foreground" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((a) => (
          <div key={a.id} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{a.label || "Endereço"}</span>
                  {a.is_default && <Badge variant="secondary">Padrão</Badge>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {a.street}, {a.number}
                  {a.complement ? ` — ${a.complement}` : ""}
                  <br />
                  {a.district} — {a.city}/{a.state}
                  <br />
                  CEP {a.zip}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remover endereço"
                onClick={() => void remove(a.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            {!a.is_default && (
              <Button variant="soft" size="sm" className="mt-4" onClick={() => void makeDefault(a.id)}>
                Tornar padrão
              </Button>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Você ainda não salvou endereços. Adicione um para agilizar o checkout.
          </p>
        )}
      </div>

      {showForm ? (
        <form onSubmit={save} className="max-w-2xl space-y-4 rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="font-semibold">Novo endereço</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Apelido" value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
            <Field
              label="CEP *"
              value={form.zip}
              onChange={(v) => {
                const masked = maskZip(v);
                setForm({ ...form, zip: masked });
                void lookupZip(masked);
              }}
            />
            <Field label="Número *" value={form.number} onChange={(v) => setForm({ ...form, number: v })} />
          </div>
          <Field label="Rua *" value={form.street} onChange={(v) => setForm({ ...form, street: v })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Complemento"
              value={form.complement}
              onChange={(v) => setForm({ ...form, complement: v })}
            />
            <Field label="Bairro *" value={form.district} onChange={(v) => setForm({ ...form, district: v })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cidade *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            <Field label="UF *" value={form.state} onChange={(v) => setForm({ ...form, state: v.toUpperCase().slice(0, 2) })} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="hero" disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" />} Salvar endereço
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="soft" onClick={() => setShowForm(true)}>
          <Plus className="size-4" /> Adicionar endereço
        </Button>
      )}
    </div>
  );
}

function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void supabase
      .from("orders")
      .select("id, reference, total, status, payment_method, created_at, items")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader2 className="size-5 animate-spin text-muted-foreground" />;

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center shadow-card">
        <Package className="mx-auto size-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-bold">Nenhum pedido por aqui ainda</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Quando você finalizar uma compra, o acompanhamento aparece nesta página.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="hero" asChild>
            <Link to="/loja">Ir para a loja</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href={whatsappLink("Olá! Quero acompanhar meu reparo.")} target="_blank" rel="noreferrer">
              <Wrench className="size-4" /> Acompanhar reparo
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div
          key={o.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-card"
        >
          <div>
            <p className="font-semibold">Pedido {o.reference}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(o.created_at).toLocaleDateString("pt-BR")} ·{" "}
              {Array.isArray(o.items) ? o.items.length : 0} item(ns) · {o.payment_method.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{statusLabels[o.status] ?? o.status}</Badge>
            <span className="font-bold">{brl(Number(o.total))}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = label.replace(/\W/g, "").toLowerCase();
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
      </Label>
      <Input id={id} className="mt-1.5" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
