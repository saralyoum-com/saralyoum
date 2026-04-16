import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في العراق اليوم بالدينار العراقي",
  description: "سعر الذهب في العراق اليوم بالدينار العراقي — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في العراق", "سعر الذهب اليوم بالدينار العراقي", "سعر جرام الذهب في بغداد", "عيار 21 في العراق", "سعر الذهب بغداد"],
  openGraph: { title: "سعر الذهب في العراق اليوم — سعر الذهب", description: "أسعار الذهب بالدينار العراقي لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-العراق" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في العراق", item: "https://sardhahab.com/سعر-الذهب-العراق" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
