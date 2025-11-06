import { Suspense } from "react";
import HobbiesClient from "./HobbiesClient";

export default function PasatiemposPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">
      <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
        <HobbiesClient />
      </Suspense>
    </main>
  );
}
