"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Dice3D from "../components/Dice3D";
import TokenDecor from "../components/TokenDecor";

const ROUTES: Record<number, string> = {
  1: "/about",
  2: "/projects",
  3: "/experience",
  4: "/services",
  5: "/hobbies",
  6: "/contact",
};

export default function Page() {
  const router = useRouter();

  const handleRoll = useCallback((n: number) => {
    const to = ROUTES[n];
    if (to) router.push(to);
  }, [router]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <section className="relative rounded-3xl w-full max-w-4xl p-12 grid place-items-center text-center overflow-hidden">
        
        {/* ✅ CORREGIDO: Eliminado BackgroundFX (ya está en providers.tsx) */}
        {/* Mesa verde suave */}
        <div className="absolute inset-0 board-bg opacity-60" />

        {/* Tokens decorativos en esquinas con flotación */}
        <TokenDecor color="red" size={60} className="absolute top-6 left-6 token-float" />
        <TokenDecor color="blue" size={72} className="absolute top-8 right-10 token-float" />
        <TokenDecor color="yellow" size={54} className="absolute bottom-8 left-10 token-float" />
        <TokenDecor color="green" size={64} className="absolute bottom-6 right-6 token-float" />

        {/* Contenido principal */}
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            🎲 Lanza el dado y explora mi portafolio
          </h1>
          <p className="text-white/90 mt-2">
            Cada número del dado te llevará a una sección distinta de mi mundo profesional y personal.
          </p>
          <div className="mt-8 grid place-items-center">
            <Dice3D onRoll={handleRoll} />
            <p className="text-white/90 text-sm mt-3">
              1: About · 2: Projects · 3: Experience · 4: Services · 5: Hobbies · 6: Contact
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
