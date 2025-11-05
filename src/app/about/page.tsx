import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-12">
      <section className="mt-6">
        <div className="relative rounded-3xl shadow-lg overflow-hidden border-2 border-slate-300 dark:border-slate-700">
          {/* Fondo sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

          {/* Overlay de luz */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-transparent pointer-events-none" />

          {/* Contenido principal */}
          <div className="relative px-6 md:px-10 py-7 md:py-10 bg-white/75 dark:bg-black/30 backdrop-blur-md">
            
            {/* Encabezado */}
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-emerald-600 dark:from-slate-300 dark:to-emerald-400 mb-2">
                Hola, soy Jesús David Villota Arteaga
              </h1>
              <div className="text-lg font-bold text-slate-600 dark:text-emerald-300">
                Desarrollador Creativo & Problem Solver
              </div>
            </div>

            {/* Layout principal */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Foto */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative group">
                  {/* Glow effect sutil */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-slate-400 to-emerald-400 rounded-full blur-xl opacity-15 group-hover:opacity-25 transition-opacity" />
                  {/* Foto con sombra suave (no cuadrada) */}
                  <div className="relative w-[220px] h-[220px] md:w-[260px] md:h-[260px] rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-slate-700">
                    <Image
                      src="/images/me.jpg"
                      alt="Jesús David Villota Arteaga"
                      width={260}
                      height={260}
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Texto y tarjetas */}
              <div className="md:col-span-8 space-y-4">
                {/* Texto descriptivo */}
                <div className="space-y-3">
                  <p className="text-sm md:text-base leading-relaxed text-gray-800 dark:text-gray-200">
                    <span className="font-semibold text-slate-700 dark:text-emerald-300">Soy estudiante de Ingeniería de Software</span> apasionado por crear experiencias digitales excepcionales. Combino creatividad técnica con metodologías ágiles para desarrollar soluciones escalables y de alto impacto.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-gray-800 dark:text-gray-200">
                    Manejo tanto <span className="font-semibold text-slate-700 dark:text-emerald-300">frontend como backend</span>, desarrollando interfaces intuitivas y robustas. Trabajo con bases de datos complejas, garantizando código limpio con testing automatizado y las mejores prácticas en desarrollo.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-gray-800 dark:text-gray-200">
                    Soy <span className="italic text-emerald-600 dark:text-emerald-300">curioso, autodidacta y orientado a resultados</span>. Me encanta colaborar en equipos ágiles, resolver problemas complejos y siempre busco mejorar la calidad del código. Estoy comprometido con crear soluciones innovadoras que generen valor real a los usuarios y al negocio.
                  </p>
                </div>

                {/* Tarjetas - AMBAS CON BORDE VERDE */}
                <div className="grid gap-3 md:grid-cols-2">
                  {/* Stack Tecnológico */}
                  <div className="bg-gradient-to-br from-slate-100 to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-sm p-4 border-2 border-emerald-400 dark:border-emerald-500 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-emerald-700 dark:text-emerald-300 text-sm mb-2 flex items-center gap-2">
                      <span>⚙️</span> Stack Tecnológico
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug">
                      React • Next.js • Angular • TypeScript • Node.js • Python • Java • MySQL • MongoDB • Jest
                    </p>
                  </div>
                  {/* Herramientas */}
                  <div className="bg-gradient-to-br from-emerald-50 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-sm p-4 border-2 border-emerald-400 dark:border-emerald-500 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-emerald-700 dark:text-emerald-300 text-sm mb-2 flex items-center gap-2">
                      <span>🎯</span> Herramientas
                    </h4>
                    <p className="text-xs text-emerald-900 dark:text-slate-200 leading-snug">
                      Figma • Vercel • GitHub • Tailwind CSS • Testing • DevTools • AWS
                    </p>
                  </div>
                </div>

                {/* Botón - SOLO DESCARGA, BIEN UBICADO */}
                <div className="flex justify-center pt-2">
                  <a
                    href="/cv/Hoja_de_Vida_Academica_y_Profesional_Jesus_David_Villota_Arteaga.pdf"
                    download
                    className="px-8 py-2.5 bg-gradient-to-r from-slate-600 to-emerald-600 hover:from-slate-700 hover:to-emerald-700 text-white text-sm md:text-base font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <span>📥</span> Descargar CV
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
