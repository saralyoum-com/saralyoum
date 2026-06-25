"use client";

import { useState } from "react";
import { useLang } from "@/components/LanguageContext";
import {
  OZ,
  karatGramPrices,
  buySellPrices,
  bullionPrices,
  getMarket,
} from "@/lib/goldDetails";
import type { GoldDay } from "@/lib/goldHistory";

interface Props {
  code: string;
  goldPriceUSD: number;
  rate: number;
  currency: string;
  currencyAr: string;
  currencyEn: string;
  nameAr: string;
  nameEn: string;
  history: GoldDay[];
}

export default function GoldPriceTables({
  code, goldPriceUSD, rate, currency, currencyAr, currencyEn, nameAr, nameEn, history,
}: Props) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const dir = ar ? "rtl" : "ltr";
  const [showAllBullion, setShowAllBullion] = useState(false);

  const market = getMarket(code);
  const spot = karatGramPrices(goldPriceUSD, rate);
  const buySell = buySellPrices(goldPriceUSD, rate, market);
  const bullion = bullionPrices(goldPriceUSD, rate);

  const dec = rate > 1000 ? 0 : rate > 100 ? 1 : rate < 1 ? 3 : 2;
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: dec });
  const fmtUsd = (n: number) =>
    "$" + n.toLocaleString("en-US", { maximumFractionDigits: n >= 1000 ? 0 : 2 });
  const vatPct = Math.round(market.vat * 100);

  const histRows = history.map((d) => {
    const g24 = (d.usdPerOz / OZ) * rate;
    return {
      date: d.date.slice(5),
      k24: g24, k22: g24 * (22 / 24), k21: g24 * (21 / 24), k18: g24 * (18 / 24),
    };
  });

  const Header = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-gold/10 text-gold font-bold text-sm px-4 py-2.5">{children}</div>
  );

  return (
    <div dir={dir} className="space-y-4 mt-4">

      {/* ── SPOT (raw gram per karat) ── */}
      <section className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Header>{ar ? "سعر جرام الذهب اليوم (السعر الخام)" : "Gold gram price today (spot)"}</Header>
        <div className="overflow-x-auto">
          <div className="min-w-[320px]">
            <div className="flex text-xs text-text-secondary px-4 py-2 border-b border-border">
              <span className="flex-[1.2]">{ar ? "العيار" : "Karat"}</span>
              <span className="flex-1 text-center">{currency}</span>
              <span className="flex-1 text-end">USD</span>
            </div>
            {spot.map((r, i) => (
              <div key={r.karat} className={`flex items-center px-4 py-2.5 text-sm ${i % 2 ? "bg-surface-2" : ""}`}>
                <span className={`flex-[1.2] ${r.karat === 21 ? "text-gold font-bold" : "text-text-primary"}`}>
                  {ar ? `عيار ${r.karat}` : `${r.karat}K`}{r.karat === 21 ? " ★" : ""}
                </span>
                <span className="flex-1 text-center text-gold font-bold">{fmt(r.local)}</span>
                <span className="flex-1 text-end text-text-secondary">{fmtUsd(r.usd)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUY / SELL ── */}
      <section className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Header>{ar ? "أسعار البيع والشراء في المحلات" : "Shop buy / sell prices"}</Header>
        <div className="overflow-x-auto">
          <div className="min-w-[320px]">
            <div className="flex text-xs text-text-secondary px-4 py-2 border-b border-border">
              <span className="flex-1">{ar ? "العيار" : "Karat"}</span>
              <span className="flex-[1.2] text-center">{ar ? "شراء جديد" : "Buy (new)"}</span>
              <span className="flex-[1.2] text-end">{ar ? "بيع مستعمل" : "Sell (used)"}</span>
            </div>
            {buySell.map((r, i) => (
              <div key={r.karat} className={`flex items-center px-4 py-2.5 text-sm ${i % 2 ? "bg-surface-2" : ""}`}>
                <span className={`flex-1 ${r.karat === 21 ? "text-gold font-bold" : "text-text-primary"}`}>
                  {ar ? `عيار ${r.karat}` : `${r.karat}K`}{r.karat === 21 ? " ★" : ""}
                </span>
                <span className="flex-[1.2] text-center text-text-primary font-medium">{fmt(r.newBuy)}</span>
                <span className="flex-[1.2] text-end text-text-secondary">{fmt(r.usedSell)}</span>
              </div>
            ))}
            <p className="text-[11px] text-text-secondary px-4 py-2 border-t border-border leading-relaxed">
              {ar
                ? `"شراء جديد" يشمل المصنعية · تُضاف ضريبة ${vatPct}% · "بيع مستعمل" ما يدفعه المحل لك · بالـ${currencyAr} · تقديري`
                : `"Buy" includes making charge · +${vatPct}% VAT · "Sell" is the shop buy-back · in ${currencyEn} · estimated`}
            </p>
          </div>
        </div>
      </section>

      {/* ── BULLION (سبائك) ── */}
      <section className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Header>{ar ? "أسعار سبائك الذهب (عيار 24 · 999.9)" : "Gold bullion prices (24K · 999.9)"}</Header>
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
                className={`flex items-center px-4 py-2.5 text-sm ${i % 2 ? "bg-surface-2" : ""} ${i >= 7 && !showAllBullion ? "hidden" : ""}`}
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
            onClick={() => setShowAllBullion((v) => !v)}
            className="w-full text-gold text-sm font-bold py-2.5 border-t border-border hover:bg-gold/5 transition-colors"
          >
            {showAllBullion ? (ar ? "عرض أقل ▲" : "Show less ▲") : (ar ? "عرض كل الأحجام ▼" : "Show all sizes ▼")}
          </button>
        )}
      </section>

      {/* ── 7-DAY HISTORY ── */}
      {histRows.length > 1 && (
        <section className="bg-surface border border-border rounded-2xl overflow-hidden">
          <Header>{ar ? `أسعار الأيام السابقة (جرام · ${currencyAr})` : `Previous days (gram · ${currency})`}</Header>
          <div className="overflow-x-auto">
            <div className="min-w-[360px]">
              <div className="flex text-xs text-text-secondary px-3 py-2 border-b border-border">
                <span className="flex-[1.4]">{ar ? "التاريخ" : "Date"}</span>
                <span className="flex-1 text-center">24</span>
                <span className="flex-1 text-center">22</span>
                <span className="flex-1 text-center">21</span>
                <span className="flex-1 text-center">18</span>
              </div>
              {histRows.map((d, i) => (
                <div key={d.date} className={`flex items-center px-3 py-2 text-xs ${i % 2 ? "bg-surface-2" : ""}`}>
                  <span className="flex-[1.4] text-text-secondary">{d.date}</span>
                  <span className={`flex-1 text-center ${i === 0 ? "text-gold font-bold" : "text-text-primary"}`}>{fmt(d.k24)}</span>
                  <span className="flex-1 text-center text-text-primary">{fmt(d.k22)}</span>
                  <span className="flex-1 text-center text-text-primary">{fmt(d.k21)}</span>
                  <span className="flex-1 text-center text-text-primary">{fmt(d.k18)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <p className="text-[11px] text-text-secondary text-center px-3">
        {ar
          ? `المحتوى لأغراض إعلامية · ليس نصيحة استثمارية · الأسعار في ${nameAr} تقديرية وتختلف حسب المحل`
          : `Informational only · not investment advice · prices in ${nameEn} are estimates and vary by shop`}
      </p>
    </div>
  );
}
