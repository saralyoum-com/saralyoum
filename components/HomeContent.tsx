"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageContext";
import AdSlot from "@/components/AdSlot";
import { formatDate } from "@/lib/format";
import { NewsItem } from "@/types";
import { track } from "@/lib/analytics";

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
  const { lang, t } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <>
      {/* إعلان بعد بطاقات الأسعار */}
      <AdSlot size="leaderboard" slot="1234567890" className="my-4" />
      <AdSlot size="mobile-banner" slot="1234567891" className="my-4" />

      {/* CTA التنبيهات */}
      <div
        dir={dir}
        className="bg-gradient-to-l from-gold/5 to-gold/10 border border-gold/20 rounded-2xl p-4 sm:p-6 mb-10 sm:mb-12 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="text-center sm:text-start">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-1">{t.home.ctaTitle}</h2>
          <p className="text-text-secondary text-sm">{t.home.ctaDesc}</p>
        </div>
        <Link
          href="/تنبيهات"
          onClick={() => track.ctaClick()}
          className="bg-gold text-background font-bold px-5 sm:px-6 py-3 rounded-xl hover:bg-gold-light transition-colors whitespace-nowrap w-full sm:w-auto text-center"
        >
          {t.home.subscribe}
        </Link>
      </div>
    </>
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

  const links = [
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
      href: "/تنبيهات",
      icon: "🔔",
      title: lang === "ar" ? "التنبيهات الذكية" : "Smart Alerts",
      desc: lang === "ar" ? "تنبيهات يومية وسعرية" : "Daily and price alerts",
    },
  ];

  return (
    <section dir={dir} className="max-w-7xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => track.quickLinkClick(link.title)}
            className="bg-surface border border-border rounded-2xl p-4 sm:p-6 hover:border-gold/30 transition-all group text-center"
          >
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{link.icon}</div>
            <h3 className="text-text-primary font-bold mb-1 sm:mb-2 group-hover:text-gold transition-colors text-sm sm:text-base">{link.title}</h3>
            <p className="text-text-secondary text-xs hidden sm:block">{link.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
