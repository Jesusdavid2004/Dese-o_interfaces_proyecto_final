"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function LangSwitch() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const lang = ((sp.get("lang") || "es").toLowerCase() === "en" ? "en" : "es") as "es" | "en";

  const baseHref = useMemo(() => {
    const params = new URLSearchParams(sp.toString());
    return params;
  }, [sp]);

  const setLang = (next: "es" | "en") => {
    const params = new URLSearchParams(baseHref.toString());
    params.set("lang", next);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className="relative inline-flex items-center rounded-full border border-slate-300/70 dark:border-slate-700/70 bg-white/70 dark:bg-white/5 backdrop-blur-md p-1 shadow-sm"
      role="group"
      aria-label="Language switch"
    >
      {/* Indicador activo deslizante */}
      <span
        aria-hidden
        className={`absolute top-1 bottom-1 w-[46%] rounded-full transition-[left] duration-200 ease-out bg-gradient-to-r from-emerald-500 to-cyan-400
        ${lang === "es" ? "left-1" : "left-[53%]"}`}
      />

      <button
        type="button"
        onClick={() => setLang("es")}
        className={`relative z-10 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors
        ${lang === "es" ? "text-white" : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"}`}
        aria-pressed={lang === "es"}
      >
        ES
      </button>

      <button
        type="button"
        onClick={() => setLang("en")}
        className={`relative z-10 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors
        ${lang === "en" ? "text-white" : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}
