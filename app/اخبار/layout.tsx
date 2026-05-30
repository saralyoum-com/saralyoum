import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أخبار الذهب والأسواق اليوم — اقتصاد عربي وعالمي",
  description:
    "آخر أخبار الذهب والبيتكوين والأسواق المالية والاقتصاد العربي والعالمي — من BBC عربي والجزيرة ورويترز، محدّثة باستمرار.",
  keywords: [
    "أخبار الذهب",
    "أخبار البيتكوين",
    "أخبار الأسواق المالية",
    "أخبار اقتصادية",
    "أخبار العملات",
    "الاقتصاد العربي",
    "gold news",
    "bitcoin news",
    "financial news",
  ],
  openGraph: {
    title: "الأخبار الاقتصادية — سعر الذهب",
    description: "آخر أخبار الأسواق والذهب والعملات من BBC عربي والجزيرة ورويترز",
    type: "website",
  },
  alternates: {
    canonical: "https://sardhahab.com/اخبار",
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "الأخبار الاقتصادية", item: "https://sardhahab.com/اخبار" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
