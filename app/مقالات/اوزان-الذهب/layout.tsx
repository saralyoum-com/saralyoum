import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اونصة الذهب كم جرام؟ — دليل أوزان الذهب: الأونصة والجنيه والتولة",
  description:
    "أونصة الذهب تساوي 31.1035 جرام. الفرق بين أونصة الذهب والأونصة العادية، وكم جرام في الجنيه الذهب والليرة والتولة والمثقال، مع طريقة حساب قيمة أي وزن.",
  keywords: [
    "اونصة الذهب كم جرام",
    "اونصة الذهب كم جرام عيار 21",
    "الاونصة كم جرام ذهب",
    "جنيه الذهب كم جرام",
    "الليرة الذهب كم جرام",
    "التولة كم جرام",
    "اوزان الذهب",
    "كيلو الذهب كم اونصة",
    "gold ounce in grams",
    "troy ounce gold grams",
  ],
  openGraph: {
    title: "اونصة الذهب كم جرام؟ — دليل أوزان الذهب | سعر الذهب",
    description:
      "الأونصة 31.1035 جرام، والفرق بينها وبين الأونصة العادية، وأوزان الجنيه والليرة والتولة.",
    type: "article",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=gold",
        width: 1200,
        height: 630,
        alt: "اونصة الذهب كم جرام — دليل أوزان الذهب",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/اوزان-الذهب" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "اونصة الذهب كم جرام؟ — دليل أوزان الذهب: الأونصة والجنيه والتولة",
    description:
      "أونصة الذهب تساوي 31.1035 جرام. الفرق بين الأونصة الترويّة والعادية، وأوزان الجنيه والليرة والتولة والمثقال.",
    datePublished: "2026-08-26",
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "sardhahab.com" },
    publisher: {
      "@type": "Organization",
      name: "sardhahab.com",
      url: "https://sardhahab.com",
    },
    mainEntityOfPage: "https://sardhahab.com/مقالات/اوزان-الذهب",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "مقالات", item: "https://sardhahab.com/مقالات" },
      { "@type": "ListItem", position: 3, name: "أوزان الذهب", item: "https://sardhahab.com/مقالات/اوزان-الذهب" },
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
