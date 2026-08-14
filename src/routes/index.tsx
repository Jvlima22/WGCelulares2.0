import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BatteryCharging,
  Cable,
  Car,
  ClipboardCheck,
  Cpu,
  Droplets,
  Headphones,
  Clock,
  Layers,
  MapPin,
  MessageCircle,
  PackageCheck,
  Plug,
  PlugZap,
  RefreshCcw,
  ShieldCheck,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Timer,
  Watch,
  Wrench,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Counter } from "@/components/site/Counter";
import { ProductCard } from "@/components/site/ProductCard";
import { QuoteWidget } from "@/components/site/QuoteWidget";
import { QuoteDialog } from "@/components/site/QuoteDialog";

import { GoogleRatingCard } from "@/components/site/GoogleRatingCard";
import { categories, contact, faq, formatBRL, products, services, team, testimonials, whatsappLink } from "@/data/catalog";
import heroImg from "@/assets/hero-tecnico.jpg";
import lojaImg from "@/assets/loja-fisica.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WG Celulares — Assistência técnica e loja em Cotia/SP" },
      {
        name: "description",
        content:
          "Trazemos vida de volta ao seu celular: reparos com garantia de 90 dias e loja de acessórios com frete grátis acima de R$150. 22 anos em Cotia/SP.",
      },
      { property: "og:title", content: "WG Celulares — Assistência técnica e loja em Cotia/SP" },
      {
        property: "og:description",
        content: "Troca de tela, bateria e reparo de placa em até 1 hora, mais uma loja completa de acessórios.",
      },
    ],
  }),
  component: Home,
});

const categoryIcons: Record<string, typeof Shield> = {
  shield: Shield,
  layers: Layers,
  cable: Cable,
  headphones: Headphones,
  watch: Watch,
  plug: Plug,
};

const serviceIcons: Record<string, typeof Shield> = {
  smartphone: Smartphone,
  "battery-charging": BatteryCharging,
  "plug-zap": PlugZap,
  droplets: Droplets,
  cpu: Cpu,
  "refresh-ccw": RefreshCcw,
};

const trust = [
  { icon: ShieldCheck, label: "Garantia de 90 dias" },
  { icon: Sparkles, label: "+22 anos de mercado" },
  { icon: Wrench, label: "Técnicos especializados" },
  { icon: Car, label: "Estacionamento gratuito" },
];

const steps = [
  { icon: ClipboardCheck, title: "Avaliação gratuita", text: "Diagnóstico na hora e orçamento fechado antes de qualquer reparo." },
  { icon: Wrench, title: "Reparo especializado", text: "Bancada equipada, peças testadas e acompanhamento pelo WhatsApp." },
  { icon: PackageCheck, title: "Aparelho pronto", text: "Testado na sua frente e entregue com 90 dias de garantia." },
];

const differentials = [
  { icon: Timer, title: "Agilidade real", text: "Tela e bateria em até 1 hora — a maioria dos clientes espera na praça de alimentação." },
  { icon: Sparkles, title: "Atenção aos detalhes", text: "Aparelho higienizado, parafusos conferidos e vedação refeita em todo reparo." },
  { icon: Cpu, title: "Casos difíceis", text: "Microssoldagem e reparo de placa que outras lojas costumam recusar." },
  { icon: ShieldCheck, title: "Transparência", text: "Você vê a peça trocada e recebe nota com a garantia registrada." },
];

function Home() {
  const featured = products.filter((p) => p.featured);

  return (
    <div>
      {/* HERO */}
      <section className="hero-dark relative overflow-hidden">
        <div className="container-wg grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr_0.8fr] lg:items-center lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Bem-vindo à WG Celulares</p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[0.98] md:text-6xl">
              Não adie,
              <br />
              conserte hoje<span className="text-primary">.</span>
            </h1>
            <p className="mt-6 text-lg font-semibold">Confie na WG — onde a técnica encontra o cuidado.</p>
            <p className="mt-3 max-w-md text-sm opacity-75">
              Não deixe um defeito atrapalhar seu dia. Na WG devolvemos a vida do seu aparelho com rapidez e garantia de
              90 dias.
            </p>
            <div className="mt-7 flex flex-wrap gap-5 text-xs font-semibold uppercase tracking-wide opacity-70">
              <Link to="/servicos" className="underline underline-offset-4 hover:opacity-100">
                Garantia
              </Link>
              <Link to="/servicos" className="underline underline-offset-4 hover:opacity-100">
                Serviços
              </Link>
              <Link to="/contato" className="underline underline-offset-4 hover:opacity-100">
                Suporte
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild>
                <a href={whatsappLink("Olá! Quero um orçamento na WG Celulares.")} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" /> Fale no WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-current/25 bg-transparent hover:bg-current/10" asChild>
                <Link to="/loja">Ver a loja</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-8 -z-10 rounded-full bg-primary/25 blur-3xl" />
            <img
              src={heroImg}
              alt="Técnico da WG Celulares realizando reparo em smartphone"
              width={1200}
              height={1200}
              className="w-full rounded-[2.5rem] object-cover shadow-glow"
            />
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-5xl font-extrabold md:text-6xl">
                <Counter to={48} suffix="k" /> <span className="text-primary">+</span>
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] opacity-70">Aparelhos consertados</p>
            </div>
            <p className="text-sm opacity-80">
              Nossos técnicos fazem o diagnóstico do seu aparelho totalmente grátis.{" "}
              <a
                href={whatsappLink("Olá! Quero um diagnóstico gratuito.")}
                target="_blank"
                rel="noreferrer"
                className="font-bold underline underline-offset-4"
              >
                Fale com a gente!
              </a>
            </p>
            <div className="flex items-center gap-3 text-sm opacity-80">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-primary text-primary" />
                ))}
              </div>
              4,9 de 5 no Google
            </div>
            <Link to="/servicos" className="inline-flex items-center gap-2 text-lg font-semibold">
              Ver <span className="text-primary underline underline-offset-4">serviços</span> de reparo
              <ArrowRight className="size-5 text-primary" />
            </Link>
          </div>
        </div>
      </section>


      {/* BARRA DE CONFIANÇA */}
      <section className="border-b">
        <div className="container-wg grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <t.icon className="size-5" />
              </span>
              <span className="text-sm font-semibold">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="container-wg py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Acessórios para o seu aparelho</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] md:text-5xl">
              Compre por
              <br />
              categoria<span className="text-primary">.</span>
            </h2>
            <Button variant="ghost" className="mt-6 px-0 hover:bg-transparent" asChild>
              <Link to="/loja">
                Ver toda a loja <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {categories.map((c) => {
              const Icon = categoryIcons[c.icon] ?? Shield;
              const from = products
                .filter((p) => p.category === c.slug)
                .reduce<number | null>((min, p) => (min === null || p.price < min ? p.price : min), null);
              return (
                <Link key={c.slug} to="/loja" search={{ categoria: c.slug }} className="group block">
                  <span className="relative inline-flex items-center justify-center">
                    <span className="absolute -right-1 -bottom-1 size-8 rounded-full bg-accent transition-transform group-hover:scale-125" />
                    <Icon className="relative size-9 text-foreground transition-colors group-hover:text-primary" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold transition-colors group-hover:text-primary">{c.name}</h3>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">{c.description}</p>
                  {from !== null && (
                    <p className="mt-4 text-sm font-semibold">A partir de {formatBRL(from)}</p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* PRODUTOS EM DESTAQUE */}
      <section className="bg-secondary/40 py-16">
        <div className="container-wg">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Mais vendidos</h2>
              <p className="mt-2 text-muted-foreground">Frete grátis acima de R$150 ou retire na loja em Cotia.</p>
            </div>
          </div>

          <Carousel opts={{ align: "start" }} className="mt-8">
            <CarouselContent className="-ml-4">
              {featured.map((p) => (
                <CarouselItem key={p.slug} className="basis-full pl-4 sm:basis-1/2 lg:basis-1/4">
                  <ProductCard product={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="container-wg py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">Assistência técnica</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">Serviços que devolvem seu aparelho ao dia a dia</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = serviceIcons[s.icon] ?? Wrench;
            return (
              <div key={s.slug} className="flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-card">
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.short}</p>
                <p className="mt-4 text-sm">
                  A partir de <strong className="text-primary">{formatBRL(s.fromPrice)}</strong>
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <QuoteDialog serviceSlug={s.slug}>
                    <Button variant="hero" size="sm">
                      Solicitar orçamento
                    </Button>
                  </QuoteDialog>

                  <Link
                    to="/servicos/$slug"
                    params={{ slug: s.slug }}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Saiba mais
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ORÇAMENTO */}
      <section className="container-wg pb-16">
        <QuoteWidget />
      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-secondary/40 py-16">
        <div className="container-wg">
          <h2 className="text-3xl font-bold md:text-4xl">Por que nos escolher</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {differentials.map((d) => (
              <div key={d.title} className="rounded-2xl border bg-card p-6">
                <d.icon className="size-6 text-primary" />
                <p className="mt-4 font-bold">{d.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="container-wg py-16">
        <h2 className="text-3xl font-bold md:text-4xl">Como funciona</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border p-6">
              <span className="absolute -top-5 left-6 flex size-10 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <s.icon className="mt-4 size-6 text-primary" />
              <p className="mt-4 text-lg font-bold">{s.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NÚMEROS */}
      <section className="gradient-primary py-16 text-primary-foreground">
        <div className="container-wg grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: 22, suffix: "", label: "anos de experiência" },
            { to: 48000, suffix: "+", label: "celulares consertados" },
            { to: 32000, suffix: "+", label: "clientes satisfeitos" },
            { to: 61000, suffix: "+", label: "peças substituídas" },
          ].map((n) => (
            <div key={n.label}>
              <p className="text-4xl font-extrabold md:text-5xl">
                <Counter to={n.to} suffix={n.suffix} />
              </p>
              <p className="mt-1 text-sm opacity-90">{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EQUIPE */}
      <section className="container-wg py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold md:text-4xl">Quem cuida do seu aparelho</h2>
          <p className="mt-2 text-muted-foreground">
            Técnicos que trabalham juntos há anos — você fala direto com quem coloca a mão no seu celular.
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.name} className="rounded-2xl border p-6 text-center transition-shadow hover:shadow-card">
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

      {/* AVALIAÇÕES */}
      <section className="bg-secondary/40 py-16">
        <div className="container-wg">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">O que dizem nossos clientes</h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                Avaliações reais de quem já trouxe o aparelho para a nossa bancada em Cotia.
              </p>
            </div>
            <GoogleRatingCard />
          </div>
          <Carousel opts={{ align: "start" }} className="mt-8">
            <CarouselContent className="-ml-4">
              {testimonials.map((t) => (
                <CarouselItem key={t.name} className="basis-full pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full rounded-2xl border bg-card p-6">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{t.text}</p>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <p className="font-semibold">{t.name}</p>
                      <span className="text-xs text-muted-foreground">via Google</span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* SOBRE */}
      <section className="container-wg grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
        <img
          src={lojaImg}
          alt="Loja da WG Celulares no Open Mall The Square, em Cotia"
          loading="lazy"
          width={1400}
          height={900}
          className="rounded-3xl object-cover shadow-card"
        />
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">Sobre a WG</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">Uma loja de bairro com padrão de grande rede</h2>
          <p className="mt-4 text-muted-foreground">
            Começamos com uma bancada e muita indicação boca a boca. Hoje somos assistência técnica completa e loja de
            acessórios no Shopping Open Mall The Square, em Cotia, com estacionamento gratuito e atendimento todos os
            dias.
          </p>
          <Button variant="outline" size="lg" className="mt-6" asChild>
            <Link to="/sobre">Conhecer nossa história</Link>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-wg py-16">
        <h2 className="text-3xl font-bold md:text-4xl">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="mt-8">
          {faq.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left text-base font-semibold">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA CONTATO */}
      <section className="container-wg pb-16">
        <div className="flex flex-col items-center gap-5 rounded-3xl gradient-primary p-10 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold md:text-4xl">Seu celular precisa de socorro?</h2>
          <p className="max-w-xl opacity-90">
            Chame no WhatsApp e receba um orçamento sem compromisso, ou passe na loja para uma avaliação gratuita.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="secondary" asChild>
              <a href={whatsappLink("Olá! Quero um orçamento na WG Celulares.")} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" /> Fale no WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contato">Ver endereço e mapa</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* MAPA DA LOJA FÍSICA */}
      <section className="border-t bg-secondary/40 py-16">
        <div className="container-wg grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Loja física</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Venha nos visitar em Cotia</h2>
            <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {contact.address}
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" /> {contact.hours}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{contact.parking}</p>
            <Button variant="hero" size="lg" className="mt-6" asChild>
              <a href={contact.mapsUrl} target="_blank" rel="noreferrer">
                Como chegar <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
          <div className="overflow-hidden rounded-3xl border shadow-card">
            <iframe
              title="Mapa da loja WG Celulares em Cotia/SP"
              src={contact.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[380px] w-full border-0"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
