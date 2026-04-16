import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في عُمان اليوم بالريال العُماني",
  description: "سعر الذهب في سلطنة عُمان اليوم بالريال العُماني — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في عمان", "سعر الذهب اليوم بالريال العماني", "سعر جرام الذهب في مسقط", "عيار 21 في عمان", "سعر الذهب مسقط"],
  openGraph: { title: "سعر الذهب في عُمان اليوم — سعر الذهب", description: "أسعار الذهب بالريال العُماني لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-عمان" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في عُمان", item: "https://sardhahab.com/سعر-الذهب-عمان" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
