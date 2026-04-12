import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في قطر اليوم بالريال القطري",
  description: "سعر الذهب في قطر اليوم بالريال القطري — عيار 24 و21 و18 بالجرام في الدوحة، محدّث لحظياً.",
  keywords: ["سعر الذهب في قطر", "سعر الذهب الدوحة", "سعر جرام الذهب بالريال القطري", "gold price Qatar riyal"],
  openGraph: { title: "سعر الذهب في قطر — سعر الذهب", description: "أسعار الذهب بالريال القطري لحظياً", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-قطر" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" }, { "@type": "ListItem", position: 2, name: "سعر الذهب في قطر", item: "https://sardhahab.com/سعر-الذهب-قطر" }] };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
