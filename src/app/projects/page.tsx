import { ProjectCard } from "@/components/ProjectCard";
import ParquesColombia from "@/components/ParquesColombia";

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="opacity-90 text-emerald-400" />
          <h2 className="text-3xl font-extrabold text-black dark:text-white">Mis Proyectos</h2>
        </div>
        <p className="muted mb-6 text-lg text-black dark:text-white">
          Algunos de los diseños y desarrollos que he realizado:
        </p>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-5 items-start">
          <div className="grid gap-3">
            <ProjectCard
              title="App de Turismo"
              desc="Prototipo de app móvil con mapas y reseñas."
              darkColor="#1F3A52"
              lightColor="#3B82F6"
              href="#"
            />
            <ProjectCard
              title="E-commerce"
              desc="Tienda virtual con carrito y pasarela de pago."
              darkColor="#2A2F4A"
              lightColor="#8B5CF6"
              href="#"
            />
          </div>

          <div className="card p-6 bg-zinc-900/80 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center justify-center">
            <ParquesColombia />
          </div>

          <div className="grid gap-3">
            <ProjectCard
              title="Dashboard Energético"
              desc="Panel de consumo energético en tiempo real."
              darkColor="#1F4A47"
              lightColor="#06B6D4"
              href="#"
            />
            <ProjectCard
              title="Reloj Digital en Python"
              desc="Estilo Apple Watch, con clima y fondo dinámico."
              darkColor="#3D2442"
              lightColor="#EC4899"
              href="#"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
