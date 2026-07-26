"use client";

import { useLang } from "@/components/LanguageContext";

/* ─── shared types ─── */
export interface ContentSection {
  ar: { heading: string; body: string | string[] };
  en: { heading: string; body: string | string[] };
}

export interface CountryDealer {
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
}

export interface CountryFAQ {
  q: { ar: string; en: string };
  a: { ar: string; en: string };
}

interface Props {
  countryAr: string;
  countryEn: string;
  intro: ContentSection;
  market: ContentSection;
  culture: ContentSection;
  dealers: ContentSection;
  history: ContentSection;
  buyingGuide: ContentSection;
  faq: CountryFAQ[];
}

export default function CountryContent({
  countryAr, countryEn,
  intro, market, culture, dealers, history, buyingGuide, faq,
}: Props) {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const renderBody = (body: string | string[]) => {
    if (Array.isArray(body)) {
      return (
        <ul className="space-y-2 text-text-secondary text-sm sm:text-base leading-relaxed list-disc pr-5">
          {body.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    }
    return body.split("\n").filter(p => p.trim()).map((p, i) => (
      <p key={i} className="text-text-secondary text-sm sm:text-base leading-relaxed mb-3">{p}</p>
    ));
  };

  const section = (s: ContentSection) => {
    const data = lang === "ar" ? s.ar : s.en;
    return (
      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
          {data.heading}
        </h2>
        {renderBody(data.body)}
      </section>
    );
  };

  /* No FAQPage JSON-LD here on purpose. Google deprecated FAQ rich results on
     7 May 2026 and the schema was removed sitewide; it only produced duplicate
     field errors in Search Console. The FAQ below stays as visible on-page
     content, which is what actually helps these pages rank. */

  return (
    <section dir={dir} className="max-w-4xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8">
        {section(intro)}
        {section(market)}
        {section(culture)}
        {section(dealers)}
        {section(history)}
        {section(buyingGuide)}

        {/* FAQ */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">
            {lang === "ar"
              ? `أسئلة شائعة عن الذهب في ${countryAr}`
              : `FAQ — Gold in ${countryEn}`}
          </h2>
          <div className="space-y-3">
            {faq.map((f, i) => (
              <details key={i} className="bg-surface-2 border border-border rounded-xl p-4 group">
                <summary className="font-bold text-text-primary cursor-pointer text-sm sm:text-base list-none flex items-center justify-between">
                  <span>{lang === "ar" ? f.q.ar : f.q.en}</span>
                  <span className="text-gold text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-text-secondary text-sm leading-relaxed mt-3">
                  {lang === "ar" ? f.a.ar : f.a.en}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
