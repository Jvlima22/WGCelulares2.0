import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_STORAGE_KEY = "wg-theme";

/**
 * Inline script injected in <head> to apply the stored/system theme before
 * first paint, avoiding a flash of the wrong appearance.
 */
export const themeInitScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var t=s==="light"||s==="dark"?s:"light";var e=document.documentElement;e.classList.toggle("dark",t==="dark");e.style.colorScheme=t;}catch(_){}})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");

  useEffect(() => {
    let initial: ThemeMode = "light";
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        initial = stored;
      }
    } catch {
      /* ignore */
    }
    setThemeState(initial);
  }, []);

  const apply = useCallback((next: ThemeMode) => {
    setThemeState(next);
    const el = document.documentElement;
    el.classList.toggle("dark", next === "dark");
    el.style.colorScheme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: apply, toggle: () => apply(theme === "dark" ? "light" : "dark") }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
