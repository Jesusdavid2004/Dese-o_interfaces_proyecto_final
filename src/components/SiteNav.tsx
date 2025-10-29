"use client"
import ThemeToggle from "./ThemeToggle"

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-neutral-900/60 border-b border-black/5 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <a href="/" className="font-extrabold tracking-tight">🎲 Portfolio Parqués</a>
        <div className="flex items-center gap-4 text-sm">
          <a className="hover:underline" href="/about">1 · About</a>
          <a className="hover:underline" href="/projects">2 · Projects</a>
          <a className="hover:underline" href="/experience">3 · Experience</a>
          <a className="hover:underline" href="/services">4 · Services</a>
          <a className="hover:underline" href="/hobbies">5 · Hobbies</a>
          <a className="hover:underline" href="/contact">6 · Contact</a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
