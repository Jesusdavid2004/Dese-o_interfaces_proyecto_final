
import { Gamepad2 } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import ParquesColombia from "@/components/ParquesColombia";

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      {/* Sección principal */}
      <section className="mt-8">
        {/* Título y encabezado */}
        <div className="flex items-center gap-2 mb-2">
          <Gamepad2 className="opacity-90 text-emerald-400" />
          <h2 className="text-3xl font-extrabold">Mis Proyectos</h2>
        </div>
        <p className="muted mb-6 text-lg">
          Algunos de los diseños y desarrollos que he realizado:
        </p>

        {/* Contenedor general */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
          {/* Columna izquierda */}
          <div className="grid gap-4">
            <ProjectCard
              title="App de Turismo"
              desc="Prototipo de app móvil con mapas y reseñas."
              color="#E53935"
              href="#"
            />
            <ProjectCard
              title="E-commerce"
              desc="Tienda virtual con carrito y pasarela de pago."
              color="#FFD54F"
              href="#"
            />
          </div>

          {/* Centro: Tablero Parqués colombiano */}
          <div className="card p-6 bg-zinc-900/80 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center justify-center">
            <ParquesColombia />
          </div>

          {/* Columna derecha */}
          <div className="grid gap-4">
            <ProjectCard
              title="Dashboard Energético"
              desc="Panel de consumo energético en tiempo real."
              color="#1E88E5"
              href="#"
            />
            <ProjectCard
              title="Reloj Digital en Python"
              desc="Estilo Apple Watch, con clima y fondo dinámico."
              color="#A5D6A7"
              href="#"
            />
          </div>
        </div>

        {/* Botón inferior */}
        <div className="flex justify-center mt-10">
          <a
            className="badge bg-blue-600 text-white hover:brightness-110 transition shadow-md"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            Explora más en mi GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
