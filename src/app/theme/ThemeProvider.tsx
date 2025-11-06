"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

type ProviderProps = {
  children: ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: Theme;
  enableSystem?: boolean;
};

type Ctx = {
  theme: "light" | "dark";
  raw: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeCtx = createContext<Ctx | undefined>(undefined);

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemeToDocument(
  mode: "light" | "dark",
  attribute: "class" | "data-theme" = "class"
): void {
  const root = document.documentElement;
  if (attribute === "class") {
    root.classList.toggle("dark", mode === "dark");
    root.classList.toggle("light", mode === "light");
  } else {
    root.setAttribute("data-theme", mode);
  }
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
}: ProviderProps) {
  const [raw, setRaw] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  const theme: "light" | "dark" = useMemo(() => {
    if (raw === "system") {
      return enableSystem && getSystemPrefersDark() ? "dark" : "light";
    }
    return raw === "dark" ? "dark" : "light";
  }, [raw, enableSystem]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme:choice") as Theme | null;
      if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
        setRaw(saved);
        applyThemeToDocument(
          saved === "system" ? (getSystemPrefersDark() ? "dark" : "light") : saved,
          attribute
        );
      } else {
        const resolvedTheme =
          defaultTheme === "system" ? (getSystemPrefersDark() ? "dark" : "light") : defaultTheme;
        applyThemeToDocument(resolvedTheme, attribute);
      }
    } catch (err) {
      console.warn("Error initializing theme:", err);
    }
    setMounted(true);
  }, [attribute, defaultTheme]);

  useEffect(() => {
    if (!mounted) return;
    applyThemeToDocument(theme, attribute);
    try {
      localStorage.setItem("theme:choice", raw);
    } catch (err) {
      console.warn("Error saving theme:", err);
    }
  }, [theme, raw, attribute, mounted]);

  useEffect(() => {
    if (!enableSystem || !mounted || raw !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (): void => {
      applyThemeToDocument(mql.matches ? "dark" : "light", attribute);
    };

    try {
      mql.addEventListener("change", handler);
    } catch {
      try {
        // Fallback para navegadores antiguos
        (mql as unknown as { addListener: (cb: () => void) => void }).addListener(handler);
      } catch {
        // no-op
      }
    }

    return () => {
      try {
        mql.removeEventListener("change", handler);
      } catch {
        try {
          // Fallback para navegadores antiguos
          (mql as unknown as { removeListener: (cb: () => void) => void }).removeListener(handler);
        } catch {
          // no-op
        }
      }
    };
  }, [raw, enableSystem, attribute, mounted]);

  const setTheme = (t: Theme): void => {
    setRaw(t);
  };

  const toggle = (): void => {
    setRaw((prev) => {
      if (prev === "dark") return "light";
      if (prev === "light") return "system";
      return "dark";
    });
  };

  const value: Ctx = { theme, raw, setTheme, toggle };

  if (!mounted) {
    return <>{children}</>;
  }

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeCtx);
  if (!ctx) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  }
  return ctx;
}
