import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteWidget } from "@/components/site/QuoteWidget";
import { formatBRL, services, whatsappLink } from "@/data/catalog";
import heroImg from "@/assets/hero-tecnico.jpg";

export const Route = createFileRoute("/servicos/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Serviço indisponível | WG Celulares" }, { name: "robots", content: "noindex" }] };
    }
    const { service } = loaderData;
    return {
      meta: [
        { title: `${service.name} em Cotia | WG Celulares` },
        { name: "description", content: service.short },
        { property: "og:title", content: `${service.name} em Cotia | WG Celulares` },
        { property: "og:description", content: service.short },
      ],
    };
  },
  component: ServicoPage,
});

function ServicoPage() {
  const { service } = Route.useLoaderData();
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="container-wg py-10">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Início
        </Link>{" "}
        /{" "}
        <Link to="/servicos" className="hover:text-primary">
          Serviços
        </Link>{" "}
        / <span className="text-foreground">{service.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">{service.name}</h1>
          <p className="mt-4 text-muted-foreground">{service.description}</p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-primary" /> A partir de{" "}
              <strong>{formatBRL(service.fromPrice)}</strong>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-primary" /> {service.duration}
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" /> 90 dias de garantia em peça e mão de obra
            </li>
          </ul>

          <Button variant="hero" size="lg" className="mt-8" asChild>
            <a href={whatsappLink(`Olá! Quero um orçamento de ${service.name}.`)} target="_blank" rel="noreferrer">
              Solicitar orçamento no WhatsApp
            </a>
          </Button>
        </div>

        <img
          src={heroImg}
          alt={`Técnico realizando ${service.name.toLowerCase()}`}
          loading="lazy"
          width={1200}
          height={1200}
          className="rounded-2xl object-cover shadow-card"
        />
      </div>

      <div className="mt-14">
        <QuoteWidget serviceSlug={service.slug} />
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Outros serviços</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {others.map((s) => (
            <Link
              key={s.slug}
              to="/servicos/$slug"
              params={{ slug: s.slug }}
              className="rounded-xl border p-5 transition-shadow hover:shadow-card"
            >
              <p className="font-semibold">{s.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.short}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
