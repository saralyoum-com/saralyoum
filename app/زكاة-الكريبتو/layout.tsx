import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حاسبة زكاة الكريبتو — زكاة البيتكوين والإيثيريوم",
  description:
    "احسب زكاة عملاتك الرقمية بدقة — بيتكوين وإيثيريوم وغيرها. النصاب لحظياً، آراء العلماء، وحساب فوري بعملتك المحلية.",
  keywords: [
    "زكاة الكريبتو",
    "زكاة البيتكوين",
    "زكاة العملات الرقمية",
    "حاسبة زكاة بيتكوين",
    "هل في زكاة على البيتكوين",
    "نصاب الكريبتو",
    "زكاة الإيثيريوم",
    "زكاة crypto",
    "bitcoin zakat calculator",
    "زكاة العملات المشفرة",
  ],
  openGraph: {
    title: "حاسبة زكاة الكريبتو | بيتكوين وإيثيريوم — سعر الذهب",
    description:
      "احسب زكاة البيتكوين والإيثيريوم وكل عملاتك الرقمية بأسعار لحظية وآراء العلماء.",
    type: "website",
  },
  alternates: { canonical: "https://sardhahab.com/زكاة-الكريبتو" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "حاسبة زكاة الكريبتو", item: "https://sardhahab.com/زكاة-الكريبتو" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
