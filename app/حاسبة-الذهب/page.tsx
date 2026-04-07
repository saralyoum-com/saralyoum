"use client";

import { useState, useEffect } from "react";
import { useLocation } from "@/components/LocalCurrency";
import Disclaimer from "@/components/Disclaimer";
import { motion } from "framer-motion";

const KARATS = [
  { value: 24, label: "عيار 24", purity: 1 },
  { value: 22, label: "عيار 22", purity: 22 / 24 },
  { value: 21, label: "عيار 21", purity: 21 / 24 },
  { value: 18, label: "عيار 18", purity: 18 / 24 },
];

// نصاب الذهب: 85 جرام من الذهب الخالص (عيار 24)
const NISAB_GRAMS = 85;

export default function GoldCalculatorPage() {
  const loc = useLocation();
  const [goldPricePerOz, setGoldPricePerOz] = useState(0);
  const [loadingPrice, setLoadingPrice] = useState(true);

  // حاسبة الذهب
  const [weight, setWeight] = useState("");
  const [karat, setKarat] = useState(21);

  // حاسبة الزكاة
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

  // حساب قيمة الذهب
  const selectedKarat = KARATS.find((k) => k.value === karat)!;
  const pricePerGramSelected = pricePerGram24k * selectedKarat.purity;
  const totalUSD = weight ? parseFloat(weight) * pricePerGramSelected : 0;
  const totalLocal = totalUSD * loc.rate;

  // حساب الزكاة
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

  // جدول العيارات اللحظي
  const karatTable = KARATS.map((k) => ({
    ...k,
    pricePerGram: pricePerGram24k * k.purity,
  }));

  return (
    <div dir="rtl" className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary mb-2">🧮 حاسبة الذهب</h1>
        <p className="text-text-secondary">احسب قيمة ذهبك وزكاتك بدقة</p>
        {!loadingPrice && (
          <p className="text-xs text-gold mt-1">
            سعر الأونصة الحالي: ${goldPricePerOz.toFixed(2)} — {pricePerGram24k.toFixed(2)}$/جرام (24K)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── حاسبة السعر ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-text-primary mb-5 flex items-center gap-2">
            🥇 حاسبة سعر الذهب
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm mb-2">الوزن (جرام)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="مثال: 10"
                dir="ltr"
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm mb-2">العيار</label>
              <div className="grid grid-cols-4 gap-2">
                {KARATS.map((k) => (
                  <button
                    key={k.value}
                    onClick={() => setKarat(k.value)}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      karat === k.value
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-text-secondary hover:border-gold/40"
                    }`}
                  >
                    {k.value}K
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
                  {weight}جم × {selectedKarat.label} × ${pricePerGramSelected.toFixed(2)}/جم
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

        {/* ── حاسبة الزكاة ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-text-primary mb-1 flex items-center gap-2">
            ☪️ حاسبة الزكاة
          </h2>
          <p className="text-text-secondary text-xs mb-5">
            نصاب الذهب: 85 جرام (عيار 24) • معدل الزكاة: 2.5%
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm mb-2">وزن الذهب (جرام)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={goldWeightZakat}
                  onChange={(e) => setGoldWeightZakat(e.target.value)}
                  placeholder="مثال: 100"
                  dir="ltr"
                  className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
                />
                <select
                  value={karatZakat}
                  onChange={(e) => setKaratZakat(Number(e.target.value))}
                  className="bg-surface-2 border border-border rounded-xl px-3 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
                >
                  {KARATS.map((k) => (
                    <option key={k.value} value={k.value}>{k.value}K</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-sm mb-2">
                النقد والمدخرات (USD) — اختياري
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
              className={`mt-5 border rounded-xl p-4 ${
                reachedNisab
                  ? "bg-rise/5 border-rise/20"
                  : "bg-surface-2 border-border"
              }`}
            >
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between text-text-secondary">
                  <span>قيمة نصاب الذهب:</span>
                  <span>${nisabValueUSD.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>إجمالي ثروتك:</span>
                  <span>${totalWealthUSD.toFixed(0)}</span>
                </div>
              </div>

              {reachedNisab ? (
                <div className="text-center">
                  <div className="text-rise font-bold mb-1">✅ بلغت النصاب — تجب الزكاة</div>
                  <div className="text-2xl font-black text-gold">${zakatDueUSD.toFixed(2)}</div>
                  {loc.currency !== "USD" && (
                    <div className="text-lg font-bold text-text-primary">
                      ≈ {zakatDueLocal.toLocaleString("en-US", { maximumFractionDigits: 0 })} {loc.currencySymbol}
                    </div>
                  )}
                  <div className="text-text-secondary text-xs mt-2">2.5% من إجمالي الثروة</div>
                </div>
              ) : (
                <div className="text-center text-text-secondary">
                  <div className="text-lg font-bold">لم تبلغ النصاب بعد</div>
                  <div className="text-xs mt-1">
                    تحتاج ${(nisabValueUSD - totalWealthUSD).toFixed(0)} إضافية للوصول للنصاب
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── جدول أسعار العيارات ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-surface border border-border rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-text-primary mb-4">📊 أسعار العيارات اللحظية</h2>
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
                  <th className="text-right pb-3 font-medium">العيار</th>
                  <th className="text-center pb-3 font-medium">السعر/جرام (USD)</th>
                  {loc.currency !== "USD" && (
                    <th className="text-center pb-3 font-medium">السعر/جرام ({loc.currencySymbol})</th>
                  )}
                  <th className="text-center pb-3 font-medium">السعر/أوقية (USD)</th>
                </tr>
              </thead>
              <tbody>
                {karatTable.map((k, i) => (
                  <tr key={k.value} className={`border-b border-border/50 ${i === 0 ? "text-gold" : ""}`}>
                    <td className="py-3 font-bold">{k.label}</td>
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
          * الأسعار مؤشرية بناءً على سعر الأونصة الحالي — قد تختلف عند الشراء أو البيع الفعلي
        </p>
      </motion.div>

      <div className="mt-6">
        <Disclaimer compact />
      </div>

      <div className="mt-4 bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-text-secondary">
        <p className="font-bold text-gold mb-1">ملاحظات الزكاة</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>نصاب الذهب: 85 جراماً من الذهب عيار 24 وفق رأي جمهور العلماء</li>
          <li>تجب الزكاة بعد مرور حول كامل (سنة هجرية) على بلوغ النصاب</li>
          <li>معدل الزكاة: 2.5% من إجمالي الثروة الخاضعة للزكاة</li>
          <li>استشر عالماً أو مختصاً شرعياً لأحكام زكاتك الشخصية</li>
        </ul>
      </div>
    </div>
  );
}
