import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سعر الذهب اليوم — عيار 24 و21 و18 بالجرام والأونصة (2026)",
  description:
    "سعر الذهب اليوم بالجرام والأونصة لجميع العيارات 24 و22 و21 و18. تعرف على العوامل المؤثرة في السعر اليومي، وكيف تقرأ حركة السوق لاتخاذ قرار الشراء أو البيع.",
  keywords: [
    "سعر الذهب اليوم",
    "سعر الذهب اليوم بالجرام",
    "سعر الذهب اليوم عيار 21",
    "سعر الذهب اليوم عيار 24",
    "سعر الذهب الآن",
    "سعر الأونصة الذهب",
    "gold price today",
    "سعر الذهب لحظياً",
    "كم سعر الذهب اليوم",
    "سعر الذهب في السوق",
  ],
  openGraph: {
    title: "سعر الذهب اليوم — عيار 24 و21 و18 | سعر الذهب",
    description:
      "سعر الذهب اليوم بالجرام لجميع العيارات مع تحليل الأسباب وكيفية قراءة حركة السوق.",
    type: "article",
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/سعر-الذهب-اليوم" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "سعر الذهب اليوم — عيار 24 و21 و18 بالجرام والأونصة",
    description: "دليل شامل لفهم سعر الذهب اليومي وعوامله وكيفية قراءة السوق",
    url: "https://sardhahab.com/مقالات/سعر-الذهب-اليوم",
    publisher: { "@type": "Organization", name: "سعر الذهب", url: "https://sardhahab.com" },
    datePublished: "2026-04-18",
    dateModified: "2026-04-18",
    inLanguage: "ar",
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "المقالات", item: "https://sardhahab.com/مقالات" },
      { "@type": "ListItem", position: 3, name: "سعر الذهب اليوم", item: "https://sardhahab.com/مقالات/سعر-الذهب-اليوم" },
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
