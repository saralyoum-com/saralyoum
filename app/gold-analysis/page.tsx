"use client";

import Link from "next/link";
import GoldTradingTerminal from "@/components/GoldTradingTerminal";
import { useLang } from "@/components/LanguageContext";

// ASCII route for the Arabic URL /تحليل-تقني-الذهب (mapped in middleware
// OTHER_SLUGS). Arabic directories route unreliably on Vercel and 404 across
// deploys (see the /اسعار incident), so the page lives at an ASCII path and the
// Arabic URL is rewritten to it at the Edge. Public URL + canonical stay Arabic.
export default function TechnicalAnalysisPage() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const txt = {
    ar: {
      home: "الرئيسية",
      title: "التحليل التقني للذهب",
      subtitle: "شارت الشمعدانات مع مؤشرات RSI وMACD ومستويات الدعم والمقاومة وإشارات الذكاء الاصطناعي — يتحدث كل 60 ثانية.",
      otherAssets: "تحليل أصول أخرى",
      comingSoon: "قريباً",
      viewPrice: "عرض السعر ←",
      viewAll: "عرض الكل ←",
      alertTitle: "هل تريد تنبيهاً عند تغير السعر؟",
      alertDesc: "فعّل التنبيهات وكن أول من يعلم بتحركات الذهب.",
      alertBtn: "تفعيل التنبيهات",
      disclaimer: "التحليلات والتوقعات الواردة في هذه الصفحة مدعومة بالذكاء الاصطناعي وهي لأغراض إعلامية فقط. لا تُعدّ نصيحة مالية أو استثمارية. يُنصح بالتشاور مع مستشار مالي متخصص قبل اتخاذ أي قرار استثماري.",
      note: "تنبيه:",
    },
    en: {
      home: "Home",
      title: "Gold Technical Analysis",
      subtitle: "Candlestick chart with RSI, MACD, support & resistance levels, and AI-powered signals — updates every 60 seconds.",
      otherAssets: "Analyze Other Assets",
      comingSoon: "Coming Soon",
      viewPrice: "View Price →",
      viewAll: "View All →",
      alertTitle: "Want a price-change alert?",
      alertDesc: "Enable alerts and be the first to know about gold market moves.",
      alertBtn: "Enable Alerts",
      disclaimer: "The analysis and forecasts on this page are AI-powered and for informational purposes only. They do not constitute financial or investment advice. Please consult a licensed financial advisor before making any investment decision.",
      note: "Disclaimer:",
    },
  };

  const t = txt[isAr ? "ar" : "en"];

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
          <span className="text-gold text-xl">✦</span>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">{t.title}</h1>
        </div>
        <p className="text-sm text-text-secondary max-w-2xl">{t.subtitle}</p>
      </div>

      {/* Main trading terminal */}
      <GoldTradingTerminal />

      {/* Other assets */}
      <section className="mt-10 mb-8">
        <h2 className="text-base font-bold text-text-primary mb-4">{t.otherAssets}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1.5 opacity-50">
            <span className="text-xl">🥈</span>
            <p className="text-sm font-bold text-text-primary">{isAr ? "الفضة" : "Silver"}</p>
            <p className="text-[11px] text-text-secondary">{t.comingSoon}</p>
          </div>
          <Link href="/سعر-البيتكوين"
            className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1.5 hover:border-gold/40 transition-colors">
            <span className="text-xl">₿</span>
            <p className="text-sm font-bold text-text-primary">{isAr ? "بيتكوين" : "Bitcoin"}</p>
            <p className="text-[11px] text-gold">{t.viewPrice}</p>
          </Link>
          <Link href="/سعر-الاثيريوم"
            className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1.5 hover:border-gold/40 transition-colors">
            <span className="text-xl">⟠</span>
            <p className="text-sm font-bold text-text-primary">{isAr ? "إيثيريوم" : "Ethereum"}</p>
            <p className="text-[11px] text-gold">{t.viewPrice}</p>
          </Link>
          <Link href="/اسعار"
            className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1.5 hover:border-gold/40 transition-colors">
            <span className="text-xl">📊</span>
            <p className="text-sm font-bold text-text-primary">{isAr ? "جميع الأسعار" : "All Prices"}</p>
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
        <Link href="/تنبيهات"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-gold text-background font-bold text-sm hover:opacity-90 transition-opacity">
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
