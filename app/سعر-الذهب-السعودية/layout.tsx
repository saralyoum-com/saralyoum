import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في السعودية اليوم بالريال",
  description: "سعر الذهب في المملكة العربية السعودية اليوم بالريال السعودي — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في السعودية", "سعر الذهب اليوم بالريال", "سعر جرام الذهب بالريال", "عيار 21 بالريال", "سعر الذهب الرياض"],
  openGraph: { title: "سعر الذهب في السعودية اليوم — سعر الذهب", description: "أسعار الذهب بالريال السعودي لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-السعودية" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في السعودية", item: "https://sardhahab.com/سعر-الذهب-السعودية" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
