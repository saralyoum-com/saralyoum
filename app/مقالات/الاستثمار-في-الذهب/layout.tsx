import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الاستثمار في الذهب — كيف تستثمر بمبلغ صغير أو كبير (دليل 2026)",
  description: "كيف استثمر في الذهب؟ دليل شامل للمبتدئين: سبائك، حسابات ذهب بنكية، صناديق ETF، ذهب رقمي — مقارنة عملية مع خطوات البدء بأقل من 100 ريال وأفضل وقت للشراء.",
  keywords: [
    "الاستثمار في الذهب",
    "كيف استثمر في الذهب",
    "كيف أستثمر في الذهب",
    "كيفية الاستثمار في الذهب",
    "كيف استثمر مبلغ صغير في الذهب",
    "استثمار الذهب للمبتدئين",
    "استثمار في الذهب للمبتدئين",
    "كيف تستثمر في الذهب",
    "شراء الذهب كاستثمار",
    "سبائك الذهب",
    "صناديق الذهب ETF",
    "الاستثمار في الذهب للمبتدئين",
    "أفضل طريقة للاستثمار في الذهب",
    "حسابات الذهب البنكية",
  ],
  openGraph: {
    title: "الاستثمار في الذهب — كيف تستثمر بمبلغ صغير أو كبير (دليل 2026)",
    description: "كيف استثمر في الذهب؟ سبائك، حسابات بنكية، صناديق ETF — مقارنة عملية مع خطوات البدء بأقل من 100 ريال.",
    type: "article",
    publishedTime: "2026-04-08",
    modifiedTime: "2026-05-30",
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/الاستثمار-في-الذهب" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "الاستثمار في الذهب — كيف تستثمر بمبلغ صغير أو كبير (دليل 2026)",
            description: "كيف استثمر في الذهب؟ دليل شامل للمبتدئين: سبائك، حسابات ذهب بنكية، صناديق ETF — مقارنة عملية مع خطوات البدء بأقل من 100 ريال",
            datePublished: "2026-04-08",
            dateModified: "2026-05-30",
            author: { "@type": "Organization", name: "سعر الذهب", url: "https://sardhahab.com" },
            publisher: {
              "@type": "Organization",
              name: "سعر الذهب",
              url: "https://sardhahab.com",
              logo: { "@type": "ImageObject", url: "https://sardhahab.com/icons/icon-512.png" },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://sardhahab.com/مقالات/الاستثمار-في-الذهب" },
            inLanguage: "ar",
            image: { "@type": "ImageObject", url: "https://sardhahab.com/api/og?asset=gold" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
              { "@type": "ListItem", position: 2, name: "مقالات", item: "https://sardhahab.com/مقالات" },
              { "@type": "ListItem", position: 3, name: "كيف أستثمر في الذهب؟", item: "https://sardhahab.com/مقالات/الاستثمار-في-الذهب" },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
