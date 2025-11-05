import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import SiteNav from "../components/SiteNav";

export const metadata: Metadata = {
  title: "Jesus David Villota Arteaga — Portfolio",
  description: "Portafolio con Parqués interactivo, animaciones y modo oscuro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const html = document.documentElement;
                try {
                  const theme = localStorage.getItem('theme:choice');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = !theme ? prefersDark : theme === 'dark';
                  
                  if (shouldBeDark) {
                    html.classList.add('dark');
                    html.classList.remove('light');
                  } else {
                    html.classList.add('light');
                    html.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-dvh relative overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Providers>
          <SiteNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
