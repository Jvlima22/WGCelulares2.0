import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Clock, Phone } from "lucide-react";
import { categories, contact, services } from "@/data/catalog";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-secondary/60">
      <div className="container-wg grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold">WG Celulares</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Assistência técnica e loja de acessórios com 22 anos de experiência em Cotia/SP.
          </p>
          <a
            href={contact.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <Instagram className="size-4" /> @wgcelulares
          </a>
        </div>

        <div>
          <p className="text-sm font-bold">Loja</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/loja" search={{ categoria: c.slug }} className="hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold">Serviços</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to="/servicos/$slug" params={{ slug: s.slug }} className="hover:text-primary">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold">Contato</p>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" /> {contact.whatsappLabel}
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" /> {contact.email}
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {contact.address}
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" /> {contact.hours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} WG Celulares. Todos os direitos reservados.
      </div>
    </footer>
  );
}
