import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حاسبة الذهب — حساب سعر الذهب بالجرام وزكاة الذهب",
  description:
    "احسب سعر الذهب بالجرام لجميع العيارات (24/22/21/18) وطريقة حساب زكاة الذهب — أسعار لحظية بالريال والدرهم والدينار. حاسبة مجانية.",
  keywords: [
    "حاسبة الذهب",
    "حساب الذهب",
    "طريقة حساب الذهب",
    "كيف احسب الذهب",
    "كيف احسب سعر الذهب",
    "طريقة حساب سعر الذهب",
    "حاسبة زكاة الذهب",
    "كيف احسب زكاة الذهب",
    "سعر جرام الذهب",
    "عيار 24",
    "عيار 21",
    "عيار 22",
    "عيار 18",
    "زكاة الذهب",
    "نصاب الذهب",
    "gold calculator",
    "zakat calculator",
    "gold gram price",
  ],
  openGraph: {
    title: "حاسبة الذهب — حساب سعر الذهب بالجرام وزكاة الذهب",
    description: "احسب سعر الذهب بالجرام لجميع العيارات وطريقة حساب زكاة الذهب بأسعار لحظية",
    type: "website",
  },
  alternates: {
    canonical: "https://sardhahab.com/حاسبة-الذهب",
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "حاسبة الذهب", item: "https://sardhahab.com/حاسبة-الذهب" },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "حاسبة الذهب — حساب سعر الذهب بالجرام",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: "https://sardhahab.com/حاسبة-الذهب",
    description: "احسب سعر الذهب بالجرام لجميع العيارات (24/22/21/18) وطريقة حساب زكاة الذهب — أسعار لحظية بالريال والدرهم والدينار.",
    inLanguage: "ar",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@type": "Organization", name: "سعر الذهب", url: "https://sardhahab.com" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      {children}
    </>
  );
}
