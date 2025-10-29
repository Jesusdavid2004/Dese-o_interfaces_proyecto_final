import SiteNav from "@/components/SiteNav"
import TokenDecor from "@/components/TokenDecor"

export default function ExperiencePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <SiteNav />

      <section className="mt-8">
        <h2 className="text-3xl font-extrabold mb-2">Mi Experiencia</h2>
        <p className="muted mb-6">Proyectos académicos y colaborativos</p>

        <ol className="relative border-l-2 border-dashed border-green-500/60 pl-6">
          <li className="mb-10">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-2.5 ring-2 ring-white dark:ring-neutral-900" />
            <h3 className="font-bold">2023 – Presente · Estudiante de Ingeniería de Software</h3>
          </li>
          <li className="mb-4">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-2.5 ring-2 ring-white dark:ring-neutral-900" />
            <h3 className="font-bold">2024 · Freelance UI y proyectos personales</h3>
          </li>
        </ol>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <TokenDecor color="yellow" size={40} />
              <h4 className="font-semibold">Cliente A</h4>
            </div>
            <p className="italic">“Excelente comunicación y resultados.”</p>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <TokenDecor color="blue" size={40} />
              <h4 className="font-semibold">Cliente B</h4>
            </div>
            <p className="italic">“Profesional y comprometido en cada detalle.”</p>
          </div>
        </div>
      </section>
    </main>
  )
}
