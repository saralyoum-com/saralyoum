import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سعر الفضة اليوم — عيار 999 و925 بالجرام والأونصة",
  description:
    "سعر الفضة اليوم بالدولار والريال والدرهم — عيار 999 (فضة خالصة) وعيار 925 (فضة ستيرلينج) بالجرام والأونصة، مع مقارنة بالذهب ونصائح للمستثمرين.",
  keywords: [
    "سعر الفضة اليوم",
    "سعر الفضة",
    "silver price today",
    "سعر الفضة بالجرام",
    "سعر الفضة عيار 999",
    "سعر الفضة عيار 925",
    "الاستثمار في الفضة",
    "سعر الأونصة الفضة",
    "الفضة مقابل الذهب",
    "هل الفضة استثمار جيد",
  ],
  openGraph: {
    title: "سعر الفضة اليوم | sardhahab.com",
    description:
      "سعر الفضة اليوم بالجرام والأونصة — عيار 999 و925 — مع مقارنة بالذهب وتوقعات المحللين.",
    type: "article",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=gold",
        width: 1200,
        height: 630,
        alt: "سعر الفضة اليوم",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/سعر-الفضة-اليوم" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "سعر الفضة اليوم — عيار 999 و925 بالجرام والأونصة",
    description:
      "سعر الفضة اليوم بالدولار والريال والدرهم — مع مقارنة بالذهب ونصائح للاستثمار.",
    datePublished: "2026-05-10",
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "sardhahab.com" },
    publisher: {
      "@type": "Organization",
      name: "sardhahab.com",
      url: "https://sardhahab.com",
    },
    mainEntityOfPage: "https://sardhahab.com/مقالات/سعر-الفضة-اليوم",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "مقالات", item: "https://sardhahab.com/مقالات" },
      { "@type": "ListItem", position: 3, name: "سعر الفضة اليوم", item: "https://sardhahab.com/مقالات/سعر-الفضة-اليوم" },
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
