import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contact, whatsappLink } from "@/data/catalog";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — WG Celulares em Cotia/SP" },
      {
        name: "description",
        content: "Fale com a WG Celulares por WhatsApp, e-mail ou visite a loja no Open Mall The Square, em Cotia/SP.",
      },
      { property: "og:title", content: "Contato — WG Celulares em Cotia/SP" },
      { property: "og:description", content: "WhatsApp, e-mail, endereço, horários e mapa da loja." },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="container-wg py-14">
      <h1 className="text-3xl font-bold md:text-5xl">Vamos conversar</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Respondemos rápido no WhatsApp em horário comercial. Prefere escrever? Use o formulário abaixo.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <form
          className="space-y-4 rounded-2xl border p-6 shadow-card"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast.success("Mensagem enviada! Responderemos em breve.");
          }}
        >
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" required className="mt-1.5" placeholder="Seu nome" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required className="mt-1.5" placeholder="voce@email.com" />
            </div>
            <div>
              <Label htmlFor="tel">Telefone</Label>
              <Input id="tel" className="mt-1.5" placeholder="(11) 90000-0000" />
            </div>
          </div>
          <div>
            <Label htmlFor="msg">Mensagem</Label>
            <Textarea id="msg" required rows={5} className="mt-1.5" placeholder="Como podemos ajudar?" />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full">
            {sent ? "Mensagem enviada" : "Enviar mensagem"}
          </Button>
        </form>

        <div className="space-y-6">
          <div className="rounded-2xl border p-6">
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MessageCircle className="size-5 shrink-0 text-primary" />
                <a href={whatsappLink("Olá! Vim pelo site.")} target="_blank" rel="noreferrer" className="font-medium hover:text-primary">
                  WhatsApp {contact.whatsappLabel}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="size-5 shrink-0 text-primary" />
                <a href={`mailto:${contact.email}`} className="hover:text-primary">
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Instagram className="size-5 shrink-0 text-primary" />
                <a href={contact.instagram} target="_blank" rel="noreferrer" className="hover:text-primary">
                  @wgcelulares
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="size-5 shrink-0 text-primary" />
                {contact.address}
              </li>
              <li className="flex gap-3">
                <Clock className="size-5 shrink-0 text-primary" />
                {contact.hours}
              </li>
            </ul>
          </div>

          <iframe
            title="Mapa da loja WG Celulares"
            src={contact.mapEmbed}
            loading="lazy"
            className="h-80 w-full rounded-2xl border"
          />
        </div>
      </div>
    </div>
  );
}
