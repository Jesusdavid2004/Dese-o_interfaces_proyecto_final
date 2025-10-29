"use client"
import { useEffect, useRef } from "react"

export default function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current!
    const ring = ringRef.current!

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x, ry = y

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      dot.style.transform = `translate(${x}px, ${y}px)`
    }

    // seguimiento suave del aro
    const loop = () => {
      rx += (x - rx) * 0.15
      ry += (y - ry) * 0.15
      ring.style.transform = `translate(${rx}px, ${ry}px)`
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)

    // ocultar cursor nativo (solo desktop)
    document.documentElement.classList.add("cursor-none-global")

    window.addEventListener("mousemove", onMove)
    return () => {
      window.removeEventListener("mousemove", onMove)
      document.documentElement.classList.remove("cursor-none-global")
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  )
}
