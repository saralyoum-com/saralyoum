import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في المغرب اليوم بالدرهم",
  description: "سعر الذهب في المغرب اليوم بالدرهم المغربي — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في المغرب", "سعر الذهب اليوم بالدرهم المغربي", "سعر جرام الذهب بالدرهم", "عيار 21 بالمغرب", "سعر الذهب الرباط"],
  openGraph: { title: "سعر الذهب في المغرب اليوم — سعر الذهب", description: "أسعار الذهب بالدرهم المغربي لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-المغرب" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في المغرب", item: "https://sardhahab.com/سعر-الذهب-المغرب" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
