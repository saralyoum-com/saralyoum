"use client";

import { useLang } from "@/components/LanguageContext";

/**
 * Exchange-rate transparency notice (Move: rate disclosure).
 *
 * Country gold prices are computed as: global ounce price × exchange rate from
 * the feed. For most countries that feed rate is what people actually trade at,
 * because the currency is pegged (SAR, AED, QAR, BHD, JOD…).
 *
 * For a handful of markets the official rate and the rate people actually pay
 * diverge — sometimes by multiples. Rather than hand-maintaining parallel rates
 * (which go stale within days and are not citable), we keep the official feed
 * and disclose the gap here.
 *
 * To add a country or reword a notice, edit NOTICES only — nothing else needs
 * to change.
 */

type Notice = { ar: string; en: string; emphasisAr?: string; emphasisEn?: string };

const NOTICES: Record<string, Notice> = {
  // Yemen runs two separate currency areas — old banknotes in the north
  // (Sana'a) and new ones in the south/east (Aden) — trading at very
  // different rates, so the real local gram price differs several-fold
  // between the two cities for identical metal.
  ye: {
    emphasisAr: "تنبيه:",
    emphasisEn: "Note:",
    ar: "تختلف أسعار الذهب الفعلي في السوق المحلي اليمني بشكل كبير بين صنعاء وعدن بسبب فارق سعر صرف الريال. الأسعار المعروضة هنا مستندة إلى سعر الصرف الرسمي.",
    en: "Actual gold prices in Yemen's local market differ significantly between Sana'a and Aden because of the gap in the rial's exchange rate. The prices shown here are based on the official exchange rate.",
  },
  sd: {
    ar: "الأسعار محسوبة وفق سعر الصرف الرسمي. قد تختلف أسعار الذهب الفعلي في السوق المحلي بحسب سعر الصرف الموازي.",
    en: "Prices are calculated using the official exchange rate. Actual gold trading in the local market may vary based on the parallel market rate.",
  },
  sy: {
    ar: "الأسعار محسوبة وفق سعر الصرف الرسمي. قد تختلف أسعار الذهب الفعلي في السوق المحلي بحسب سعر الصرف الموازي.",
    en: "Prices are calculated using the official exchange rate. Actual gold trading in the local market may vary based on the parallel market rate.",
  },
  lb: {
    ar: "الأسعار محسوبة وفق سعر الصرف الرسمي. قد تختلف أسعار الذهب الفعلي في السوق المحلي بحسب سعر الصرف الموازي.",
    en: "Prices are calculated using the official exchange rate. Actual gold trading in the local market may vary based on the parallel market rate.",
  },
};

export default function RateNotice({ code }: { code: string }) {
  const { lang } = useLang();
  const notice = NOTICES[code.toLowerCase()];
  if (!notice) return null;

  const text = lang === "ar" ? notice.ar : notice.en;
  const emphasis = lang === "ar" ? notice.emphasisAr : notice.emphasisEn;

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="bg-gold/5 border border-gold/25 rounded-xl px-3.5 py-3 mb-6 flex items-start gap-2.5"
    >
      <span className="text-sm leading-relaxed shrink-0" aria-hidden>
        ℹ️
      </span>
      <p className="text-text-secondary text-xs sm:text-[13px] leading-relaxed">
        {emphasis && <span className="text-gold font-bold">{emphasis} </span>}
        {text}
      </p>
    </div>
  );
}
