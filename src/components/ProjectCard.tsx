"use client";

interface ProjectCardProps {
  title: string;
  desc: string;
  darkColor: string;
  lightColor: string;
  href: string;
  codeHref?: string;
  hideLive?: boolean;
  liveLabel?: string;
  codeLabel?: string;
}

export function ProjectCard({
  title,
  desc,
  darkColor,
  lightColor,
  href,
  codeHref,
  hideLive,
  liveLabel = "Ver proyecto",
  codeLabel = "Ver código",
}: ProjectCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:scale-105 hover:shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${darkColor} 0%, color-mix(in srgb, ${darkColor} 75%, black) 100%)`,
      }}
    >
      {/* Efecto de brillo metálico - Solo en modo oscuro */}
      <div className="dark:block hidden absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Modo claro - fondo con color vibrante */}
      <div
        className="hidden dark:hidden absolute inset-0 rounded-2xl bg-gradient-to-br"
        style={{
          backgroundImage: `linear-gradient(135deg, ${lightColor}20, ${lightColor}10)`,
          backgroundColor: lightColor,
          opacity: 0.95,
        }}
      />

      {/* Contenido */}
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white dark:text-white mb-1.5 group-hover:translate-y-[-2px] transition-transform line-clamp-2">
          {title}
        </h3>
        <p className="text-white/85 dark:text-gray-100 mb-4 text-xs leading-relaxed line-clamp-2">
          {desc}
        </p>

        {/* Botones */}
        <div className="flex gap-2.5">
          {!hideLive && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 bg-white/95 text-gray-900 font-semibold rounded-lg text-sm hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              {liveLabel}
            </a>
          )}
          <a
            href={codeHref ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-1.5 border-2 border-white/30 text-white font-semibold rounded-lg text-sm hover:border-white hover:bg-white/5 transition-all duration-300 hover:scale-105 dark:border-white/50 dark:hover:bg-white/10"
          >
            {codeLabel}
          </a>
        </div>
      </div>

      {/* Borde decorativo */}
      <div className="absolute inset-0 rounded-2xl border border-white/15 pointer-events-none" />
    </div>
  );
}
