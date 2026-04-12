import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "سعر الذهب — موقع عربي متخصص في متابعة أسعار الذهب والفضة والعملات الرقمية والعملات العالمية لحظياً مع أخبار اقتصادية يومية.",
  keywords: ["سعر الذهب", "من نحن", "موقع الذهب", "sardhahab"],
  openGraph: {
    title: "من نحن — سعر الذهب",
    description: "تعرّف على موقع سعر الذهب — مصدرك الأول لأسعار الذهب والعملات",
    type: "website",
  },
  alternates: {
    canonical: "https://sardhahab.com/من-نحن",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "من نحن", item: "https://sardhahab.com/من-نحن" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
