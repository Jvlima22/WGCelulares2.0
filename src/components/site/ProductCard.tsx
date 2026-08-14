import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatBRL, type Product } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import produtosImg from "@/assets/produtos-mock.jpg";

export function ProductCard({ product }: { product: Product }) {
  const { add, setOpen } = useCart();

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-card">
      <Link
        to="/produto/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-secondary"
      >
        <img
          src={produtosImg}
          alt={product.name}
          loading="lazy"
          width={600}
          height={600}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to="/produto/$slug" params={{ slug: product.slug }} className="line-clamp-2 text-sm font-semibold hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-primary text-primary" />
          {product.rating.toFixed(1)} ({product.reviews})
        </div>

        <div className="mt-3">
          {product.oldPrice && (
            <span className="mr-2 text-xs text-muted-foreground line-through">{formatBRL(product.oldPrice)}</span>
          )}
          <span className="text-lg font-bold">{formatBRL(product.price)}</span>
          <p className="text-xs text-muted-foreground">
            até 3x de {formatBRL(product.price / 3)} sem juros
          </p>
        </div>

        <Button
          variant="hero"
          className="mt-4 w-full"
          onClick={() => {
            add({ slug: product.slug, name: product.name, price: product.price, variant: product.variants[0] ?? "" });
            setOpen(true);
            toast.success("Produto adicionado ao carrinho");
          }}
        >
          <ShoppingCart className="size-4" /> Adicionar
        </Button>
      </div>
    </div>
  );
}
