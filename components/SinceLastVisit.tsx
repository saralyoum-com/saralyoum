"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/LanguageContext";

// Shows returning visitors how gold moved since they were last here — a cheap,
// backend-free personalization that makes every repeat visit feel current.
// State is the last-seen gold price + timestamp in localStorage.
const KEY = "sard_last_visit_gold";
const MIN_HOURS = 3; // don't show for near-instant reloads

export default function SinceLastVisit({ goldPriceUSD }: { goldPriceUSD: number }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [info, setInfo] = useState<{ pct: number; hours: number } | null>(null);

  useEffect(() => {
    if (!goldPriceUSD || goldPriceUSD <= 0) return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const { price, ts } = JSON.parse(raw);
        const hours = (Date.now() - ts) / 3_600_000;
        if (price > 0 && hours >= MIN_HOURS) {
          setInfo({ pct: ((goldPriceUSD - price) / price) * 100, hours });
        }
      }
    } catch { /* ignore */ }
    // Record this visit for next time.
    try {
      localStorage.setItem(KEY, JSON.stringify({ price: goldPriceUSD, ts: Date.now() }));
    } catch { /* ignore */ }
  }, [goldPriceUSD]);

  if (!info) return null;

  const up = info.pct >= 0;
  const pctStr = `${Math.abs(info.pct).toFixed(1)}%`;
  const when =
    info.hours < 48
      ? isAr ? "منذ زيارتك الأخيرة" : "since your last visit"
      : isAr ? `منذ ${Math.round(info.hours / 24)} أيام` : `in ${Math.round(info.hours / 24)} days`;

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="flex justify-center mb-4">
      <div className={`inline-flex items-center gap-2 text-xs sm:text-sm rounded-full px-4 py-1.5 border ${
        up ? "bg-rise/10 border-rise/25 text-rise" : "bg-fall/10 border-fall/25 text-fall"
      }`}>
        <span className="text-text-secondary">{when}:</span>
        <span className="font-bold">{isAr ? "الذهب" : "Gold"} {up ? "▲" : "▼"} {pctStr}</span>
      </div>
    </div>
  );
}
