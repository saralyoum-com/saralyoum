import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "كيف أستثمر في الذهب؟ — الدليل الشامل للمبتدئين 2026",
  description: "كيف تستثمر في الذهب بمبلغ صغير أو كبير: سبائك، ETF، مجوهرات، وذهب رقمي — مقارنة شاملة بين كل الطرق مع نصائح عملية للمبتدئين.",
  keywords: [
    "الاستثمار في الذهب",
    "كيف استثمر في الذهب",
    "كيف أستثمر في الذهب",
    "كيفية الاستثمار في الذهب",
    "كيف استثمر مبلغ صغير في الذهب",
    "شراء الذهب كاستثمار",
    "سبائك الذهب",
    "صناديق الذهب ETF",
    "الاستثمار في الذهب للمبتدئين",
  ],
  openGraph: {
    title: "كيف أستثمر في الذهب؟ — الدليل الشامل 2026 | سعر الذهب",
    description: "كيف تستثمر في الذهب بمبلغ صغير أو كبير: سبائك، ETF، مجوهرات، وذهب رقمي — مقارنة شاملة للمبتدئين.",
    type: "article",
    publishedTime: "2026-04-08",
    modifiedTime: "2026-05-19",
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
            headline: "كيف أستثمر في الذهب؟ — الدليل الشامل للمبتدئين 2026",
            description: "كيف تستثمر في الذهب بمبلغ صغير أو كبير: سبائك، ETF، مجوهرات، وذهب رقمي",
            datePublished: "2026-04-08",
            dateModified: "2026-05-19",
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
