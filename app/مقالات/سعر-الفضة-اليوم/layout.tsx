import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سعر الفضة اليوم — عيار 999 و925 بالجرام والأونصة",
  description:
    "سعر الفضة اليوم بالدولار والريال والدرهم — عيار 999 (فضة خالصة) وعيار 925 (فضة ستيرلينج) بالجرام والأونصة، مع مقارنة بالذهب ونصائح للمستثمرين.",
  keywords: [
    "سعر الفضة اليوم",
    "سعر الفضة",
    "silver price today",
    "سعر الفضة بالجرام",
    "سعر الفضة عيار 999",
    "سعر الفضة عيار 925",
    "الاستثمار في الفضة",
    "سعر الأونصة الفضة",
    "الفضة مقابل الذهب",
    "هل الفضة استثمار جيد",
  ],
  openGraph: {
    title: "سعر الفضة اليوم | sardhahab.com",
    description:
      "سعر الفضة اليوم بالجرام والأونصة — عيار 999 و925 — مع مقارنة بالذهب وتوقعات المحللين.",
    type: "article",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=gold",
        width: 1200,
        height: 630,
        alt: "سعر الفضة اليوم",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/سعر-الفضة-اليوم" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "سعر الفضة اليوم — عيار 999 و925 بالجرام والأونصة",
    description:
      "سعر الفضة اليوم بالدولار والريال والدرهم — مع مقارنة بالذهب ونصائح للاستثمار.",
    datePublished: "2026-05-10",
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "sardhahab.com" },
    publisher: {
      "@type": "Organization",
      name: "sardhahab.com",
      url: "https://sardhahab.com",
    },
    mainEntityOfPage: "https://sardhahab.com/مقالات/سعر-الفضة-اليوم",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ما هو سعر الفضة اليوم بالجرام؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "سعر الفضة اليوم يتغير لحظياً. عادةً تتراوح أسعار الفضة عيار 999 بين 0.80 و1.20 دولار للجرام حسب أسعار السوق العالمية. يمكن متابعة السعر اللحظي على الصفحة الرئيسية لـ sardhahab.com.",
        },
      },
      {
        "@type": "Question",
        name: "ما الفرق بين فضة 999 و925؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "فضة 999 (Fine Silver) هي الفضة الخالصة بنسبة 99.9٪ وتُستخدم في سبائك الاستثمار والعملات المعدنية. فضة 925 (Sterling Silver) تحتوي على 92.5٪ فضة و7.5٪ نحاس أو معادن أخرى، وهي الأكثر استخداماً في المجوهرات لأنها أصلب وأكثر مقاومة للخدش.",
        },
      },
      {
        "@type": "Question",
        name: "هل الفضة استثمار جيد؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "الفضة استثمار ذو طابع مزدوج: كمعدن ثمين يُخزن القيمة، وكمادة صناعية تُستخدم في الألواح الشمسية والإلكترونيات والطب. هذا الطلب الصناعي يمنحها دعماً إضافياً مقارنةً بالذهب، لكنه يجعلها أكثر تذبذباً. تنسيب الفضة بنسبة 5-10٪ من المحفظة الاستثمارية يُعدّ معتدلاً.",
        },
      },
      {
        "@type": "Question",
        name: "ما نسبة الذهب للفضة (Gold-Silver Ratio)؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نسبة الذهب للفضة (GSR) هي عدد أونصات الفضة اللازمة لشراء أونصة واحدة من الذهب. تاريخياً كانت النسبة بين 15:1 و20:1، لكنها في العقود الأخيرة ارتفعت إلى 60-90:1. نسبة مرتفعة تعني أن الفضة رخيصة نسبياً مقارنةً بالذهب.",
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
      { "@type": "ListItem", position: 3, name: "سعر الفضة اليوم", item: "https://sardhahab.com/مقالات/سعر-الفضة-اليوم" },
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
