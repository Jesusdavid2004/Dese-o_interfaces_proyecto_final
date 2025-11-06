"use client";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import React from "react";

export default function ContactPage() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 pb-24">
      {/* Fondo decorativo sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/10" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />
      </div>

      <section className="mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Phone className="h-6 w-6 text-emerald-500" />
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Contáctame
          </h2>
        </div>

        <p className="mb-6 text-slate-700 dark:text-slate-300">
          ¿Quieres hablar conmigo? Estoy disponible para proyectos, colaboraciones y nuevas oportunidades.
        </p>

        <form
          id="form"
          className="relative overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 max-w-xl mx-auto grid gap-4 shadow-sm"
        >
          {/* Glow superior */}
          <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-emerald-400/10 to-transparent dark:from-emerald-400/10" />

          <input
            type="text"
            name="name"
            id="name"
            placeholder="Nombre"
            autoComplete="name"
            required
            className="form-field rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-4 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />

          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="email"
            required
            className="form-field rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-4 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />

          <textarea
            name="message"
            id="message"
            placeholder="Mensaje"
            rows={5}
            className="form-field rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-4 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          >
            Enviar
          </button>

          {/* Accesos solo ícono, rediseñados */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <IconPill
              label="GitHub"
              href="https://github.com/tu-usuario"
              Icon={Github}
            />
            <IconPill
              label="LinkedIn"
              href="https://www.linkedin.com/in/tu-usuario"
              Icon={Linkedin}
            />
            <IconPill
              label="Email"
              href="mailto:tu@email.com"
              Icon={Mail}
            />
          </div>
        </form>
      </section>
    </main>
  );
}

/* --------- Subcomponente estilizado (solo ícono) ---------- */
function IconPill({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      aria-label={label}
      className="
        group relative inline-flex h-11 w-11 items-center justify-center
        rounded-full border border-slate-300/80 bg-white text-slate-800
        shadow-sm transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-md
        hover:border-emerald-400/70 focus:outline-none
        focus:ring-2 focus:ring-emerald-400/50
        dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100
      "
    >
      {/* Aura dinámica */}
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 bg-[radial-gradient(40%_40%_at_50%_40%,rgba(16,185,129,0.18),transparent_60%)]" />

      {/* Icono */}
      <Icon className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />

      {/* Tooltip minimal */}
      <span
        className="
          pointer-events-none absolute -bottom-8 translate-y-1
          rounded-full px-2 py-0.5 text-xs font-medium
          text-slate-700 bg-white border border-slate-200 shadow-sm
          opacity-0 group-hover:opacity-100 group-hover:translate-y-0
          transition-all duration-200
          dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700
        "
      >
        {label}
      </span>
    </a>
  );
}
