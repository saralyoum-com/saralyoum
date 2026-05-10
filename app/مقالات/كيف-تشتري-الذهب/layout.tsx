import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "كيف تشتري الذهب؟ — دليل المبتدئين الشامل",
  description:
    "دليل عملي خطوة بخطوة لشراء الذهب: أين تشتري في الخليج، ما تبحث عنه، الفرق بين السبائك والمجوهرات والصناديق، وكيف تتجنب النصب والغش.",
  keywords: [
    "كيف تشتري الذهب",
    "شراء الذهب في السعودية",
    "أين أشتري الذهب",
    "سبائك الذهب",
    "محلات الذهب السعودية",
    "نصائح شراء الذهب",
    "الفرق بين سبائك الذهب والمجوهرات",
    "how to buy gold in Saudi Arabia",
    "buy gold Gulf",
  ],
  openGraph: {
    title: "كيف تشتري الذهب؟ دليل شامل | سعر الذهب",
    description:
      "أين تشتري الذهب، ما تتحقق منه، وكيف تتجنب الغش — دليل عملي للمبتدئين.",
    type: "article",
    images: [
      {
        url: "https://sardhahab.com/api/og?asset=gold",
        width: 1200,
        height: 630,
        alt: "كيف تشتري الذهب — دليل المبتدئين",
      },
    ],
  },
  alternates: { canonical: "https://sardhahab.com/مقالات/كيف-تشتري-الذهب" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "كيف تشتري الذهب؟ — دليل المبتدئين الشامل",
    description: "دليل عملي خطوة بخطوة لشراء الذهب: أين تشتري وكيف تتجنب النصب.",
    datePublished: "2026-04-25",
    dateModified: new Date().toISOString().split("T")[0],
    author: { "@type": "Organization", name: "sardhahab.com" },
    publisher: {
      "@type": "Organization",
      name: "sardhahab.com",
      url: "https://sardhahab.com",
    },
    mainEntityOfPage: "https://sardhahab.com/مقالات/كيف-تشتري-الذهب",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "أين أشتري الذهب في السعودية؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "يمكن شراء الذهب من محلات الصاغة المرخصة في أسواق الذهب الرئيسية (الرياض، جدة، الدمام)، من البنوك التي تبيع السبائك والشهادات، أو من المنصات الرقمية المعتمدة كمنصة ذهبي.",
        },
      },
      {
        "@type": "Question",
        name: "هل السبائك أفضل من المجوهرات للاستثمار؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نعم، للاستثمار البحت السبائك أفضل لأنها بدون أجرة صياغة وعيارها 24 (أعلى نقاوة). أما المجوهرات فتناسب الزينة لكن تفقد جزءاً من قيمتها عند البيع بسبب أجرة الصياغة.",
        },
      },
      {
        "@type": "Question",
        name: "كيف أعرف أن الذهب أصيل؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "تحقق من طابع العيار المنقوش على القطعة (21K، 18K...)، اطلب الوزن أمامك بالميزان، واشتر من محلات مرخصة مع فاتورة رسمية. للسبائك، تأكد من وجود شهادة أصالة من جهة معتمدة.",
        },
      },
      {
        "@type": "Question",
        name: "ما هو أفضل وقت لشراء الذهب؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "لا يوجد توقيت مثالي مضمون. الاستراتيجية الأفضل للمبتدئ هي الشراء بمبالغ ثابتة شهرياً (التوسط بالتكلفة) للاستفادة من تذبذب الأسعار. تابع sardhahab.com للاطلاع على الأسعار اللحظية.",
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
      { "@type": "ListItem", position: 3, name: "كيف تشتري الذهب", item: "https://sardhahab.com/مقالات/كيف-تشتري-الذهب" },
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
