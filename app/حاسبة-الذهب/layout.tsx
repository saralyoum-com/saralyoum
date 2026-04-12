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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "كيف أحسب قيمة الذهب؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "أدخل وزن الذهب بالجرام واختر العيار (24، 22، 21، أو 18)، ستظهر القيمة تلقائياً بناءً على أسعار الذهب اللحظية.",
        },
      },
      {
        "@type": "Question",
        name: "كيف أحسب زكاة الذهب؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "زكاة الذهب 2.5% من القيمة السوقية إذا بلغت النصاب (85 جراماً من الذهب عيار 24) وحال عليها الحول (سنة هجرية).",
        },
      },
      {
        "@type": "Question",
        name: "ما هو نصاب الذهب؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نصاب الذهب هو 85 جراماً من الذهب الخالص (عيار 24)، وهو ما يعادل 20 مثقالاً.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
