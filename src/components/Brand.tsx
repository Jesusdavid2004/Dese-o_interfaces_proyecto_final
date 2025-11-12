"use client";

import { useSearchParams } from "next/navigation";
import { t, getLangFromSearch, Lang } from "@/lib/i18n";

export default function Brand() {
  const sp = useSearchParams();
  const lang: Lang = getLangFromSearch(sp?.toString() || "");
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xl">🎲</span>
      <span className="text-2xl font-extrabold text-purple-300">
        {t(lang, "brand_portfolio")}
      </span>
    </span>
  );
}
