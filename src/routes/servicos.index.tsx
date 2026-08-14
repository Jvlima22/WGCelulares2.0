import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteWidget } from "@/components/site/QuoteWidget";
import { QuoteDialog } from "@/components/site/QuoteDialog";
import { formatBRL, services } from "@/data/catalog";


export const Route = createFileRoute("/servicos/")({
  head: () => ({
    meta: [
      { title: "Serviços de assistência técnica | WG Celulares" },
      {
        name: "description",
        content: "Troca de tela, bateria, conector, desoxidação e reparo de placa com 90 dias de garantia em Cotia/SP.",
      },
      { property: "og:title", content: "Serviços de assistência técnica | WG Celulares" },
      { property: "og:description", content: "Reparos com preço a partir de, prazo definido e garantia de 90 dias." },
    ],
  }),
  component: ServicosPage,
});

function ServicosPage() {
  return (
    <div>
      <div className="border-b bg-secondary/50">
        <div className="container-wg py-14">
          <h1 className="max-w-2xl text-3xl font-bold md:text-5xl">
            Reparos com diagnóstico honesto e <span className="text-primary">90 dias de garantia</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            22 anos consertando celulares em Cotia. Avaliação gratuita, preço fechado antes do serviço e aparelho
            testado na sua frente na entrega.
          </p>
        </div>
      </div>

      <div className="container-wg py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.slug} className="flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-card">
              <h2 className="text-lg font-bold">{s.name}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.description}</p>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">A partir de</span>
                  <span className="font-bold text-primary">{formatBRL(s.fromPrice)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 text-primary" /> {s.duration}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="size-4 text-primary" /> Garantia de 90 dias
                </div>
              </dl>
              <div className="mt-6 flex gap-2">
                <QuoteDialog serviceSlug={s.slug}>
                  <Button variant="hero" className="flex-1">
                    Solicitar orçamento
                  </Button>
                </QuoteDialog>

                <Button variant="outline" asChild>
                  <Link to="/servicos/$slug" params={{ slug: s.slug }}>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <QuoteWidget />
        </div>
      </div>
    </div>
  );
}
