import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أسعار الذهب والفضة والعملات الرقمية",
  description:
    "أسعار لحظية للذهب عيار 24/22/21/18 والفضة والبيتكوين والإيثيريوم وأكثر من 27 عملة عربية وعالمية محدّثة باستمرار من مصادر موثوقة.",
  keywords: [
    "سعر الذهب اليوم",
    "سعر عيار 21",
    "سعر عيار 24",
    "سعر عيار 22",
    "سعر عيار 18",
    "سعر الفضة",
    "سعر البيتكوين",
    "الريال السعودي",
    "الدرهم الإماراتي",
    "سعر الدولار",
    "أسعار العملات العربية",
  ],
  openGraph: {
    title: "أسعار الذهب والفضة والعملات — سعر الذهب",
    description: "أسعار لحظية للذهب والفضة وأكثر من 27 عملة محدّثة باستمرار",
    type: "website",
  },
  alternates: {
    canonical: "https://sardhahab.com/اسعار",
  },
};

export default function PricesLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "أسعار الذهب والعملات", item: "https://sardhahab.com/اسعار" },
    ],
  };

  const financeJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "أسعار الذهب والفضة والعملات الرقمية اليوم",
    description: "أسعار لحظية للذهب والفضة والبيتكوين والإيثيريوم وأكثر من 27 عملة",
    url: "https://sardhahab.com/اسعار",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "سعر الذهب اليوم" },
      { "@type": "ListItem", position: 2, name: "سعر الفضة اليوم" },
      { "@type": "ListItem", position: 3, name: "سعر البيتكوين اليوم" },
      { "@type": "ListItem", position: 4, name: "سعر الإيثيريوم اليوم" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(financeJsonLd) }} />
      {children}
    </>
  );
}
