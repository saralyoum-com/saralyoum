"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PriceData, TechnicalSignal } from "@/types";
import { track } from "@/lib/analytics";
import CurrencySymbol from "@/components/CurrencySymbol";
import { subscribeToPush } from "@/components/PushNotifications";

interface Props {
  data: PriceData;
  signal?: TechnicalSignal;
  index?: number;
  localRate?: number;
  localSymbol?: string;
  localCode?: string;
  lang?: string;
}

const assetIcons: Record<string, string> = {
  BTC: "₿",
  ETH: "⟠",
};

// Gold/silver get a clean metal disc (Au/Ag) instead of a medal emoji
const metalDisc: Record<string, { sym: string; bg: string }> = {
  XAU: { sym: "Au", bg: "#C9A84C" },
  XAG: { sym: "Ag", bg: "#C0C0C0" },
};

const assetNamesEn: Record<string, string> = {
  XAU: "Gold",
  XAG: "Silver",
  BTC: "Bitcoin",
  ETH: "Ethereum",
};

// أسعار العيارات بالجرام من سعر الأونصة
function getKaratPrices(pricePerOz: number, lang: string) {
  const pricePerGram = pricePerOz / 31.1035;
  return [
    { karat: 24, label: lang === "ar" ? "عيار 24" : "24K", purity: 1 },
    { karat: 22, label: lang === "ar" ? "عيار 22" : "22K", purity: 22 / 24 },
    { karat: 21, label: lang === "ar" ? "عيار 21" : "21K", purity: 21 / 24 },
    { karat: 18, label: lang === "ar" ? "عيار 18" : "18K", purity: 18 / 24 },
  ].map((k) => ({ ...k, price: pricePerGram * k.purity }));
}

export default function PriceCard({
  data,
  signal,
  index = 0,
  localRate = 1,
  localSymbol = "$",
  localCode = "USD",
  lang = "ar",
}: Props) {
  const [showKarats, setShowKarats] = useState(false);
  const [pushState, setPushState] = useState<"idle" | "loading" | "subscribed">("idle");
  const isPositive = data.changePercent >= 0;
  const isGold = data.symbol === "XAU";

  async function handleBellClick() {
    if (pushState !== "idle") return;
    setPushState("loading");
    track.quickLinkClick("price-card-bell");
    const ok = await subscribeToPush();
    setPushState(ok ? "subscribed" : "idle");
  }

  const isBTC = data.symbol === "BTC";
  const usdPriceNum = isBTC
    ? data.price.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : data.price.toFixed(2);

  const signalColor =
    signal?.signal === "صاعد"
      ? "text-rise border-rise/30 bg-rise/10"
      : signal?.signal === "هابط"
      ? "text-fall border-fall/30 bg-fall/10"
      : "text-text-secondary border-border bg-surface-2";

  const karats = isGold ? getKaratPrices(data.price, lang) : [];
  const showLocalPrice = localRate !== 1 && localSymbol !== "$";

  // Local currency big number formatting
  const localPriceValue = data.price * localRate;
  // Use fewer decimals for high-rate currencies (LBP, IQD, etc.)
  const localDecimals = localRate > 1000 ? 0 : localRate > 100 ? 0 : localRate < 1 ? 2 : 0;
  const localPriceNum = localPriceValue.toLocaleString("en-US", { maximumFractionDigits: localDecimals });
  const localChangeValue = data.change * localRate;
  const localChangeNum = Math.abs(localChangeValue).toLocaleString("en-US", { maximumFractionDigits: localDecimals });

  function handleKaratToggle() {
    if (!showKarats) track.viewKaratsOpen(data.symbol);
    else track.viewKaratsClose(data.symbol);
    setShowKarats(!showKarats);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="bg-surface border border-border rounded-2xl p-4 sm:p-5 hover:border-gold/40 transition-all duration-300 group"
    >
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {metalDisc[data.symbol] ? (
            <span
              className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-bold shrink-0"
              style={{ background: metalDisc[data.symbol].bg, color: "#0A0A0C" }}
            >
              {metalDisc[data.symbol].sym}
            </span>
          ) : (
            <span className="text-xl sm:text-2xl">{assetIcons[data.symbol] || "💰"}</span>
          )}
          <div>
            <h3 className="text-text-primary font-bold text-sm sm:text-base">{lang === "ar" ? data.nameAr : (assetNamesEn[data.symbol] ?? data.nameAr)}</h3>
            <span className="text-text-secondary text-xs">{data.symbol}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isGold && (
            <button
              type="button"
              onClick={handleBellClick}
              disabled={pushState !== "idle"}
              aria-label={lang === "ar" ? "نبهني عند تحرك السعر" : "Notify me on price moves"}
              title={lang === "ar" ? "نبهني عند تحرك السعر" : "Notify me on price moves"}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm transition-colors shrink-0 ${
                pushState === "subscribed"
                  ? "bg-rise/10 text-rise"
                  : "bg-surface-2 text-text-secondary hover:text-gold hover:bg-gold/10"
              }`}
            >
              {pushState === "subscribed" ? "✅" : pushState === "loading" ? "…" : "🔔"}
            </button>
          )}
          <div
            className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-lg ${
              isPositive ? "bg-rise/10 text-rise" : "bg-fall/10 text-fall"
            }`}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(data.changePercent).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* السعر */}
      <div className="mb-3">
        {showLocalPrice ? (
          <>
            {/* Local currency — BIG headline */}
            <div className="text-xl sm:text-2xl font-bold text-text-primary group-hover:text-gold transition-colors flex items-center gap-1.5 flex-wrap">
              <span>{localPriceNum}</span>
              <CurrencySymbol currency={localCode} size="md" className="text-gold/80" />
            </div>
            {/* USD — small reference */}
            <div className="text-xs text-text-secondary mt-1 flex items-center gap-1">
              <span>≈ {usdPriceNum}</span>
              <CurrencySymbol currency="USD" size="sm" />
            </div>
            {/* Change in local currency */}
            <div className={`text-sm mt-1 flex items-center gap-1 ${isPositive ? "text-rise" : "text-fall"}`}>
              <span>{isPositive ? "+" : "-"}{localChangeNum}</span>
              <CurrencySymbol currency={localCode} size="sm" />
            </div>
          </>
        ) : (
          <>
            {/* USD mode — original layout */}
            <div className="text-xl sm:text-2xl font-bold text-text-primary group-hover:text-gold transition-colors flex items-center gap-1.5">
              <span>{usdPriceNum}</span>
              <CurrencySymbol currency="USD" size="md" className="text-gold/80" />
            </div>
            <div className={`text-sm mt-1 flex items-center gap-1 ${isPositive ? "text-rise" : "text-fall"}`}>
              <span>{isPositive ? "+" : ""}{data.change.toFixed(2)}</span>
              <CurrencySymbol currency="USD" size="sm" />
            </div>
          </>
        )}
      </div>

      {/* حد أعلى / أدنى */}
      {(data.high24h || data.low24h) && (
        <div className="flex justify-between text-xs text-text-secondary border-t border-border pt-3 mb-3">
          <span>{lang === "ar" ? "أعلى:" : "High:"} <span className="text-rise">${data.high24h?.toFixed(2)}</span></span>
          <span>{lang === "ar" ? "أدنى:" : "Low:"} <span className="text-fall">${data.low24h?.toFixed(2)}</span></span>
        </div>
      )}

      {/* زر العيارات — للذهب فقط */}
      {isGold && (
        <div className="mb-3">
          <button
            onClick={handleKaratToggle}
            className="w-full flex items-center justify-between text-xs text-gold border border-gold/20 rounded-xl px-3 py-2 hover:bg-gold/5 transition-all"
          >
            <span>🏅 {lang === "ar" ? "عرض أسعار العيارات" : "Show karat prices"}</span>
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
                    <div key={k.karat} className="bg-surface-2 rounded-xl p-2 sm:p-2.5 text-center">
                      <div className="text-text-secondary text-xs mb-1">{k.label}</div>
                      {showLocalPrice ? (
                        <>
                          <div className="text-text-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1">
                            <span>
                              {(k.price * localRate).toLocaleString("en-US", { maximumFractionDigits: localDecimals })}
                            </span>
                            <CurrencySymbol currency={localCode} size="sm" />
                          </div>
                          <div className="text-text-secondary text-xs mt-0.5 flex items-center justify-center gap-0.5">
                            <span>≈ {k.price.toFixed(2)}</span>
                            <CurrencySymbol currency="USD" size="sm" />
                          </div>
                        </>
                      ) : (
                        <div className="text-text-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1">
                          <span>{k.price.toFixed(2)}</span>
                          <CurrencySymbol currency="USD" size="sm" />
                        </div>
                      )}
                      <div className="text-text-secondary text-xs">
                        {lang === "ar" ? "/ جرام" : "/ gram"}
                      </div>
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
              {signal.signal === "صاعد" ? "📈" : signal.signal === "هابط" ? "📉" : "➡️"}{" "}
              {signal.signal === "صاعد"
                ? lang === "ar" ? "زخم صاعد" : "Bullish Momentum"
                : signal.signal === "هابط"
                ? lang === "ar" ? "زخم هابط" : "Bearish Momentum"
                : lang === "ar" ? "محايد" : "Neutral"}
            </span>
            <span>RSI: {signal.rsi.toFixed(1)}</span>
          </div>
          <div className="text-text-secondary mt-1">
            {lang === "ar" ? "إشارة تقنية — ليست نصيحة استثمارية" : "Technical signal — not investment advice"}
          </div>
        </div>
      )}
    </motion.div>
  );
}
