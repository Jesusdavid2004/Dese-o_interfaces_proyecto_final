"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Dice3D from "../components/Dice3D";
import TokenDecor from "../components/TokenDecor";

const ROUTES: Record<number, string> = {
  1: "/about",
  2: "/projects",
  3: "/services",
  4: "/experience",
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
    <main className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center px-4 py-8 sm:py-12">
      <section className="relative rounded-3xl w-full max-w-4xl p-6 sm:p-12 grid place-items-center text-center overflow-hidden">
        
        {/* Mesa verde de fondo */}
        <div className="absolute inset-0 board-bg opacity-60 rounded-3xl" />

        {/* Tokens decorativos */}
        <TokenDecor color="red" size={60} className="absolute top-6 left-6 token-float hidden sm:block" />
        <TokenDecor color="blue" size={72} className="absolute top-8 right-10 token-float hidden sm:block" />
        <TokenDecor color="yellow" size={54} className="absolute bottom-8 left-10 token-float hidden md:block" />
        <TokenDecor color="green" size={64} className="absolute bottom-6 right-6 token-float hidden md:block" />

        {/* Contenido principal */}
        <div className="relative z-10 max-w-2xl mx-auto w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 sm:mb-4">
             Lanza el dado y explora mi portafolio
          </h1>
          
          <p className="text-white/80 sm:text-white/90 text-sm sm:text-base md:text-lg mb-8 sm:mb-10">
            Cada número del dado te llevará a una sección distinta de mi mundo profesional y personal.
          </p>

          {/* Dado */}
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="scale-75 sm:scale-90 md:scale-100">
              <Dice3D onRoll={handleRoll} />
            </div>
            
            {/* Guía de números */}
            <p className="text-white/70 text-xs sm:text-sm px-4 text-center max-w-xl">
              <span className="hidden sm:inline">
                1: Acerca de mí · 2: Proyectos · 3: Servicios · 4: Experiencia · 5: Pasatiempos · 6: Contacto
              </span>
              <span className="sm:hidden">
                1: Mí · 2: Proy. · 3: Serv. · 4: Exp. · 5: Pasatiempos · 6: Contacto
              </span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
