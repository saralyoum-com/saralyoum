"use client";

import { useLang } from "@/components/LanguageContext";

type Section = { h: string; p: string };

const txt = {
  ar: {
    title: "إخلاء المسؤولية",
    updated: "آخر تحديث: أبريل 2026",
    banner:
      "المحتوى المعروض على هذا الموقع لأغراض تعليمية وإعلامية فقط. لا يمثل نصيحة استثمارية أو مالية. الاستثمار ينطوي على مخاطر. استشر مستشاراً مالياً مرخصاً قبل أي قرار.",
    sections: [
      {
        h: "1. طبيعة المعلومات",
        p: 'تُقدّم المعلومات والبيانات والأسعار الواردة في موقع "سعر الذهب" لأغراض إعلامية وتعليمية عامة فحسب. لا تُشكّل هذه المعلومات بأي شكل من الأشكال نصيحةً استثمارية أو مالية أو قانونية أو توصيةً بشراء أو بيع أي أصل مالي أو عملة رقمية أو سلعة.',
      },
      {
        h: "2. دقة البيانات",
        p: "رغم حرصنا على تقديم بيانات دقيقة ومحدّثة، لا يضمن الموقع دقة أو اكتمال أو حداثة أي معلومة. الأسعار المعروضة مؤشرية وقد تختلف عن أسعار التداول الفعلية في الأسواق. لا يتحمل الموقع أي مسؤولية عن أخطاء أو تأخيرات في البيانات.",
      },
      {
        h: "3. مخاطر الاستثمار",
        p: "الاستثمار في الأصول المالية بما فيها الذهب والفضة والعملات الرقمية ينطوي على مخاطر عالية بما فيها خسارة رأس المال كلياً أو جزئياً. الأداء السابق لا يضمن نتائج مستقبلية. أسعار العملات الرقمية شديدة التقلب وقد تتغير بشكل حاد وسريع.",
      },
      {
        h: "4. الإشارات التقنية",
        p: "الإشارات التقنية المعروضة (RSI، المتوسطات المتحركة) هي أدوات تحليلية إحصائية ولا تُعدّ ضماناً لأداء مستقبلي. تُقدَّم هذه الإشارات بصفتها معلومات فقط وليست نصائح استثمارية بأي حال من الأحوال.",
      },
      {
        h: "5. المصادر الخارجية",
        p: "يعتمد الموقع على مصادر بيانات خارجية (GoldAPI، CoinGecko، ExchangeRate-API) ولا يتحكم في صحة أو استمرارية هذه الخدمات. الأخبار الواردة مصدرها وكالات خارجية والموقع غير مسؤول عن محتواها.",
      },
      {
        h: "6. التنبيهات",
        p: "خدمة التنبيهات الإلكترونية تُقدَّم لأغراض إعلامية فقط. لا تُعدّ التنبيهات توصيات للشراء أو البيع. قد تتأخر التنبيهات أو لا تصل لأسباب تقنية خارجة عن إرادتنا.",
      },
      {
        h: "7. حدود المسؤولية",
        p: 'لا يتحمل موقع "سعر الذهب" وإدارته وكل من يعمل به أي مسؤولية عن أي خسائر أو أضرار مباشرة أو غير مباشرة ناجمة عن الاعتماد على المعلومات الواردة في الموقع. يتحمل المستخدم وحده مسؤولية قراراته الاستثمارية.',
      },
    ] as Section[],
    noticeTitle: "تنبيه مهم",
    notice:
      "قبل اتخاذ أي قرار استثماري، يُنصح بشدة باستشارة مستشار مالي مرخص ومؤهل يأخذ في الاعتبار وضعك المالي الشخصي وأهدافك وقدرتك على تحمل المخاطر.",
  },
  en: {
    title: "Disclaimer",
    updated: "Last updated: April 2026",
    banner:
      "The content on this website is for educational and informational purposes only. It does not constitute investment or financial advice. Investing involves risk. Consult a licensed financial advisor before any decision.",
    sections: [
      {
        h: "1. Nature of the information",
        p: 'The information, data, and prices on the "SARD Gold Price" website are provided for general informational and educational purposes only. They do not in any way constitute investment, financial, or legal advice, or a recommendation to buy or sell any financial asset, cryptocurrency, or commodity.',
      },
      {
        h: "2. Data accuracy",
        p: "While we strive to provide accurate and up-to-date data, the site does not guarantee the accuracy, completeness, or timeliness of any information. Displayed prices are indicative and may differ from actual trading prices in the markets. The site bears no responsibility for errors or delays in the data.",
      },
      {
        h: "3. Investment risks",
        p: "Investing in financial assets — including gold, silver, and cryptocurrencies — involves high risk, including the total or partial loss of capital. Past performance does not guarantee future results. Cryptocurrency prices are highly volatile and can change sharply and quickly.",
      },
      {
        h: "4. Technical indicators",
        p: "The technical indicators displayed (RSI, moving averages) are statistical analytical tools and are not a guarantee of future performance. These indicators are provided as information only and are not investment advice under any circumstances.",
      },
      {
        h: "5. External sources",
        p: "The site relies on external data sources (GoldAPI, CoinGecko, ExchangeRate-API) and does not control the validity or continuity of these services. News items originate from external agencies, and the site is not responsible for their content.",
      },
      {
        h: "6. Alerts",
        p: "The email alerts service is provided for informational purposes only. Alerts are not recommendations to buy or sell. Alerts may be delayed or fail to arrive for technical reasons beyond our control.",
      },
      {
        h: "7. Limitation of liability",
        p: 'The "SARD Gold Price" website, its management, and everyone working on it bear no responsibility for any direct or indirect losses or damages resulting from reliance on the information on the site. Users alone are responsible for their investment decisions.',
      },
    ] as Section[],
    noticeTitle: "Important notice",
    notice:
      "Before making any investment decision, we strongly recommend consulting a licensed, qualified financial advisor who takes into account your personal financial situation, goals, and risk tolerance.",
  },
};

export default function DisclaimerPage() {
  const { lang } = useLang();
  const t = txt[lang];

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-text-primary mb-2">{t.title}</h1>
      <p className="text-text-secondary text-sm mb-8">{t.updated}</p>

      <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6 mb-8">
        <p className="text-gold font-bold text-lg leading-relaxed">{t.banner}</p>
      </div>

      <div className="space-y-6 text-text-secondary leading-relaxed">
        {t.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-text-primary font-bold text-xl mb-3">{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}

        <div className="bg-surface border border-border rounded-xl p-5 text-sm">
          <p className="font-bold text-text-primary mb-2">{t.noticeTitle}</p>
          <p>{t.notice}</p>
        </div>
      </div>
    </div>
  );
}
