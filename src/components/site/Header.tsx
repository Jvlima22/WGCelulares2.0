import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, MapPin, Search, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { categories, services } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const notices = [
  "Garantia de 90 dias em todos os serviços",
  "Frete grátis nas compras acima de R$150",
  "Reparo pronto em até 1 hora",
];

function NoticeBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % notices.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="gradient-primary text-primary-foreground">
      <div className="container-wg flex h-9 items-center justify-center overflow-hidden text-xs font-medium sm:text-sm">
        <span key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {notices[i]}
        </span>
      </div>
    </div>
  );
}

function MegaMenu() {
  return (
    <nav className="hidden items-center gap-7 py-3 lg:flex">
      {categories.map((c) => (
        <Link
          key={c.slug}
          to="/loja"
          search={{ categoria: c.slug }}
          className="text-sm font-semibold text-foreground/85 transition-colors hover:text-primary"
        >
          {c.name}
        </Link>
      ))}
      <span className="h-4 w-px bg-border" />
      <Link to="/servicos" className="text-sm font-semibold text-foreground/85 transition-colors hover:text-primary">
        Serviços
      </Link>
      <Link to="/loja" className="text-sm font-semibold text-foreground/85 transition-colors hover:text-primary">
        Loja
      </Link>
      <Link to="/sobre" className="text-sm font-semibold text-foreground/85 transition-colors hover:text-primary">
        Sobre
      </Link>
      <Link to="/contato" className="text-sm font-semibold text-foreground/85 transition-colors hover:text-primary">
        Contato
      </Link>
    </nav>
  );
}


function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] overflow-y-auto p-6">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="mt-6 flex flex-col gap-1">
          <Link to="/" onClick={() => setOpen(false)} className="py-2 text-base font-semibold">
            Início
          </Link>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">Loja</p>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/loja"
              search={{ categoria: c.slug }}
              onClick={() => setOpen(false)}
              className="py-1.5 text-sm text-muted-foreground"
            >
              {c.name}
            </Link>
          ))}
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">Serviços</p>
          {services.map((s) => (
            <Link
              key={s.slug}
              to="/servicos/$slug"
              params={{ slug: s.slug }}
              onClick={() => setOpen(false)}
              className="py-1.5 text-sm text-muted-foreground"
            >
              {s.name}
            </Link>
          ))}
          <Link to="/sobre" onClick={() => setOpen(false)} className="mt-4 py-2 text-base font-semibold">
            Sobre
          </Link>
          <Link to="/contato" onClick={() => setOpen(false)} className="py-2 text-base font-semibold">
            Contato
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AccountMenu() {
  const { session, profile, signOut } = useAuth();

  if (!session) {
    return (
      <Button variant="ghost" size="icon" aria-label="Entrar na minha conta" asChild>
        <Link to="/auth">
          <User className="size-5" />
        </Link>
      </Button>
    );
  }

  const name = profile?.full_name ?? session.user.email ?? "Minha conta";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Minha conta">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials || "WG"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/conta">Minha conta</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/conta" search={{ aba: "pedidos" }}>
            Meus pedidos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const { count, setOpen } = useCart();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <NoticeBar />
      <div className="container-wg flex h-16 items-center gap-3">
        <MobileMenu />
        <Link to="/" className="shrink-0" aria-label="WG Celulares — página inicial">
          <Logo className="h-9 w-auto" />
        </Link>

        <div className="mx-auto hidden max-w-xl flex-1 items-center md:flex">
          <form
            className="relative w-full"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/loja?busca=${encodeURIComponent(q)}`;
            }}
          >
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Busca"
              className="h-11 rounded-full border-transparent bg-muted pl-11"
              aria-label="Buscar produtos"
            />
          </form>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <span className="mr-2 hidden items-center gap-2 text-sm font-medium text-muted-foreground xl:flex">
            <MapPin className="size-4" /> Cotia — The Square
          </span>
          <ThemeToggle />
          <AccountMenu />
          <Button variant="ghost" size="icon" aria-label="Abrir carrinho" className="relative" onClick={() => setOpen(true)}>
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>

      </div>
      <div className="hidden border-t lg:block">
        <div className="container-wg">
          <MegaMenu />
        </div>
      </div>
    </header>
  );
}

export { X };
