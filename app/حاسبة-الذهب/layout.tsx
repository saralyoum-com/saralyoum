import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حاسبة الذهب والزكاة",
  description:
    "احسب قيمة ذهبك بجميع العيارات (24/22/21/18) وزكاة الذهب والمدخرات بدقة — أسعار لحظية محدّثة. حاسبة مجانية عربية.",
  keywords: [
    "حاسبة الذهب",
    "حاسبة زكاة الذهب",
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
    title: "حاسبة الذهب والزكاة — سعر الذهب",
    description: "احسب قيمة ذهبك وزكاتك بأسعار لحظية لجميع العيارات",
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
      { "@type": "ListItem", position: 2, name: "حاسبة الذهب والزكاة", item: "https://sardhahab.com/حاسبة-الذهب" },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "حاسبة الذهب والزكاة",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: "https://sardhahab.com/حاسبة-الذهب",
    description: "احسب قيمة ذهبك بجميع العيارات (24/22/21/18) وزكاة الذهب والمدخرات بأسعار لحظية — حاسبة مجانية عربية.",
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
