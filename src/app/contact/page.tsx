"use client";
import React from "react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 pb-24">
      {/* Fondo atmosférico */}
      <BackdropAura />

      <section className="mt-8">
        <header className="flex items-center gap-2 mb-4">
          <Phone className="h-6 w-6 text-emerald-500" />
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Contáctame
          </h2>
        </header>

        <p className="mb-6 text-slate-700 dark:text-slate-300">
          ¿Quieres hablar conmigo? Estoy disponible para proyectos, colaboraciones y nuevas oportunidades.
        </p>

        <div className="mx-auto max-w-3xl">
          <GlassCard>
            <ContactForm />
            <SocialRow />
          </GlassCard>
        </div>
      </section>

      {/* keyframes locales */}
      <style>{`
        @keyframes borderGlow {
          0% { opacity: .35; }
          100% { opacity: .9; }
        }
        @keyframes sheen {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes pulseDot {
          0% { transform: scale(1); opacity: .6; }
          50% { transform: scale(1.3); opacity: .9; }
          100% { transform: scale(1); opacity: .6; }
        }
      `}</style>
    </main>
  );
}

/* ---------- Bloques ---------- */
function BackdropAura() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl dark:bg-emerald-400/15" />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-400/15" />
      <div className="absolute left-1/3 bottom-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-400/10" />
    </div>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[22px] border-2 border-slate-200/70 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(2,6,23,.35)]">
      {/* Borde animado */}
      <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-emerald-400/30 [mask:linear-gradient(#000,transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 rounded-[22px] opacity-40"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, rgba(16,185,129,.35), rgba(99,102,241,.35), rgba(59,130,246,.35), rgba(16,185,129,.35))",
          animation: "borderGlow 3s ease-in-out infinite alternate",
          WebkitMask: "linear-gradient(#000, transparent 65%)",
          mask: "linear-gradient(#000, transparent 65%)",
        }}
      />
      {/* Sheen sutil */}
      <span className="pointer-events-none absolute inset-y-0 -skew-x-12 w-1/3 bg-white/5 dark:bg-white/3 blur-md animate-[sheen_8s_linear_infinite]" />
      <div className="relative p-6 md:p-8">{children}</div>
    </div>
  );
}

function ContactForm() {
  return (
    <form id="form" className="grid gap-4">
      <div className="grid gap-2">
        <Label>Nombre</Label>
        <Input name="name" autoComplete="name" placeholder="Tu nombre" />
      </div>

      <div className="grid gap-2">
        <Label>Email</Label>
        <Input type="email" name="email" autoComplete="email" placeholder="tunombre@correo.com" />
      </div>

      <div className="grid gap-2">
        <Label>Mensaje</Label>
        <TextArea name="message" rows={5} placeholder="Cuéntame sobre tu proyecto…" />
      </div>

      <GradientButton type="submit">Enviar</GradientButton>
    </form>
  );
}

function SocialRow() {
  return (
    <div className="mt-6 flex items-center justify-center gap-5">
      <IconCrystal label="GitHub" href="https://github.com/tu-usuario" Icon={Github} />
      <IconCrystal label="LinkedIn" href="https://www.linkedin.com/in/tu-usuario" Icon={Linkedin} />
      <IconCrystal label="Email" href="mailto:tu@email.com" Icon={Mail} />
    </div>
  );
}

/* ---------- Atomos ---------- */
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
          "w-full rounded-xl border border-slate-300/80 dark:border-slate-700/80",
          "bg-white/75 dark:bg-slate-900/50 px-4 py-2 pl-7 text-slate-900 dark:text-slate-100",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "outline-none transition focus:ring-2 focus:ring-emerald-400/50",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,.35)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,.06)]",
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
          "w-full rounded-xl border border-slate-300/80 dark:border-slate-700/80",
          "bg-white/75 dark:bg-slate-900/50 px-4 py-3 pl-7 text-slate-900 dark:text-slate-100",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "outline-none transition focus:ring-2 focus:ring-emerald-400/50 min-h-[140px] resize-y",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,.35)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,.06)]",
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
      style={{
        background:
          "linear-gradient(135deg, rgba(16,185,129,1) 0%, rgba(56,189,248,1) 50%, rgba(139,92,246,1) 100%)",
      }}
    >
      {/* brillo */}
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
        rounded-2xl border border-white/60 dark:border-white/10
        bg-white/30 dark:bg-white/5 backdrop-blur-md
        shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_8px_28px_-12px_rgba(2,6,23,.45)]
        transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_18px_40px_-14px_rgba(16,185,129,.55)]
        focus:outline-none focus:ring-2 focus:ring-emerald-400/50
      "
    >
      {/* reflejo */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-70 dark:from-white/10" />
      {/* glow dinámico */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-[radial-gradient(45%_45%_at_50%_35%,rgba(16,185,129,0.25),transparent_60%)]" />
      <Icon className="relative z-10 h-5 w-5 text-slate-800 dark:text-slate-100 transition-transform duration-300 group-hover:scale-110" />
      {/* tooltip */}
      <span
        className="
          pointer-events-none absolute -bottom-8 translate-y-1 rounded-full px-2 py-0.5
          text-xs font-medium text-slate-700 bg-white border border-slate-200 shadow-sm
          opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200
          dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700
        "
      >
        {label}
      </span>
    </a>
  );
}
