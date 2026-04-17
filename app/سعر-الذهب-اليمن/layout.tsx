import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "سعر الذهب في اليمن اليوم بالريال اليمني",
  description: "سعر الذهب في اليمن اليوم بالريال اليمني — عيار 24 و21 و18 بالجرام، محدّث لحظياً من المصادر العالمية.",
  keywords: ["سعر الذهب في اليمن", "سعر الذهب اليوم بالريال اليمني", "سعر جرام الذهب في صنعاء", "عيار 21 في اليمن", "سعر الذهب صنعاء"],
  openGraph: { title: "سعر الذهب في اليمن اليوم — سعر الذهب", description: "أسعار الذهب بالريال اليمني لحظياً لجميع العيارات", type: "website" },
  alternates: { canonical: "https://sardhahab.com/سعر-الذهب-اليمن" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الذهب في اليمن", item: "https://sardhahab.com/سعر-الذهب-اليمن" },
    ],
  };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</>);
}
