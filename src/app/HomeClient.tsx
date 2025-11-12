"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Dice3D from "../components/Dice3D";
import TokenDecor from "../components/TokenDecor";
import { getLangFromSearch, t, Lang } from "@/lib/i18n";

const ROUTES: Record<number, string> = {
  1: "/about",
  2: "/projects",
  3: "/services",
  4: "/experience",
  5: "/hobbies",
  6: "/contact",
};

export default function HomeClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const lang: Lang = getLangFromSearch(sp?.toString() || "");

  const handleRoll = useCallback(
    (n: number) => {
      const to = ROUTES[n];
      if (!to) return;
      router.push(`${to}?lang=${lang}`);
    },
    [router, lang]
  );

  return (
    <div className="relative z-0 max-w-2xl mx-auto w-full">
      {/* Capa decorativa al fondo, no interactúa */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <TokenDecor
          color="red"
          size={60}
          className="absolute -top-6 -left-10 token-float hidden sm:block"
        />
        <TokenDecor
          color="blue"
          size={72}
          className="absolute -top-4 -right-12 token-float hidden sm:block"
        />
        <TokenDecor
          color="yellow"
          size={54}
          className="absolute -bottom-6 -left-8 token-float hidden md:block"
        />
        <TokenDecor
          color="green"
          size={64}
          className="absolute -bottom-10 -right-8 token-float hidden md:block"
        />
      </div>

      {/* Contenido principal por encima */}
      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 sm:mb-4">
          {t(lang, "home_title")}
        </h1>

        <p className="text-white/80 sm:text-white/90 text-sm sm:text-base md:text-lg mb-8 sm:mb-10">
          {t(lang, "home_sub")}
        </p>

        {/* Dado */}
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="scale-75 sm:scale-90 md:scale-100">
            <Dice3D onRoll={handleRoll} />
          </div>

          {/* Guía de números */}
          <p className="text-white/70 text-xs sm:text-sm px-4 text-center max-w-xl">
            <span className="hidden sm:inline">{t(lang, "home_guide_full")}</span>
            <span className="sm:hidden">{t(lang, "home_guide_short")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
