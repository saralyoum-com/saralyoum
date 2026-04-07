"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import Disclaimer from "@/components/Disclaimer";
import AdSlot from "@/components/AdSlot";
import { NewsItem } from "@/types";
import { formatDate } from "@/lib/format";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("الكل");

  const sources = ["الكل", "BBC عربي", "الجزيرة", "أرقام", "مباشر", "رويترز عربي"];

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data.news || []);
      } catch {
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered =
    filter === "الكل" ? news : news.filter((n) => n.source === filter);

  // Split news into chunks of 6 to insert ads in between
  const chunks: NewsItem[][] = [];
  for (let i = 0; i < filtered.length; i += 6) {
    chunks.push(filtered.slice(i, i + 6));
  }

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary mb-2">📰 الأخبار الاقتصادية</h1>
        <p className="text-text-secondary">آخر أخبار الأسواق المالية والعملات</p>
      </div>

      {/* فلاتر المصادر */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sources.map((src) => (
          <button
            key={src}
            onClick={() => setFilter(src)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === src
                ? "bg-gold text-background"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {src}
          </button>
        ))}
      </div>

      {/* إعلان بعد الفلاتر */}
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
            {chunks.map((chunk, chunkIdx) => (
              <Fragment key={chunkIdx}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chunk.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target={item.url.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="bg-surface border border-border rounded-2xl p-5 hover:border-gold/30 transition-all group flex flex-col"
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
                        اقرأ المزيد ←
                      </div>
                    </a>
                  ))}
                </div>
                {/* إعلان بين كل 6 أخبار (ليس بعد الأخير) */}
                {chunkIdx < chunks.length - 1 && (
                  <div className="my-8">
                    <AdSlot size="leaderboard" slot="3456789014" />
                    <AdSlot size="mobile-banner" slot="3456789015" />
                  </div>
                )}
              </Fragment>
            ))}
          </>
        ) : (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-5xl mb-4">📡</p>
            <p className="text-lg font-medium">لا توجد أخبار متاحة حالياً</p>
            <p className="text-sm mt-2">يُرجى المحاولة لاحقاً</p>
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <div className="mt-8 text-center text-text-secondary text-xs">
          المصادر: BBC عربي • الجزيرة • أرقام • مباشر — تُحدَّث كل 15 دقيقة
        </div>
      )}
    </div>
  );
}
