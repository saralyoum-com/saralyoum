import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في الإمارات اليوم بالدرهم",
  description: "سعر الذهب في الإمارات اليوم بالدرهم الإماراتي — عيار 24 و21 و18 بالجرام في دبي وأبوظبي، محدّث لحظياً.",
  keywords: ["سعر الذهب في الإمارات", "سعر الذهب دبي", "سعر جرام الذهب بالدرهم", "عيار 21 بالدرهم", "gold price UAE dirham"],
  openGraph: { title: "سعر الذهب في الإمارات — سعر الذهب", description: "أسعار الذهب بالدرهم الإماراتي لحظياً", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-الامارات" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" }, { "@type": "ListItem", position: 2, name: "سعر الذهب في الإمارات", item: "https://sardhahab.com/سعر-الذهب-الامارات" }] };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
