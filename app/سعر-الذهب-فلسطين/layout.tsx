import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في فلسطين اليوم بالشيكل",
  description: "سعر الذهب في فلسطين اليوم بالشيكل — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في فلسطين", "سعر الذهب اليوم بالشيكل", "سعر جرام الذهب في القدس", "عيار 21 في فلسطين", "سعر الذهب القدس"],
  openGraph: { title: "سعر الذهب في فلسطين اليوم — سعر الذهب", description: "أسعار الذهب بالشيكل لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-فلسطين" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في فلسطين", item: "https://sardhahab.com/سعر-الذهب-فلسطين" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
