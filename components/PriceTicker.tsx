"use client";

import { PriceData } from "@/types";
import { formatPercent } from "@/lib/format";
import { useLang } from "@/components/LanguageContext";

interface Props {
  prices: PriceData[];
}

export default function PriceTicker({ prices }: Props) {
  const items = [...prices, ...prices]; // تضاعف للحلقة اللانهائية
  const { lang } = useLang();

  return (
    <div
      dir="rtl"
      className="bg-surface border-b border-border overflow-hidden w-full h-10"
    >
      <div className="flex items-center h-full">
        <div className="bg-gold text-background font-bold px-3 sm:px-4 h-full flex items-center text-xs sm:text-sm whitespace-nowrap z-10 shrink-0">
          🔴 {lang === "ar" ? "مباشر" : "LIVE"}
        </div>
        <div className="overflow-hidden flex-1 relative">
          <div className="flex animate-ticker whitespace-nowrap">
            {items.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 text-xs sm:text-sm">
                <span className="text-text-secondary hidden xs:inline">
                  {lang === "ar" ? item.nameAr : item.symbol}
                </span>
                <span className="text-text-secondary xs:hidden">{item.symbol}</span>
                <span className="text-text-primary font-bold">
                  {item.symbol === "BTC" || item.symbol === "ETH"
                    ? `$${item.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                    : `$${item.price.toFixed(2)}`}
                </span>
                <span
                  className={`text-xs ${
                    item.changePercent >= 0 ? "text-rise" : "text-fall"
                  }`}
                >
                  {formatPercent(item.changePercent)}
                </span>
                <span className="text-border mx-1 sm:mx-2">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
