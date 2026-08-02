"use client";

import Link from "next/link";
import GoldTradingTerminal, { type TerminalAsset } from "@/components/GoldTradingTerminal";
import GoldPredictionPoll from "@/components/GoldPredictionPoll";
import { useLang } from "@/components/LanguageContext";

// Shared body for every technical-analysis page. Each asset gets its own ASCII
// route (/gold-analysis, /silver-analysis, ...) with the Arabic URL rewritten
// to it in middleware — Arabic directories route unreliably on Vercel.

// `arFor` is the genitive form used in the page title — written out per asset
// rather than glued together at runtime, because "لـ" + "الفضة" produces the
// ungrammatical "لـالفضة" instead of "للفضة".
export const ANALYSIS_ASSETS = {
  gold: {
    icon: "🥇", ar: "الذهب", arFor: "للذهب", en: "Gold",
    path: "/gold-analysis", arSlug: "/تحليل-تقني-الذهب",
    pricePath: "/اسعار",
  },
  silver: {
    icon: "🥈", ar: "الفضة", arFor: "للفضة", en: "Silver",
    path: "/silver-analysis", arSlug: "/تحليل-تقني-الفضة",
    pricePath: "/اسعار",
  },
  bitcoin: {
    icon: "₿", ar: "بيتكوين", arFor: "للبيتكوين", en: "Bitcoin",
    path: "/bitcoin-analysis", arSlug: "/تحليل-تقني-البيتكوين",
    pricePath: "/سعر-البيتكوين",
  },
  ethereum: {
    icon: "⟠", ar: "إيثيريوم", arFor: "للإيثيريوم", en: "Ethereum",
    path: "/ethereum-analysis", arSlug: "/تحليل-تقني-الايثيريوم",
    pricePath: "/سعر-الاثيريوم",
  },
} as const;

export type AnalysisAsset = keyof typeof ANALYSIS_ASSETS;

export default function AssetAnalysisPage({ asset }: { asset: AnalysisAsset }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const a = ANALYSIS_ASSETS[asset];
  const others = (Object.keys(ANALYSIS_ASSETS) as AnalysisAsset[]).filter((k) => k !== asset);

  const t = isAr
    ? {
        home: "الرئيسية",
        title: `التحليل التقني ${a.arFor}`,
        // No "AI" claim here: the chart's indicators are classic TA (RSI, MACD,
        // pivots). Only the prediction poll below is AI-generated.
        subtitle: `شارت الشمعدانات مع مؤشرات RSI وMACD ومستويات الدعم والمقاومة — يتحدث كل 60 ثانية.`,
        otherAssets: "تحليل أصول أخرى",
        viewAnalysis: "عرض التحليل ←",
        allPrices: "جميع الأسعار",
        viewAll: "عرض الكل ←",
        alertTitle: "هل تريد تنبيها عند تغير السعر؟",
        alertDesc: `فعّل التنبيهات وكن أول من يعلم بتحركات ${a.ar}.`,
        alertBtn: "تفعيل التنبيهات",
        disclaimer:
          "التحليلات والمؤشرات الواردة في هذه الصفحة لأغراض إعلامية فقط ولا تُعدّ نصيحة مالية أو استثمارية. يُنصح بالتشاور مع مستشار مالي متخصص قبل اتخاذ أي قرار استثماري.",
        note: "تنبيه:",
      }
    : {
        home: "Home",
        title: `${a.en} Technical Analysis`,
        subtitle: "Candlestick chart with RSI, MACD and support & resistance levels — updates every 60 seconds.",
        otherAssets: "Analyze Other Assets",
        viewAnalysis: "View analysis →",
        allPrices: "All Prices",
        viewAll: "View All →",
        alertTitle: "Want a price-change alert?",
        alertDesc: `Enable alerts and be the first to know about ${a.en} market moves.`,
        alertBtn: "Enable Alerts",
        disclaimer:
          "The analysis and indicators on this page are for informational purposes only and do not constitute financial or investment advice. Please consult a licensed financial advisor before making any investment decision.",
        note: "Disclaimer:",
      };

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-text-secondary mb-6">
        <Link href="/" className="hover:text-gold transition-colors">{t.home}</Link>
        <span>/</span>
        <span className="text-text-primary">{t.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="text-gold text-xl">{a.icon}</span>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">{t.title}</h1>
        </div>
        <p className="text-sm text-text-secondary max-w-2xl">{t.subtitle}</p>
      </div>

      {/* Main trading terminal */}
      <GoldTradingTerminal asset={asset as TerminalAsset} />

      {/* Audience prediction poll — gold only (the AI forecast endpoint and the
          weekly poll are both gold-specific). */}
      {asset === "gold" && (
        <section className="mt-8 mb-8">
          <GoldPredictionPoll />
        </section>
      )}

      {/* Other assets */}
      <section className="mt-10 mb-8">
        <h2 className="text-base font-bold text-text-primary mb-4">{t.otherAssets}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {others.map((k) => {
            const o = ANALYSIS_ASSETS[k];
            return (
              <Link
                key={k}
                href={o.arSlug}
                className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1.5 hover:border-gold/40 transition-colors"
              >
                <span className="text-xl">{o.icon}</span>
                <p className="text-sm font-bold text-text-primary">{isAr ? o.ar : o.en}</p>
                <p className="text-[11px] text-gold">{t.viewAnalysis}</p>
              </Link>
            );
          })}
          <Link
            href="/اسعار"
            className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1.5 hover:border-gold/40 transition-colors"
          >
            <span className="text-xl">📊</span>
            <p className="text-sm font-bold text-text-primary">{t.allPrices}</p>
            <p className="text-[11px] text-gold">{t.viewAll}</p>
          </Link>
        </div>
      </section>

      {/* Alert CTA */}
      <section className="rounded-2xl border border-gold/20 bg-surface p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <p className="font-bold text-text-primary mb-1">{t.alertTitle}</p>
          <p className="text-sm text-text-secondary">{t.alertDesc}</p>
        </div>
        <Link
          href="/تنبيهات"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-gold text-background font-bold text-sm hover:opacity-90 transition-opacity"
        >
          {t.alertBtn}
        </Link>
      </section>

      {/* Disclaimer */}
      <div className="rounded-xl bg-surface-2 border border-border p-4 text-[11px] text-text-secondary leading-relaxed">
        <strong className="text-text-primary">{t.note}</strong>{" "}{t.disclaimer}
      </div>
    </main>
  );
}
