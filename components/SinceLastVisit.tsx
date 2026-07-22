"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/LanguageContext";

// Shows returning visitors how gold — and, if they own any, their own
// portfolio — moved since they were last here. A cheap, backend-free
// personalization that makes every repeat visit feel current. State is the
// last-seen gold price + timestamp in localStorage; portfolio holdings are
// read from the same "gold_portfolio" schema PortfolioTracker writes.
const KEY = "sard_last_visit_gold";
const MIN_HOURS = 3; // don't show for near-instant reloads
const OZ = 31.1035;
const KARAT_PURITY: Record<number, number> = { 24: 1, 22: 22 / 24, 21: 21 / 24, 18: 18 / 24, 14: 14 / 24 };

interface Holding { karat: number; grams: number }
interface PortfolioData { holdings: Holding[]; currency: string; rate: number }

interface Info {
  pct: number;
  hours: number;
  portfolio: { deltaValue: number; symbol: string } | null;
}

export default function SinceLastVisit({ goldPriceUSD }: { goldPriceUSD: number }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [info, setInfo] = useState<Info | null>(null);

  useEffect(() => {
    if (!goldPriceUSD || goldPriceUSD <= 0) return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const { price, ts } = JSON.parse(raw);
        const hours = (Date.now() - ts) / 3_600_000;
        if (price > 0 && hours >= MIN_HOURS) {
          setInfo({
            pct: ((goldPriceUSD - price) / price) * 100,
            hours,
            portfolio: portfolioDelta(price, goldPriceUSD),
          });
        }
      }
    } catch { /* ignore */ }
    // Record this visit for next time.
    try {
      localStorage.setItem(KEY, JSON.stringify({ price: goldPriceUSD, ts: Date.now() }));
    } catch { /* ignore */ }
  }, [goldPriceUSD]);

  // Value change of the saved holdings between the last-visit gold price and now.
  function portfolioDelta(thenUSD: number, nowUSD: number): Info["portfolio"] {
    try {
      const raw = localStorage.getItem("gold_portfolio");
      if (!raw) return null;
      const d: PortfolioData = JSON.parse(raw);
      if (!d.holdings?.length) return null;
      const rate = d.currency === "USD" ? 1 : d.rate || 1;
      const nowPerG = nowUSD / OZ;
      const thenPerG = thenUSD / OZ;
      let deltaValue = 0;
      for (const h of d.holdings) {
        const purity = KARAT_PURITY[h.karat] ?? 1;
        deltaValue += (nowPerG - thenPerG) * purity * rate * h.grams;
      }
      return { deltaValue, symbol: d.currency === "USD" ? "$" : d.currency };
    } catch { return null; }
  }

  if (!info) return null;

  const up = info.pct >= 0;
  const pctStr = `${Math.abs(info.pct).toFixed(1)}%`;
  const goldWord = isAr ? "الذهب" : "Gold";
  const when =
    info.hours < 48
      ? isAr ? "منذ زيارتك الأخيرة" : "Since your last visit"
      : isAr ? `منذ ${Math.round(info.hours / 24)} أيام` : `${Math.round(info.hours / 24)} days ago`;

  const pf = info.portfolio;
  const pfUp = pf ? pf.deltaValue >= 0 : up;
  const sym = pf?.symbol ?? "$";
  const dec = pf && Math.abs(pf.deltaValue) > 1000 ? 0 : 2;
  const pfAmount = pf ? Math.abs(pf.deltaValue).toLocaleString("en-US", { maximumFractionDigits: dec }) : "";

  // Colour follows the portfolio move when present, else gold.
  const positive = pf ? pfUp : up;

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="mb-4">
      <div
        className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 border bg-gradient-to-l ${
          positive ? "from-rise/[0.08] border-rise/25" : "from-fall/[0.08] border-fall/25"
        } to-transparent`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${positive ? "bg-rise/10" : "bg-fall/10"}`}>
            {positive ? "📈" : "📉"}
          </div>
          <div className="min-w-0">
            <p className="text-text-secondary text-xs">{when}</p>
            {pf ? (
              <p className="text-text-primary text-sm font-medium truncate">
                {isAr ? "محفظتك" : "Your portfolio"} {pfUp ? (isAr ? "ارتفعت" : "up") : (isAr ? "انخفضت" : "down")}
                <span className="text-text-secondary"> · {goldWord} {up ? "▲" : "▼"} {pctStr}</span>
              </p>
            ) : (
              <p className="text-text-primary text-sm font-medium truncate">
                {goldWord} {up ? "▲" : "▼"} {pctStr}
                <a href="#portfolio" className="text-gold hover:text-gold-light"> · {isAr ? "أضف ذهبك لتخصيص هذا" : "add your gold to personalize"}</a>
              </p>
            )}
          </div>
        </div>
        <div className="text-end shrink-0">
          {pf ? (
            <>
              <p className={`text-lg sm:text-xl font-black tabular-nums ${pfUp ? "text-rise" : "text-fall"}`}>
                {pfUp ? "+" : "−"} {sym} {pfAmount}
              </p>
              <p className={`text-xs ${pfUp ? "text-rise" : "text-fall"}`}>
                {up ? "+" : ""}{info.pct.toFixed(1)}% {isAr ? "على قيمتك" : "on your value"}
              </p>
            </>
          ) : (
            <p className={`text-lg sm:text-xl font-black ${up ? "text-rise" : "text-fall"}`}>
              {up ? "▲" : "▼"} {pctStr}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
