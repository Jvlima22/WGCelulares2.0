import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatBRL } from "@/data/catalog";
import { useCart } from "@/lib/cart";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, shipping, total } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>Seu carrinho</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
            <Button variant="hero" onClick={() => setOpen(false)} asChild>
              <Link to="/loja">Ver produtos</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.map((item) => (
                <div key={`${item.slug}-${item.variant ?? ""}`} className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-snug">{item.name}</p>
                    {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                    <p className="mt-1 text-sm font-bold text-primary">{formatBRL(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-7"
                        aria-label="Diminuir"
                        onClick={() => setQty(item.slug, item.variant, item.qty - 1)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.qty}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-7"
                        aria-label="Aumentar"
                        onClick={() => setQty(item.slug, item.variant, item.qty + 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="ml-auto size-7 text-muted-foreground"
                        aria-label="Remover"
                        onClick={() => remove(item.slug, item.variant)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-5">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatBRL(total)}</span>
                </div>
              </div>
              <Button variant="hero" size="lg" className="mt-4 w-full" asChild onClick={() => setOpen(false)}>
                <Link to="/checkout">Finalizar compra</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
