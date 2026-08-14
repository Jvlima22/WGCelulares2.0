import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/data/catalog";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Olá! Gostaria de falar com a WG Celulares.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-glow transition-transform hover:scale-105"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
