import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الفرق بين سعر بيع وشراء الذهب — ولماذا تخسر عند إعادة البيع؟",
  description:
    "لماذا يبيعك المحل الذهب بسعر أعلى مما يشتريه منك؟ شرح الفرق بين سعر البيع والشراء، ومكونات الفجوة من مصنعية وهامش وضريبة، وكيف تقلل خسارتك عند إعادة البيع.",
  keywords: [
    "سعر بيع وشراء الذهب",
    "الفرق بين سعر البيع والشراء",
    "سعر شراء الذهب المستعمل",
    "بيع الذهب المستعمل",
    "كم يخصم المحل عند بيع الذهب",
    "سعر الذهب بيع وشراء اليوم",
    "هل الذهب المشغول استثمار",
    "gold buy sell spread",
    "selling used gold",
  ],
  openGraph: {
    title: "سعر بيع وشراء الذهب — لماذا تخسر عند إعادة البيع؟ | سعر الذهب",
    description:
      "مكونات الفجوة بين سعر البيع والشراء بالأرقام، وكيف تقللها من 24% إلى 2%.",
    type: "article",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=gold",
        width: 1200,
        height: 630,
        alt: "الفرق بين سعر بيع وشراء الذهب",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/سعر-بيع-وشراء-الذهب" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "الفرق بين سعر بيع وشراء الذهب — ولماذا تخسر عند إعادة البيع؟",
    description:
      "شرح الفرق بين سعر البيع والشراء في محلات الذهب، ومكونات الفجوة، وكيف تقلل خسارتك عند إعادة البيع.",
    datePublished: "2026-07-16",
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "sardhahab.com" },
    publisher: {
      "@type": "Organization",
      name: "sardhahab.com",
      url: "https://sardhahab.com",
    },
    mainEntityOfPage: "https://sardhahab.com/مقالات/سعر-بيع-وشراء-الذهب",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "مقالات", item: "https://sardhahab.com/مقالات" },
      { "@type": "ListItem", position: 3, name: "سعر بيع وشراء الذهب", item: "https://sardhahab.com/مقالات/سعر-بيع-وشراء-الذهب" },
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
