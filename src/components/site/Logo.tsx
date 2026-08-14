import darkText from "@/assets/logo-wg-dark-text.png.asset.json";
import lightText from "@/assets/logo-wg-light-text.png.asset.json";

/**
 * The WG symbol stays orange in both themes; only the wordmark below it swaps
 * between black (white mode) and white (dark mode). Both variants are rendered
 * and toggled with CSS so the correct one shows before hydration.
 */
export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <span className="inline-flex items-center">
      <img
        src={darkText.url}
        alt="WG Celulares — Assistência Técnica"
        className={`${className} dark:hidden`}
        loading="eager"
      />
      <img
        src={lightText.url}
        alt="WG Celulares — Assistência Técnica"
        className={`${className} hidden dark:block`}
        loading="eager"
        aria-hidden="true"
      />
    </span>
  );
}
