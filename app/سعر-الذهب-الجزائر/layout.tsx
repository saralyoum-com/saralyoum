import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في الجزائر اليوم بالدينار الجزائري",
  description: "سعر الذهب في الجزائر اليوم بالدينار الجزائري — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في الجزائر", "سعر الذهب اليوم بالدينار الجزائري", "سعر جرام الذهب في الجزائر", "عيار 21 في الجزائر", "سعر الذهب الجزائر العاصمة"],
  openGraph: { title: "سعر الذهب في الجزائر اليوم — سعر الذهب", description: "أسعار الذهب بالدينار الجزائري لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-الجزائر" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في الجزائر", item: "https://sardhahab.com/سعر-الذهب-الجزائر" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
