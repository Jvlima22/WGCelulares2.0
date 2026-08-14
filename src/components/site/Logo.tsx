import darkTextUrl from "@/assets/logo-wg-dark-text.png?url";
import lightTextUrl from "@/assets/logo-wg-light-text.png?url";

/**
 * The WG symbol stays orange in both themes; only the wordmark below it swaps
 * between black (white mode) and white (dark mode). Both variants are rendered
 * and toggled with CSS so the correct one shows before hydration.
 */
export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <span className="inline-flex items-center">
      <img
        src={darkTextUrl}
        alt="WG Celulares — Assistência Técnica"
        className={`${className} dark:hidden`}
        loading="eager"
      />
      <img
        src={lightTextUrl}
        alt="WG Celulares — Assistência Técnica"
        className={`${className} hidden dark:block`}
        loading="eager"
        aria-hidden="true"
      />
    </span>
  );
}
