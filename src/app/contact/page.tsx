// app/contact/page.tsx
import { Suspense } from "react";
import ContactClient from "./ContactClient";
import { getLangFromSearch, Lang } from "@/lib/i18n";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Desenvuelve los searchParams (Next 15: API asíncrona)
  const sp = await searchParams;

  // Convierte a string estable para i18n
  const qs = new URLSearchParams();
  for (const k of Object.keys(sp)) {
    const v = sp[k];
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, String(x)));
    else if (typeof v !== "undefined") qs.set(k, String(v));
  }

  const lang: Lang = getLangFromSearch(qs.toString());

  return (
    <main className="relative mx-auto max-w-6xl px-4 md:px-6 pb-24">
      <section className="mt-8">
        <Suspense fallback={null}>
          <ContactClient lang={lang} />
        </Suspense>
      </section>
    </main>
  );
}
