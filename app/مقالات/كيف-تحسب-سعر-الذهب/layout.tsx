import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "كيف تحسب سعر الذهب بنفسك؟ طريقة الحساب بالجرام والعيار خطوة بخطوة",
  description:
    "طريقة حساب سعر الذهب بالجرام لأي عيار: المعادلة الأساسية، تحويل سعر الأونصة إلى جرام، حساب سعر الشراء من المحل مع المصنعية والضريبة، وقيمة ذهبك عند البيع.",
  keywords: [
    "كيف احسب سعر الذهب",
    "طريقة حساب الذهب",
    "حساب سعر الذهب بالجرام",
    "حساب بيع الذهب",
    "طريقة حساب سعر الذهب",
    "كيف احسب الذهب",
    "حساب الذهب عيار 21",
    "سعر الجرام من الأونصة",
    "gold price calculation",
    "how to calculate gold price per gram",
  ],
  openGraph: {
    title: "كيف تحسب سعر الذهب بنفسك؟ | سعر الذهب",
    description:
      "المعادلة الأساسية لحساب الذهب بالجرام والعيار، مع أمثلة كاملة للشراء والبيع بالمصنعية والضريبة.",
    type: "article",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=gold",
        width: 1200,
        height: 630,
        alt: "كيف تحسب سعر الذهب بنفسك",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/كيف-تحسب-سعر-الذهب" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "كيف تحسب سعر الذهب بنفسك؟ طريقة الحساب بالجرام والعيار خطوة بخطوة",
    description:
      "طريقة حساب سعر الذهب بالجرام لأي عيار: المعادلة الأساسية، تحويل سعر الأونصة إلى جرام، والسعر النهائي مع المصنعية والضريبة.",
    datePublished: "2026-07-16",
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "sardhahab.com" },
    publisher: {
      "@type": "Organization",
      name: "sardhahab.com",
      url: "https://sardhahab.com",
    },
    mainEntityOfPage: "https://sardhahab.com/مقالات/كيف-تحسب-سعر-الذهب",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "مقالات", item: "https://sardhahab.com/مقالات" },
      { "@type": "ListItem", position: 3, name: "كيف تحسب سعر الذهب", item: "https://sardhahab.com/مقالات/كيف-تحسب-سعر-الذهب" },
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
