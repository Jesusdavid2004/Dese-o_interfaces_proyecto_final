import SiteNav from "@/components/SiteNav"
import { Github, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <SiteNav />

      <section className="mt-8">
        <div className="flex items-center gap-2 mb-6">
          <Phone />
          <h2 className="text-3xl font-extrabold">Contáctame</h2>
        </div>

        <p className="muted mb-4">
          ¿Quieres hablar conmigo? Estoy disponible para proyectos, colaboraciones y nuevas oportunidades.
        </p>

        {/* Usa contact-card para reforzar estilos del contenedor y form-field en inputs */}
        <form className="card contact-card p-6 md:p-8 max-w-xl mx-auto grid gap-4">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Nombre"
            autoComplete="name"
            required
            className="form-field"
          />

          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="email"
            required
            className="form-field"
          />

          <textarea
            name="message"
            id="message"
            placeholder="Mensaje"
            className="form-field"
          />

          <button type="submit" className="btn btn-solid btn-primary px-6 py-3 w-full rounded-full">
            Enviar
          </button>

          <div className="flex gap-4 justify-center text-sm mt-2">
            <a className="badge bg-white text-gray-900" href="https://github.com/" target="_blank" rel="noreferrer">
              <Github /> GitHub
            </a>
            <a className="badge bg-white text-gray-900" href="#" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="badge bg-white text-gray-900" href="mailto:tu@email.com">
              Email
            </a>
          </div>
        </form>
      </section>
    </main>
  )
}
