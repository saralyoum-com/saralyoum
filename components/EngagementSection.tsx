"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/components/LanguageContext";

/* ─── animated counter hook ─── */
function useCountUp(target: number, duration = 1200, decimals = 0) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (target === 0 || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (p < 1) requestAnimationFrame(tick);
      else setValue(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration, decimals]);

  return value;
}

/* ─── helpers ─── */
function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-06-01"
}
function ls(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, val: string) {
  try { localStorage.setItem(key, val); } catch { /* noop */ }
}

/* ═══════════════════════════════════════════════════
   1. PRICE STREAK COUNTER
   ═══════════════════════════════════════════════════ */
function PriceStreak({ changePercent }: { changePercent: number }) {
  const { lang } = useLang();
  const [streak, setStreak] = useState(0);
  const [dir, setDir] = useState<"up" | "down">("up");

  useEffect(() => {
    const saved = ls("gold_streak");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const today = todayKey();
        if (data.date === today) {
          setStreak(data.count);
          setDir(data.dir);
          return;
        }
        // New day — check if streak continues
        const currentDir = changePercent >= 0 ? "up" : "down";
        if (currentDir === data.dir) {
          const newCount = data.count + 1;
          setStreak(newCount);
          setDir(currentDir);
          lsSet("gold_streak", JSON.stringify({ date: today, count: newCount, dir: currentDir }));
        } else {
          setStreak(1);
          setDir(currentDir);
          lsSet("gold_streak", JSON.stringify({ date: today, count: 1, dir: currentDir }));
        }
      } catch {
        initStreak();
      }
    } else {
      initStreak();
    }

    function initStreak() {
      const currentDir = changePercent >= 0 ? "up" : "down";
      setStreak(1);
      setDir(currentDir);
      lsSet("gold_streak", JSON.stringify({ date: todayKey(), count: 1, dir: currentDir }));
    }
  }, [changePercent]);

  const isUp = dir === "up";

  return (
    <div className={`rounded-2xl border p-4 ${isUp ? "bg-rise/5 border-rise/20" : "bg-fall/5 border-fall/20"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-secondary text-xs font-medium">
          {lang === "ar" ? "سلسلة الأسعار" : "Price Streak"}
        </span>
        <span className="text-2xl">{isUp ? "📈" : "📉"}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-black ${isUp ? "text-rise" : "text-fall"}`}>
          {streak}
        </span>
        <span className="text-text-secondary text-sm">
          {lang === "ar"
            ? `${streak === 1 ? "يوم" : streak === 2 ? "يومان" : streak <= 10 ? "أيام" : "يوم"} ${isUp ? "ارتفاع" : "انخفاض"} متواصل`
            : `${streak === 1 ? "day" : "days"} ${isUp ? "rising" : "falling"}`}
        </span>
      </div>
      {streak >= 3 && (
        <p className={`text-xs mt-2 ${isUp ? "text-rise" : "text-fall"}`}>
          {lang === "ar" ? `🔥 أطول من المعتاد!` : `🔥 Longer than usual!`}
        </p>
      )}
    </div>
  );
}



/* ═══════════════════════════════════════════════════
   5. "WHAT IF" CALCULATOR
   ═══════════════════════════════════════════════════ */
function WhatIfCalculator({ currentPrice }: { currentPrice: number }) {
  const { lang } = useLang();
  // Real price from ~1 year ago, fetched from the history API. This used to be
  // a hardcoded constant that went stale, and when the live price failed to
  // load the widget rendered "$0 (0.0%)" — worse than showing nothing. Now the
  // widget only renders when both numbers are real.
  const [yearAgoPrice, setYearAgoPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/history?asset=gold&range=1y")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const first = d?.data?.[0]?.p;
        if (typeof first === "number" && first > 0) setYearAgoPrice(first);
      })
      .catch(() => {});
  }, []);

  const investAmount = 1000;
  const ready =
    currentPrice > 0 &&
    yearAgoPrice != null &&
    // sanity band — a wildly off ratio means bad data, hide rather than mislead
    currentPrice / yearAgoPrice > 0.3 &&
    currentPrice / yearAgoPrice < 3;

  const currentValue = ready ? Math.round(investAmount * (currentPrice / yearAgoPrice)) : investAmount;
  const profit = currentValue - investAmount;
  const gainPct = ready ? ((currentPrice - yearAgoPrice) / yearAgoPrice * 100).toFixed(1) : "0";

  const animatedValue = useCountUp(currentValue, 1400);
  const animatedProfit = useCountUp(profit, 1400);
  const animatedPct = useCountUp(parseFloat(gainPct), 1400, 1);

  if (!ready) return null;

  return (
    <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-4">
      <span className="text-text-secondary text-xs font-medium">
        {lang === "ar" ? "ماذا لو استثمرت؟" : "What If You Invested?"}
      </span>
      <div className="mt-3 space-y-2">
        <p className="text-text-primary text-sm">
          {lang === "ar"
            ? `لو استثمرت $${investAmount.toLocaleString()} في الذهب قبل سنة...`
            : `If you invested $${investAmount.toLocaleString()} in gold 1 year ago...`}
        </p>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-black tabular-nums ${profit >= 0 ? "text-rise" : "text-fall"}`}>
            ${Math.round(animatedValue).toLocaleString()}
          </span>
          <span className={`text-sm font-bold tabular-nums ${profit >= 0 ? "text-rise" : "text-fall"}`}>
            {profit >= 0 ? "+" : "−"}${Math.abs(Math.round(animatedProfit)).toLocaleString()} ({animatedPct.toFixed(1)}%)
          </span>
        </div>
        <p className="text-text-secondary text-xs">
          {lang === "ar"
            ? "الذهب يحمي ثروتك من التضخم — ابدأ اليوم"
            : "Gold protects your wealth from inflation — start today"}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN SECTION — combines all widgets
   ═══════════════════════════════════════════════════ */
interface EngagementProps {
  goldPrice: number;
  changePercent: number;
}

export default function EngagementSection({ goldPrice, changePercent }: EngagementProps) {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <section dir={dir} className="max-w-7xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
          🎯
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            {lang === "ar" ? "تفاعل مع السوق" : "Market Engagement"}
          </h2>
          <p className="text-text-secondary text-xs sm:text-sm">
            {lang === "ar" ? "توقّع • تابع • شارك رأيك" : "Predict • Track • Share your opinion"}
          </p>
        </div>
      </div>

      {/* Widgets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <PriceStreak changePercent={changePercent} />
        <WhatIfCalculator currentPrice={goldPrice} />
      </div>
    </section>
  );
}
