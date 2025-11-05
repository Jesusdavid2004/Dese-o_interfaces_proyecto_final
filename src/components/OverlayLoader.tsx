"use client";

export default function OverlayLoader() {
  return (
    <div
      aria-label="Cargando"
      className="fixed inset-0 z-[9999] grid place-items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Spinner con gradiente */}
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-emerald-400 border-r-cyan-400 shadow-lg" />
          <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full border-4 border-emerald-400/20" />
        </div>

        {/* Texto con efecto de brillo */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-semibold text-white/90 tracking-wide">
            Cargando Portfolio
          </p>
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
          </div>
        </div>
      </div>

      {/* Efecto de brillo de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-cyan-500/30 blur-3xl [animation-delay:0.5s]" />
      </div>
    </div>
  );
}
