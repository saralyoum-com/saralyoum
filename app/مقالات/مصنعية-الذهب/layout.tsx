import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مصنعية الذهب — ما هي؟ ولماذا تختلف؟ وهل تُسترد عند البيع؟",
  description:
    "دليل شامل لمصنعية الذهب: ما هي، لماذا تختلف من محل لآخر، متوسطها في السعودية والإمارات ومصر وعُمان، هل تُسترد عند البيع، وكيف توفّر فيها.",
  keywords: [
    "مصنعية الذهب",
    "كم مصنعية الذهب اليوم",
    "مصنعية الذهب عيار 21",
    "مصنعية الذهب في السعودية",
    "مصنعية الذهب في الإمارات",
    "هل تسترد المصنعية عند البيع",
    "أجرة الصياغة",
    "gold making charge",
    "gold making charge Saudi Arabia",
  ],
  openGraph: {
    title: "مصنعية الذهب — دليل شامل | سعر الذهب",
    description:
      "ما هي المصنعية، لماذا تختلف، متوسطها في الدول العربية، وهل تُسترد عند البيع.",
    type: "article",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=gold",
        width: 1200,
        height: 630,
        alt: "مصنعية الذهب — دليل شامل",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/مصنعية-الذهب" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "مصنعية الذهب — ما هي؟ ولماذا تختلف؟ وهل تُسترد عند البيع؟",
    description: "دليل شامل لمصنعية الذهب: ما هي، لماذا تختلف، متوسطها في الدول العربية، وهل تُسترد عند البيع.",
    datePublished: "2026-06-24",
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "sardhahab.com" },
    publisher: {
      "@type": "Organization",
      name: "sardhahab.com",
      url: "https://sardhahab.com",
    },
    mainEntityOfPage: "https://sardhahab.com/مقالات/مصنعية-الذهب",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "مقالات", item: "https://sardhahab.com/مقالات" },
      { "@type": "ListItem", position: 3, name: "مصنعية الذهب", item: "https://sardhahab.com/مقالات/مصنعية-الذهب" },
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
