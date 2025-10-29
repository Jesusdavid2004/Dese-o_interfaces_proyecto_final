import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "./theme/ThemeProvider"
import BackgroundFX from "../components/BackgroundFX"
import CursorFX from "../components/CursorFX"

export const metadata: Metadata = {
  title: "Jesus David Villota Arteaga — Portfolio",
  description: "Portafolio con Parqués interactivo, animaciones y modo oscuro",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-dvh relative overflow-hidden">
        {/* Fondo animado global */}
        <BackgroundFX />
        {/* Cursor global */}
        <CursorFX />

        {/* Contenido */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
