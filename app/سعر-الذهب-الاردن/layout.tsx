import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في الأردن اليوم بالدينار",
  description: "سعر الذهب في الأردن اليوم بالدينار الأردني — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في الأردن", "سعر الذهب اليوم بالدينار الأردني", "سعر جرام الذهب بالدينار", "عيار 21 بالدينار", "سعر الذهب عمان"],
  openGraph: { title: "سعر الذهب في الأردن اليوم — سعر الذهب", description: "أسعار الذهب بالدينار الأردني لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-الاردن" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في الأردن", item: "https://sardhahab.com/سعر-الذهب-الاردن" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
