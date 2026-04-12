import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التنبيهات الذكية",
  description:
    "اشترك مجاناً في تنبيهات أسعار الذهب والعملات الرقمية — تنبيه يومي الساعة 8 صباحاً وتنبيه سعري عند بلوغ السعر المستهدف.",
  keywords: [
    "تنبيهات سعر الذهب",
    "تنبيه بيتكوين",
    "تنبيهات الأسواق",
    "سعر الذهب تنبيه",
    "gold price alert",
    "bitcoin alert",
  ],
  openGraph: {
    title: "التنبيهات الذكية — سعر اليوم",
    description: "تنبيهات يومية وسعرية مجانية على بريدك الإلكتروني",
    type: "website",
  },
  alternates: {
    canonical: "https://sardhahab.com/تنبيهات",
  },
};

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "التنبيهات الذكية", item: "https://sardhahab.com/تنبيهات" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
