"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageContext";

interface Section {
  heading: string;
  body: string;
}

interface ArticleProps {
  icon: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  date: string;
  readMins: number;
  category: string;
  sectionsAr: Section[];
  sectionsEn: Section[];
}

export default function ArticlePage({
  icon, titleAr, titleEn, descAr, descEn, date, readMins, category,
  sectionsAr, sectionsEn,
}: ArticleProps) {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const title = lang === "ar" ? titleAr : titleEn;
  const desc = lang === "ar" ? descAr : descEn;
  const sections = lang === "ar" ? sectionsAr : sectionsEn;

  return (
    <article dir={dir} className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-text-secondary text-sm mb-6">
        <Link href="/" className="hover:text-gold transition-colors">{lang === "ar" ? "الرئيسية" : "Home"}</Link>
        <span>/</span>
        <Link href="/مقالات" className="hover:text-gold transition-colors">{lang === "ar" ? "المقالات" : "Articles"}</Link>
        <span>/</span>
        <span className="text-text-primary line-clamp-1">{title}</span>
      </nav>

      {/* Hero */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-gold/10 text-gold px-2.5 py-1 rounded-full font-medium">{category}</span>
          <span className="text-text-secondary text-xs">
            {new Date(date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span className="text-text-secondary text-xs">·</span>
          <span className="text-text-secondary text-xs">
            {lang === "ar" ? `${readMins} دقائق قراءة` : `${readMins} min read`}
          </span>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-5xl">{icon}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary leading-snug mb-2">{title}</h1>
            <p className="text-text-secondary text-base leading-relaxed">{desc}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="space-y-6">
        {sections.map((s, i) => (
          <section key={i} className="bg-surface border border-border rounded-2xl p-5">
            <h2 className="text-lg font-bold text-gold mb-3">{s.heading}</h2>
            <p className="text-text-secondary leading-loose text-sm sm:text-base whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 bg-gold/5 border border-gold/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-text-primary mb-1">
            {lang === "ar" ? "🧮 احسب قيمة ذهبك الآن" : "🧮 Calculate your gold now"}
          </p>
          <p className="text-text-secondary text-sm">
            {lang === "ar" ? "استخدم حاسبة الذهب المجانية" : "Use our free gold calculator"}
          </p>
        </div>
        <Link href="/حاسبة-الذهب" className="bg-gold text-background font-bold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-colors whitespace-nowrap">
          {lang === "ar" ? "الحاسبة" : "Calculator"}
        </Link>
      </div>

      {/* Back */}
      <div className="mt-6 text-center">
        <Link href="/مقالات" className="text-gold hover:text-gold-light text-sm font-medium transition-colors">
          ← {lang === "ar" ? "جميع المقالات" : "All Articles"}
        </Link>
      </div>
    </article>
  );
}
