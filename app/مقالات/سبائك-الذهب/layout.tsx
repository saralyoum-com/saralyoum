import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سبائك الذهب للمبتدئين — الأوزان والأسعار وكيف تشتري أول سبيكة",
  description:
    "دليل شراء سبائك الذهب: الأوزان الشائعة من 1 جرام إلى الكيلو، كيف يحسب سعر السبيكة وعلاوة السك، الفرق بينها وبين المشغولات للاستثمار، والضريبة في الدول العربية.",
  keywords: [
    "سبائك الذهب",
    "اسعار سبائك الذهب",
    "سعر سبيكة الذهب اليوم",
    "سبيكة ذهب 10 جرام",
    "سبيكة ذهب 5 جرام",
    "شراء سبائك الذهب",
    "افضل سبائك الذهب",
    "الذهب الاستثماري",
    "gold bullion bars",
    "gold bar prices",
  ],
  openGraph: {
    title: "سبائك الذهب للمبتدئين — دليل شامل | سعر الذهب",
    description:
      "الأوزان والأسعار وعلاوة السك، وكيف تشتري أول سبيكة بأمان وتخزنها وتبيعها.",
    type: "article",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=gold",
        width: 1200,
        height: 630,
        alt: "سبائك الذهب — دليل المبتدئين",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/سبائك-الذهب" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "سبائك الذهب للمبتدئين — الأوزان والأسعار وكيف تشتري أول سبيكة",
    description:
      "دليل شراء سبائك الذهب: الأوزان الشائعة، حساب سعر السبيكة وعلاوة السك، والمقارنة مع المشغولات للاستثمار.",
    datePublished: "2026-07-16",
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "sardhahab.com" },
    publisher: {
      "@type": "Organization",
      name: "sardhahab.com",
      url: "https://sardhahab.com",
    },
    mainEntityOfPage: "https://sardhahab.com/مقالات/سبائك-الذهب",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "مقالات", item: "https://sardhahab.com/مقالات" },
      { "@type": "ListItem", position: 3, name: "سبائك الذهب", item: "https://sardhahab.com/مقالات/سبائك-الذهب" },
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
