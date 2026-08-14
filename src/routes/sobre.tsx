import { createFileRoute } from "@tanstack/react-router";
import { Heart, MapPin, Users, Wrench } from "lucide-react";
import { team } from "@/data/catalog";
import lojaImg from "@/assets/loja-fisica.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a WG Celulares — 22 anos em Cotia" },
      {
        name: "description",
        content: "Conheça a história da WG Celulares, nossa equipe técnica e a loja no Open Mall The Square, em Cotia/SP.",
      },
      { property: "og:title", content: "Sobre a WG Celulares — 22 anos em Cotia" },
      { property: "og:description", content: "História, equipe e valores de uma assistência técnica com 22 anos de estrada." },
    ],
  }),
  component: SobrePage,
});

const values = [
  { icon: Wrench, title: "Qualidade técnica", text: "Peças testadas, bancada equipada e microssoldagem feita na própria loja." },
  { icon: Heart, title: "Atenção aos detalhes", text: "Cada aparelho é higienizado, testado e entregue como se fosse nosso." },
  { icon: Users, title: "Relação de confiança", text: "Clientes que voltam há duas décadas e indicam a família inteira." },
];

function SobrePage() {
  return (
    <div className="container-wg py-14">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">Nossa história</p>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">22 anos devolvendo vida aos celulares de Cotia</h1>
          <p className="mt-5 text-muted-foreground">
            A WG Celulares nasceu como uma pequena bancada de reparos e cresceu junto com os clientes da região. Hoje
            somos assistência técnica completa e loja de acessórios dentro do Shopping Open Mall The Square, atendendo
            desde a troca de película até reparos de placa que outras lojas recusam.
          </p>
          <p className="mt-4 text-muted-foreground">
            O que nunca mudou foi o jeito de trabalhar: diagnóstico honesto, preço fechado antes de abrir o aparelho e
            garantia de 90 dias em tudo o que sai da nossa bancada.
          </p>
        </div>
        <img
          src={lojaImg}
          alt="Loja física da WG Celulares no Open Mall The Square"
          loading="lazy"
          width={1400}
          height={900}
          className="rounded-2xl object-cover shadow-card"
        />
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl border p-6">
            <v.icon className="size-6 text-primary" />
            <p className="mt-4 font-bold">{v.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold md:text-3xl">Quem cuida do seu aparelho</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.name} className="rounded-2xl border p-6 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full gradient-primary text-xl font-bold text-primary-foreground">
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <p className="mt-4 font-bold">{m.name}</p>
              <p className="text-sm text-primary">{m.role}</p>
              <p className="mt-2 text-xs text-muted-foreground">{m.specialty}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 flex items-center gap-3 rounded-2xl bg-accent p-6 text-accent-foreground">
        <MapPin className="size-6 shrink-0" />
        <p className="text-sm font-medium">
          Estamos no Shopping Open Mall The Square, Rod. Raposo Tavares km 22, Cotia/SP — com estacionamento gratuito.
        </p>
      </div>
    </div>
  );
}
