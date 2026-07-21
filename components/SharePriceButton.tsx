"use client";

import { useState } from "react";
import { useLang } from "@/components/LanguageContext";
import { useLocation } from "@/components/LocalCurrency";
import { track } from "@/lib/analytics";

const OZ = 31.1035;

// "Share today's price" — generates a styled PNG from the existing
// /api/social-card endpoint (the same renderer the posting bot uses) and
// hands it to the native share sheet on mobile (WhatsApp/Telegram/TikTok),
// falling back to a plain download on desktop.
interface Props {
  goldPriceUSD: number;
  changePercent: number;
}

export default function SharePriceButton({ goldPriceUSD, changePercent }: Props) {
  const { lang } = useLang();
  const loc = useLocation();

  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  if (!goldPriceUSD || goldPriceUSD <= 0) return null;

  async function handleShare() {
    if (state === "loading") return;
    setState("loading");
    track.quickLinkClick("share-price-card");
    try {
      const gold = Math.round(goldPriceUSD).toLocaleString("en-US");
      const dir = changePercent >= 0 ? "up" : "down";

      // Per-gram prices in the visitor's local currency
      const rate = loc.currency === "USD" ? 1 : loc.rate;
      const perGram24 = (goldPriceUSD / OZ) * rate;
      const dec = rate > 100 ? 0 : 2;
      const g = (purity: number) =>
        (perGram24 * purity).toLocaleString("en-US", { maximumFractionDigits: dec });
      const sym = loc.currency === "USD" ? "$" : loc.currencySymbol;
      const curName = loc.currency === "USD" ? "بالدولار الأمريكي" : `بـ${loc.currencyName}`;
      const date = new Date().toLocaleDateString("ar", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

      const url =
        `/api/social-card?type=price&gold=${encodeURIComponent(gold)}` +
        `&change=${Math.abs(changePercent).toFixed(2)}&dir=${dir}` +
        `&g24=${encodeURIComponent(g(1))}&g21=${encodeURIComponent(g(21 / 24))}&g18=${encodeURIComponent(g(18 / 24))}` +
        `&sym=${encodeURIComponent(sym)}&curName=${encodeURIComponent(curName)}&date=${encodeURIComponent(date)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("card failed");
      const blob = await res.blob();
      const file = new File([blob], "sard-gold-price.png", { type: "image/png" });

      const shareData = {
        files: [file],
        title: lang === "ar" ? "سعر الذهب اليوم" : "Gold price today",
        text: `${lang === "ar" ? "الذهب الآن" : "Gold now"} $${gold} — sardhahab.com`,
      };

      if (typeof navigator.canShare === "function" && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "sard-gold-price.png";
        a.click();
        URL.revokeObjectURL(a.href);
      }
      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      // AbortError (user closed the share sheet) lands here too — just reset
      setState("idle");
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={state === "loading"}
      className="flex items-center justify-center gap-2 w-full bg-surface border border-border hover:border-gold/40 text-text-secondary hover:text-gold rounded-xl px-4 py-3 mb-4 text-sm font-medium transition-colors disabled:opacity-60"
    >
      {state === "loading"
        ? (lang === "ar" ? "⏳ جاري تجهيز البطاقة..." : "⏳ Preparing card...")
        : state === "done"
        ? (lang === "ar" ? "✅ تمت المشاركة" : "✅ Shared")
        : (lang === "ar" ? "📤 شارك سعر اليوم — بطاقة جاهزة للواتساب" : "📤 Share today's price — ready-made card")}
    </button>
  );
}
