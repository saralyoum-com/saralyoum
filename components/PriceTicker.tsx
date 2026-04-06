"use client";

import { PriceData } from "@/types";
import { formatPercent } from "@/lib/format";

interface Props {
  prices: PriceData[];
}

export default function PriceTicker({ prices }: Props) {
  const items = [...prices, ...prices]; // تضاعف للحلقة اللانهائية

  return (
    <div
      dir="rtl"
      className="bg-surface border-b border-border overflow-hidden w-full"
      style={{ height: "40px" }}
    >
      <div className="flex items-center h-full">
        <div className="bg-gold text-background font-bold px-4 h-full flex items-center text-sm whitespace-nowrap z-10 shrink-0">
          🔴 مباشر
        </div>
        <div className="overflow-hidden flex-1 relative">
          <div className="flex animate-ticker whitespace-nowrap">
            {items.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 px-6 text-sm">
                <span className="text-text-secondary">{item.nameAr}</span>
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
                <span className="text-border mx-2">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
