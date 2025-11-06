import { Suspense } from "react";
import HomeClient from "./HomeClient";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center px-4 py-8 sm:py-12">
      <section className="relative rounded-3xl w-full max-w-4xl p-6 sm:p-12 grid place-items-center text-center overflow-hidden">
        <div className="absolute inset-0 board-bg opacity-60 rounded-3xl" />
        <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
          <HomeClient />
        </Suspense>
      </section>
    </main>
  );
}
