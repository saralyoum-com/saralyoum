"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useLang } from "@/components/LanguageContext";
import AdSlot from "@/components/AdSlot";
import { formatDate } from "@/lib/format";
import { NewsItem } from "@/types";
import { track } from "@/lib/analytics";

const PriceChart = dynamic(() => import("@/components/PriceChart"), { ssr: false });

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
          <>أسعار <span className="text-gold">لحظية</span></>
        ) : (
          <><span className="text-gold">Live</span> Prices</>
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

      {/* CTA — قناة تيليجرام */}
      <div
        dir={dir}
        className="bg-gradient-to-l from-[#229ED9]/10 to-[#229ED9]/5 border border-[#229ED9]/30 rounded-2xl p-4 sm:p-6 mb-10 sm:mb-12 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="text-center sm:text-start">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-1">
            {lang === "ar" ? "🔔 انضم لقناة سعر الذهب" : "🔔 Join Our Telegram Channel"}
          </h2>
          <p className="text-text-secondary text-sm">
            {lang === "ar"
              ? "تنبيهات فورية بأسعار الذهب والعملات مباشرةً على تيليجرام — مجاناً"
              : "Instant gold & currency alerts directly on Telegram — free"}
          </p>
        </div>
        <a
          href="https://t.me/sardhahab"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track.ctaClick()}
          className="flex items-center gap-2 bg-[#229ED9] text-white font-bold px-5 sm:px-6 py-3 rounded-xl hover:bg-[#1a8bc4] transition-colors whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.613c-.149.666-.546.829-1.107.516l-3.07-2.263-1.482 1.425c-.165.165-.303.303-.618.303l.22-3.12 5.674-5.126c.247-.22-.054-.342-.383-.123L6.91 14.42 3.9 13.473c-.657-.207-.67-.657.138-.973l10.88-4.195c.547-.197 1.026.133.844.943z"/></svg>
          {lang === "ar" ? "انضم للقناة" : "Join Channel"}
        </a>
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
            <p>{lang === "ar" ? "جاري تحميل الأخبار..." : "Loading news..."}</p>
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

  const links: { href: string; icon: string; title: string; desc: string; external?: boolean }[] = [
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
      href: "/اخبار",
      icon: "📰",
      title: lang === "ar" ? "الأخبار الاقتصادية" : "Economic News",
      desc: lang === "ar" ? "آخر أخبار الأسواق" : "Latest market news",
    },
    {
      href: "https://t.me/sardhahab",
      icon: "✈️",
      title: lang === "ar" ? "قناة تيليجرام" : "Telegram Channel",
      desc: lang === "ar" ? "تنبيهات فورية مجاناً" : "Instant free alerts",
      external: true,
    },
  ];

  return (
    <section dir={dir} className="max-w-7xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {links.map((link) => {
          const cls = `bg-surface border rounded-2xl p-4 sm:p-6 transition-all group text-center ${
            link.external
              ? "border-[#229ED9]/30 hover:border-[#229ED9]/60 hover:bg-[#229ED9]/5"
              : "border-border hover:border-gold/30"
          }`;
          const inner = (
            <>
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{link.icon}</div>
              <h3 className={`font-bold mb-1 sm:mb-2 transition-colors text-sm sm:text-base ${link.external ? "text-[#229ED9] group-hover:text-[#1a8bc4]" : "text-text-primary group-hover:text-gold"}`}>{link.title}</h3>
              <p className="text-text-secondary text-xs hidden sm:block">{link.desc}</p>
            </>
          );
          return link.external ? (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" onClick={() => track.quickLinkClick(link.title)} className={cls}>{inner}</a>
          ) : (
            <Link key={link.href} href={link.href} onClick={() => track.quickLinkClick(link.title)} className={cls}>{inner}</Link>
          );
        })}
      </div>
    </section>
  );
}
