import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

/* ---------- SEO ---------- */
export const metadata: Metadata = {
  title: "Jesús David Villota Arteaga — Portafolio",
  description: "Portafolio con Parqués interactivo, animaciones y modo oscuro",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#111827" />
        {/* Preferencia de tema antes del paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var html = document.documentElement;
                  var theme = localStorage.getItem('theme:choice');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var shouldBeDark = !theme ? prefersDark : (theme === 'dark' || (theme === 'system' && prefersDark));
                  if (shouldBeDark) { html.classList.add('dark'); html.classList.remove('light'); }
                  else { html.classList.add('light'); html.classList.remove('dark'); }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Ajusta lang antes del paint para evitar FOUC de idioma */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var p = new URLSearchParams(location.search);
                  var lang = (p.get('lang') || 'es').toLowerCase() === 'en' ? 'en' : 'es';
                  document.documentElement.setAttribute('lang', lang);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-dvh w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
        {/* Providers ya contiene ThemeProvider y monta SiteNav (con ThemeToggle + LangSwitch) adentro */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
