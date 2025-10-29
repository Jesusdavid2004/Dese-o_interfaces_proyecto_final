"use client"

import Link from "next/link"
import ThemeToggle from "./ThemeToggle"

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-neutral-900/60 border-b border-black/5 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-extrabold tracking-tight">
          🎲 Portfolio Parqués
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link className="hover:underline" href="/about">1 · About</Link>
          <Link className="hover:underline" href="/projects">2 · Projects</Link>
          <Link className="hover:underline" href="/experience">3 · Experience</Link>
          <Link className="hover:underline" href="/services">4 · Services</Link>
          <Link className="hover:underline" href="/hobbies">5 · Hobbies</Link>
          <Link className="hover:underline" href="/contact">6 · Contact</Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
