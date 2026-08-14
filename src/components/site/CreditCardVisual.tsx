import { cardBrandLabel, detectCardBrand } from "@/lib/format";

type Props = {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  flipped: boolean;
};

function Chip() {
  return (
    <svg viewBox="0 0 48 36" className="h-8 w-11" aria-hidden="true">
      <rect x="1" y="1" width="46" height="34" rx="6" fill="#e8c26a" />
      <path
        d="M17 1v34M31 1v34M1 12h46M1 24h46"
        stroke="#b8912f"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

export function CreditCardVisual({ number, name, expiry, cvv, flipped }: Props) {
  const brand = detectCardBrand(number);
  const digits = number.replace(/\D/g, "").padEnd(16, "•");
  const groups = [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12), digits.slice(12, 16)];

  return (
    <div className="[perspective:1200px]">
      <div
        className={`relative h-52 w-full max-w-sm transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl card-gradient p-6 text-card-ink shadow-glow [backface-visibility:hidden]">
          <div className="flex items-start justify-between">
            <Chip />
            <span className="text-sm font-semibold uppercase tracking-wide opacity-90">
              {cardBrandLabel[brand]}
            </span>
          </div>
          <div className="font-mono text-xl tracking-[0.18em] tabular-nums">
            {groups.join(" ")}
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest opacity-70">Titular</p>
              <p className="truncate text-sm font-medium uppercase">{name || "NOME NO CARTÃO"}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest opacity-70">Validade</p>
              <p className="font-mono text-sm">{expiry || "MM/AA"}</p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex flex-col rounded-2xl card-gradient text-card-ink shadow-glow [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="mt-6 h-11 w-full bg-black/70" />
          <div className="px-6 pt-6">
            <p className="text-[10px] uppercase tracking-widest opacity-70">CVV</p>
            <div className="mt-1 flex h-9 items-center justify-end rounded bg-white px-3 font-mono text-sm text-black">
              {cvv || "•••"}
            </div>
          </div>
          <p className="mt-auto p-6 pt-4 text-[10px] opacity-70">
            Ambiente seguro — seus dados não são armazenados.
          </p>
        </div>
      </div>
    </div>
  );
}
