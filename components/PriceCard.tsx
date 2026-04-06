"use client";

import { motion } from "framer-motion";
import { PriceData, TechnicalSignal } from "@/types";
import { formatPercent } from "@/lib/format";

interface Props {
  data: PriceData;
  signal?: TechnicalSignal;
  index?: number;
}

const assetIcons: Record<string, string> = {
  XAU: "🥇",
  XAG: "🥈",
  BTC: "₿",
  ETH: "⟠",
};

export default function PriceCard({ data, signal, index = 0 }: Props) {
  const isPositive = data.changePercent >= 0;

  const priceDisplay =
    data.symbol === "BTC"
      ? `$${data.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
      : data.symbol === "ETH"
      ? `$${data.price.toFixed(2)}`
      : `$${data.price.toFixed(2)}`;

  const signalColor =
    signal?.signal === "شراء"
      ? "text-rise border-rise/30 bg-rise/10"
      : signal?.signal === "بيع"
      ? "text-fall border-fall/30 bg-fall/10"
      : "text-text-secondary border-border bg-surface-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      dir="rtl"
      className="bg-surface border border-border rounded-2xl p-5 hover:border-gold/40 transition-all duration-300 group"
    >
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{assetIcons[data.symbol] || "💰"}</span>
          <div>
            <h3 className="text-text-primary font-bold text-base">{data.nameAr}</h3>
            <span className="text-text-secondary text-xs">{data.symbol}</span>
          </div>
        </div>
        <div
          className={`text-sm font-bold px-2 py-1 rounded-lg ${
            isPositive
              ? "bg-rise/10 text-rise"
              : "bg-fall/10 text-fall"
          }`}
        >
          {isPositive ? "▲" : "▼"} {formatPercent(Math.abs(data.changePercent))}
        </div>
      </div>

      {/* السعر */}
      <div className="mb-3">
        <div className="text-2xl font-bold text-text-primary group-hover:text-gold transition-colors">
          {priceDisplay}
        </div>
        <div
          className={`text-sm mt-1 ${
            isPositive ? "text-rise" : "text-fall"
          }`}
        >
          {isPositive ? "+" : ""}
          {data.change.toFixed(2)} USD
        </div>
      </div>

      {/* حد أعلى / أدنى */}
      {(data.high24h || data.low24h) && (
        <div className="flex justify-between text-xs text-text-secondary border-t border-border pt-3 mb-3">
          <span>
            أعلى: <span className="text-rise">${data.high24h?.toFixed(2)}</span>
          </span>
          <span>
            أدنى: <span className="text-fall">${data.low24h?.toFixed(2)}</span>
          </span>
        </div>
      )}

      {/* الإشارة التقنية */}
      {signal && (
        <div className={`border rounded-xl px-3 py-2 text-xs ${signalColor}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold">
              {signal.signal === "شراء" ? "📈" : signal.signal === "بيع" ? "📉" : "➡️"}{" "}
              {signal.signal === "شراء" ? "ضغط شرائي" : signal.signal === "بيع" ? "ضغط بيعي" : "محايد"}
            </span>
            <span>RSI: {signal.rsi.toFixed(1)}</span>
          </div>
          <div className="text-text-secondary mt-1">
            إشارة تقنية — ليست نصيحة استثمارية
          </div>
        </div>
      )}
    </motion.div>
  );
}
