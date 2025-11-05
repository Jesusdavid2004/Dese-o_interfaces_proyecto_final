"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/app/theme/ThemeProvider";
import { Menu, X, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, raw, toggle } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { label: "Acerca de mí", number: "1", href: "/about" },
    { label: "Proyectos", number: "2", href: "/projects" },
    { label: "Experiencia", number: "3", href: "/experience" },
    { label: "Servicios", number: "4", href: "/services" },
    { label: "Pasatiempos", number: "5", href: "/hobbies" },
    { label: "Contacto", number: "6", href: "/contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-bold text-lg text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          🎲 Portafolio
        </Link>

        {/* Menú Desktop */}
        <div className="hidden lg:flex items-center gap-8 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.number}
              href={item.href}
              className={`font-medium transition-colors duration-200 relative group ${
                isActive(item.href)
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
            >
              <span className="text-gray-400 dark:text-gray-500 text-xs mr-1">
                {item.number}
              </span>
              <span>{item.label}</span>
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 ${
                  isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* Acciones Derecha */}
        <div className="flex items-center gap-4">
          {/* Cambiar Tema - PERFECTAMENTE SINCRONIZADO */}
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
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          )}

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
                href={item.href}
                className={`w-full block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-gray-400 dark:text-gray-500 text-xs mr-2">
                  {item.number}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
