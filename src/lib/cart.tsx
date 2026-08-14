import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  variant?: string | undefined;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string, variant?: string) => void;
  setQty: (slug: string, variant: string | undefined, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "wg-cart-v1";

const sameLine = (a: CartItem, slug: string, variant?: string) => a.slug === slug && a.variant === variant;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 19.9;
    return {
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      open,
      setOpen,
      add: (item, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((p) => sameLine(p, item.slug, item.variant));
          if (existing) {
            return prev.map((p) => (sameLine(p, item.slug, item.variant) ? { ...p, qty: p.qty + qty } : p));
          }
          return [...prev, { ...item, qty }];
        }),
      remove: (slug, variant) => setItems((prev) => prev.filter((p) => !sameLine(p, slug, variant))),
      setQty: (slug, variant, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((p) => !sameLine(p, slug, variant))
            : prev.map((p) => (sameLine(p, slug, variant) ? { ...p, qty } : p)),
        ),
      clear: () => setItems([]),
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
