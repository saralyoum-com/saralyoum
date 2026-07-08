"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

// Compact "your portfolio" chip shown high on the home page (right under the
// jump-nav chips) so returning users with saved gold don't have to scroll ~6
// screens to see it. Reads the same localStorage schema PortfolioTracker
// writes ("gold_portfolio") — read-only summary here, full editing stays in
// PortfolioTracker further down the page (this chip links to #portfolio).

const OZ = 31.1035;
const KARAT_PURITY: Record<number, number> = { 24: 1, 22: 22 / 24, 21: 21 / 24, 18: 18 / 24, 14: 14 / 24 };

interface Holding { karat: number; grams: number }
interface PortfolioData { holdings: Holding[]; currency: string; rate: number }

interface Props {
  goldPriceUSD: number;
  changePercent: number;
}

export default function PortfolioSummaryChip({ goldPriceUSD, changePercent }: Props) {
  const { lang } = useLang();
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [symbol, setSymbol] = useState("$");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gold_portfolio");
      if (!raw) return;
      const data: PortfolioData = JSON.parse(raw);
      if (!data.holdings || data.holdings.length === 0) return;

      const rate = data.currency === "USD" ? 1 : data.rate || 1;
      const goldPerGramUSD = goldPriceUSD / OZ;
      const value = data.holdings.reduce((sum, h) => {
        const purity = KARAT_PURITY[h.karat] ?? 1;
        return sum + goldPerGramUSD * purity * rate * h.grams;
      }, 0);

      setTotalValue(value);
      setSymbol(data.currency === "USD" ? "$" : data.currency);
    } catch {
      /* noop */
    }
  }, [goldPriceUSD]);

  if (totalValue == null) return null;

  const isUp = changePercent >= 0;
  const decimals = totalValue > 1000 ? 0 : 2;

  return (
    <a
      href="#portfolio"
      onClick={() => track.quickLinkClick("portfolio-summary-chip")}
      className="flex items-center justify-between gap-3 bg-surface border border-gold/20 hover:border-gold/40 rounded-xl px-4 py-3 mb-4 transition-colors"
    >
      <span className="text-sm text-text-secondary">
        💰 {lang === "ar" ? "محفظتك الذهبية" : "Your gold portfolio"}
      </span>
      <span className="flex items-center gap-2 font-bold text-sm sm:text-base">
        <span className="text-text-primary">
          {symbol} {totalValue.toLocaleString("en-US", { maximumFractionDigits: decimals })}
        </span>
        <span className={isUp ? "text-rise" : "text-fall"}>
          {isUp ? "▲" : "▼"} {Math.abs(changePercent).toFixed(1)}%
        </span>
      </span>
    </a>
  );
}
