import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سعر الإيثيريوم اليوم بالريال السعودي والدرهم والدينار",
  description:
    "سعر الإيثيريوم (ETH) لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي والجنيه المصري وجميع العملات العربية — محدّث كل 5 دقائق.",
  keywords: [
    "سعر الإيثيريوم اليوم",
    "سعر ETH بالريال السعودي",
    "سعر الاثيريوم بالريال",
    "سعر الإيثيريوم بالدرهم",
    "إيثيريوم بالدينار الكويتي",
    "سعر الإيثيريوم بالجنيه المصري",
    "ethereum price in SAR",
    "ethereum price arabic",
    "ETH سعر",
    "سعر ايثيريوم اليوم",
  ],
  openGraph: {
    title: "سعر الإيثيريوم اليوم — سعر الذهب",
    description:
      "سعر ETH لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي وجميع العملات العربية.",
    type: "website",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=ethereum",
        width: 1200,
        height: 630,
        alt: "سعر الإيثيريوم اليوم",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/سعر-الاثيريوم" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const now = new Date().toISOString();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الإيثيريوم", item: "https://sardhahab.com/سعر-الاثيريوم" },
    ],
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "سعر الإيثيريوم اليوم بالعملات العربية",
    description: "سعر الإيثيريوم (ETH) لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي والجنيه المصري وجميع العملات العربية — محدّث كل 5 دقائق.",
    url: "https://sardhahab.com/سعر-الاثيريوم",
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
      { "@type": "PropertyValue", name: "Ethereum USD", unitText: "USD" },
      { "@type": "PropertyValue", name: "Ethereum SAR", unitText: "SAR" },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: "https://sardhahab.com/سعر-الاثيريوم",
    name: "سعر الإيثيريوم اليوم",
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
