import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سعر الإيثيريوم اليوم بالريال السعودي والدرهم والدينار",
  description:
    "سعر الإيثيريوم (ETH) لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي والجنيه المصري وجميع العملات العربية — محدّث كل 5 دقائق.",
  keywords: [
    "سعر الإيثيريوم اليوم",
    "سعر ETH بالريال السعودي",
    "سعر الاثيريوم بالريال",
    "سعر الإيثيريوم بالدرهم",
    "إيثيريوم بالدينار الكويتي",
    "سعر الإيثيريوم بالجنيه المصري",
    "ethereum price in SAR",
    "ethereum price arabic",
    "ETH سعر",
    "سعر ايثيريوم اليوم",
  ],
  openGraph: {
    title: "سعر الإيثيريوم اليوم — سعر الذهب",
    description:
      "سعر ETH لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي وجميع العملات العربية.",
    type: "website",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=ethereum",
        width: 1200,
        height: 630,
        alt: "سعر الإيثيريوم اليوم",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/سعر-الاثيريوم" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ما هو سعر الإيثيريوم بالريال السعودي اليوم؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "سعر الإيثيريوم يتغير باستمرار. للاطلاع على السعر اللحظي بالريال السعودي، راجع صفحة سعر الإيثيريوم في sardhahab.com والتي تتحدث كل 5 دقائق.",
        },
      },
      {
        "@type": "Question",
        name: "هل تجب الزكاة على الإيثيريوم؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نعم، تجب الزكاة على الإيثيريوم إذا بلغت قيمته نصاب الذهب (ما يعادل 85 جراماً من الذهب) وحال عليه الحول. النسبة 2.5% من القيمة الإجمالية.",
        },
      },
      {
        "@type": "Question",
        name: "ما الفرق بين البيتكوين والإيثيريوم؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "البيتكوين عملة رقمية للتخزين والتبادل، بينما الإيثيريوم منصة برمجية تدعم العقود الذكية والتطبيقات اللامركزية. كلاهما من أكبر العملات الرقمية من حيث القيمة السوقية.",
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "سعر الإيثيريوم", item: "https://sardhahab.com/سعر-الاثيريوم" },
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
