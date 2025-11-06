"use client";
import React, { useMemo } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import ParquesColombia from "@/components/ParquesColombia";
import { t, getLangFromSearch, Lang } from "@/lib/i18n";

type ProjectItem = {
  titleKey: string;
  descKey: string;
  darkColor: string;
  lightColor: string;
  href: string;
};

const leftCol: ProjectItem[] = [
  { titleKey: "prj_tour_title",  descKey: "prj_tour_desc",  darkColor: "#1F3A52", lightColor: "#3B82F6", href: "#" },
  { titleKey: "prj_shop_title",  descKey: "prj_shop_desc",  darkColor: "#2A2F4A", lightColor: "#8B5CF6", href: "#" },
];

const rightCol: ProjectItem[] = [
  { titleKey: "prj_energy_title", descKey: "prj_energy_desc", darkColor: "#1F4A47", lightColor: "#06B6D4", href: "#" },
  { titleKey: "prj_watch_title",  descKey: "prj_watch_desc",  darkColor: "#3D2442", lightColor: "#EC4899", href: "#" },
];

export default function ProjectsPage() {
  // Idioma determinado en cliente, con fallback seguro a "es"
  const lang: Lang = useMemo(() => {
    if (typeof window === "undefined") return "es";
    return getLangFromSearch(window.location.search);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="opacity-90 text-emerald-400" />
          <h2 className="text-3xl font-extrabold text-black dark:text-white">
            {t(lang, "projects_title")}
          </h2>
        </div>

        <p className="muted mb-6 text-lg text-black dark:text-white">
          {t(lang, "projects_intro")}
        </p>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-5 items-start">
          {/* Columna izquierda */}
          <div className="grid gap-3">
            {leftCol.map((p) => (
              <ProjectCard
                key={p.titleKey}
                title={t(lang, p.titleKey)}
                desc={t(lang, p.descKey)}
                darkColor={p.darkColor}
                lightColor={p.lightColor}
                href={p.href}
              />
            ))}
          </div>

          {/* Centro (Parqués) */}
          <div className="card p-6 bg-zinc-900/80 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center justify-center">
            {/* No se pasa prop lang; ParquesColombia puede leer ?lang internamente */}
            <ParquesColombia />
          </div>

          {/* Columna derecha */}
          <div className="grid gap-3">
            {rightCol.map((p) => (
              <ProjectCard
                key={p.titleKey}
                title={t(lang, p.titleKey)}
                desc={t(lang, p.descKey)}
                darkColor={p.darkColor}
                lightColor={p.lightColor}
                href={p.href}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
