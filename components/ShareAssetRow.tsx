"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageContext";
import { useLocation } from "@/components/LocalCurrency";
import { track } from "@/lib/analytics";

const OZ = 31.1035;
const KARAT_PURITY: Record<number, number> = { 24: 1, 22: 22 / 24, 21: 21 / 24, 18: 18 / 24, 14: 14 / 24 };

// Row of one-tap "share this price" cards — one per asset plus the user's
// portfolio. Each card fetches a branded square PNG from /api/social-card and
// hands it to the native share sheet (WhatsApp/Telegram), falling back to a
// download on desktop. Replaces the older gold-only SharePriceButton.
interface AssetIn { price: number; changePercent: number; high?: number; low?: number }

// Badge + brand colour per asset. Latin tickers only — Tajawal has no ₿ or Ξ
// glyph, so those would render as tofu inside the Satori-generated PNG.
const BADGES: Record<string, { badge: string; accent: string; accentFg: string }> = {
  silver:   { badge: "Ag",  accent: "#A8AEB8", accentFg: "#1b1e22" },
  bitcoin:  { badge: "BTC", accent: "#F7931A", accentFg: "#2a1802" },
  ethereum: { badge: "ETH", accent: "#627EEA", accentFg: "#ffffff" },
};
interface Props {
  gold: AssetIn;
  silver: AssetIn;
  bitcoin: AssetIn;
  ethereum: AssetIn;
}

type Key = "gold" | "silver" | "bitcoin" | "ethereum" | "portfolio";

interface Holding { karat: number; grams: number; buyPrice?: number }
interface PortfolioData { holdings: Holding[]; currency: string; rate: number }

export default function ShareAssetRow({ gold, silver, bitcoin, ethereum }: Props) {
  const { lang } = useLang();
  const loc = useLocation();
  const isAr = lang === "ar";

  const [busy, setBusy] = useState<Key | null>(null);
  const [done, setDone] = useState<Key | null>(null);
  const [hasPortfolio, setHasPortfolio] = useState(false);

  // Detect a saved portfolio so the 💰 card either shares or invites an add.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gold_portfolio");
      if (!raw) return;
      const data: PortfolioData = JSON.parse(raw);
      setHasPortfolio(!!data.holdings?.length);
    } catch { /* noop */ }
  }, []);

  const dateStr = new Date().toLocaleDateString("ar", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // ── URL builders ──────────────────────────────────────────────────────────
  function buildGoldUrl(): string {
    const g = Math.round(gold.price).toLocaleString("en-US");
    const rate = loc.currency === "USD" ? 1 : loc.rate;
    const perGram24 = (gold.price / OZ) * rate;
    const dec = rate > 100 ? 0 : 2;
    const gram = (purity: number) =>
      (perGram24 * purity).toLocaleString("en-US", { maximumFractionDigits: dec });
    const sym = loc.currency === "USD" ? "$" : loc.currencySymbol;
    const curName = loc.currency === "USD" ? "بالدولار الأمريكي" : `بـ${loc.currencyName}`;
    const dir = gold.changePercent >= 0 ? "up" : "down";
    return `/api/social-card?type=price&gold=${encodeURIComponent(g)}` +
      `&change=${Math.abs(gold.changePercent).toFixed(2)}&dir=${dir}` +
      `&g24=${encodeURIComponent(gram(1))}&g21=${encodeURIComponent(gram(21 / 24))}&g18=${encodeURIComponent(gram(18 / 24))}` +
      `&sym=${encodeURIComponent(sym)}&curName=${encodeURIComponent(curName)}&date=${encodeURIComponent(dateStr)}`;
  }

  function buildAssetUrl(key: string, nameAr: string, sub: string, a: AssetIn, decimals: number): string {
    const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: decimals });
    const dir = a.changePercent >= 0 ? "up" : "down";
    const b = BADGES[key];
    let url = `/api/social-card?type=asset&assetName=${encodeURIComponent(nameAr)}` +
      `&assetSub=${encodeURIComponent(sub)}&price=${encodeURIComponent(fmt(a.price))}&sym=%24` +
      `&change=${Math.abs(a.changePercent).toFixed(2)}&dir=${dir}&date=${encodeURIComponent(dateStr)}`;
    if (b) {
      url += `&badge=${encodeURIComponent(b.badge)}&accent=${encodeURIComponent(b.accent)}` +
        `&accentFg=${encodeURIComponent(b.accentFg)}`;
    }
    if (a.high && a.low) {
      url += `&high=${encodeURIComponent(fmt(a.high))}&low=${encodeURIComponent(fmt(a.low))}`;
    }
    return url;
  }

  function buildPortfolioUrl(): string | null {
    let data: PortfolioData;
    try {
      const raw = localStorage.getItem("gold_portfolio");
      if (!raw) return null;
      data = JSON.parse(raw);
    } catch { return null; }
    if (!data.holdings?.length) return null;

    const rate = data.currency === "USD" ? 1 : data.rate || 1;
    const goldPerGramUSD = gold.price / OZ;

    let totalValue = 0;
    let costedValue = 0;
    let costedCost = 0;
    let hasCost = false;
    for (const h of data.holdings) {
      const purity = KARAT_PURITY[h.karat] ?? 1;
      const pricePerGramUSD = goldPerGramUSD * purity;
      const value = pricePerGramUSD * rate * h.grams;
      totalValue += value;
      // buyPrice is stored as USD/gram — guard against corrupt/legacy values.
      if (h.buyPrice && h.buyPrice > 0 && h.buyPrice >= pricePerGramUSD * 0.2 && h.buyPrice <= pricePerGramUSD * 5) {
        costedValue += value;
        costedCost += h.buyPrice * h.grams * rate;
        hasCost = true;
      }
    }

    const sym = data.currency === "USD" ? "$" : data.currency;
    const dec = totalValue > 1000 ? 0 : 2;
    const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: dec });
    const dailyChange = totalValue * (gold.changePercent / 100);
    const count = `${data.holdings.length} ${data.holdings.length <= 2 ? "قطعة" : "قطع"}`;

    let url = `/api/social-card?type=portfolio&pv=${encodeURIComponent(fmt(totalValue))}` +
      `&sym=${encodeURIComponent(sym)}&count=${encodeURIComponent(count)}` +
      `&daily=${encodeURIComponent(fmt(Math.abs(dailyChange)))}&dailyPct=${gold.changePercent.toFixed(2)}` +
      `&dailyDir=${gold.changePercent >= 0 ? "up" : "down"}&date=${encodeURIComponent(dateStr)}`;

    if (hasCost && costedCost > 0) {
      const pnl = costedValue - costedCost;
      const pnlPct = (pnl / costedCost) * 100;
      url += `&pnl=${encodeURIComponent(fmt(Math.abs(pnl)))}&pnlPct=${pnlPct.toFixed(1)}&pnlDir=${pnl >= 0 ? "up" : "down"}`;
    }
    return url;
  }

  // ── Share handler ─────────────────────────────────────────────────────────
  async function share(key: Key, url: string | null, title: string, filename: string) {
    if (busy) return;
    if (!url) return;
    setBusy(key);
    track.quickLinkClick(`share-${key}`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("card failed");
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/png" });
      const shareData = { files: [file], title, text: `${title} — sardhahab.com` };
      if (typeof navigator.canShare === "function" && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
      }
      setBusy(null);
      setDone(key);
      setTimeout(() => setDone(null), 2000);
    } catch {
      // AbortError (user closed the sheet) lands here too — just reset.
      setBusy(null);
    }
  }

  // Element/ticker badges instead of emoji — 🥇🥈 rendered as full-colour
  // medals next to the monochrome ₿ and ⟠, which read as three unrelated icon
  // sets. These match the Au/Ag badges already used on the price cards.
  const walletIcon = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );

  const cards: {
    key: Key; badge: React.ReactNode; badgeCls: string; label: string;
    up: boolean; pct: number; onClick: () => void; featured?: boolean; href?: string;
  }[] = [
    {
      key: "gold", badge: "Au", badgeCls: "bg-[#C9A84C] text-[#241b03]",
      label: isAr ? "الذهب" : "Gold", up: gold.changePercent >= 0, pct: gold.changePercent,
      onClick: () => share("gold", buildGoldUrl(), isAr ? "سعر الذهب اليوم" : "Gold price today", "sard-gold.png"),
    },
    {
      key: "silver", badge: "Ag", badgeCls: "bg-[#A8AEB8] text-[#1b1e22]",
      label: isAr ? "الفضة" : "Silver", up: silver.changePercent >= 0, pct: silver.changePercent,
      onClick: () => share("silver", buildAssetUrl("silver", isAr ? "الفضة" : "Silver", "سعر الأونصة الآن", silver, 2), isAr ? "سعر الفضة اليوم" : "Silver price today", "sard-silver.png"),
    },
    {
      key: "bitcoin", badge: "₿", badgeCls: "bg-[#F7931A] text-[#2a1802] text-lg sm:text-xl",
      label: isAr ? "بيتكوين" : "Bitcoin", up: bitcoin.changePercent >= 0, pct: bitcoin.changePercent,
      onClick: () => share("bitcoin", buildAssetUrl("bitcoin", isAr ? "بيتكوين" : "Bitcoin", "السعر الآن", bitcoin, 0), isAr ? "سعر البيتكوين اليوم" : "Bitcoin price today", "sard-bitcoin.png"),
    },
    {
      key: "ethereum", badge: "Ξ", badgeCls: "bg-[#627EEA] text-white text-lg sm:text-xl",
      label: isAr ? "إيثيريوم" : "Ethereum", up: ethereum.changePercent >= 0, pct: ethereum.changePercent,
      onClick: () => share("ethereum", buildAssetUrl("ethereum", isAr ? "إيثيريوم" : "Ethereum", "السعر الآن", ethereum, 0), isAr ? "سعر الإيثيريوم اليوم" : "Ethereum price today", "sard-ethereum.png"),
    },
    {
      key: "portfolio", badge: walletIcon, badgeCls: "bg-gold/[0.14] border border-gold/50 text-gold",
      label: isAr ? "محفظتي" : "Portfolio", up: gold.changePercent >= 0, pct: gold.changePercent, featured: true,
      href: hasPortfolio ? undefined : "#portfolio",
      onClick: () => share("portfolio", buildPortfolioUrl(), isAr ? "محفظتي الذهبية" : "My Gold Portfolio", "sard-portfolio.png"),
    },
  ];

  const shareIcon = (size: number) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="mb-4">
      <div className="flex items-center gap-2 mb-2 px-0.5">
        <span className="text-gold flex items-center gap-1.5 text-sm font-medium">
          {shareIcon(15)}
          {isAr ? "شارك السعر كبطاقة جاهزة" : "Share as a ready card"}
        </span>
        <span className="text-text-secondary text-xs hidden sm:inline">
          {isAr ? "— اختر الأصل" : "— pick an asset"}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {cards.map((c) => {
          const isBusy = busy === c.key;
          const isDone = done === c.key;
          const inner = (
            <>
              {/* Share affordance — nothing previously signalled these were
                  share buttons rather than links to a price page. */}
              <span className="absolute top-1.5 start-1.5 text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                {shareIcon(11)}
              </span>
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-extrabold text-xs sm:text-sm ${c.badgeCls} ${isBusy ? "animate-pulse" : ""}`}
              >
                {isDone ? "✓" : c.badge}
              </div>
              <div className={`text-[11px] sm:text-sm mt-1.5 font-bold ${c.featured ? "text-gold" : "text-text-primary"}`}>{c.label}</div>
              {c.key === "portfolio" && c.href ? (
                <div className="text-[10px] sm:text-xs text-text-secondary">{isAr ? "أضف ذهبك" : "add gold"}</div>
              ) : (
                <div className={`text-[10px] sm:text-xs font-medium ${c.up ? "text-rise" : "text-fall"}`}>
                  {c.up ? "▲" : "▼"} {Math.abs(c.pct).toFixed(1)}%
                </div>
              )}
            </>
          );
          const base = `group relative flex flex-col items-center justify-center text-center rounded-xl px-1.5 py-3 border transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 ${
            c.featured
              ? "bg-gold/[0.06] border-gold/40 hover:border-gold/60"
              : "bg-surface border-border hover:border-gold/40"
          }`;
          return c.href ? (
            <a key={c.key} href={c.href} onClick={() => track.quickLinkClick("share-portfolio-add")} className={base}>
              {inner}
            </a>
          ) : (
            <button key={c.key} onClick={c.onClick} disabled={busy !== null} className={base}>
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
}
