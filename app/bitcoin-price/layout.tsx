import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سعر البيتكوين اليوم بالريال السعودي والدرهم والدينار",
  description:
    "سعر البيتكوين (BTC) لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي والجنيه المصري وجميع العملات العربية — محدّث كل 5 دقائق.",
  keywords: [
    "سعر البيتكوين اليوم",
    "سعر بيتكوين بالريال السعودي",
    "سعر BTC بالريال",
    "سعر البيتكوين بالدرهم",
    "بيتكوين بالدينار الكويتي",
    "سعر البيتكوين بالجنيه المصري",
    "سعر العملات الرقمية اليوم",
    "bitcoin price in SAR",
    "bitcoin price in arabic",
    "BTC سعر",
  ],
  openGraph: {
    title: "سعر البيتكوين اليوم — سعر الذهب",
    description:
      "سعر BTC لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي وجميع العملات العربية.",
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
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر البيتكوين", item: "https://sardhahab.com/سعر-البيتكوين" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
