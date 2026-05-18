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
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الإيثيريوم", item: "https://sardhahab.com/سعر-الاثيريوم" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
