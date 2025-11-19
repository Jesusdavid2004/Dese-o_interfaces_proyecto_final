"use client";
import TokenDecor from "@/components/TokenDecor";
import { useRef } from "react";
import { getLangFromSearch, t, Lang } from "@/lib/i18n";

/* Tilt/parallax sutil */
function useTilt(maxTilt = 7) {
  const ref = useRef<HTMLDivElement | null>(null);
  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -2 * maxTilt;
    const ry = (px - 0.5) * 2 * maxTilt;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    const glow = el.querySelector(".glow") as HTMLDivElement | null;
    if (glow) {
      glow.style.background = `radial-gradient(320px circle at ${px * 100}% ${py * 100}%, rgba(16,185,129,0.14), transparent 50%)`;
    }
  }
  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }
  return { ref, onMouseMove, onMouseLeave };
}

function MiniReco({
  name,
  role,
  quote,
  color,
}: {
  name: string;
  role: string;
  quote: string;
  color: "yellow" | "blue" | "red" | "green";
}) {
  const tilt = useTilt(6);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="relative rounded-xl border-2 border-emerald-300 dark:border-emerald-500 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-4 shadow-sm hover:shadow-[0_18px_42px_-16px_rgba(16,185,129,0.4)] transition duration-300 will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="glow pointer-events-none absolute inset-0 rounded-xl" />
      <div className="flex items-center gap-2 mb-1" style={{ transform: "translateZ(16px)" }}>
        <TokenDecor color={color} size={28} />
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight">{name}</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">{role}</p>
        </div>
      </div>
      <p className="italic text-slate-700 dark:text-slate-200 text-sm" style={{ transform: "translateZ(12px)" }}>
        “{quote}”
      </p>
    </div>
  );
}

export default function ExperiencePage() {
  const lang: Lang =
    typeof window !== "undefined"
      ? getLangFromSearch(window.location.search)
      : "es"; // fallback

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <section className="mt-8">
        <h2 className="text-3xl font-extrabold mb-2 text-slate-900 dark:text-white">
          {t(lang, "experience_title")}
        </h2>
        <p className="mb-6 text-slate-600 dark:text-slate-300">
          {t(lang, "experience_intro")}
        </p>

        {/* Timeline con 2023, 2024 y 2025 */}
        <ol className="relative pl-7 md:pl-9">
          <div className="pointer-events-none absolute left-3.5 md:left-4 top-0 bottom-0 border-l-2 border-dashed border-emerald-500/60 dark:border-emerald-400/60" />

          <li className="relative mb-8">
            <span className="absolute -left-1 md:-left-1.5 top-1 h-3.5 w-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500 ring-4 ring-emerald-300/40 dark:ring-emerald-400/40" />
            <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-5 shadow-sm hover:shadow-emerald-600/10 transition">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                {t(lang, "exp_2023_title")}
              </h3>
              <p className="mt-1 text-slate-600 dark:text-slate-300 text-sm">
                {t(lang, "exp_2023_desc")}
              </p>
            </div>
          </li>

          <li className="relative mb-8">
            <span className="absolute -left-1 md:-left-1.5 top-1 h-3.5 w-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500 ring-4 ring-emerald-300/40 dark:ring-emerald-400/40" />
            <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-5 shadow-sm hover:shadow-emerald-600/10 transition">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                {t(lang, "exp_2024_title")}
              </h3>
              <p className="mt-1 text-slate-600 dark:text-slate-300 text-sm">
                {t(lang, "exp_2024_desc")}
              </p>
            </div>
          </li>

          <li className="relative mb-2">
            <span className="absolute -left-1 md:-left-1.5 top-1 h-3.5 w-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500 ring-4 ring-emerald-300/40 dark:ring-emerald-400/40" />
            <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-5 shadow-sm hover:shadow-emerald-600/10 transition">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                {t(lang, "exp_2025_title")}
              </h3>
              <p className="mt-1 text-slate-600 dark:text-slate-300 text-sm">
                {t(lang, "exp_2025_desc")}
              </p>
            </div>
          </li>
        </ol>

        {/* Recomendaciones - ahora bilingüe automático */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniReco
            name={t(lang, "rec_1_name")}
            role={t(lang, "rec_1_role")}
            quote={t(lang, "rec_1_quote")}
            color="blue"
          />
          <MiniReco
            name={t(lang, "rec_2_name")}
            role={t(lang, "rec_2_role")}
            quote={t(lang, "rec_2_quote")}
            color="yellow"
          />
          <MiniReco
            name={t(lang, "rec_3_name")}
            role={t(lang, "rec_3_role")}
            quote={t(lang, "rec_3_quote")}
            color="green"
          />
          <MiniReco
            name={t(lang, "rec_4_name")}
            role={t(lang, "rec_4_role")}
            quote={t(lang, "rec_4_quote")}
            color="red"
          />
        </div>
      </section>
    </main>
  );
}
