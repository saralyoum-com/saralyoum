"use client";

import { useState } from "react";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

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
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  if (!goldPriceUSD || goldPriceUSD <= 0) return null;

  async function handleShare() {
    if (state === "loading") return;
    setState("loading");
    track.quickLinkClick("share-price-card");
    try {
      const gold = Math.round(goldPriceUSD).toLocaleString("en-US");
      const dir = changePercent >= 0 ? "up" : "down";
      const url = `/api/social-card?type=morning&gold=${encodeURIComponent(gold)}&change=${Math.abs(changePercent).toFixed(2)}&dir=${dir}`;
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
