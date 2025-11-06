"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "@/app/theme/ThemeProvider";
import { Menu, X, Sun, Moon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, raw, toggle } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();
  const lang = ((sp?.get("lang") || "es").toLowerCase() === "en" ? "en" : "es") as "es" | "en";

  useEffect(() => setMounted(true), []);
  useEffect(() => setIsOpen(false), [pathname]);

  // helper para anexar ?lang a cualquier href
  const withLang = (href: string) => {
    const params = new URLSearchParams(sp?.toString() || "");
    params.set("lang", lang);
    return `${href}?${params.toString()}`;
  };

  const navItems = useMemo(
    () => [
      { label: lang === "en" ? "About me" : "Acerca de mí", number: "1", href: "/about" },
      { label: lang === "en" ? "Projects" : "Proyectos", number: "2", href: "/projects" },
      { label: lang === "en" ? "Experience" : "Experiencia", number: "3", href: "/experience" },
      { label: lang === "en" ? "Services" : "Servicios", number: "4", href: "/services" },
      { label: lang === "en" ? "Hobbies" : "Pasatiempos", number: "5", href: "/hobbies" },
      { label: lang === "en" ? "Contact" : "Contacto", number: "6", href: "/contact" },
    ],
    [lang]
  );

  const isActive = (href: string) => pathname === href;

  const setLang = (next: "es" | "en") => {
    const params = new URLSearchParams(sp?.toString() || "");
    params.set("lang", next);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href={withLang("/")}
          className="font-display font-bold text-lg text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          🎲 Portafolio
        </Link>

        {/* Menú Desktop */}
        <div className="hidden lg:flex items-center gap-8 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.number}
              href={withLang(item.href)}
              className={`font-medium transition-colors duration-200 relative group ${
                isActive(item.href)
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
            >
              <span className="text-gray-400 dark:text-gray-500 text-xs mr-1">{item.number}</span>
              <span>{item.label}</span>
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 ${
                  isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Acciones Derecha: Tema + Idioma + Menú móvil */}
        <div className="flex items-center gap-3">
          {/* Toggle Tema */}
          {mounted && (
            <button
              onClick={toggle}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 transform hover:scale-110"
              aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : theme === "light" ? "sistema" : "oscuro"}`}
              title={`Tema actual: ${raw} → ${theme}`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              )}
            </button>
          )}

          {/* Switch ES/EN en formato pill */}
          <div
            className="relative inline-flex items-center rounded-full border border-slate-300/70 dark:border-slate-700/70 bg-white/70 dark:bg-white/5 backdrop-blur-md p-1 shadow-sm"
            role="group"
            aria-label="Language switch"
          >
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

          {/* Botón Menú Móvil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Abrir menú"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-900 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.number}
                href={withLang(item.href)}
                className={`w-full block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-gray-400 dark:text-gray-500 text-xs mr-2">{item.number}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
