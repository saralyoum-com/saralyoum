import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في ليبيا اليوم بالدينار الليبي",
  description: "سعر الذهب في ليبيا اليوم بالدينار الليبي — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في ليبيا", "سعر الذهب اليوم بالدينار الليبي", "سعر جرام الذهب في طرابلس", "عيار 21 في ليبيا", "سعر الذهب طرابلس"],
  openGraph: { title: "سعر الذهب في ليبيا اليوم — سعر الذهب", description: "أسعار الذهب بالدينار الليبي لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-ليبيا" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في ليبيا", item: "https://sardhahab.com/سعر-الذهب-ليبيا" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
