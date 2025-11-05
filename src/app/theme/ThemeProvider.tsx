"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";

type ProviderProps = {
  children: React.ReactNode;
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

const ThemeCtx = createContext<Ctx | null>(null);

function getSystemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemeToDocument(
  mode: "light" | "dark",
  attribute: "class" | "data-theme" = "class"
) {
  const root = document.documentElement;
  if (attribute === "class") {
    root.classList.toggle("dark", mode === "dark");
  } else {
    root.setAttribute("data-theme", mode);
  }
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "dark",
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
    setMounted(true);

    try {
      const saved = localStorage.getItem("theme:choice") as Theme | null;
      if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
        setRaw(saved);
      }
    } catch {
      // Silent fail para SSR
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    applyThemeToDocument(theme, attribute);

    try {
      localStorage.setItem("theme:choice", raw);
    } catch {
      // Silent fail
    }
  }, [theme, raw, attribute, mounted]);

  useEffect(() => {
    if (!enableSystem || !mounted) return;
    if (raw !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = () => {
      applyThemeToDocument(mql.matches ? "dark" : "light", attribute);
    };

    try {
      mql.addEventListener?.("change", handler);
    } catch {
      mql.addListener?.(handler);
    }

    return () => {
      try {
        mql.removeEventListener?.("change", handler);
      } catch {
        mql.removeListener?.(handler);
      }
    };
  }, [raw, enableSystem, attribute, mounted]);

  const setTheme = (t: Theme) => setRaw(t);
  const toggle = () =>
    setRaw((prev) =>
      prev === "dark" ? "light" : prev === "light" ? "system" : "dark"
    );

  const value: Ctx = { theme, raw, setTheme, toggle };

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  }
  return ctx;
}
