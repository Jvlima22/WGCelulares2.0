import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/site/ProductCard";
import { brands, categories, colors, formatBRL, products } from "@/data/catalog";

type Search = { categoria?: string | undefined; busca?: string | undefined };

export const Route = createFileRoute("/loja")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    categoria: typeof search["categoria"] === "string" ? (search["categoria"] as string) : undefined,
    busca: typeof search["busca"] === "string" ? (search["busca"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Loja de acessórios para celular | WG Celulares" },
      {
        name: "description",
        content: "Capas, películas, cabos, fones, smartwatches e adaptadores com frete grátis acima de R$150.",
      },
      { property: "og:title", content: "Loja de acessórios para celular | WG Celulares" },
      { property: "og:description", content: "Acessórios originais e premium com entrega para todo o Brasil." },
    ],
  }),
  component: LojaPage,
});

function LojaPage() {
  const { categoria, busca } = Route.useSearch();
  const [cats, setCats] = useState<string[]>(categoria ? [categoria] : []);
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [selColors, setSelColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sort, setSort] = useState("relevancia");

  const activeCats = categoria && cats.length === 0 ? [categoria] : cats;

  const list = useMemo(() => {
    let out = products.filter((p) => {
      if (activeCats.length && !activeCats.includes(p.category)) return false;
      if (selBrands.length && !selBrands.includes(p.brand)) return false;
      if (selColors.length && !selColors.includes(p.color)) return false;
      if (p.price > maxPrice) return false;
      if (busca && !p.name.toLowerCase().includes(busca.toLowerCase())) return false;
      return true;
    });
    if (sort === "menor") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "maior") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "vendidos") out = [...out].sort((a, b) => b.reviews - a.reviews);
    return out;
  }, [activeCats, selBrands, selColors, maxPrice, sort, busca]);

  const toggle = (arr: string[], set: (v: string[]) => void, value: string) =>
    set(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

  const catName = categories.find((c) => c.slug === categoria)?.name;

  return (
    <div>
      <div className="border-b bg-secondary/50">
        <div className="container-wg py-10">
          <nav className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Início
            </Link>{" "}
            / <span className="text-foreground">Loja{catName ? ` / ${catName}` : ""}</span>
          </nav>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{catName ?? "Loja WG"}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Acessórios selecionados, testados na loja e com garantia. Frete grátis acima de R$150 ou retire em Cotia.
          </p>
        </div>
      </div>

      <div className="container-wg grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-8">
          <div>
            <p className="mb-3 text-sm font-bold">Categorias</p>
            <div className="space-y-2">
              {categories.map((c) => (
                <div key={c.slug} className="flex items-center gap-2">
                  <Checkbox
                    id={`cat-${c.slug}`}
                    checked={activeCats.includes(c.slug)}
                    onCheckedChange={() => toggle(activeCats, setCats, c.slug)}
                  />
                  <Label htmlFor={`cat-${c.slug}`} className="text-sm font-normal">
                    {c.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold">Faixa de preço</p>
            <Slider value={[maxPrice]} min={20} max={500} step={10} onValueChange={(v) => setMaxPrice(v[0] ?? 500)} />
            <p className="mt-2 text-xs text-muted-foreground">Até {formatBRL(maxPrice)}</p>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold">Compatibilidade</p>
            <div className="space-y-2">
              {brands.map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <Checkbox id={`b-${b}`} checked={selBrands.includes(b)} onCheckedChange={() => toggle(selBrands, setSelBrands, b)} />
                  <Label htmlFor={`b-${b}`} className="text-sm font-normal">
                    {b}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold">Cor</p>
            <div className="space-y-2">
              {colors.map((c) => (
                <div key={c} className="flex items-center gap-2">
                  <Checkbox id={`c-${c}`} checked={selColors.includes(c)} onCheckedChange={() => toggle(selColors, setSelColors, c)} />
                  <Label htmlFor={`c-${c}`} className="text-sm font-normal">
                    {c}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{list.length} produtos encontrados</p>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">Relevância</SelectItem>
                <SelectItem value="menor">Menor preço</SelectItem>
                <SelectItem value="maior">Maior preço</SelectItem>
                <SelectItem value="vendidos">Mais vendidos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {list.length === 0 ? (
            <p className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
              Nenhum produto encontrado com esses filtros.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
