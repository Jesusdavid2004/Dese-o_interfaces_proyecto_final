"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import BackgroundFX from "../components/BackgroundFX";
import CursorFX from "../components/CursorFX";
import OverlayLoader from "../components/OverlayLoader";
import SiteNav from "../components/SiteNav";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sincroniza el atributo lang del <html> en navegación cliente
    try {
      const syncLang = () => {
        const params = new URLSearchParams(location.search);
        const lang = (params.get("lang") || "es").toLowerCase() === "en" ? "en" : "es";
        document.documentElement.setAttribute("lang", lang);
      };
      syncLang();
      window.addEventListener("popstate", syncLang);
      window.addEventListener("pushstate", syncLang as any);
      window.addEventListener("replacestate", syncLang as any);
    } catch {}
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      {!mounted && <OverlayLoader />}
      <BackgroundFX />
      <CursorFX />

      {/* ✅ Todo lo que use useTheme debe ir debajo de ThemeProvider */}
      {mounted && <SiteNav />}

      <main className="relative z-10 w-full flex-1 overflow-y-auto">
        {children}
      </main>
    </ThemeProvider>
  );
}
