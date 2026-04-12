import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في البحرين اليوم بالدينار",
  description: "سعر الذهب في البحرين اليوم بالدينار البحريني — عيار 24 و21 و18 بالجرام في المنامة، محدّث لحظياً.",
  keywords: ["سعر الذهب في البحرين", "سعر جرام الذهب بالدينار البحريني", "gold price Bahrain dinar"],
  openGraph: { title: "سعر الذهب في البحرين — سعر الذهب", description: "أسعار الذهب بالدينار البحريني لحظياً", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-البحرين" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" }, { "@type": "ListItem", position: 2, name: "سعر الذهب في البحرين", item: "https://sardhahab.com/سعر-الذهب-البحرين" }] };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
