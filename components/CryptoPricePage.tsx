"use client";

import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

interface CurrencyRow {
  code: string;
  nameAr: string;
  nameEn: string;
  flag: string;
  rate: number;
}

interface Props {
  coin: "bitcoin" | "ethereum" | "bnb" | "solana";
  symbol: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  priceUSD: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  marketCapUSD: number;
  volume24hUSD: number;
  currencies: CurrencyRow[];
}

const fmt = (n: number, decimals = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const fmtCurrency = (usdPrice: number, rate: number) => {
  const val = usdPrice * rate;
  if (val >= 1_000_000) return fmt(val / 1_000_000, 2) + "M";
  if (val >= 1_000) return fmt(val, 0);
  return fmt(val, 2);
};

export default function CryptoPricePage({
  symbol, nameAr, nameEn, icon, priceUSD, changePercent,
  high24h, low24h, marketCapUSD, volume24hUSD, currencies,
}: Props) {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isUp = changePercent >= 0;

  const displayCurrencies = [
    { code: "SAR", nameAr: "ريال سعودي",    nameEn: "Saudi Riyal",     flag: "🇸🇦", rate: 3.75 },
    { code: "AED", nameAr: "درهم إماراتي",   nameEn: "UAE Dirham",      flag: "🇦🇪", rate: 3.67 },
    { code: "KWD", nameAr: "دينار كويتي",    nameEn: "Kuwaiti Dinar",   flag: "🇰🇼", rate: 0.307 },
    { code: "EGP", nameAr: "جنيه مصري",      nameEn: "Egyptian Pound",  flag: "🇪🇬", rate: 50.9 },
    { code: "QAR", nameAr: "ريال قطري",      nameEn: "Qatari Riyal",    flag: "🇶🇦", rate: 3.64 },
    { code: "BHD", nameAr: "دينار بحريني",   nameEn: "Bahraini Dinar",  flag: "🇧🇭", rate: 0.376 },
    { code: "OMR", nameAr: "ريال عماني",     nameEn: "Omani Rial",      flag: "🇴🇲", rate: 0.385 },
    { code: "JOD", nameAr: "دينار أردني",    nameEn: "Jordanian Dinar", flag: "🇯🇴", rate: 0.709 },
    { code: "MAD", nameAr: "درهم مغربي",     nameEn: "Moroccan Dirham", flag: "🇲🇦", rate: 9.97 },
    { code: "IQD", nameAr: "دينار عراقي",    nameEn: "Iraqi Dinar",     flag: "🇮🇶", rate: 1310 },
  ].map(c => {
    const live = currencies.find(r => r.code === c.code);
    return { ...c, rate: live?.rate ?? c.rate };
  });

  const faqs = lang === "ar" ? [
    { q: `ما هو سعر ${nameAr} الآن؟`, a: `سعر ${nameAr} (${symbol}) الآن ${fmt(priceUSD)} دولار أمريكي، وبالريال السعودي يساوي ${fmtCurrency(priceUSD, 3.75)} ريال تقريباً.` },
    { q: `هل تجب الزكاة على ${nameAr}؟`, a: `نعم، ذهب أكثر العلماء إلى وجوب الزكاة على ${nameAr} وغيره من العملات الرقمية إذا بلغت نصاب الذهب وحال عليها الحول. النسبة 2.5% من القيمة الإجمالية.` },
    { q: `كيف أحسب قيمة ${nameAr} بالريال السعودي؟`, a: `اضرب سعر ${symbol} بالدولار في سعر صرف الريال (3.75 تقريباً). مثال: إذا كان ${symbol} = ${fmt(priceUSD)} دولار، فقيمته = ${fmtCurrency(priceUSD, 3.75)} ريال.` },
    { q: `ما هو الفرق بين ${nameAr} والذهب كاستثمار؟`, a: `الذهب أكثر استقراراً وله تاريخ آلاف السنين كمخزن للقيمة. أما ${nameAr} فأكثر تذبذباً وقد يحقق عوائد أعلى أو خسائر أكبر في المدى القصير.` },
  ] : [
    { q: `What is the current price of ${nameEn}?`, a: `${nameEn} (${symbol}) is currently priced at $${fmt(priceUSD)} USD, which equals approximately ${fmtCurrency(priceUSD, 3.75)} SAR.` },
    { q: `Is Zakat due on ${nameEn}?`, a: `Most scholars agree that Zakat is obligatory on ${nameEn} if it reaches the gold nisab and a full lunar year passes. The rate is 2.5% of the total value.` },
    { q: `How do I convert ${symbol} to Saudi Riyals?`, a: `Multiply the ${symbol} USD price by the SAR exchange rate (~3.75). Example: ${symbol} = $${fmt(priceUSD)} USD × 3.75 = ${fmtCurrency(priceUSD, 3.75)} SAR.` },
    { q: `${nameEn} vs Gold — Which is a better investment?`, a: `Gold is more stable with thousands of years of value storage history. ${nameEn} is more volatile and may offer higher returns or losses in the short term.` },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-background text-text-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">

        {/* ── Hero ── */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">
            {lang === "ar" ? `سعر ${nameAr} اليوم` : `${nameEn} Price Today`}
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            {lang === "ar"
              ? `سعر ${symbol} لحظياً بالدولار وجميع العملات العربية`
              : `Live ${symbol} price in USD and all Arab currencies`}
          </p>

          {/* Big price */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl sm:text-5xl font-black text-gold">${fmt(priceUSD)}</span>
            <span className={`text-lg font-bold px-4 py-1.5 rounded-xl ${isUp ? "text-rise bg-rise/10" : "text-fall bg-fall/10"}`}>
              {isUp ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
              <span className="text-sm font-normal ms-2 opacity-70">
                {lang === "ar" ? "آخر 24 ساعة" : "24h"}
              </span>
            </span>
          </div>

          {/* 24h stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: lang === "ar" ? "أعلى 24س" : "24h High", val: `$${fmt(high24h)}` },
              { label: lang === "ar" ? "أدنى 24س" : "24h Low",  val: `$${fmt(low24h)}` },
              { label: lang === "ar" ? "القيمة السوقية" : "Market Cap", val: `$${fmt(marketCapUSD / 1e9, 1)}B` },
              { label: lang === "ar" ? "حجم التداول" : "Volume 24h", val: `$${fmt(volume24hUSD / 1e9, 1)}B` },
            ].map(({ label, val }) => (
              <div key={label} className="bg-surface-2 rounded-xl p-3">
                <div className="text-xs text-text-secondary mb-1">{label}</div>
                <div className="font-bold text-sm">{val}</div>
              </div>
            ))}
          </div>
        </div>

        <AdSlot size="responsive" slot="9876543210" />

        {/* ── Currency Table ── */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border">
            <h2 className="text-lg font-black">
              {lang === "ar" ? `سعر ${nameAr} بالعملات العربية` : `${nameEn} Price in Arab Currencies`}
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              {lang === "ar" ? "محدّث لحظياً • يتغير مع السعر" : "Updated in real-time • changes with price"}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[360px]">
              <thead>
                <tr className="border-b border-border text-xs text-text-secondary">
                  <th className="text-start p-3 sm:p-4 font-medium">
                    {lang === "ar" ? "الدولة / العملة" : "Country / Currency"}
                  </th>
                  <th className="text-end p-3 sm:p-4 font-medium">
                    {lang === "ar" ? `سعر ${symbol}` : `${symbol} Price`}
                  </th>
                  <th className="text-end p-3 sm:p-4 font-medium hidden sm:table-cell">
                    {lang === "ar" ? "سعر الصرف" : "Exchange Rate"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayCurrencies.map((c, i) => (
                  <tr key={c.code} className={`border-b border-border/50 hover:bg-surface-2 transition-colors ${i % 2 === 0 ? "" : "bg-surface-2/30"}`}>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{c.flag}</span>
                        <div>
                          <div className="font-semibold text-sm">{lang === "ar" ? c.nameAr : c.nameEn}</div>
                          <div className="text-xs text-text-secondary">{c.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-end">
                      <span className="font-black text-gold text-sm sm:text-base">
                        {fmtCurrency(priceUSD, c.rate)} {c.code}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-end text-xs text-text-secondary hidden sm:table-cell">
                      1 USD = {c.rate >= 100 ? fmt(c.rate, 0) : fmt(c.rate, 3)} {c.code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Zakat CTA ── */}
        <Link
          href="/زكاة-الكريبتو"
          onClick={() => track.navClick("zakat-crypto-from-crypto-page")}
          className="flex items-center justify-between gap-4 bg-surface border border-gold/30 hover:border-gold rounded-2xl p-5 transition-colors group"
        >
          <span className="text-3xl">₿⚖️</span>
          <div className="flex-1">
            <p className="font-black text-base">
              {lang === "ar" ? `احسب زكاة ${nameAr}` : `Calculate ${nameEn} Zakat`}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {lang === "ar"
                ? "نصاب لحظي · نسبة 2.5% · آراء العلماء"
                : "Live nisab · 2.5% rate · scholarly opinions"}
            </p>
          </div>
          <span className="text-gold font-black text-xl group-hover:translate-x-1 transition-transform">←</span>
        </Link>

        {/* ── FAQ ── */}
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-black">
            {lang === "ar" ? `أسئلة شائعة عن ${nameAr}` : `Frequently Asked Questions about ${nameEn}`}
          </h2>
          {faqs.map(({ q, a }) => (
            <details key={q} className="group border-b border-border/50 pb-4 last:border-0 last:pb-0">
              <summary className="cursor-pointer font-semibold text-sm sm:text-base list-none flex justify-between items-center gap-2">
                <span>{q}</span>
                <span className="text-gold text-lg group-open:rotate-45 transition-transform shrink-0">+</span>
              </summary>
              <p className="mt-3 text-text-secondary text-sm leading-relaxed">{a}</p>
            </details>
          ))}
        </div>

        {/* ── Disclaimer ── */}
        <p className="text-xs text-text-secondary text-center leading-relaxed">
          {lang === "ar"
            ? "⚠️ الأسعار للاستدلال فقط. لا تُعدّ نصيحة استثمارية. تحقق من مصادر متعددة قبل أي قرار مالي."
            : "⚠️ Prices are for reference only. Not investment advice. Always verify with multiple sources before financial decisions."}
        </p>

      </div>
    </div>
  );
}
