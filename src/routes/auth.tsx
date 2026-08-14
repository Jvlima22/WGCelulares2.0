import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, Mail, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { maskPhone, isValidEmail } from "@/lib/format";
import { Logo } from "@/components/site/Logo";
import { GoogleButton } from "@/components/site/GoogleButton";

type Search = { redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search['redirect'] === "string" ? { redirect: search['redirect'] } : {},
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta | WG Celulares" },
      {
        name: "description",
        content:
          "Acesse sua conta WG Celulares para acompanhar pedidos, endereços salvos e orçamentos da assistência técnica.",
      },
      { property: "og:title", content: "Entrar ou criar conta | WG Celulares" },
      { property: "og:description", content: "Login por e-mail ou Google na WG Celulares." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function safeRedirect(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/conta";
  return value;
}

function AuthPage() {
  const { redirect } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const target = safeRedirect(redirect);

  useEffect(() => {
    if (!loading && session) void navigate({ to: target, replace: true });
  }, [loading, session, navigate, target]);

  return (
    <div className="container-wg flex min-h-[80vh] items-center justify-center py-14">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" aria-label="Ir para o início">
            <Logo className="h-16 w-auto" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Sua conta WG</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe pedidos, orçamentos e endereços salvos em um só lugar.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="registro">Criar conta</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6">
              <LoginForm redirectTo={target} />
            </TabsContent>
            <TabsContent value="registro" className="mt-6">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Prefere não criar conta?{" "}
          <Link to="/checkout" className="font-semibold text-primary hover:underline">
            Continue como visitante no checkout
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function LoginForm({ redirectTo }: { redirectTo: string }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"login" | "recover">("login");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) { toast.error("Informe um e-mail válido."); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast.error(
        error.message.includes("Invalid login")
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar. Tente novamente.",
      );
      return;
    }
    toast.success("Bem-vindo de volta!");
    void navigate({ to: redirectTo, replace: true });
  }

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) { toast.error("Informe o e-mail da sua conta."); return; }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setBusy(false);
    if (error) { toast.error("Não foi possível enviar o link agora."); return; }
    toast.success("Enviamos um link de redefinição para o seu e-mail.");
    setMode("login");
  }

  if (mode === "recover") {
    return (
      <form onSubmit={handleRecover} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Informe o e-mail cadastrado e enviaremos um link para criar uma nova senha.
        </p>
        <Field
          id="recover-email"
          label="E-mail"
          icon={<Mail className="size-4" />}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="voce@email.com"
        />
        <Button type="submit" variant="hero" className="w-full" disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" />} Enviar link de redefinição
        </Button>
        <button
          type="button"
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setMode("login")}
        >
          Voltar para o login
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleButton label="Entrar com Google" />
      <Divider />
      <form onSubmit={handleLogin} className="space-y-4">
        <Field
          id="login-email"
          label="E-mail"
          icon={<Mail className="size-4" />}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="voce@email.com"
          autoComplete="email"
        />
        <Field
          id="login-password"
          label="Senha"
          icon={<Lock className="size-4" />}
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setMode("recover")}
          className="text-xs font-medium text-primary hover:underline"
        >
          Esqueci minha senha
        </button>
        <Button type="submit" variant="hero" className="w-full" disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" />} Entrar
        </Button>
      </form>
    </div>
  );
}

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 3) { toast.error("Informe seu nome completo."); return; }
    if (!isValidEmail(email)) { toast.error("Informe um e-mail válido."); return; }
    if (phone.replace(/\D/g, "").length < 10) { toast.error("Informe um telefone válido com DDD."); return; }
    if (password.length < 8) { toast.error("A senha precisa ter ao menos 8 caracteres."); return; }
    if (!terms) { toast.error("É preciso aceitar os termos para criar a conta."); return; }

    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name.trim(), phone },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(
        error.message.includes("already registered")
          ? "Este e-mail já possui conta. Faça login."
          : "Não foi possível criar a conta agora.",
      );
      return;
    }
    if (!data.session) {
      setSent(true);
      return;
    }
    toast.success("Conta criada com sucesso!");
  }

  if (sent) {
    return (
      <div className="space-y-3 text-center">
        <Mail className="mx-auto size-10 text-primary" />
        <h2 className="text-lg font-bold">Confirme seu e-mail</h2>
        <p className="text-sm text-muted-foreground">
          Enviamos um link de confirmação para <strong>{email}</strong>. Depois de confirmar, você já poderá entrar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleButton label="Criar conta com Google" />
      <Divider />
      <form onSubmit={handleRegister} className="space-y-4">
        <Field
          id="reg-name"
          label="Nome completo"
          icon={<UserIcon className="size-4" />}
          value={name}
          onChange={setName}
          placeholder="Como podemos te chamar"
          autoComplete="name"
        />
        <Field
          id="reg-email"
          label="E-mail"
          icon={<Mail className="size-4" />}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="voce@email.com"
          autoComplete="email"
        />
        <Field
          id="reg-phone"
          label="Telefone"
          icon={<Phone className="size-4" />}
          value={phone}
          onChange={(v) => setPhone(maskPhone(v))}
          placeholder="(11) 90000-0000"
          inputMode="tel"
        />
        <Field
          id="reg-password"
          label="Senha"
          icon={<Lock className="size-4" />}
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Mínimo de 8 caracteres"
          autoComplete="new-password"
        />
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <Checkbox checked={terms} onCheckedChange={(v) => setTerms(v === true)} className="mt-0.5" />
          <span>
            Li e aceito os termos de uso e a política de privacidade da WG Celulares, incluindo o contato por
            WhatsApp sobre meus pedidos e orçamentos.
          </span>
        </label>
        <Button type="submit" variant="hero" className="w-full" disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" />} Criar conta
        </Button>
      </form>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs uppercase tracking-wide text-muted-foreground">ou</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function Field({
  id,
  label,
  icon,
  value,
  onChange,
  ...rest
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "id">) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
      </Label>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} className="pl-9" {...rest} />
      </div>
    </div>
  );
}
