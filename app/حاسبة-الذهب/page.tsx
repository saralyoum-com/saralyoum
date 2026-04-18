"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocation } from "@/components/LocalCurrency";
import { useLang } from "@/components/LanguageContext";
import Disclaimer from "@/components/Disclaimer";
import AdSlot from "@/components/AdSlot";
import { motion } from "framer-motion";
import { track } from "@/lib/analytics";

const KARATS = [
  { value: 24, labelAr: "عيار 24", labelEn: "24K", purity: 1 },
  { value: 22, labelAr: "عيار 22", labelEn: "22K", purity: 22 / 24 },
  { value: 21, labelAr: "عيار 21", labelEn: "21K", purity: 21 / 24 },
  { value: 18, labelAr: "عيار 18", labelEn: "18K", purity: 18 / 24 },
];

// Nisab: 85g of pure gold (24K)
const NISAB_GRAMS = 85;

export default function GoldCalculatorPage() {
  const loc = useLocation();
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [goldPricePerOz, setGoldPricePerOz] = useState(0);
  const [loadingPrice, setLoadingPrice] = useState(true);

  // Gold value calculator
  const [weight, setWeight] = useState("");
  const [karat, setKarat] = useState(21);

  // Zakat calculator
  const [goldWeightZakat, setGoldWeightZakat] = useState("");
  const [karatZakat, setKaratZakat] = useState(21);
  const [savings, setSavings] = useState("");

  useEffect(() => {
    fetch("/api/prices?type=metals")
      .then((r) => r.json())
      .then((d) => {
        setGoldPricePerOz(d.gold?.price || 3200);
        setLoadingPrice(false);
      })
      .catch(() => {
        setGoldPricePerOz(3200);
        setLoadingPrice(false);
      });
  }, []);

  const pricePerGram24k = goldPricePerOz / 31.1035;

  // Gold value calculation
  const selectedKarat = KARATS.find((k) => k.value === karat)!;
  const pricePerGramSelected = pricePerGram24k * selectedKarat.purity;
  const totalUSD = weight ? parseFloat(weight) * pricePerGramSelected : 0;
  const totalLocal = totalUSD * loc.rate;

  // Zakat calculation
  const selectedKaratZakat = KARATS.find((k) => k.value === karatZakat)!;
  const goldGramsAs24k = goldWeightZakat
    ? parseFloat(goldWeightZakat) * selectedKaratZakat.purity
    : 0;
  const nisabValueUSD = NISAB_GRAMS * pricePerGram24k;
  const goldValueUSD = goldGramsAs24k * pricePerGram24k;
  const savingsUSD = savings ? parseFloat(savings) : 0;
  const totalWealthUSD = goldValueUSD + savingsUSD;
  const reachedNisab = totalWealthUSD >= nisabValueUSD;
  const zakatDueUSD = reachedNisab ? totalWealthUSD * 0.025 : 0;
  const zakatDueLocal = zakatDueUSD * loc.rate;

  // Live karat price table
  const karatTable = KARATS.map((k) => ({
    ...k,
    pricePerGram: pricePerGram24k * k.purity,
  }));

  // Profit/Loss calculator
  const [plWeight, setPlWeight] = useState("");
  const [plKarat, setPlKarat] = useState(21);
  const [plBuyPrice, setPlBuyPrice] = useState("");
  const plKaratData = KARATS.find((k) => k.value === plKarat)!;
  const plCurrentPricePerGram = pricePerGram24k * plKaratData.purity;
  const plWeightNum = parseFloat(plWeight) || 0;
  const plBuyNum = parseFloat(plBuyPrice) || 0;
  const plCurrentValue = plWeightNum * plCurrentPricePerGram;
  const plBuyValue = plWeightNum * plBuyNum;
  const plProfit = plCurrentValue - plBuyValue;
  const plProfitPct = plBuyValue > 0 ? (plProfit / plBuyValue) * 100 : 0;
  const plProfitLocal = plProfit * loc.rate;
  const plCurrentValueLocal = plCurrentValue * loc.rate;

  return (
    <div dir={dir} className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary mb-2">
          {lang === "ar" ? "🧮 حاسبة الذهب" : "🧮 Gold Calculator"}
        </h1>
        <p className="text-text-secondary text-sm sm:text-base">
          {lang === "ar"
            ? "احسب قيمة ذهبك وزكاتك بدقة"
            : "Calculate your gold value and zakat accurately"}
        </p>
        {!loadingPrice && (
          <p className="text-xs text-gold mt-1">
            {lang === "ar"
              ? `سعر الأونصة الحالي: $${goldPricePerOz.toFixed(2)} — ${pricePerGram24k.toFixed(2)}$/جرام (24K)`
              : `Current oz price: $${goldPricePerOz.toFixed(2)} — $${pricePerGram24k.toFixed(2)}/gram (24K)`}
          </p>
        )}
      </div>

      <AdSlot size="leaderboard" slot="4567890123" className="mb-6" />
      <AdSlot size="mobile-banner" slot="4567890124" className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gold Price Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-text-primary mb-5 flex items-center gap-2">
            {lang === "ar" ? "🥇 حاسبة سعر الذهب" : "🥇 Gold Price Calculator"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm mb-2">
                {lang === "ar" ? "الوزن (جرام)" : "Weight (grams)"}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => { setWeight(e.target.value); if (e.target.value) track.calcWeightInput(parseFloat(e.target.value)); }}
                placeholder={lang === "ar" ? "مثال: 10" : "e.g. 10"}
                dir="ltr"
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm mb-2">
                {lang === "ar" ? "العيار" : "Karat"}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {KARATS.map((k) => (
                  <button
                    key={k.value}
                    onClick={() => { setKarat(k.value); track.calcKaratSelect(k.value); }}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      karat === k.value
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-text-secondary hover:border-gold/40"
                    }`}
                  >
                    {lang === "ar" ? k.labelAr : k.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {weight && parseFloat(weight) > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 bg-gold/5 border border-gold/20 rounded-xl p-4"
            >
              <div className="text-center">
                <div className="text-text-secondary text-sm mb-1">
                  {weight}{lang === "ar" ? "جم" : "g"} × {lang === "ar" ? selectedKarat.labelAr : selectedKarat.labelEn} × ${pricePerGramSelected.toFixed(2)}/{lang === "ar" ? "جم" : "g"}
                </div>
                <div className="text-3xl font-black text-gold">
                  ${totalUSD.toFixed(2)}
                </div>
                {loc.currency !== "USD" && (
                  <div className="text-xl font-bold text-text-primary mt-1">
                    ≈ {totalLocal.toLocaleString("en-US", { maximumFractionDigits: 0 })} {loc.currencySymbol}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Zakat Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-text-primary mb-1 flex items-center gap-2">
            {lang === "ar" ? "☪️ حاسبة الزكاة" : "☪️ Zakat Calculator"}
          </h2>
          <p className="text-text-secondary text-xs mb-5">
            {lang === "ar"
              ? "نصاب الذهب: 85 جرام (عيار 24) • معدل الزكاة: 2.5%"
              : "Gold Nisab: 85g (24K) • Zakat rate: 2.5%"}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm mb-2">
                {lang === "ar" ? "وزن الذهب (جرام)" : "Gold weight (grams)"}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={goldWeightZakat}
                  onChange={(e) => setGoldWeightZakat(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: 100" : "e.g. 100"}
                  dir="ltr"
                  className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
                />
                <select
                  value={karatZakat}
                  onChange={(e) => { setKaratZakat(Number(e.target.value)); track.zakatKaratSelect(Number(e.target.value)); }}
                  className="bg-surface-2 border border-border rounded-xl px-3 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
                >
                  {KARATS.map((k) => (
                    <option key={k.value} value={k.value}>
                      {lang === "ar" ? k.labelAr : k.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-sm mb-2">
                {lang === "ar"
                  ? "النقد والمدخرات (USD) — اختياري"
                  : "Cash & Savings (USD) — optional"}
              </label>
              <input
                type="number"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                placeholder="0"
                dir="ltr"
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          {(goldWeightZakat || savings) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onAnimationComplete={() => track.zakatResult(reachedNisab, zakatDueUSD)}
              className={`mt-5 border rounded-xl p-4 ${
                reachedNisab
                  ? "bg-rise/5 border-rise/20"
                  : "bg-surface-2 border-border"
              }`}
            >
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between text-text-secondary">
                  <span>{lang === "ar" ? "قيمة نصاب الذهب:" : "Gold Nisab value:"}</span>
                  <span>${nisabValueUSD.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>{lang === "ar" ? "إجمالي ثروتك:" : "Total wealth:"}</span>
                  <span>${totalWealthUSD.toFixed(0)}</span>
                </div>
              </div>

              {reachedNisab ? (
                <div className="text-center">
                  <div className="text-rise font-bold mb-1">
                    {lang === "ar" ? "✅ بلغت النصاب — تجب الزكاة" : "✅ Nisab reached — Zakat is due"}
                  </div>
                  <div className="text-2xl font-black text-gold">${zakatDueUSD.toFixed(2)}</div>
                  {loc.currency !== "USD" && (
                    <div className="text-lg font-bold text-text-primary">
                      ≈ {zakatDueLocal.toLocaleString("en-US", { maximumFractionDigits: 0 })} {loc.currencySymbol}
                    </div>
                  )}
                  <div className="text-text-secondary text-xs mt-2">
                    {lang === "ar" ? "2.5% من إجمالي الثروة" : "2.5% of total wealth"}
                  </div>
                </div>
              ) : (
                <div className="text-center text-text-secondary">
                  <div className="text-lg font-bold">
                    {lang === "ar" ? "لم تبلغ النصاب بعد" : "Nisab not yet reached"}
                  </div>
                  <div className="text-xs mt-1">
                    {lang === "ar"
                      ? `تحتاج $${(nisabValueUSD - totalWealthUSD).toFixed(0)} إضافية للوصول للنصاب`
                      : `You need $${(nisabValueUSD - totalWealthUSD).toFixed(0)} more to reach Nisab`}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Live Karat Price Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-surface border border-border rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-text-primary mb-4">
          {lang === "ar" ? "📊 أسعار العيارات اللحظية" : "📊 Live Karat Prices"}
        </h2>
        {loadingPrice ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-surface-2 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-secondary border-b border-border">
                  <th className={`${lang === "ar" ? "text-right" : "text-left"} pb-3 font-medium`}>
                    {lang === "ar" ? "العيار" : "Karat"}
                  </th>
                  <th className="text-center pb-3 font-medium">
                    {lang === "ar" ? "السعر/جرام (USD)" : "Price/gram (USD)"}
                  </th>
                  {loc.currency !== "USD" && (
                    <th className="text-center pb-3 font-medium">
                      {lang === "ar"
                        ? `السعر/جرام (${loc.currencySymbol})`
                        : `Price/gram (${loc.currencySymbol})`}
                    </th>
                  )}
                  <th className="text-center pb-3 font-medium">
                    {lang === "ar" ? "السعر/أوقية (USD)" : "Price/oz (USD)"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {karatTable.map((k, i) => (
                  <tr key={k.value} className={`border-b border-border/50 ${i === 0 ? "text-gold" : ""}`}>
                    <td className="py-3 font-bold">{lang === "ar" ? k.labelAr : k.labelEn}</td>
                    <td className="py-3 text-center font-mono">${k.pricePerGram.toFixed(2)}</td>
                    {loc.currency !== "USD" && (
                      <td className="py-3 text-center font-mono text-gold/80">
                        {(k.pricePerGram * loc.rate).toFixed(2)} {loc.currencySymbol}
                      </td>
                    )}
                    <td className="py-3 text-center font-mono text-text-secondary">
                      ${(goldPricePerOz * k.purity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-text-secondary text-xs mt-3">
          {lang === "ar"
            ? "* الأسعار مؤشرية بناءً على سعر الأونصة الحالي — قد تختلف عند الشراء أو البيع الفعلي"
            : "* Prices are indicative based on current spot price — may differ at actual buy/sell"}
        </p>
      </motion.div>

      <div className="mt-6">
        <Disclaimer compact />
      </div>

      <div className="mt-4 bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-text-secondary">
        <p className="font-bold text-gold mb-1">
          {lang === "ar" ? "ملاحظات الزكاة" : "Zakat Notes"}
        </p>
        <ul className="space-y-1 list-disc list-inside">
          {lang === "ar" ? (
            <>
              <li>نصاب الذهب: 85 جراماً من الذهب عيار 24 وفق رأي جمهور العلماء</li>
              <li>تجب الزكاة بعد مرور حول كامل (سنة هجرية) على بلوغ النصاب</li>
              <li>معدل الزكاة: 2.5% من إجمالي الثروة الخاضعة للزكاة</li>
              <li>استشر عالماً أو مختصاً شرعياً لأحكام زكاتك الشخصية</li>
            </>
          ) : (
            <>
              <li>Gold Nisab: 85 grams of 24K gold (majority scholarly opinion)</li>
              <li>Zakat is due after one full lunar year (Hawl) of possessing the Nisab</li>
              <li>Zakat rate: 2.5% of total zakatable wealth</li>
              <li>Consult a qualified Islamic scholar for personal zakat rulings</li>
            </>
          )}
        </ul>
      </div>

      {/* ── Crypto Zakat CTA ── */}
      <Link
        href="/zakat-crypto"
        onClick={() => track.navClick("crypto-zakat-cta")}
        className="mt-6 flex items-center justify-between gap-4 bg-surface border border-border hover:border-gold/40 rounded-2xl p-5 transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">₿🤲</span>
          <div>
            <p className="font-bold text-text-primary group-hover:text-gold transition-colors">
              {lang === "ar" ? "حاسبة زكاة العملات الرقمية" : "Crypto Zakat Calculator"}
            </p>
            <p className="text-text-secondary text-sm">
              {lang === "ar"
                ? "BTC · ETH · BNB · SOL · USDT — نصاب لحظي"
                : "BTC · ETH · BNB · SOL · USDT — Live Nisab"}
            </p>
          </div>
        </div>
        <span className="text-gold font-black text-xl shrink-0">←</span>
      </Link>

      {/* ── Profit / Loss Calculator ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-surface border border-border rounded-2xl p-6"
      >
        <h2 className="text-lg font-bold text-text-primary mb-4">
          📈 {lang === "ar" ? "حاسبة الربح والخسارة" : "Profit & Loss Calculator"}
        </h2>
        <p className="text-text-secondary text-sm mb-4">
          {lang === "ar"
            ? "احسب كم ربحت أو خسرت في استثمارك بالذهب"
            : "Calculate how much you gained or lost on your gold investment"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Weight */}
          <div>
            <label className="text-text-secondary text-xs mb-1.5 block">
              {lang === "ar" ? "الوزن (جرام)" : "Weight (grams)"}
            </label>
            <input
              type="number"
              value={plWeight}
              onChange={(e) => setPlWeight(e.target.value)}
              placeholder={lang === "ar" ? "مثال: 50" : "e.g. 50"}
              dir="ltr"
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold text-sm"
            />
          </div>
          {/* Karat */}
          <div>
            <label className="text-text-secondary text-xs mb-1.5 block">
              {lang === "ar" ? "العيار" : "Karat"}
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {KARATS.map((k) => (
                <button
                  key={k.value}
                  onClick={() => setPlKarat(k.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex-1 ${
                    plKarat === k.value ? "bg-gold text-background" : "bg-surface-2 border border-border text-text-secondary"
                  }`}
                >
                  {lang === "ar" ? k.labelAr : k.labelEn}
                </button>
              ))}
            </div>
          </div>
          {/* Buy price per gram */}
          <div>
            <label className="text-text-secondary text-xs mb-1.5 block">
              {lang === "ar" ? "سعر الشراء ($/جرام)" : "Buy Price ($/gram)"}
            </label>
            <input
              type="number"
              value={plBuyPrice}
              onChange={(e) => setPlBuyPrice(e.target.value)}
              placeholder={lang === "ar" ? "سعر الشراء بالدولار" : "e.g. 85.00"}
              dir="ltr"
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold text-sm"
            />
          </div>
        </div>

        {plWeightNum > 0 && plBuyNum > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-5 border ${plProfit >= 0 ? "bg-rise/5 border-rise/20" : "bg-fall/5 border-fall/20"}`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-text-secondary text-xs mb-1">{lang === "ar" ? "سعر الشراء الكلي" : "Total Buy Value"}</p>
                <p className="font-black text-text-primary">${plBuyValue.toFixed(2)}</p>
                <p className="text-text-secondary text-xs">{(plBuyValue * loc.rate).toLocaleString("en-US", { maximumFractionDigits: 0 })} {loc.currency}</p>
              </div>
              <div>
                <p className="text-text-secondary text-xs mb-1">{lang === "ar" ? "القيمة الحالية" : "Current Value"}</p>
                <p className="font-black text-text-primary">${plCurrentValue.toFixed(2)}</p>
                <p className="text-text-secondary text-xs">{plCurrentValueLocal.toLocaleString("en-US", { maximumFractionDigits: 0 })} {loc.currency}</p>
              </div>
              <div>
                <p className="text-text-secondary text-xs mb-1">{lang === "ar" ? "الربح / الخسارة" : "Profit / Loss"}</p>
                <p className={`font-black text-xl ${plProfit >= 0 ? "text-rise" : "text-fall"}`}>
                  {plProfit >= 0 ? "+" : ""}${plProfit.toFixed(2)}
                </p>
                <p className={`text-xs ${plProfit >= 0 ? "text-rise" : "text-fall"}`}>
                  {plProfitLocal >= 0 ? "+" : ""}{plProfitLocal.toLocaleString("en-US", { maximumFractionDigits: 0 })} {loc.currency}
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-xs mb-1">{lang === "ar" ? "النسبة" : "Return %"}</p>
                <p className={`font-black text-2xl ${plProfitPct >= 0 ? "text-rise" : "text-fall"}`}>
                  {plProfitPct >= 0 ? "+" : ""}{plProfitPct.toFixed(2)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
