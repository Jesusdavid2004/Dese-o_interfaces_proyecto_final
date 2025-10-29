"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "../app/theme/ThemeProvider"

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita hydration mismatch: solo mostramos el icono real tras montar en cliente
  useEffect(() => setMounted(true), [])

  return (
    <button
      aria-label="Cambiar tema"
      onClick={toggle}
      className="rounded-full p-2 bg-white/80 dark:bg-neutral-800 border border-black/5 dark:border-white/10 hover:scale-105 transition"
      suppressHydrationWarning
    >
      {/* Mientras no ha montado, deja un placeholder estable del mismo tamaño */}
      {!mounted ? (
        <span className="inline-block w-5 h-5" />
      ) : theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
}
