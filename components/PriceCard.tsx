"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PriceData, TechnicalSignal } from "@/types";
import { formatPercent } from "@/lib/format";

interface Props {
  data: PriceData;
  signal?: TechnicalSignal;
  index?: number;
  localRate?: number;
  localSymbol?: string;
}

const assetIcons: Record<string, string> = {
  XAU: "🥇",
  XAG: "🥈",
  BTC: "₿",
  ETH: "⟠",
};

// أسعار العيارات بالجرام من سعر الأونصة
function getKaratPrices(pricePerOz: number) {
  const pricePerGram = pricePerOz / 31.1035;
  return [
    { karat: 24, label: "عيار 24", purity: 1 },
    { karat: 22, label: "عيار 22", purity: 22 / 24 },
    { karat: 21, label: "عيار 21", purity: 21 / 24 },
    { karat: 18, label: "عيار 18", purity: 18 / 24 },
  ].map((k) => ({ ...k, price: pricePerGram * k.purity }));
}

export default function PriceCard({ data, signal, index = 0, localRate = 1, localSymbol = "$" }: Props) {
  const [showKarats, setShowKarats] = useState(false);
  const isPositive = data.changePercent >= 0;
  const isGold = data.symbol === "XAU";

  const priceDisplay =
    data.symbol === "BTC"
      ? `$${data.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
      : `$${data.price.toFixed(2)}`;

  const signalColor =
    signal?.signal === "شراء"
      ? "text-rise border-rise/30 bg-rise/10"
      : signal?.signal === "بيع"
      ? "text-fall border-fall/30 bg-fall/10"
      : "text-text-secondary border-border bg-surface-2";

  const karats = isGold ? getKaratPrices(data.price) : [];
  const showLocalPrice = localRate !== 1 && localSymbol !== "$";

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
            isPositive ? "bg-rise/10 text-rise" : "bg-fall/10 text-fall"
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
        {showLocalPrice && (
          <div className="text-sm text-gold/80 mt-0.5">
            ≈ {(data.price * localRate).toLocaleString("en-US", { maximumFractionDigits: 0 })} {localSymbol}
          </div>
        )}
        <div className={`text-sm mt-1 ${isPositive ? "text-rise" : "text-fall"}`}>
          {isPositive ? "+" : ""}
          {data.change.toFixed(2)} USD
        </div>
      </div>

      {/* حد أعلى / أدنى */}
      {(data.high24h || data.low24h) && (
        <div className="flex justify-between text-xs text-text-secondary border-t border-border pt-3 mb-3">
          <span>أعلى: <span className="text-rise">${data.high24h?.toFixed(2)}</span></span>
          <span>أدنى: <span className="text-fall">${data.low24h?.toFixed(2)}</span></span>
        </div>
      )}

      {/* زر العيارات — للذهب فقط */}
      {isGold && (
        <div className="mb-3">
          <button
            onClick={() => setShowKarats(!showKarats)}
            className="w-full flex items-center justify-between text-xs text-gold border border-gold/20 rounded-xl px-3 py-2 hover:bg-gold/5 transition-all"
          >
            <span>🏅 عرض أسعار العيارات</span>
            <span>{showKarats ? "▲" : "▼"}</span>
          </button>

          <AnimatePresence>
            {showKarats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {karats.map((k) => (
                    <div key={k.karat} className="bg-surface-2 rounded-xl p-2.5 text-center">
                      <div className="text-text-secondary text-xs mb-1">{k.label}</div>
                      <div className="text-text-primary font-bold text-sm">
                        ${k.price.toFixed(2)}
                      </div>
                      {showLocalPrice && (
                        <div className="text-gold/70 text-xs mt-0.5">
                          {(k.price * localRate).toFixed(0)} {localSymbol}
                        </div>
                      )}
                      <div className="text-text-secondary text-xs">/ جرام</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
          <div className="text-text-secondary mt-1">إشارة تقنية — ليست نصيحة استثمارية</div>
        </div>
      )}
    </motion.div>
  );
}
