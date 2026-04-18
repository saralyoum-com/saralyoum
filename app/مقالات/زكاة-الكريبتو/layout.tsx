import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "زكاة العملات الرقمية — أحكامها وكيفية حسابها (دليل شامل 2026)",
  description:
    "دليل شامل لزكاة الكريبتو: هل تجب الزكاة على البيتكوين وBNB وSOL؟ النصاب، الحول، نسبة 2.5%، وآراء هيئة كبار العلماء والمجامع الفقهية.",
  keywords: [
    "زكاة العملات الرقمية",
    "زكاة البيتكوين",
    "زكاة الكريبتو",
    "هل تجب الزكاة على البيتكوين",
    "حكم زكاة الكريبتو",
    "زكاة BNB",
    "زكاة سولانا",
    "نصاب الكريبتو",
    "آراء العلماء في الكريبتو",
  ],
  openGraph: {
    title: "زكاة العملات الرقمية — دليل شامل 2026 | سعر الذهب",
    description:
      "هل تجب الزكاة على البيتكوين والإيثيريوم وBNB وSOL؟ الأحكام الفقهية، النصاب، وطريقة الحساب بالتفصيل.",
    type: "article",
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/زكاة-الكريبتو" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "زكاة العملات الرقمية — أحكامها وكيفية حسابها",
    description: "دليل شامل لزكاة الكريبتو: البيتكوين، الإيثيريوم، BNB، SOL والعملات الرقمية الأخرى",
    url: "https://sardhahab.com/مقالات/زكاة-الكريبتو",
    publisher: {
      "@type": "Organization",
      name: "سعر الذهب",
      url: "https://sardhahab.com",
    },
    datePublished: "2026-04-17",
    dateModified: "2026-04-17",
    inLanguage: "ar",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "المقالات", item: "https://sardhahab.com/مقالات" },
      { "@type": "ListItem", position: 3, name: "زكاة العملات الرقمية", item: "https://sardhahab.com/مقالات/زكاة-الكريبتو" },
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
