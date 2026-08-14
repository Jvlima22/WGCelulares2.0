import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, MessageCircle, ShoppingCart, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/site/ProductCard";
import { formatBRL, products, testimonials, whatsappLink } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import produtosImg from "@/assets/produtos-mock.jpg";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Produto indisponível | WG Celulares" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} | WG Celulares` },
        { name: "description", content: product.short },
        { property: "og:title", content: `${product.name} | WG Celulares` },
        { property: "og:description", content: product.short },
      ],
    };
  },
  component: ProdutoPage,
});

function ProdutoPage() {
  const { product } = Route.useLoaderData();
  const { add, setOpen } = useCart();
  const [variant, setVariant] = useState(product.variants[0] ?? "");
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);

  return (
    <div className="container-wg py-10">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Início
        </Link>{" "}
        /{" "}
        <Link to="/loja" search={{ categoria: product.category }} className="hover:text-primary">
          Loja
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border bg-secondary">
            <img
              src={produtosImg}
              alt={product.name}
              width={1200}
              height={800}
              className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <img
                key={i}
                src={produtosImg}
                alt={`${product.name} — foto ${i + 1}`}
                loading="lazy"
                width={300}
                height={300}
                className="aspect-square w-full rounded-lg border object-cover"
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-primary text-primary" /> {product.rating.toFixed(1)}
            </span>
            <span>· {product.reviews} avaliações</span>
          </div>

          <div className="mt-6">
            {product.oldPrice && (
              <span className="mr-2 text-muted-foreground line-through">{formatBRL(product.oldPrice)}</span>
            )}
            <span className="text-4xl font-bold">{formatBRL(product.price)}</span>
            <p className="mt-1 text-sm text-muted-foreground">
              ou 3x de {formatBRL(product.price / 3)} sem juros · à vista no Pix com 5% de desconto
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">Variação</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    v === variant ? "border-primary bg-accent text-accent-foreground" : "hover:bg-muted"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-success">
            <Check className="size-4" /> {product.stock} unidades em estoque
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="hero"
              size="lg"
              className="flex-1"
              onClick={() => {
                add({ slug: product.slug, name: product.name, price: product.price, variant });
                setOpen(true);
                toast.success("Produto adicionado ao carrinho");
              }}
            >
              <ShoppingCart className="size-4" /> Adicionar ao carrinho
            </Button>
            <Button variant="outline" size="lg" className="flex-1" asChild>
              <a href={whatsappLink(`Olá! Tenho interesse no produto ${product.name} (${variant}).`)} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" /> Comprar via WhatsApp
              </a>
            </Button>
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="size-4 text-primary" /> Frete grátis acima de R$150 ou retirada na loja em Cotia
          </p>

          <Separator className="my-8" />

          <h2 className="text-lg font-bold">Descrição</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Avaliações de clientes</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.name} className="rounded-xl border p-5 shadow-card">
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.text}</p>
              <p className="mt-3 text-sm font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">Produtos relacionados</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
