import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في تونس اليوم بالدينار التونسي",
  description: "سعر الذهب في تونس اليوم بالدينار التونسي — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في تونس", "سعر الذهب اليوم بالدينار التونسي", "سعر جرام الذهب في تونس", "عيار 21 في تونس", "سعر الذهب تونس العاصمة"],
  openGraph: { title: "سعر الذهب في تونس اليوم — سعر الذهب", description: "أسعار الذهب بالدينار التونسي لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-تونس" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في تونس", item: "https://sardhahab.com/سعر-الذهب-تونس" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
