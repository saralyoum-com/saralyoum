import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في الكويت اليوم بالدينار",
  description: "سعر الذهب في الكويت اليوم بالدينار الكويتي — عيار 24 و21 و18 بالجرام، محدّث لحظياً.",
  keywords: ["سعر الذهب في الكويت", "سعر جرام الذهب بالدينار الكويتي", "عيار 21 الكويت", "gold price Kuwait dinar"],
  openGraph: { title: "سعر الذهب في الكويت — سعر الذهب", description: "أسعار الذهب بالدينار الكويتي لحظياً", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-الكويت" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" }, { "@type": "ListItem", position: 2, name: "سعر الذهب في الكويت", item: "https://sardhahab.com/سعر-الذهب-الكويت" }] };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
