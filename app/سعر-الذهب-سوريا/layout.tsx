import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في سوريا اليوم بالليرة السورية",
  description: "سعر الذهب في سوريا اليوم بالليرة السورية — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في سوريا", "سعر الذهب اليوم بالليرة السورية", "سعر جرام الذهب في دمشق", "عيار 21 في سوريا", "سعر الذهب دمشق"],
  openGraph: { title: "سعر الذهب في سوريا اليوم — سعر الذهب", description: "أسعار الذهب بالليرة السورية لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-سوريا" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في سوريا", item: "https://sardhahab.com/سعر-الذهب-سوريا" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
