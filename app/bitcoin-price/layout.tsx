import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سعر البيتكوين اليوم بالريال السعودي والدرهم والدينار",
  description:
    "سعر البيتكوين (BTC) لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي والجنيه المصري وجميع العملات العربية — محدّث كل 5 دقائق.",
  keywords: [
    "سعر البيتكوين اليوم",
    "سعر بيتكوين بالريال السعودي",
    "سعر BTC بالريال",
    "سعر البيتكوين بالدرهم",
    "بيتكوين بالدينار الكويتي",
    "سعر البيتكوين بالجنيه المصري",
    "سعر العملات الرقمية اليوم",
    "bitcoin price in SAR",
    "bitcoin price in arabic",
    "BTC سعر",
  ],
  openGraph: {
    title: "سعر البيتكوين اليوم — سعر الذهب",
    description:
      "سعر BTC لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي وجميع العملات العربية.",
    type: "website",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=bitcoin",
        width: 1200,
        height: 630,
        alt: "سعر البيتكوين اليوم",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/سعر-البيتكوين" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ما هو سعر البيتكوين بالريال السعودي اليوم؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "سعر البيتكوين يتغير باستمرار. للاطلاع على السعر اللحظي بالريال السعودي، راجع صفحة سعر البيتكوين في sardhahab.com والتي تتحدث كل 5 دقائق.",
        },
      },
      {
        "@type": "Question",
        name: "هل تجب الزكاة على البيتكوين؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نعم، ذهب جمهور العلماء المعاصرين إلى وجوب الزكاة في البيتكوين إذا بلغ نصاب الذهب (ما يعادل 85 جراماً من الذهب) وحال عليه الحول. تُحسب بنسبة 2.5% من القيمة الإجمالية.",
        },
      },
      {
        "@type": "Question",
        name: "كيف أحول سعر البيتكوين من الدولار إلى الريال؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "اضرب سعر البيتكوين بالدولار في 3.75 (سعر صرف الدولار مقابل الريال السعودي) للحصول على السعر بالريال السعودي.",
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر البيتكوين", item: "https://sardhahab.com/سعر-البيتكوين" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
