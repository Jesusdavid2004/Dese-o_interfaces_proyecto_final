
import { Camera, Music, Plane, Coffee } from "lucide-react"
import TokenDecor from "@/components/TokenDecor"

export default function HobbiesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
 

      <section className="mt-8">
        <h2 className="text-3xl font-extrabold text-center mb-6">Un poco sobre mí</h2>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-4 justify-items-center">
          {[Camera, Music, Plane, Coffee].map((Icon, i) => (
            <div key={i} className="card p-4 grid place-items-center w-full"><Icon /></div>
          ))}
          <TokenDecor color="green" size={80} className="col-span-3 md:col-span-1" label="Yo" />
          <div className="card p-4 grid place-items-center text-2xl">🎮 Videojuegos</div>
          <div className="card p-4 grid place-items-center text-2xl">🐶 Mascotas</div>
        </div>
      </section>
    </main>
  )
}
