import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في لبنان اليوم بالليرة اللبنانية",
  description: "سعر الذهب في لبنان اليوم بالليرة اللبنانية — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في لبنان", "سعر الذهب اليوم بالليرة اللبنانية", "سعر جرام الذهب في بيروت", "عيار 21 في لبنان", "سعر الذهب بيروت"],
  openGraph: { title: "سعر الذهب في لبنان اليوم — سعر الذهب", description: "أسعار الذهب بالليرة اللبنانية لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-لبنان" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في لبنان", item: "https://sardhahab.com/سعر-الذهب-لبنان" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
