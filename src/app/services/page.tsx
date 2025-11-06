"use client";
import React, { useEffect, useRef } from "react";
import { Bolt, Code2, Palette, FlaskConical, Rocket, Server } from "lucide-react";
import Link from "next/link";
import { getLangFromSearch, t, Lang } from "@/lib/i18n";

type Accent = "emerald" | "blue" | "amber" | "violet" | "rose";

type Service = {
  icon: React.ReactNode;
  titleKey: string;   // clave i18n
  descKey: string;    // clave i18n
  chips: string[];    // chips suelen ser nombres propios; si quieres traducirlos, usa claves también
  accent: Accent;
};

const services: Service[] = [
  {
    icon: <Code2 className="h-5 w-5" />,
    titleKey: "svc_web_title",
    descKey: "svc_web_desc",
    chips: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    accent: "emerald",
  },
  {
    icon: <Server className="h-5 w-5" />,
    titleKey: "svc_backend_title",
    descKey: "svc_backend_desc",
    chips: ["Node.js", "Express", "MongoDB", "REST API", "JWT"],
    accent: "rose",
  },
  {
    icon: <Palette className="h-5 w-5" />,
    titleKey: "svc_design_title",
    descKey: "svc_design_desc",
    chips: ["Figma", "Prototipos", "Design System", "A11y"],
    accent: "violet",
  },
  {
    icon: <FlaskConical className="h-5 w-5" />,
    titleKey: "svc_qa_title",
    descKey: "svc_qa_desc",
    chips: ["Jest", "RTL", "Integración", "Casos de prueba"],
    accent: "amber",
  },
  {
    icon: <Rocket className="h-5 w-5" />,
    titleKey: "svc_cicd_title",
    descKey: "svc_cicd_desc",
    chips: ["GitHub Actions", "Vercel", "Docker", "Versionado"],
    accent: "blue",
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("opacity-100", "translate-y-0");
        }),
      { threshold: 0.2 }
    );
    el.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

function useTilt(maxTilt = 10) {
  const ref = useRef<HTMLDivElement | null>(null);
  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -2 * maxTilt;
    const ry = (px - 0.5) * 2 * maxTilt;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    const glow = el.querySelector(".glow") as HTMLDivElement | null;
    if (glow) glow.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgba(16,185,129,0.16), transparent 55%)`;
  }
  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }
  return { ref, onMouseMove, onMouseLeave };
}

function accentClasses(a: Accent) {
  switch (a) {
    case "emerald":
      return { ring: "ring-emerald-400", text: "text-emerald-600 dark:text-emerald-300", chip: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200", dot: "bg-emerald-400" };
    case "blue":
      return { ring: "ring-blue-400", text: "text-blue-600 dark:text-blue-300", chip: "bg-blue-100/80 text-blue-700 dark:bg-blue-400/10 dark:text-blue-200", dot: "bg-blue-400" };
    case "amber":
      return { ring: "ring-amber-400", text: "text-amber-600 dark:text-amber-300", chip: "bg-amber-100/80 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200", dot: "bg-amber-400" };
    case "violet":
      return { ring: "ring-violet-400", text: "text-violet-600 dark:text-violet-300", chip: "bg-violet-100/80 text-violet-700 dark:bg-violet-400/10 dark:text-violet-200", dot: "bg-violet-400" };
    case "rose":
      return { ring: "ring-rose-400", text: "text-rose-600 dark:text-rose-300", chip: "bg-rose-100/80 text-rose-700 dark:bg-rose-400/10 dark:text-rose-200", dot: "bg-rose-400" };
  }
}

function ServiceCard({ s, lang }: { s: Service; lang: Lang }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(9);
  const ac = accentClasses(s.accent);

  return (
    <div className="reveal opacity-0 translate-y-3 transition-all duration-700">
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative group rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm hover:shadow-[0_28px_60px_-20px_rgba(16,185,129,0.45)] transition duration-300 will-change-transform h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="glow pointer-events-none absolute inset-0 rounded-2xl" />
        <span className={`absolute right-3 top-3 h-3 w-3 rounded-full ${ac?.dot} opacity-80`} />
        <div className="flex items-center gap-3" style={{ transform: "translateZ(18px)" }}>
          <div className={`h-10 w-10 grid place-items-center rounded-xl ring-2 ${ac?.ring} bg-white/70 dark:bg-slate-800`}>{s.icon}</div>
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {t(lang, s.titleKey)}
          </h3>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300" style={{ transform: "translateZ(14px)" }}>
          {t(lang, s.descKey)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2" style={{ transform: "translateZ(12px)" }}>
          {s.chips.map((c, i) => (
            <span key={c} className={`px-2.5 py-1 rounded-full text-xs ${ac?.chip} animate-[fadeUp_500ms_ease_${120 * (i + 1)}ms_both]`}>
              {c}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4">
          <Link
            href={{ pathname: "/contact", query: { lang }, hash: "form" }}
            className={`inline-flex items-center gap-2 text-sm font-semibold ${ac?.text} hover:underline`}
            style={{ transform: "translateZ(10px)" }}
          >
            {t(lang, "cta_make_it")} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const revealRef = useReveal();
  const lang: Lang = getLangFromSearch(typeof window !== "undefined" ? window.location.search : "");

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <section ref={revealRef} className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Bolt className="h-6 w-6 text-emerald-500" />
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t(lang, "services_title")}
          </h2>
        </div>
        <p className="mb-6 text-slate-700 dark:text-slate-300">
          {t(lang, "services_intro")}
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[1fr]">
          {services.map((s) => (
            <ServiceCard key={s.titleKey} s={s} lang={lang} />
          ))}
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
