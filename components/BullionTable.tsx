"use client";

import { useState } from "react";
import { useLang } from "@/components/LanguageContext";
import { bullionPrices } from "@/lib/goldDetails";

interface Props {
  goldPriceUSD: number;
  rate: number;
  currency: string;
}

// Standalone bullion (سبائك) table for the prices page — visitor currency + USD.
export default function BullionTable({ goldPriceUSD, rate, currency }: Props) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [showAll, setShowAll] = useState(false);

  const bullion = bullionPrices(goldPriceUSD, rate);
  const dec = rate > 1000 ? 0 : rate > 100 ? 1 : rate < 1 ? 3 : 2;
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: dec });
  const fmtUsd = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: n >= 1000 ? 0 : 2 });

  return (
    <section dir={ar ? "rtl" : "ltr"} className="bg-surface border border-border rounded-2xl overflow-hidden mt-4">
      <div className="bg-gold/10 text-gold font-bold text-sm px-4 py-2.5">
        {ar ? "أسعار سبائك الذهب (عيار 24 · 999.9)" : "Gold bullion prices (24K · 999.9)"}
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[320px]">
          <div className="flex text-xs text-text-secondary px-4 py-2 border-b border-border">
            <span className="flex-[1.3]">{ar ? "الحجم" : "Size"}</span>
            <span className="flex-1 text-center">{currency}</span>
            <span className="flex-1 text-end">USD</span>
          </div>
          {bullion.map((b, i) => (
            <div
              key={b.key}
              className={`flex items-center px-4 py-2.5 text-sm ${i % 2 ? "bg-surface-2" : ""} ${i >= 7 && !showAll ? "hidden" : ""}`}
            >
              <span className="flex-[1.3] text-text-primary">{ar ? b.ar : b.en}</span>
              <span className="flex-1 text-center text-text-primary font-medium">{fmt(b.local)}</span>
              <span className="flex-1 text-end text-text-secondary">{fmtUsd(b.usd)}</span>
            </div>
          ))}
        </div>
      </div>
      {bullion.length > 7 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="w-full text-gold text-sm font-bold py-2.5 border-t border-border hover:bg-gold/5 transition-colors"
        >
          {showAll ? (ar ? "عرض أقل ▲" : "Show less ▲") : (ar ? "عرض كل الأحجام ▼" : "Show all sizes ▼")}
        </button>
      )}
      <p className="text-[11px] text-text-secondary px-4 py-2 border-t border-border">
        {ar ? "تُعرض بعملتك حسب موقعك · الأسعار تقديرية" : "Shown in your local currency · prices are estimates"}
      </p>
    </section>
  );
}
