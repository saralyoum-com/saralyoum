"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageContext";
import { ARTICLES } from "@/lib/articles";
import { track } from "@/lib/analytics";

export default function ArticlesPage() {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-2xl">
            📝
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary">
              {lang === "ar" ? "المقالات" : "Articles"}
            </h1>
            <p className="text-text-secondary text-sm">
              {lang === "ar" ? "تحليلات وشروحات عن الذهب والأسواق" : "Gold & market analysis and guides"}
            </p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            href={`/مقالات/${article.slug}`}
            onClick={() => track.navClick(`article-${article.slug}`)}
            className="bg-surface border border-border rounded-2xl p-5 hover:border-gold/30 transition-all group"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{article.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-text-secondary text-xs">
                    {lang === "ar" ? `${article.readMins} دقائق` : `${article.readMins} min read`}
                  </span>
                </div>
                <h2 className="font-bold text-text-primary text-sm sm:text-base leading-snug group-hover:text-gold transition-colors line-clamp-2">
                  {lang === "ar" ? article.titleAr : article.titleEn}
                </h2>
              </div>
            </div>
            <p className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-2">
              {lang === "ar" ? article.descAr : article.descEn}
            </p>
            <p className="text-text-secondary text-xs mt-3">
              {new Date(article.date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
