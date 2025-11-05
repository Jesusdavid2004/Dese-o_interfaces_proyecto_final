"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../app/theme/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="inline-block w-5 h-5" />;
  }

  return (
    <button
      aria-label="Cambiar tema"
      onClick={toggle}
      className="rounded-full p-2 bg-white/80 dark:bg-neutral-800 border border-black/5 dark:border-white/10 hover:scale-105 transition-transform duration-200"
      suppressHydrationWarning
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}
