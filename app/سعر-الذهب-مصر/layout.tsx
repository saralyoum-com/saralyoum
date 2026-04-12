import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في مصر اليوم بالجنيه",
  description: "سعر الذهب في مصر اليوم بالجنيه المصري — عيار 24 و21 و18 بالجرام في القاهرة، محدّث لحظياً.",
  keywords: ["سعر الذهب في مصر", "سعر الذهب اليوم بالجنيه", "سعر جرام الذهب مصر", "عيار 21 مصر", "gold price Egypt pound"],
  openGraph: { title: "سعر الذهب في مصر — سعر الذهب", description: "أسعار الذهب بالجنيه المصري لحظياً", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-مصر" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" }, { "@type": "ListItem", position: 2, name: "سعر الذهب في مصر", item: "https://sardhahab.com/سعر-الذهب-مصر" }] };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
