import Image from "next/image"
import SiteNav from "@/components/SiteNav"

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-12">
      <SiteNav />

      <section className="mt-6">
        <div className="relative rounded-3xl shadow-soft border border-black/5 overflow-hidden">
          {/* Fondo verde */}
          <div className="absolute inset-0 board-bg" />

          {/* Overlay de luz */}
          <div className="absolute inset-0 about-overlay pointer-events-none" />

          {/* Contenido principal */}
          <div className="relative px-8 md:px-12 py-10 md:py-12 bg-white/85 dark:bg-black/40 backdrop-blur-sm">
            {/* Encabezado */}
            <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                <span className="mr-2">🎯</span>
                Hola, soy Jesús David Villota Arteaga
              </h1>
              <div className="mt-1 text-xl font-bold text-gray-800 dark:text-gray-100">
                Desarrollador creativo
              </div>
              <p className="mt-1 text-base md:text-lg text-gray-700 dark:text-gray-200">
                Me apasiona el diseño de interfaces y la creación de experiencias digitales.
              </p>
            </div>

            {/* Layout principal */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Foto */}
              <div className="md:col-span-4 flex justify-center">
                <div className="w-[250px] h-[250px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden shadow-lg border-4 border-white/70 dark:border-gray-700">
                  <Image
                    src="/images/me.jpg"
                    alt="Jesús David Villota Arteaga"
                    width={280}
                    height={280}
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Texto y tarjetas */}
              <div className="md:col-span-8">
                {/* Texto descriptivo */}
                <p className="text-sm md:text-base leading-relaxed text-gray-800 dark:text-gray-200">
                  Soy estudiante de Ingeniería de Software y me gusta combinar la creatividad con la
                  tecnología para desarrollar aplicaciones funcionales, intuitivas y atractivas.
                  Tengo experiencia con Figma, Angular, React, y Python, además de conocimientos en
                  bases de datos y pruebas de software. Me considero curioso, autodidacta y con
                  muchas ganas de aprender y aportar en proyectos innovadores.
                </p>

                {/* Tarjetas: Skills y Educación */}
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-soft p-3 border border-black/10 dark:border-white/10">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                      Skills
                    </h4>
                    <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mt-1">
                      React, Next.js, TypeScript, Node.js
                    </p>
                  </div>

                  <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-soft p-3 border border-black/10 dark:border-white/10">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                      Educación
                    </h4>
                    <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mt-1">
                      Ingeniería de Software, Universidad de Nariño
                    </p>
                  </div>
                </div>

                {/* Botón de descarga */}
                <div className="mt-6 flex justify-center">
                  <a
                    href="/cv.pdf"
                    className="btn btn-solid btn-primary px-6 py-2.5 rounded-full text-sm md:text-base"
                    download
                  >
                    Descargar CV
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
