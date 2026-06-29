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
  { code: "SYP", symbol: "ل.س", nameAr: "ليرة سورية", nameEn: "SYP", fallback: 13000 },
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

  // Add form state
  const [newKarat, setNewKarat] = useState<Holding["karat"]>(21);
  const [newGrams, setNewGrams] = useState("");
  const [newBuyPrice, setNewBuyPrice] = useState("");

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
    };
    const updated = [...holdings, holding];
    setHoldings(updated);
    save(updated, currency, rate);
    setNewGrams("");
    setNewBuyPrice("");
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
    if (h.buyPrice && h.buyPrice > 0) {
      const plausibleLow = pricePerGramUSD * 0.2;
      const plausibleHigh = pricePerGramUSD * 5;
      if (h.buyPrice >= plausibleLow && h.buyPrice <= plausibleHigh) {
        const cost = h.buyPrice * h.grams * displayRate; // same currency as value
        costedValue += value;
        costedCost += cost;
        hasCostData = true;
        pnl = value - cost;
      }
    }

    return { ...h, pricePerGram, value, pnl };
  });

  const totalPnL = hasCostData ? costedValue - costedCost : null;
  const totalPnLPct = hasCostData && costedCost > 0 ? ((costedValue - costedCost) / costedCost * 100) : null;

  // Daily change
  const dailyChange = totalValueNow * (changePercent / 100);

  const decimals = displayRate > 1000 ? 0 : displayRate > 100 ? 0 : displayRate < 1 ? 3 : 2;
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: decimals });

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
                  ? "أضف ذهبك وتابع قيمته لحظياً — مجاناً وبدون تسجيل"
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
              <div key={h.id} className="px-4 sm:px-6 py-3 flex items-center justify-between">
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
                    {h.pnl !== null && (
                      <p className={`text-xs ${h.pnl >= 0 ? "text-rise" : "text-fall"}`}>
                        {h.pnl >= 0 ? "+" : ""}{curSymbol} {fmt(Math.abs(h.pnl))}
                      </p>
                    )}
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
            ))}
          </div>
        )}

        {/* Add holding form */}
        {showAdd ? (
          <div className="p-4 sm:p-6 border-t border-border bg-surface-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              {/* Buy price (optional) */}
              <div>
                <label className="text-text-secondary text-xs mb-1 block">
                  {lang === "ar" ? `سعر شراء الجرام (${curSymbol})` : `Buy / gram (${curSymbol})`}
                </label>
                <input
                  type="number"
                  value={newBuyPrice}
                  onChange={(e) => setNewBuyPrice(e.target.value)}
                  placeholder={lang === "ar" ? "للجرام · اختياري" : "per gram · optional"}
                  min="0"
                  step="0.01"
                  className="w-full bg-surface border border-border text-text-primary text-sm rounded-xl px-3 py-2.5 focus:border-gold/40 outline-none placeholder:text-text-secondary/50"
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
