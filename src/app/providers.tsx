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
  }, []);

  return (
    <ThemeProvider defaultTheme="system" enableSystem={true}>
      {!mounted && <OverlayLoader />}
      <BackgroundFX />
      <CursorFX />
      
      {/* ✅ SiteNav DENTRO del ThemeProvider - IMPORTANTE */}
      {mounted && <SiteNav />}
      
      <main className="relative z-10 w-full flex-1 overflow-y-auto">
        {children}
      </main>
    </ThemeProvider>
  );
}
