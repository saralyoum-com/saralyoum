"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import Disclaimer from "@/components/Disclaimer";
import AdSlot from "@/components/AdSlot";
import { useLang } from "@/components/LanguageContext";
import { NewsItem } from "@/types";
import { formatDate } from "@/lib/format";
import { track } from "@/lib/analytics";

const PAGE_SIZE = 20;

// "اليوم" / "أمس" / full date — groups the (already newest-first) feed into
// day sections so the page reads as a timeline instead of ~60 identical cards.
function dayLabel(iso: string, lang: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return lang === "ar" ? "أخبار" : "News";
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(new Date()) - startOf(d)) / 86400000);
  if (diffDays === 0) return lang === "ar" ? "اليوم" : "Today";
  if (diffDays === 1) return lang === "ar" ? "أمس" : "Yesterday";
  return d.toLocaleDateString(lang === "ar" ? "ar" : "en-US", { day: "numeric", month: "long" });
}

function faviconUrl(articleUrl: string): string | null {
  try {
    if (!articleUrl || articleUrl === "#") return null;
    const host = new URL(articleUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=32`;
  } catch {
    return null;
  }
}

export default function NewsPage() {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const AR_SOURCES = ["الكل", "BBC عربي", "الجزيرة", "أرقام", "مباشر", "رويترز عربي"];
  const EN_SOURCES = ["All", "Reuters", "Kitco", "Yahoo Finance", "MarketWatch"];
  const sources = lang === "ar" ? AR_SOURCES : EN_SOURCES;
  const allLabel = lang === "ar" ? "الكل" : "All";

  useEffect(() => {
    setFilter("all");
  }, [lang]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter, lang]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/news?lang=${lang}`);
        const data = await res.json();
        setNews(data.news || []);
      } catch {
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [lang]);

  const filtered =
    filter === "all"
      ? news
      : news.filter((n) => n.source === filter);

  const itemsToShow = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Group the visible slice into day sections (feed is already newest-first)
  const groups: { label: string; items: NewsItem[] }[] = [];
  for (const item of itemsToShow) {
    const label = dayLabel(item.publishedAt, lang);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }

  return (
    <div dir={dir} className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary mb-2">
          {lang === "ar" ? "📰 الأخبار الاقتصادية" : "📰 Economic News"}
        </h1>
        <p className="text-text-secondary text-sm sm:text-base">
          {lang === "ar" ? "آخر أخبار الأسواق المالية والعملات" : "Latest financial markets and currency news"}
        </p>
      </div>

      {/* Source Filters */}
      <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
        {sources.map((src) => {
          const isActive = filter === "all" ? src === allLabel : filter === src;
          return (
            <button
              key={src}
              onClick={() => { const newFilter = src === allLabel ? "all" : src; setFilter(newFilter); track.newsSourceFilter(newFilter); }}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? "bg-gold text-background"
                  : "bg-surface border border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {src}
            </button>
          );
        })}
      </div>

      {/* Ad after filters */}
      <AdSlot size="leaderboard" slot="3456789012" className="mb-6" />
      <AdSlot size="mobile-banner" slot="3456789013" className="mb-6" />

      <Disclaimer compact />

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-5 animate-pulse">
                <div className="h-3 bg-surface-2 rounded mb-3 w-1/3" />
                <div className="h-5 bg-surface-2 rounded mb-2" />
                <div className="h-5 bg-surface-2 rounded mb-3 w-4/5" />
                <div className="h-3 bg-surface-2 rounded w-full" />
                <div className="h-3 bg-surface-2 rounded w-3/4 mt-1" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            {groups.map((group, groupIdx) => (
              <Fragment key={group.label + groupIdx}>
                <h2 className="text-text-secondary text-sm font-bold mb-3 mt-2">{group.label}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((item) => {
                    const favicon = faviconUrl(item.url);
                    return (
                      <a
                        key={item.id}
                        href={item.url}
                        target={item.url.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        onClick={() => track.newsArticleClick(item.source, item.title)}
                        className="bg-surface border border-border rounded-2xl p-4 sm:p-5 hover:border-gold/30 transition-all group flex flex-col"
                      >
                        {item.imageUrl && (
                          <div className="mb-3 rounded-xl overflow-hidden h-40 bg-surface-2 relative">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          {favicon && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={favicon}
                              alt=""
                              width={14}
                              height={14}
                              className="rounded-sm shrink-0"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          )}
                          <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full font-medium">
                            {item.source}
                          </span>
                          <span className="text-text-secondary text-xs">
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>
                        <h3 className="text-text-primary font-bold text-sm leading-relaxed group-hover:text-gold transition-colors mb-2 line-clamp-2 flex-1">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-3 text-gold text-xs font-medium group-hover:underline">
                          {lang === "ar" ? "اقرأ المزيد ←" : "Read more →"}
                        </div>
                      </a>
                    );
                  })}
                </div>
                {/* Ad after every 2 day groups */}
                {groupIdx < groups.length - 1 && groupIdx % 2 === 1 && (
                  <div className="my-8">
                    <AdSlot size="leaderboard" slot="3456789014" />
                    <AdSlot size="mobile-banner" slot="3456789015" />
                  </div>
                )}
              </Fragment>
            ))}
            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={() => { setVisibleCount((c) => c + PAGE_SIZE); track.quickLinkClick("news-load-more"); }}
                  className="px-6 py-2.5 rounded-xl bg-surface border border-border hover:border-gold/40 text-text-secondary hover:text-gold font-medium text-sm transition-colors"
                >
                  {lang === "ar" ? "عرض المزيد" : "Load more"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-5xl mb-4">📡</p>
            <p className="text-lg font-medium">
              {lang === "ar" ? "لا توجد أخبار متاحة حالياً" : "No news available right now"}
            </p>
            <p className="text-sm mt-2">
              {lang === "ar" ? "يُرجى المحاولة لاحقاً" : "Please try again later"}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
