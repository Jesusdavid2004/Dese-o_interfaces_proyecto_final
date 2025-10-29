"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark" | "system"

type ProviderProps = {
  children: React.ReactNode
  /** "class" para usar la clase `dark` en <html>, o "data-theme" para setear atributo */
  attribute?: "class" | "data-theme"
  /** "system" | "light" | "dark" */
  defaultTheme?: Theme
  /** Si true, respeta el tema del sistema en "system" */
  enableSystem?: boolean
}

type Ctx = {
  theme: "light" | "dark"
  raw: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeCtx = createContext<Ctx | null>(null)

function getSystemPrefersDark() {
  if (typeof window === "undefined") return false
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
}

function applyThemeToDocument(
  mode: "light" | "dark",
  attribute: "class" | "data-theme" = "class"
) {
  const root = document.documentElement
  if (attribute === "class") {
    root.classList.toggle("dark", mode === "dark")
  } else {
    root.setAttribute("data-theme", mode)
  }
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
}: ProviderProps) {
  const [raw, setRaw] = useState<Theme>(defaultTheme)

  // Resuelve light/dark efectivo según raw + sistema
  const theme: "light" | "dark" = useMemo(() => {
    if (raw === "system") {
      return enableSystem && getSystemPrefersDark() ? "dark" : "light"
    }
    return raw
  }, [raw, enableSystem])

  // Montaje: cargar preferencia guardada (si existe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme:choice") as Theme | null
      if (saved) setRaw(saved)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Aplicar al documento y guardar
  useEffect(() => {
    applyThemeToDocument(theme, attribute)
    try {
      localStorage.setItem("theme:choice", raw)
    } catch {}
  }, [theme, raw, attribute])

  // Reaccionar a cambios del sistema si raw === "system"
  useEffect(() => {
    if (!enableSystem) return
    if (raw !== "system") return
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      applyThemeToDocument(mql.matches ? "dark" : "light", attribute)
    }
    mql.addEventListener?.("change", handler)
    return () => mql.removeEventListener?.("change", handler)
  }, [raw, enableSystem, attribute])

  const setTheme = (t: Theme) => setRaw(t)
  const toggle = () => setRaw(prev => (prev === "dark" ? "light" : "dark"))

  const value: Ctx = { theme, raw, setTheme, toggle }

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeCtx)
  if (!ctx) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>")
  }
  return ctx
}
