"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

/* ─── types ─── */
interface Holding {
  id: string;
  karat: 24 | 22 | 21 | 18 | 14;
  grams: number;
  buyPrice?: number; // USD per gram at purchase (currency-independent, optional)
  buyDate?: string;  // ISO yyyy-mm-dd (optional — enables duration + annualized return)
}

interface PortfolioData {
  holdings: Holding[];
  currency: string;
  rate: number;
}

/* ─── helpers ─── */
const OZ = 31.1035;

function ls(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, val: string) {
  try { localStorage.setItem(key, val); } catch { /* noop */ }
}
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// "منذ 4 أشهر" / "4 months ago" style label from an ISO date
function holdingAge(iso: string, isAr: boolean): { days: number; label: string } | null {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days < 0) return null;
  let label: string;
  if (days < 30) label = isAr ? `منذ ${days} يوم` : `${days}d ago`;
  else if (days < 365) {
    const m = Math.floor(days / 30);
    label = isAr ? (m === 1 ? "منذ شهر" : m === 2 ? "منذ شهرين" : m <= 10 ? `منذ ${m} أشهر` : `منذ ${m} شهر`) : `${m}mo ago`;
  } else {
    const y = +(days / 365).toFixed(1);
    label = isAr ? `منذ ${y} سنة` : `${y}y ago`;
  }
  return { days, label };
}

/* ─── count-up hook for P&L numbers ─── */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setValue(e * target);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/* ─── karat options ─── */
const KARATS: { value: Holding["karat"]; label: string; purity: number }[] = [
  { value: 24, label: "عيار 24", purity: 1 },
  { value: 22, label: "عيار 22", purity: 22 / 24 },
  { value: 21, label: "عيار 21", purity: 21 / 24 },
  { value: 18, label: "عيار 18", purity: 18 / 24 },
  { value: 14, label: "عيار 14", purity: 14 / 24 },
];

const KARATS_EN: Record<number, string> = {
  24: "24K", 22: "22K", 21: "21K", 18: "18K", 14: "14K",
};

/* ─── currency data ─── */
const CURRENCIES = [
  { code: "USD", symbol: "$", nameAr: "دولار", nameEn: "USD", fallback: 1 },
  { code: "SAR", symbol: "ر.س", nameAr: "ريال سعودي", nameEn: "SAR", fallback: 3.75 },
  { code: "AED", symbol: "د.إ", nameAr: "درهم إماراتي", nameEn: "AED", fallback: 3.6725 },
  { code: "EGP", symbol: "ج.م", nameAr: "جنيه مصري", nameEn: "EGP", fallback: 54.41 },
  { code: "KWD", symbol: "د.ك", nameAr: "دينار كويتي", nameEn: "KWD", fallback: 0.3075 },
  { code: "QAR", symbol: "ر.ق", nameAr: "ريال قطري", nameEn: "QAR", fallback: 3.64 },
  { code: "JOD", symbol: "د.أ", nameAr: "دينار أردني", nameEn: "JOD", fallback: 0.709 },
  { code: "IQD", symbol: "ع.د", nameAr: "دينار عراقي", nameEn: "IQD", fallback: 1310 },
  // 132, not 13000 — post-redenomination (1 Jan 2026). See lib/countries.ts.
  { code: "SYP", symbol: "ل.س", nameAr: "ليرة سورية", nameEn: "SYP", fallback: 132 },
];

interface Props {
  goldPriceUSD: number;
  changePercent: number;
}

export default function PortfolioTracker({ goldPriceUSD, changePercent }: Props) {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [currency, setCurrency] = useState("SAR");
  const [rate, setRate] = useState(3.75);
  const [isOpen, setIsOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Add form state
  const [newKarat, setNewKarat] = useState<Holding["karat"]>(21);
  const [newGrams, setNewGrams] = useState("");
  const [newBuyPrice, setNewBuyPrice] = useState("");
  const [newBuyDate, setNewBuyDate] = useState("");

  // Load saved data
  useEffect(() => {
    const saved = ls("gold_portfolio");
    if (saved) {
      try {
        const data: PortfolioData = JSON.parse(saved);
        setHoldings(data.holdings || []);
        if (data.currency) setCurrency(data.currency);
        if (data.rate) setRate(data.rate);
        if (data.holdings?.length > 0) setIsOpen(true);
      } catch { /* noop */ }
    }
    // Fetch live rate
    fetchRate();
  }, []);

  async function fetchRate() {
    try {
      const res = await fetch("/api/prices?type=currencies");
      if (!res.ok) return;
      const data = await res.json();
      const rates = data.currencies || data.rates || [];
      const saved = ls("gold_portfolio");
      const cur = saved ? JSON.parse(saved).currency || "SAR" : "SAR";
      const found = rates.find((r: { code: string; rate: number }) => r.code === cur);
      if (found) setRate(found.rate);
    } catch { /* use fallback */ }
  }

  function save(h: Holding[], cur: string, r: number) {
    lsSet("gold_portfolio", JSON.stringify({ holdings: h, currency: cur, rate: r }));
  }

  function addHolding() {
    const grams = parseFloat(newGrams);
    if (!grams || grams <= 0) return;
    const buyPInput = newBuyPrice ? parseFloat(newBuyPrice) : undefined;
    // Store as USD per gram (the input is in the displayed currency), so the
    // P/L stays correct even if the user later switches display currency.
    const buyPriceUSD =
      buyPInput && buyPInput > 0 ? buyPInput / displayRate : undefined;
    const holding: Holding = {
      id: genId(),
      karat: newKarat,
      grams,
      buyPrice: buyPriceUSD,
      buyDate: newBuyDate || undefined,
    };
    const updated = [...holdings, holding];
    setHoldings(updated);
    save(updated, currency, rate);
    setNewGrams("");
    setNewBuyPrice("");
    setNewBuyDate("");
    setShowAdd(false);
    track.quickLinkClick("portfolio-add");
  }

  function removeHolding(id: string) {
    const updated = holdings.filter(h => h.id !== id);
    setHoldings(updated);
    save(updated, currency, rate);
  }

  function changeCurrency(code: string) {
    setCurrency(code);
    const cur = CURRENCIES.find(c => c.code === code);
    const newRate = cur?.fallback || 1;
    setRate(newRate);
    save(holdings, code, newRate);
    // Try to get live rate
    fetchRate();
  }

  // Calculate portfolio value
  const goldPerGramUSD = goldPriceUSD / OZ;
  const curSymbol = CURRENCIES.find(c => c.code === currency)?.symbol || "$";
  const isUSD = currency === "USD";
  const displayRate = isUSD ? 1 : rate;

  let totalValueNow = 0;
  let costedValue = 0; // live value of holdings that have a valid buy price
  let costedCost = 0;  // their cost basis, in the same currency as value
  let hasCostData = false;

  const holdingDetails = holdings.map(h => {
    const purity = KARATS.find(k => k.value === h.karat)?.purity || 1;
    const pricePerGramUSD = goldPerGramUSD * purity;
    const pricePerGram = pricePerGramUSD * displayRate;
    const value = pricePerGram * h.grams;
    totalValueNow += value;

    // buyPrice is stored as USD per gram. Guard against corrupt / legacy values
    // (e.g. saved in another currency or an old format) so the portfolio never
    // shows an impossible profit/loss — those holdings just omit P/L.
    let pnl: number | null = null;
    let cost: number | null = null;
    let buyPerGramDisplay: number | null = null;
    if (h.buyPrice && h.buyPrice > 0) {
      const plausibleLow = pricePerGramUSD * 0.2;
      const plausibleHigh = pricePerGramUSD * 5;
      if (h.buyPrice >= plausibleLow && h.buyPrice <= plausibleHigh) {
        cost = h.buyPrice * h.grams * displayRate; // same currency as value
        buyPerGramDisplay = h.buyPrice * displayRate;
        costedValue += value;
        costedCost += cost;
        hasCostData = true;
        pnl = value - cost;
      }
    }

    // Duration + annualized return (needs a valid date AND a valid cost basis;
    // annualized only after 30 days — earlier extrapolation is pure noise)
    const age = h.buyDate ? holdingAge(h.buyDate, lang === "ar") : null;
    let annualizedPct: number | null = null;
    if (age && age.days >= 30 && cost != null && cost > 0) {
      annualizedPct = (Math.pow(value / cost, 365 / age.days) - 1) * 100;
    }

    return { ...h, pricePerGram, value, pnl, cost, buyPerGramDisplay, age, annualizedPct };
  });

  const totalPnL = hasCostData ? costedValue - costedCost : null;
  const totalPnLPct = hasCostData && costedCost > 0 ? ((costedValue - costedCost) / costedCost * 100) : null;

  // Daily change
  const dailyChange = totalValueNow * (changePercent / 100);

  const decimals = displayRate > 1000 ? 0 : displayRate > 100 ? 0 : displayRate < 1 ? 3 : 2;
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: decimals });

  // Export the portfolio summary as a branded 1080×1080 PNG, drawn on a canvas
  // (no dependency, no server route). Shares to the native sheet on mobile,
  // downloads on desktop.
  async function exportImage() {
    if (exporting) return;
    setExporting(true);
    track.quickLinkClick("portfolio-export-image");
    try {
      try { await (document as unknown as { fonts?: { ready?: Promise<unknown> } }).fonts?.ready; } catch { /* noop */ }
      const S = 1080;
      const canvas = document.createElement("canvas");
      canvas.width = S; canvas.height = S;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      const gold = "#C9A84C", green = "#4ade80", red = "#f87171", muted = "#8a8a8a";
      ctx.fillStyle = "#0D0D0D"; ctx.fillRect(0, 0, S, S);
      ctx.fillStyle = gold; ctx.fillRect(0, 0, S, 8);
      ctx.direction = "rtl"; ctx.textAlign = "right";
      const R = S - 80;

      ctx.fillStyle = gold; ctx.font = "800 46px Tajawal, sans-serif";
      ctx.fillText("SARD · سعر الذهب", R, 110);
      ctx.fillStyle = muted; ctx.font = "500 30px Tajawal, sans-serif";
      ctx.fillText(new Date().toLocaleDateString(lang === "ar" ? "ar" : "en-US", { day: "numeric", month: "long", year: "numeric" }), R, 160);

      ctx.fillStyle = "#F5F5F5"; ctx.font = "800 60px Tajawal, sans-serif";
      ctx.fillText(lang === "ar" ? "💰 محفظتي الذهبية" : "💰 My Gold Portfolio", R, 300);
      ctx.fillStyle = muted; ctx.font = "500 34px Tajawal, sans-serif";
      ctx.fillText(`${holdings.length} ${lang === "ar" ? (holdings.length <= 2 ? "قطعة" : "قطع") : "items"}`, R, 350);

      ctx.fillStyle = muted; ctx.font = "500 38px Tajawal, sans-serif";
      ctx.fillText(lang === "ar" ? "إجمالي القيمة" : "Total Value", R, 470);
      ctx.fillStyle = gold; ctx.font = "800 96px Tajawal, sans-serif";
      ctx.fillText(`${curSymbol} ${fmt(totalValueNow)}`, R, 570);

      const up = changePercent >= 0;
      ctx.fillStyle = muted; ctx.font = "500 34px Tajawal, sans-serif";
      ctx.fillText(lang === "ar" ? "تغيير اليوم" : "Today", R, 680);
      ctx.fillStyle = up ? green : red; ctx.font = "700 52px Tajawal, sans-serif";
      ctx.fillText(`${up ? "▲ +" : "▼ −"}${curSymbol} ${fmt(Math.abs(dailyChange))}  (${up ? "+" : ""}${changePercent.toFixed(2)}%)`, R, 740);

      if (totalPnL !== null && totalPnLPct !== null) {
        const pUp = totalPnL >= 0;
        ctx.fillStyle = muted; ctx.font = "500 34px Tajawal, sans-serif";
        ctx.fillText(lang === "ar" ? "إجمالي الربح / الخسارة" : "Total Profit / Loss", R, 850);
        ctx.fillStyle = pUp ? green : red; ctx.font = "700 60px Tajawal, sans-serif";
        ctx.fillText(`${pUp ? "+" : "−"}${curSymbol} ${fmt(Math.abs(totalPnL))}  (${pUp ? "+" : ""}${totalPnLPct.toFixed(1)}%)`, R, 920);
      }

      ctx.fillStyle = muted; ctx.font = "500 30px Tajawal, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("sardhahab.com", S / 2, 1020);

      const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b as Blob), "image/png"));
      const file = new File([blob], "sard-portfolio.png", { type: "image/png" });
      const shareData = { files: [file], title: lang === "ar" ? "محفظتي الذهبية" : "My Gold Portfolio", text: "sardhahab.com" };
      if (typeof navigator.canShare === "function" && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob); a.download = "sard-portfolio.png"; a.click();
        URL.revokeObjectURL(a.href);
      }
    } catch { /* user cancelled share / unsupported — silent */ }
    finally { setExporting(false); }
  }

  // Empty state — show CTA to add first holding
  if (!isOpen && holdings.length === 0) {
    return (
      <section dir={dir} className="max-w-7xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
        <button
          onClick={() => { setIsOpen(true); setShowAdd(true); }}
          className="w-full bg-surface border border-border hover:border-gold/30 rounded-2xl p-5 sm:p-6 transition-all group text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-2xl">
              💰
            </div>
            <div className="text-center sm:text-start">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary group-hover:text-gold transition-colors">
                {lang === "ar" ? "تتبّع محفظتك الذهبية" : "Track Your Gold Portfolio"}
              </h2>
              <p className="text-text-secondary text-sm">
                {lang === "ar"
                  ? "أضف ذهبك وتابع قيمته لحظيا — مجانا وبدون تسجيل"
                  : "Add your gold and track its live value — free, no signup"}
              </p>
            </div>
          </div>
        </button>
      </section>
    );
  }

  return (
    <section dir={dir} className="max-w-7xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
                💰
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                  {lang === "ar" ? "محفظتي الذهبية" : "My Gold Portfolio"}
                </h2>
                <p className="text-text-secondary text-xs">
                  {holdings.length} {lang === "ar" ? (holdings.length <= 2 ? "قطعة" : "قطع") : (holdings.length === 1 ? "item" : "items")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {holdings.length > 0 && (
                <button
                  onClick={exportImage}
                  disabled={exporting}
                  title={lang === "ar" ? "مشاركة كصورة" : "Share as image"}
                  aria-label={lang === "ar" ? "مشاركة المحفظة كصورة" : "Share portfolio as image"}
                  className="bg-surface-2 border border-border hover:border-gold/40 text-text-secondary hover:text-gold rounded-xl px-3 py-2 text-sm transition-colors disabled:opacity-50"
                >
                  {exporting ? "⏳" : "📤"}
                </button>
              )}
              {/* Currency selector */}
              <select
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
                className="bg-surface-2 border border-border text-text-primary text-sm rounded-xl px-3 py-2 focus:border-gold/40 outline-none"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {lang === "ar" ? c.nameAr : c.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Portfolio summary */}
          {holdings.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Total value */}
              <div className="bg-surface-2 rounded-xl p-3">
                <p className="text-text-secondary text-xs mb-1">
                  {lang === "ar" ? "إجمالي القيمة" : "Total Value"}
                </p>
                <p className="text-xl sm:text-2xl font-black text-gold">
                  {curSymbol} {fmt(totalValueNow)}
                </p>
              </div>
              {/* Daily change */}
              <div className="bg-surface-2 rounded-xl p-3">
                <p className="text-text-secondary text-xs mb-1">
                  {lang === "ar" ? "تغيير اليوم" : "Today"}
                </p>
                <p className={`text-xl sm:text-2xl font-black ${changePercent >= 0 ? "text-rise" : "text-fall"}`}>
                  {changePercent >= 0 ? "+" : ""}{curSymbol} {fmt(Math.abs(dailyChange))}
                </p>
                <p className={`text-xs ${changePercent >= 0 ? "text-rise" : "text-fall"}`}>
                  {changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%
                </p>
              </div>
              {/* P&L (if buy prices exist) */}
              {totalPnL !== null && (
                <div className="bg-surface-2 rounded-xl p-3 col-span-2 sm:col-span-1">
                  <p className="text-text-secondary text-xs mb-1">
                    {lang === "ar" ? "الربح/الخسارة" : "Profit/Loss"}
                  </p>
                  <p className={`text-xl sm:text-2xl font-black ${totalPnL >= 0 ? "text-rise" : "text-fall"}`}>
                    {totalPnL >= 0 ? "+" : ""}{curSymbol} {fmt(Math.abs(totalPnL))}
                  </p>
                  {totalPnLPct !== null && (
                    <p className={`text-xs ${totalPnL >= 0 ? "text-rise" : "text-fall"}`}>
                      {totalPnLPct >= 0 ? "+" : ""}{totalPnLPct.toFixed(1)}%
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Holdings list */}
        {holdingDetails.length > 0 && (
          <div className="divide-y divide-border">
            {holdingDetails.map(h => (
              h.pnl !== null && h.cost !== null && h.buyPerGramDisplay !== null ? (
                /* Rich card — purchase vs current + animated P&L */
                <HoldingCard
                  key={h.id}
                  lang={lang}
                  curSymbol={curSymbol}
                  fmt={fmt}
                  karatLabel={lang === "ar" ? `عيار ${h.karat}` : KARATS_EN[h.karat]}
                  karatChip={lang === "ar" ? String(h.karat) : KARATS_EN[h.karat]}
                  grams={h.grams}
                  buyPerGram={h.buyPerGramDisplay}
                  buyDate={h.buyDate}
                  ageLabel={h.age?.label ?? null}
                  cost={h.cost}
                  pricePerGram={h.pricePerGram}
                  value={h.value}
                  pnl={h.pnl}
                  annualizedPct={h.annualizedPct}
                  onRemove={() => removeHolding(h.id)}
                />
              ) : (
                /* Compact row — no (valid) cost basis, live value only */
                <div key={h.id} className="px-4 sm:px-6 py-3 flex items-center justify-between hover:bg-surface-2/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-xs font-bold text-gold">
                      {lang === "ar" ? h.karat : KARATS_EN[h.karat]}
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-medium">
                        {h.grams}g — {lang === "ar" ? `عيار ${h.karat}` : `${KARATS_EN[h.karat]}`}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {curSymbol} {fmt(h.pricePerGram)} / {lang === "ar" ? "جرام" : "gram"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-end">
                      <p className="text-text-primary text-sm font-bold">{curSymbol} {fmt(h.value)}</p>
                    </div>
                    <button
                      onClick={() => removeHolding(h.id)}
                      className="text-text-secondary hover:text-fall text-xs p-1 transition-colors"
                      title={lang === "ar" ? "حذف" : "Remove"}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Add holding form */}
        {showAdd ? (
          <div className="p-4 sm:p-6 border-t border-border bg-surface-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Karat */}
              <div>
                <label className="text-text-secondary text-xs mb-1 block">
                  {lang === "ar" ? "العيار" : "Karat"}
                </label>
                <select
                  value={newKarat}
                  onChange={(e) => setNewKarat(Number(e.target.value) as Holding["karat"])}
                  className="w-full bg-surface border border-border text-text-primary text-sm rounded-xl px-3 py-2.5 focus:border-gold/40 outline-none"
                >
                  {KARATS.map(k => (
                    <option key={k.value} value={k.value}>
                      {lang === "ar" ? k.label : KARATS_EN[k.value]}
                    </option>
                  ))}
                </select>
              </div>
              {/* Grams */}
              <div>
                <label className="text-text-secondary text-xs mb-1 block">
                  {lang === "ar" ? "الوزن (جرام)" : "Weight (g)"}
                </label>
                <input
                  type="number"
                  value={newGrams}
                  onChange={(e) => setNewGrams(e.target.value)}
                  placeholder="50"
                  min="0.1"
                  step="0.1"
                  className="w-full bg-surface border border-border text-text-primary text-sm rounded-xl px-3 py-2.5 focus:border-gold/40 outline-none placeholder:text-text-secondary/50"
                />
              </div>
              {/* Buy price — optional, but it unlocks the profit/loss card */}
              <div>
                <label className="text-gold/90 text-xs mb-1 block">
                  {lang === "ar" ? `سعر شراء الجرام (${curSymbol})` : `Buy / gram (${curSymbol})`}
                </label>
                <input
                  type="number"
                  value={newBuyPrice}
                  onChange={(e) => setNewBuyPrice(e.target.value)}
                  placeholder={lang === "ar" ? "مثال 442" : "e.g. 442"}
                  min="0"
                  step="0.01"
                  className="w-full bg-surface border border-gold/25 text-text-primary text-sm rounded-xl px-3 py-2.5 focus:border-gold/50 outline-none placeholder:text-text-secondary/50"
                />
                <p className="text-text-secondary text-[10px] mt-1 leading-tight">
                  {lang === "ar" ? "أدخله لتظهر أرباحك تلقائيا" : "Add it to see your profit"}
                </p>
              </div>
              {/* Buy date (optional) */}
              <div>
                <label className="text-text-secondary text-xs mb-1 block">
                  {lang === "ar" ? "تاريخ الشراء (اختياري)" : "Buy date (optional)"}
                </label>
                <input
                  type="date"
                  value={newBuyDate}
                  onChange={(e) => setNewBuyDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full bg-surface border border-border text-text-primary text-sm rounded-xl px-3 py-2.5 focus:border-gold/40 outline-none [color-scheme:dark]"
                />
              </div>
              {/* Buttons */}
              <div className="flex items-end gap-2">
                <button
                  onClick={addHolding}
                  disabled={!newGrams || parseFloat(newGrams) <= 0}
                  className="flex-1 bg-gold text-background font-bold py-2.5 rounded-xl hover:bg-gold-light transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {lang === "ar" ? "أضف" : "Add"}
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-3 py-2.5 text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 border-t border-border">
            <button
              onClick={() => setShowAdd(true)}
              className="w-full bg-surface-2 hover:bg-gold/10 border border-border hover:border-gold/30 text-text-secondary hover:text-gold font-medium py-3 rounded-xl transition-all text-sm"
            >
              + {lang === "ar" ? "أضف ذهب" : "Add Gold"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Rich per-holding card: purchase vs current + animated P&L ─── */
interface HoldingCardProps {
  lang: string;
  curSymbol: string;
  fmt: (n: number) => string;
  karatLabel: string;
  karatChip: string;
  grams: number;
  buyPerGram: number;
  buyDate?: string;
  ageLabel: string | null;
  cost: number;
  pricePerGram: number;
  value: number;
  pnl: number;
  annualizedPct: number | null;
  onRemove: () => void;
}

function HoldingCard({
  lang, curSymbol, fmt, karatLabel, karatChip, grams, buyPerGram, buyDate,
  ageLabel, cost, pricePerGram, value, pnl, annualizedPct, onRemove,
}: HoldingCardProps) {
  const isAr = lang === "ar";
  const up = pnl >= 0;
  const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;

  const animPnl = useCountUp(Math.abs(pnl));
  const animPct = useCountUp(Math.abs(pnlPct));
  const animValue = useCountUp(value);

  const dateLabel = buyDate
    ? new Date(buyDate).toLocaleDateString(isAr ? "ar" : "en-US", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="px-4 sm:px-6 py-4 hover:bg-surface-2/40 transition-all hover:-translate-y-0.5 duration-200">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold/10 rounded-xl flex items-center justify-center text-xs font-bold text-gold shrink-0">
            {karatChip}
          </div>
          <div>
            <p className="text-text-primary text-sm font-bold">{grams}g — {karatLabel}</p>
            {ageLabel && <p className="text-text-secondary text-xs">{ageLabel}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`${up ? "pnl-breathe-up bg-rise/10 border-rise/30 text-rise" : "pnl-breathe-down bg-fall/10 border-fall/30 text-fall"} border rounded-full px-3.5 py-1 text-xs font-bold whitespace-nowrap`}>
            {up ? "▲ +" : "▼ −"}{animPct.toFixed(2)}%
          </div>
          <button
            onClick={onRemove}
            className="text-text-secondary hover:text-fall text-xs p-1 transition-colors"
            title={isAr ? "حذف" : "Remove"}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Purchase vs current */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        <div className="bg-surface-2 rounded-xl px-3.5 py-2.5">
          <p className="text-text-secondary text-[11px] mb-0.5">
            {isAr ? "سعر الشراء" : "Purchase"}{dateLabel ? ` · ${dateLabel}` : ""}
          </p>
          <p className="text-text-primary text-sm font-bold">
            {fmt(buyPerGram)} {curSymbol}/{isAr ? "جرام" : "g"}
          </p>
          <p className="text-text-secondary text-xs mt-0.5">
            {isAr ? "الإجمالي:" : "Total:"} {curSymbol} {fmt(cost)}
          </p>
        </div>
        <div className="bg-surface-2 rounded-xl px-3.5 py-2.5">
          <p className="text-text-secondary text-[11px] mb-0.5 flex items-center gap-1.5">
            {isAr ? "السعر الحالي · مباشر" : "Current · live"}
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rise pulse-dot" />
          </p>
          <p className="text-gold text-sm font-bold">
            {fmt(pricePerGram)} {curSymbol}/{isAr ? "جرام" : "g"}
          </p>
          <p className="text-text-secondary text-xs mt-0.5">
            {isAr ? "الإجمالي:" : "Total:"} {curSymbol} {fmt(animValue)}
          </p>
        </div>
      </div>

      {/* P&L strip */}
      <div className={`rounded-xl border px-3.5 py-2.5 flex items-center justify-between ${up ? "border-rise/20 bg-gradient-to-l from-rise/10 to-transparent" : "border-fall/20 bg-gradient-to-l from-fall/10 to-transparent"}`}>
        <div>
          <p className="text-text-secondary text-[11px] mb-0.5">{isAr ? "الربح / الخسارة" : "Profit / Loss"}</p>
          <p className={`text-lg font-black tabular-nums ${up ? "text-rise" : "text-fall"}`}>
            {up ? "+" : "−"}{curSymbol} {fmt(animPnl)}
          </p>
        </div>
        {annualizedPct !== null && (
          <div className="text-end">
            <p className="text-text-secondary text-[11px] mb-0.5">{isAr ? "العائد السنوي التقريبي" : "Annualized"}</p>
            <p className={`text-sm font-bold ${annualizedPct >= 0 ? "text-rise" : "text-fall"}`}>
              ~{annualizedPct.toFixed(1)}% {isAr ? "سنويا" : "/yr"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
