import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "توقعات سعر الذهب 2026 — هل يصل إلى 4000 دولار؟",
  description:
    "تحليل شامل لتوقعات سعر الذهب في 2026: آراء Goldman Sachs وJPMorgan، العوامل المؤثرة، والسيناريوهات الثلاثة للأسعار — ما بين 2800 و4500 دولار.",
  keywords: [
    "توقعات سعر الذهب 2026",
    "سعر الذهب 2026",
    "توقعات الذهب العام القادم",
    "هل سيرتفع الذهب 2026",
    "تحليل سعر الذهب",
    "مستقبل سعر الذهب",
    "gold price forecast 2026",
    "gold price prediction 2026",
  ],
  openGraph: {
    title: "توقعات سعر الذهب 2026 | سعر الذهب",
    description:
      "هل يصل الذهب إلى 4000 دولار في 2026؟ آراء كبرى البنوك والعوامل المؤثرة.",
    type: "article",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=gold",
        width: 1200,
        height: 630,
        alt: "توقعات سعر الذهب 2026",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/توقعات-سعر-الذهب-2026" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "توقعات سعر الذهب 2026 — هل يصل إلى 4000 دولار؟",
    description:
      "تحليل شامل لتوقعات سعر الذهب في 2026: آراء المحللين والسيناريوهات المحتملة.",
    datePublished: "2026-04-25",
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "sardhahab.com" },
    publisher: {
      "@type": "Organization",
      name: "sardhahab.com",
      url: "https://sardhahab.com",
    },
    mainEntityOfPage: "https://sardhahab.com/مقالات/توقعات-سعر-الذهب-2026",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "مقالات", item: "https://sardhahab.com/مقالات" },
      { "@type": "ListItem", position: 3, name: "توقعات سعر الذهب 2026", item: "https://sardhahab.com/مقالات/توقعات-سعر-الذهب-2026" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
