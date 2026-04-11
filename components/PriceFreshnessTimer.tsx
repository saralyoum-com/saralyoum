"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LanguageContext";

// Each asset type has its own refresh window (in seconds)
const GOLD_INTERVAL = 300;   // 5 minutes (gold/silver refresh rate)

export default function PriceFreshnessTimer() {
  const router = useRouter();
  const { lang } = useLang();

  // We show the gold interval (longest = most honest)
  const [seconds, setSeconds] = useState(GOLD_INTERVAL);
  const [refreshCount, setRefreshCount] = useState(0);

  // Main 5-min countdown (gold/silver)
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          router.refresh();
          setRefreshCount((c) => c + 1);
          return GOLD_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);


  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isAlmostDue = seconds < 30;
  const isLive = seconds > GOLD_INTERVAL - 10; // just refreshed

  return (
    <div
      title={
        lang === "ar"
          ? `ذهب/فضة: كل 5د • كريبتو: كل 1د • تحديثات: ${refreshCount}`
          : `Gold/Silver: every 5m • Crypto: every 1m • Refreshes: ${refreshCount}`
      }
      className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl border select-none transition-all duration-300 ${
        isLive
          ? "border-rise/50 text-rise bg-rise/5"
          : isAlmostDue
          ? "border-gold/50 text-gold bg-gold/5"
          : "border-border text-text-secondary"
      }`}
    >
      {/* Dot indicator */}
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          isLive
            ? "bg-rise animate-pulse"
            : isAlmostDue
            ? "bg-gold animate-pulse"
            : "bg-rise"
        }`}
      />

      {/* Countdown */}
      <span className="font-mono tabular-nums">
        {mins}:{secs.toString().padStart(2, "0")}
      </span>

      {/* Label */}
      <span className="text-text-secondary hidden lg:inline">
        {lang === "ar" ? "تحديث" : "update"}
      </span>
    </div>
  );
}

// Mobile version — compact dot only
export function PriceFreshnessTimerMobile() {
  const [seconds, setSeconds] = useState(GOLD_INTERVAL);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) { router.refresh(); return GOLD_INTERVAL; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  const isAlmostDue = seconds < 30;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className={`sm:hidden flex items-center gap-1 text-xs px-2 py-1.5 rounded-xl border ${
      isAlmostDue ? "border-gold/40 text-gold" : "border-border text-text-secondary"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isAlmostDue ? "bg-gold animate-pulse" : "bg-rise"}`} />
      <span className="font-mono tabular-nums">{mins}:{secs.toString().padStart(2, "0")}</span>
    </div>
  );
}
