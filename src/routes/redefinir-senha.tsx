import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [
      { title: "Redefinir senha | WG Celulares" },
      { name: "description", content: "Crie uma nova senha para a sua conta WG Celulares." },
      { property: "og:title", content: "Redefinir senha | WG Celulares" },
      { property: "og:description", content: "Crie uma nova senha para a sua conta WG Celulares." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("A senha precisa ter ao menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error("O link expirou ou é inválido. Solicite um novo.");
      return;
    }
    toast.success("Senha atualizada com sucesso!");
    void navigate({ to: "/conta", replace: true });
  }

  return (
    <div className="container-wg flex min-h-[70vh] items-center justify-center py-14">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-card">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-14 w-auto" />
          <h1 className="mt-5 text-xl font-bold">Criar nova senha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha uma senha com pelo menos 8 caracteres.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="new-password" className="text-xs font-semibold">
              Nova senha
            </Label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="new-password"
                type="password"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="confirm-password" className="text-xs font-semibold">
              Confirmar senha
            </Label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirm-password"
                type="password"
                className="pl-9"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />} Salvar nova senha
          </Button>
        </div>
      </form>
    </div>
  );
}
