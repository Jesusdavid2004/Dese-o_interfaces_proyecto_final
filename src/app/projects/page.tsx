import { Suspense } from "react";
import ProjectsClient from "./ProjectsClient";

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <section className="mt-8">
        <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
          <ProjectsClient />
        </Suspense>
      </section>
    </main>
  );
}
