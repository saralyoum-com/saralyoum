import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سعر البيتكوين اليوم بالريال السعودي — البيتكوين مقابل الريال 2026",
  description:
    "سعر البيتكوين اليوم بالريال السعودي والدرهم الإماراتي والدينار الكويتي والجنيه المصري لحظياً — البيتكوين مقابل الريال محدّث كل 5 دقائق مع حاسبة تحويل BTC لكل العملات العربية.",
  keywords: [
    "سعر البيتكوين اليوم",
    "البيتكوين مقابل الريال",
    "البتكوين مقابل الريال",
    "سعر البيتكوين بالريال السعودي",
    "سعر البيتكوين اليوم بالريال السعودي",
    "كم سعر البيتكوين بالريال السعودي",
    "سعر البيتكوين بالدرهم",
    "سعر البيتكوين بالريال",
    "سعر البتكوين بالريال",
    "بيتكوين بالدينار الكويتي",
    "سعر البيتكوين بالجنيه المصري",
    "سعر العملات الرقمية اليوم",
    "bitcoin price in SAR",
    "BTC سعر",
  ],
  openGraph: {
    title: "سعر البيتكوين اليوم بالريال السعودي — البيتكوين مقابل الريال",
    description:
      "البيتكوين مقابل الريال السعودي والدرهم الإماراتي والدينار الكويتي لحظياً — محدّث كل 5 دقائق.",
    type: "website",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=bitcoin",
        width: 1200,
        height: 630,
        alt: "سعر البيتكوين اليوم",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/سعر-البيتكوين" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const now = new Date().toISOString();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر البيتكوين", item: "https://sardhahab.com/سعر-البيتكوين" },
    ],
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "سعر البيتكوين اليوم بالعملات العربية",
    description: "سعر البيتكوين (BTC) لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي والجنيه المصري وجميع العملات العربية — محدّث كل 5 دقائق.",
    url: "https://sardhahab.com/سعر-البيتكوين",
    creator: { "@type": "Organization", name: "سعر الذهب", url: "https://sardhahab.com" },
    dateModified: now,
    temporalCoverage: now.slice(0, 10),
    inLanguage: "ar",
    license: "https://creativecommons.org/licenses/by/4.0/",
    distribution: [{
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: "https://sardhahab.com/api/prices?type=crypto",
    }],
    variableMeasured: [
      { "@type": "PropertyValue", name: "Bitcoin USD", unitText: "USD" },
      { "@type": "PropertyValue", name: "Bitcoin SAR", unitText: "SAR" },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: "https://sardhahab.com/سعر-البيتكوين",
    name: "سعر البيتكوين اليوم",
    dateModified: now,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".price-display", ".price-hero", "[data-speakable]"],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      {children}
    </>
  );
}
