import { Bolt } from "lucide-react";

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      {/* ✅ ELIMINADO: <SiteNav /> */}

      <section className="mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Bolt />
          <h2 className="text-3xl font-extrabold">Servicios que ofrezco</h2>
        </div>
        <p className="muted mb-4">
          A lo largo de mi formación y experiencia he trabajado con distintas
          tecnologías que me permiten diseñar, desarrollar y probar
          aplicaciones digitales. Estos son algunos de los servicios que puedo
          ofrecerte:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-6 bg-neutral-50 dark:bg-neutral-800/60">
            <h3 className="font-bold">💻 Desarrollo Web</h3>
            <p>Next.js, React, Angular, TypeScript, Tailwind, Vercel.</p>
          </div>
          <div className="card p-6 bg-neutral-50 dark:bg-neutral-800/60">
            <h3 className="font-bold">🎨 UI/UX Design</h3>
            <p>Figma, wireframes, mockups, accesibilidad.</p>
          </div>
          <div className="card p-6 bg-neutral-50 dark:bg-neutral-800/60">
            <h3 className="font-bold">🧪 Testing & QA</h3>
            <p>Jest, React Testing Library, validación en bases de datos.</p>
          </div>
          <div className="card p-6 bg-neutral-50 dark:bg-neutral-800/60">
            <h3 className="font-bold">🚀 Deployment</h3>
            <p>GitHub, MySQL, Vercel.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
