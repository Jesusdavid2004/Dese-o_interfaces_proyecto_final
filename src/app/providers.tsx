"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import BackgroundFX from "../components/BackgroundFX";
import CursorFX from "../components/CursorFX";
import OverlayLoader from "../components/OverlayLoader";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Espera 200ms para asegurar que todo está listo
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {!mounted && <OverlayLoader />}
      <BackgroundFX />
      <CursorFX />
      <div className="relative z-10">{children}</div>
    </ThemeProvider>
  );
}
