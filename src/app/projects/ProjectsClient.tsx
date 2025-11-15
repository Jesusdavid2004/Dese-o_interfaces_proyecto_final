"use client";

import React from "react";
import { ProjectCard } from "@/components/ProjectCard";
import ParquesColombia from "@/components/ParquesColombia";
import { t, getLangFromSearch, Lang } from "@/lib/i18n";

type ProjectItem = {
  title: string;
  desc: string;
  darkColor: string;
  lightColor: string;
  live?: string;
  code?: string;
  hideLive?: boolean;
};

export default function ProjectsClient() {
  const lang: Lang =
    typeof window !== "undefined" ? getLangFromSearch(window.location.search) : "es";

  // Etiquetas de botones desde i18n
  const liveLabel = t(lang, "btn_view_project"); // ES: Ver proyecto / EN: View project
  const codeLabel = t(lang, "btn_view_code");    // ES: Ver código / EN: View code

  // Contenido bilingüe con claves nuevas ya añadidas al i18n
  const leftCol: ProjectItem[] = [
    {
      // App de Turismo → solo código
      title: t(lang, "prj_tour_title"),
      desc: t(lang, "prj_tour_desc_updated"),
      darkColor: "#1F3A52",
      lightColor: "#3B82F6",
      code: "https://github.com/ghosstbabby12/Carnaval-Conecta",
      hideLive: true,
    },
    {
      // E-commerce → Ubicación API
      title: t(lang, "prj_ubication_title"),
      desc: t(lang, "prj_ubication_desc"),
      darkColor: "#2A2F4A",
      lightColor: "#8B5CF6",
      live: "https://ubication-ip.vercel.app/",
      code: "https://github.com/Jesusdavid2004/ubication_ip",
    },
  ];

  const rightCol: ProjectItem[] = [
    {
      // Dashboard Energético → Maquetación
      title: t(lang, "prj_layout_title"),
      desc: t(lang, "prj_layout_desc"),
      darkColor: "#1F4A47",
      lightColor: "#06B6D4",
      live: "https://maquetacion-mocha.vercel.app/",
      code: "https://github.com/Jesusdavid2004/maquetacion",
    },
    {
      // Reloj Digital en Python → Adaptable
      title: t(lang, "prj_adaptable_title"),
      desc: t(lang, "prj_adaptable_desc"),
      darkColor: "#3D2442",
      lightColor: "#EC4899",
      live: "https://responsive-three-ashy.vercel.app/",
      code: "https://github.com/Jesusdavid2004/Responsive",
    },
  ];

  return (
    <>
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
          {leftCol.map((p, i) => (
            <ProjectCard
              key={`left-${i}`}
              title={p.title}
              desc={p.desc}
              darkColor={p.darkColor}
              lightColor={p.lightColor}
              href={p.live ?? "#"}
              codeHref={p.code}
              hideLive={p.hideLive}
              liveLabel={liveLabel}
              codeLabel={codeLabel}
            />
          ))}
        </div>

        {/* Centro (Parqués) */}
        <div className="card p-6 bg-zinc-900/80 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center justify-center">
          <ParquesColombia />
        </div>

        {/* Columna derecha */}
        <div className="grid gap-3">
          {rightCol.map((p, i) => (
            <ProjectCard
              key={`right-${i}`}
              title={p.title}
              desc={p.desc}
              darkColor={p.darkColor}
              lightColor={p.lightColor}
              href={p.live ?? "#"}
              codeHref={p.code}
              hideLive={p.hideLive}
              liveLabel={liveLabel}
              codeLabel={codeLabel}
            />
          ))}
        </div>
      </div>
    </>
  );
}
