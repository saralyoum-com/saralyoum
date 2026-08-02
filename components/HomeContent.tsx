"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useLang } from "@/components/LanguageContext";
import AdSlot from "@/components/AdSlot";
import SocialIconRow from "@/components/SocialLinks";
import { formatDate } from "@/lib/format";
import { NewsItem } from "@/types";
import { track } from "@/lib/analytics";

const PriceChart = dynamic(() => import("@/components/PriceChart"), { ssr: false });

// Sticky in-page jump chips — the mobile home page is very long; let users
// teleport to the section they came for instead of scrolling ~9 screens.
export function HomeJumpChips() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const chips = [
    { href: "#price-cards", ar: "الأسعار", en: "Prices" },
    { href: "#portfolio", ar: "محفظتي", en: "Portfolio" },
    { href: "#charts", ar: "الرسوم", en: "Charts" },
    { href: "#news", ar: "الأخبار", en: "News" },
  ];
  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="sticky top-[64px] z-30 -mx-4 px-4 py-2 bg-background/85 backdrop-blur border-b border-border/50 overflow-x-auto"
    >
      <div className="flex gap-2 w-max mx-auto">
        {chips.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="whitespace-nowrap text-xs sm:text-sm text-text-secondary hover:text-gold bg-surface border border-border hover:border-gold/40 rounded-full px-3.5 py-1.5 transition-colors"
          >
            {isAr ? c.ar : c.en}
          </a>
        ))}
      </div>
    </div>
  );
}

export function HomeHero() {
  const { lang, t } = useLang();

  const dateStr = new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    numberingSystem: "latn",
  }).format(new Date());

  return (
    <div className="text-center mb-8 sm:mb-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary mb-3">
        {lang === "ar" ? (
          <>سعر الذهب <span className="text-gold">اليوم</span></>
        ) : (
          <>Gold Price <span className="text-gold">Today</span></>
        )}
      </h1>
      <p className="text-text-secondary text-base sm:text-lg">{t.home.subtitle}</p>
      <p className="text-text-secondary text-xs sm:text-sm mt-2">{dateStr}</p>
    </div>
  );
}

export function HomeAdAndCTA() {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <>
      {/* إعلان بعد بطاقات الأسعار */}
      <AdSlot size="leaderboard" slot="1234567890" className="my-4" />
      <AdSlot size="mobile-banner" slot="1234567891" className="my-4" />

      {/* CTA — تابعنا على كل المنصات */}
      <div
        dir={dir}
        className="bg-gradient-to-l from-gold/10 to-gold/[0.02] border border-gold/25 rounded-2xl p-4 sm:p-6 mb-10 sm:mb-12 flex flex-col sm:flex-row items-center justify-between gap-5"
      >
        <div className="text-center sm:text-start">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rise pulse-dot" />
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">
              {lang === "ar" ? "تابع سعر الذهب" : "Follow Gold Prices"}
            </h2>
          </div>
          <p className="text-text-secondary text-sm">
            {lang === "ar"
              ? "تنبيهات فورية بأسعار الذهب والعملات على كل المنصات — مجانا"
              : "Instant gold & currency alerts on every platform — free"}
          </p>
        </div>
        <SocialIconRow className="flex-wrap justify-center" />
      </div>
    </>
  );
}

interface HomePriceProps {
  gold: { price: number; changePercent: number };
  silver: { price: number; changePercent: number };
  bitcoin: { price: number; changePercent: number };
  ethereum: { price: number; changePercent: number };
}

export function HomePriceChartsSection({ gold, silver, bitcoin, ethereum }: HomePriceProps) {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const assets = [
    { key: "gold" as const,     label: lang === "ar" ? "الذهب"     : "Gold",     icon: "🥇", price: gold.price,    change: gold.changePercent    },
    { key: "silver" as const,   label: lang === "ar" ? "الفضة"     : "Silver",   icon: "🥈", price: silver.price,  change: silver.changePercent  },
    { key: "bitcoin" as const,  label: lang === "ar" ? "بيتكوين"   : "Bitcoin",  icon: "₿",  price: bitcoin.price, change: bitcoin.changePercent },
    { key: "ethereum" as const, label: lang === "ar" ? "إيثيريوم"  : "Ethereum", icon: "⟠",  price: ethereum.price, change: ethereum.changePercent },
  ];

  return (
    <section dir={dir} className="max-w-7xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
            📈
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              {lang === "ar" ? "الرسوم البيانية" : "Price Charts"}
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm">
              {lang === "ar" ? "اليوم • أسبوع • شهر • سنة" : "1D • 1W • 1M • 1Y"}
            </p>
          </div>
        </div>
        <Link
          href="/اسعار"
          onClick={() => track.quickLinkClick("charts-view-all")}
          className="text-gold hover:text-gold-light text-sm font-medium transition-colors"
        >
          {lang === "ar" ? "عرض الكل ←" : "View All →"}
        </Link>
      </div>

      {/* 2×2 Charts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {assets.map((a) => (
          <PriceChart
            key={a.key}
            asset={a.key}
            currentPrice={a.price}
            changePercent={a.change}
          />
        ))}
      </div>
    </section>
  );
}

export function HomeNewsSection({ news }: { news: NewsItem[] }) {
  const { lang, t } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <>
      {/* قسم الأخبار */}
      <section dir={dir} className="max-w-7xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{t.home.latestNews}</h2>
          <Link
            href="/اخبار"
            onClick={() => track.homeViewAllNews()}
            className="text-gold hover:text-gold-light text-sm font-medium transition-colors"
          >
            {t.home.viewAll}
          </Link>
        </div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {news.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target={item.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={() => track.homeNewsClick(item.source, item.title)}
                className="bg-surface border border-border rounded-2xl p-4 sm:p-5 hover:border-gold/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{item.source}</span>
                  <span className="text-text-secondary text-xs">{formatDate(item.publishedAt)}</span>
                </div>
                <h3 className="text-text-primary font-bold text-sm leading-relaxed group-hover:text-gold transition-colors mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">{item.description}</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-secondary">
            <p className="text-4xl mb-3">📡</p>
            <p>{lang === "ar" ? "لا توجد أخبار متاحة حالياً" : "No news available right now"}</p>
            <Link href="/اخبار" className="text-gold text-sm mt-2 inline-block">
              {lang === "ar" ? "تصفح الأخبار" : "Browse News"}
            </Link>
          </div>
        )}
      </section>

      {/* إعلان بعد قسم الأخبار */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 mb-6">
        <AdSlot size="responsive" slot="0987654321" />
      </div>
    </>
  );
}

export function HomeQuickLinks() {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  // أقسام الموقع فقط — روابط التواصل الاجتماعي مكانها بانر "تابعنا" والفوتر
  const links: { href: string; icon: string; title: string; desc: string }[] = [
    {
      href: "/اسعار",
      icon: "📊",
      title: lang === "ar" ? "جدول الأسعار" : "Prices Table",
      desc: lang === "ar" ? "عرض تفصيلي لجميع الأسعار" : "Detailed view of all prices",
    },
    {
      href: "/حاسبة-الذهب",
      icon: "🧮",
      title: lang === "ar" ? "حاسبة الذهب" : "Gold Calculator",
      desc: lang === "ar" ? "احسب قيمة ذهبك وزكاتك" : "Calculate your gold value and zakat",
    },
    {
      href: "/تحليل-تقني-الذهب",
      icon: "📈",
      title: lang === "ar" ? "التحليل الفني" : "Technical Analysis",
      desc: lang === "ar" ? "مؤشرات ومستويات الدعم" : "Indicators & support levels",
    },
    {
      href: "/زكاة-الكريبتو",
      icon: "🕌",
      title: lang === "ar" ? "زكاة الكريبتو" : "Crypto Zakat",
      desc: lang === "ar" ? "احسب زكاة عملاتك الرقمية" : "Calculate your crypto zakat",
    },
    {
      href: "/اخبار",
      icon: "📰",
      title: lang === "ar" ? "الأخبار الاقتصادية" : "Economic News",
      desc: lang === "ar" ? "آخر أخبار الأسواق" : "Latest market news",
    },
    {
      href: "/تنبيهات",
      icon: "🔔",
      title: lang === "ar" ? "التنبيهات" : "Price Alerts",
      desc: lang === "ar" ? "نبهني عند وصول السعر" : "Alert me when price hits",
    },
  ];

  return (
    <section dir={dir} className="max-w-7xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => track.quickLinkClick(link.title)}
            className="bg-surface border border-border hover:border-gold/30 rounded-2xl p-4 sm:p-6 transition-all group text-center"
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{link.icon}</div>
            <h3 className="font-bold mb-1 sm:mb-2 transition-colors text-sm sm:text-base text-text-primary group-hover:text-gold">
              {link.title}
            </h3>
            <p className="text-text-secondary text-xs hidden sm:block">{link.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
