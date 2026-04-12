"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

const PriceChart = dynamic(() => import("@/components/PriceChart"), { ssr: false });

interface Props {
  flag: string;
  nameAr: string;
  nameEn: string;
  city: string;
  currency: string;
  currencyAr: string;
  currencyEn: string;
  goldPriceUSD: number;
  silverPriceUSD: number;
  rate: number; // 1 USD = X local currency
  changePercent: number;
}

export default function CountryGoldPage({
  flag, nameAr, nameEn, city, currency, currencyAr, currencyEn,
  goldPriceUSD, silverPriceUSD, rate, changePercent,
}: Props) {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const OZ_TO_GRAM = 31.1035;
  const goldPerOz = goldPriceUSD * rate;
  const goldPerGram24 = (goldPriceUSD / OZ_TO_GRAM) * rate;
  const silverPerOz = silverPriceUSD * rate;
  const silverPerGram = (silverPriceUSD / OZ_TO_GRAM) * rate;

  const karats = [
    { label: lang === "ar" ? "عيار 24" : "24K", factor: 1 },
    { label: lang === "ar" ? "عيار 22" : "22K", factor: 22 / 24 },
    { label: lang === "ar" ? "عيار 21" : "21K", factor: 21 / 24 },
    { label: lang === "ar" ? "عيار 18" : "18K", factor: 18 / 24 },
    { label: lang === "ar" ? "عيار 14" : "14K", factor: 14 / 24 },
  ];

  const decimals = rate < 1 ? 4 : rate < 5 ? 3 : 2;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: 2 });


  return (
    <div dir={dir} className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-text-secondary text-sm mb-6">
        <Link href="/" className="hover:text-gold transition-colors">
          {lang === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <span>/</span>
        <span className="text-text-primary">{lang === "ar" ? `سعر الذهب في ${nameAr}` : `Gold Price in ${nameEn}`}</span>
      </nav>

      {/* Hero */}
      <div className="bg-surface border border-border rounded-3xl p-5 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{flag}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-text-primary">
                {lang === "ar" ? `سعر الذهب في ${nameAr}` : `Gold Price in ${nameEn}`}
              </h1>
              <p className="text-text-secondary text-sm mt-0.5">
                {lang === "ar"
                  ? `بالـ${currencyAr} — محدّث لحظياً`
                  : `In ${currencyEn} — Live updated`}
              </p>
            </div>
          </div>
          <div className="text-right sm:text-end">
            <p className="text-text-secondary text-xs mb-1">
              {lang === "ar" ? "سعر الأونصة" : "Price per oz"}
            </p>
            <p className="text-3xl sm:text-4xl font-black text-gold">
              {fmt(goldPerOz)}
            </p>
            <p className="text-text-secondary text-sm">{currency}</p>
            <span className={`text-sm font-bold ${changePercent >= 0 ? "text-rise" : "text-fall"}`}>
              {changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Karats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {karats.map(({ label, factor }) => (
            <div key={label} className="bg-surface-2 border border-border rounded-2xl p-3 sm:p-4 text-center">
              <p className="text-text-secondary text-xs mb-1">{label}</p>
              <p className="text-gold font-black text-lg sm:text-xl">
                {fmt(goldPerGram24 * factor)}
              </p>
              <p className="text-text-secondary text-xs">
                {currency} / {lang === "ar" ? "جرام" : "gram"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Gold Chart */}
      <PriceChart
        asset="gold"
        currentPrice={goldPriceUSD}
        changePercent={changePercent}
      />

      {/* Silver */}
      <div className="bg-surface border border-border rounded-2xl p-5 mt-4">
        <h2 className="font-bold text-text-primary mb-3 text-lg">
          🥈 {lang === "ar" ? `سعر الفضة في ${nameAr}` : `Silver Price in ${nameEn}`}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-2 rounded-xl p-3 text-center">
            <p className="text-text-secondary text-xs mb-1">
              {lang === "ar" ? "سعر الأونصة" : "Per oz"}
            </p>
            <p className="font-black text-xl text-text-primary">{fmt(silverPerOz)}</p>
            <p className="text-text-secondary text-xs">{currency}</p>
          </div>
          <div className="bg-surface-2 rounded-xl p-3 text-center">
            <p className="text-text-secondary text-xs mb-1">
              {lang === "ar" ? "سعر الجرام" : "Per gram"}
            </p>
            <p className="font-black text-xl text-text-primary">{fmt(silverPerGram)}</p>
            <p className="text-text-secondary text-xs">{currency}</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5 mt-4">
        <h2 className="font-bold text-text-primary mb-2">
          💡 {lang === "ar" ? "معلومة" : "Info"}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          {lang === "ar"
            ? `سعر الذهب في ${nameAr} (${city}) يُحسب بتحويل سعر الأونصة العالمي من الدولار إلى ${currencyAr} بسعر الصرف اللحظي. الأسعار تُحدَّث كل 5 دقائق.`
            : `Gold price in ${nameEn} (${city}) is calculated by converting the international spot price from USD to ${currencyEn} at the live exchange rate. Prices update every 5 minutes.`}
        </p>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        <Link
          href="/حاسبة-الذهب"
          onClick={() => track.quickLinkClick("country-calc")}
          className="flex items-center justify-center gap-2 bg-gold text-background font-bold py-3.5 rounded-xl hover:bg-gold-light transition-colors"
        >
          🧮 {lang === "ar" ? "احسب قيمة ذهبك" : "Calculate Gold Value"}
        </Link>
        <Link
          href="/اسعار"
          onClick={() => track.quickLinkClick("country-prices")}
          className="flex items-center justify-center gap-2 border border-border text-text-secondary hover:text-text-primary font-bold py-3.5 rounded-xl transition-colors"
        >
          📊 {lang === "ar" ? "جدول الأسعار الكامل" : "Full Prices Table"}
        </Link>
      </div>

    </div>
  );
}
