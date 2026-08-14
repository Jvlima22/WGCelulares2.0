import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contact } from "@/data/catalog";

const RATING = 4.9;
const TOTAL = 428;

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-5">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.5 14.5 0 0 1 9.77 24c0-1.6.27-3.15.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.88.93 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function GoogleRatingCard() {
  return (
    <div className="flex items-center gap-5 rounded-2xl border bg-card p-5 shadow-card">
      <div className="text-center">
        <p className="text-4xl font-bold leading-none">{RATING.toLocaleString("pt-BR")}</p>
        <div className="mt-2 flex justify-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4 fill-primary text-primary" />
          ))}
        </div>
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <GoogleGlyph /> Avaliações no Google
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Baseado em {TOTAL} avaliações de clientes.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="soft" asChild>
            <a href={contact.mapsUrl} target="_blank" rel="noreferrer">
              Ver no Google
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={contact.reviewUrl} target="_blank" rel="noreferrer">
              Avaliar a loja
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
