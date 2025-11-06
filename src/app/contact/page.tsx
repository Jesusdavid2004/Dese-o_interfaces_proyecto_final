"use client";
import React from "react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { getLangFromSearch, t, Lang } from "@/lib/i18n";

export default function ContactPage() {
  const lang: Lang = getLangFromSearch(
    typeof window !== "undefined" ? window.location.search : ""
  );

  return (
    <main className="relative mx-auto max-w-6xl px-4 md:px-6 pb-24">
      <BackdropAura />

      <section className="mt-8">
        <header className="flex items-center gap-2 mb-4">
          <Phone className="h-6 w-6 text-emerald-500" />
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t(lang, "contact_title")}
          </h2>
        </header>

        <p className="mb-6 text-slate-700 dark:text-slate-300">
          {t(lang, "contact_intro")}
        </p>

        <div className="mx-auto max-w-3xl">
          <ContactForm lang={lang} />
          <SocialRow lang={lang} />
        </div>
      </section>

      <style>{`
        @keyframes pulseDot {
          0% { transform: scale(1); opacity: .6; }
          50% { transform: scale(1.3); opacity: .9; }
          100% { transform: scale(1); opacity: .6; }
        }
      `}</style>
    </main>
  );
}

/* -------- Fondo atmosférico suavizado y sin bordes duros -------- */
function BackdropAura() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(1200px_1200px_at_50%_40%,#000_60%,transparent_100%)]"
    >
      <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-[110px] dark:bg-emerald-400/12" />
      <div className="absolute right-[-120px] top-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-[110px] dark:bg-blue-400/12" />
      <div className="absolute left-1/3 bottom-0 h-80 w-80 rounded-full bg-violet-500/8 blur-[110px] dark:bg-violet-400/10" />
      {/* Capa anti-banding para evitar cualquier línea vertical */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0.02)_20%,rgba(2,6,23,0.02)_80%,rgba(2,6,23,0)_100%)]" />
    </div>
  );
}

/* ----------------- Formulario premium con alto contraste ----------------- */
function ContactForm({ lang }: { lang: Lang }) {
  return (
    <form
      id="form"
      className="grid gap-4 rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_60px_-20px_rgba(2,6,23,.15)] p-6 md:p-8
                 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_60px_-20px_rgba(2,6,23,.35)] backdrop-blur-xl"
    >
      <div className="grid gap-2">
        <Label>{t(lang, "name")}</Label>
        <Input name="name" autoComplete="name" placeholder={t(lang, "name_ph")} />
      </div>

      <div className="grid gap-2">
        <Label>{t(lang, "email")}</Label>
        <Input type="email" name="email" autoComplete="email" placeholder={t(lang, "email_ph")} />
      </div>

      <div className="grid gap-2">
        <Label>{t(lang, "message")}</Label>
        <TextArea name="message" rows={5} placeholder={t(lang, "message_ph")} />
      </div>

      <GradientButton type="submit">{t(lang, "send")}</GradientButton>
    </form>
  );
}

function SocialRow({ lang }: { lang: Lang }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-5">
      <IconCrystal label={t(lang, "github")} href="https://github.com/tu-usuario" Icon={Github} />
      <IconCrystal label={t(lang, "linkedin")} href="https://www.linkedin.com/in/tu-usuario" Icon={Linkedin} />
      <IconCrystal label={t(lang, "mail")} href="mailto:tu@email.com" Icon={Mail} />
    </div>
  );
}

/* ----------------- Átomos ----------------- */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[13px] font-semibold tracking-wide text-slate-800 dark:text-slate-200">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-[pulseDot_2.2s_ease-in-out_infinite]" />
      <input
        {...props}
        className={[
          // Light
          "w-full rounded-xl border border-slate-300 bg-white px-4 py-2 pl-7 text-slate-900 placeholder:text-slate-500",
          "outline-none transition focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300",
          // Dark
          "dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500",
        ].join(" ")}
      />
    </div>
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-4 h-1.5 w-1.5 rounded-full bg-violet-400/80 animate-[pulseDot_2.2s_ease-in-out_infinite]" />
      <textarea
        {...props}
        className={[
          // Light
          "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-7 text-slate-900 placeholder:text-slate-500 min-h-[140px] resize-y",
          "outline-none transition focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300",
          // Dark
          "dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500",
        ].join(" ")}
      />
    </div>
  );
}

function GradientButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
      style={{ background: "linear-gradient(135deg, #10B981 0%, #38BDF8 50%, #8B5CF6 100%)" }}
    >
      {/* Borde interno para separar del fondo claro */}
      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/40 dark:ring-0" />
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(255,255,255,.25),transparent_60%)]" />
      <span className="relative">Enviar</span>
    </button>
  );
}

function IconCrystal({
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
        group relative inline-flex h-12 w-12 items-center justify-center
        rounded-2xl border border-slate-200 bg-white shadow-sm
        transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-emerald-400/50
        dark:border-white/15 dark:bg-white/5 dark:backdrop-blur-md
        dark:shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_8px_28px_-12px_rgba(2,6,23,.45)]
      "
    >
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/70 to-transparent opacity-80 dark:from-white/20" />
      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-[radial-gradient(45%_45%_at_50%_35%,rgba(16,185,129,0.25),transparent_60%)]" />
      <Icon className="relative z-10 h-5 w-5 text-slate-700 dark:text-slate-100 transition-transform duration-300 group-hover:scale-110" />
      <span className="pointer-events-none absolute -bottom-8 translate-y-1 rounded-full px-2 py-0.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
        {label}
      </span>
    </a>
  );
}
