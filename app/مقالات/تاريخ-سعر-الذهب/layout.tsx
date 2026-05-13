import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تاريخ سعر الذهب — من 35 دولاراً إلى 3000+ دولار",
  description:
    "رحلة تاريخية لسعر الذهب من نظام بريتون وودز (35 دولاراً للأونصة) حتى اليوم: أسباب أكبر الانهيارات والارتفاعات، وتوقعات المستقبل.",
  keywords: [
    "تاريخ سعر الذهب",
    "سعر الذهب عبر التاريخ",
    "gold price history",
    "ارتفاع سعر الذهب",
    "أعلى سعر للذهب في التاريخ",
    "نظام بريتون وودز",
    "Gold Standard",
    "سعر الذهب 2008",
    "سعر الذهب كوفيد",
    "الذهب والتضخم",
  ],
  openGraph: {
    title: "تاريخ سعر الذهب | sardhahab.com",
    description:
      "من 35 دولاراً إلى 3000+: رحلة تاريخية لسعر الذهب عبر أهم الأحداث الاقتصادية والأزمات العالمية.",
    type: "article",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=gold",
        width: 1200,
        height: 630,
        alt: "تاريخ سعر الذهب",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/تاريخ-سعر-الذهب" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "تاريخ سعر الذهب — من 35 دولاراً إلى 3000+ دولار",
    description:
      "رحلة تاريخية لسعر الذهب من نظام بريتون وودز حتى اليوم: الأزمات، الارتفاعات، والانهيارات.",
    datePublished: "2026-05-10",
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "sardhahab.com" },
    publisher: {
      "@type": "Organization",
      name: "sardhahab.com",
      url: "https://sardhahab.com",
    },
    mainEntityOfPage: "https://sardhahab.com/مقالات/تاريخ-سعر-الذهب",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ما هو أعلى سعر للذهب في التاريخ؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "سجّل الذهب مستويات قياسية تتجاوز 3000 دولار للأونصة في عام 2025، وهو الأعلى تاريخياً. كان الرقم القياسي السابق نحو 2075 دولاراً في أغسطس 2020 خلال جائحة كوفيد-19.",
        },
      },
      {
        "@type": "Question",
        name: "لماذا ارتفع سعر الذهب كثيراً؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "أسباب رئيسية: تراجع ثقة البنوك المركزية بالدولار وشراؤها كميات كبيرة من الذهب، التضخم المرتفع، التوترات الجيوسياسية (روسيا-أوكرانيا، الشرق الأوسط)، وضعف الدولار الأمريكي.",
        },
      },
      {
        "@type": "Question",
        name: "ما هو نظام بريتون وودز وعلاقته بالذهب؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "بريتون وودز (1944-1971) كان نظاماً مالياً ربط الدولار الأمريكي بالذهب بسعر ثابت (35 دولاراً للأونصة). في 1971 ألغى نيكسون هذا الربط (Nixon Shock) مما أطلق سعر الذهب ليتحرك بحرية في السوق، وبدأ ارتفاعه الطويل.",
        },
      },
      {
        "@type": "Question",
        name: "هل الذهب يحمي من التضخم؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "تاريخياً نعم، لكن ليس دائماً على المدى القصير. الذهب حافظ على قيمته الشرائية على مدى قرون. لكن في فترات ارتفاع الفائدة كتسعينيات القرن الماضي، قد يتراجع الذهب حتى مع وجود تضخم. على المدى الطويل (10+ سنوات) يعدّ أحد أفضل مخازن القيمة.",
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "مقالات", item: "https://sardhahab.com/مقالات" },
      { "@type": "ListItem", position: 3, name: "تاريخ سعر الذهب", item: "https://sardhahab.com/مقالات/تاريخ-سعر-الذهب" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
