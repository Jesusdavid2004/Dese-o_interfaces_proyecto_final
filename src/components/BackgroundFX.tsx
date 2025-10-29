"use client"
import { useEffect, useRef } from "react"

export default function BackgroundFX() {
  const rootRef = useRef<HTMLDivElement>(null)
  const b1 = useRef<HTMLSpanElement>(null)
  const b2 = useRef<HTMLSpanElement>(null)
  const b3 = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current!
    const blobs = [b1.current!, b2.current!, b3.current!]

    let vw = window.innerWidth
    let vh = window.innerHeight
    const center = () => ({ cx: vw / 2, cy: vh / 2 })

    const parallax = (e: MouseEvent) => {
      const { cx, cy } = center()
      const dx = (e.clientX - cx) / cx
      const dy = (e.clientY - cy) / cy
      // parallax leve del contenedor
      root.style.transform = `translate(${dx * 6}px, ${dy * 4}px)`

      // “empujón” radial por proximidad
      for (const el of blobs) {
        const rect = el.getBoundingClientRect()
        const bx = rect.left + rect.width / 2
        const by = rect.top + rect.height / 2
        const ddx = e.clientX - bx
        const ddy = e.clientY - by
        const dist = Math.hypot(ddx, ddy)
        const influence = Math.max(0, 1 - dist / 280) // radio de influencia ~280px
        // vector de desplazamiento opuesto al mouse (escape)
        const ux = -ddx / (dist || 1)
        const uy = -ddy / (dist || 1)
        const push = influence * 18 // fuerza máx px
        el.style.setProperty("--push-x", `${ux * push}px`)
        el.style.setProperty("--push-y", `${uy * push}px`)
      }
    }

    const onResize = () => {
      vw = window.innerWidth
      vh = window.innerHeight
    }

    window.addEventListener("mousemove", parallax)
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("mousemove", parallax)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <div ref={rootRef} className="bgfx pointer-events-none">
      <span ref={b1} className="blob blob-1" />
      <span ref={b2} className="blob blob-2" />
      <span ref={b3} className="blob blob-3" />
      <span className="bg-noise" />
    </div>
  )
}
