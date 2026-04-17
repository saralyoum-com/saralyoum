import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في السودان اليوم بالجنيه السوداني",
  description: "سعر الذهب في السودان اليوم بالجنيه السوداني — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في السودان", "سعر الذهب اليوم بالجنيه السوداني", "سعر جرام الذهب في الخرطوم", "عيار 21 في السودان", "سعر الذهب الخرطوم"],
  openGraph: { title: "سعر الذهب في السودان اليوم — سعر الذهب", description: "أسعار الذهب بالجنيه السوداني لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-السودان" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في السودان", item: "https://sardhahab.com/سعر-الذهب-السودان" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
