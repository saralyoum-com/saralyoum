import type { Metadata } from "next";
import { getCountryByCode } from "@/lib/countries";

export function generateMetadata({
  params,
}: {
  params: { code: string };
}): Metadata {
  const country = getCountryByCode(params.code);
  if (!country) return {};

  const title = `سعر الذهب في ${country.nameAr} اليوم بالـ${country.currencyAr}`;
  const description = `سعر الذهب في ${country.nameAr} (${country.city}) اليوم بالـ${country.currencyAr} — عيار 24 و22 و21 و18 و14 بالجرام، محدّث لحظياً من المصادر العالمية.`;

  return {
    title,
    description,
    keywords: country.keywords,
    openGraph: {
      title: `سعر الذهب في ${country.nameAr} — سعر الذهب`,
      description,
      type: "website",
      images: [{ url: "https://sardhahab.com/api/og?asset=gold", width: 1200, height: 630, alt: `سعر الذهب في ${country.nameAr}` }],
    },
    alternates: {
      canonical: `https://sardhahab.com/${country.slug}`,
    },
  };
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { code: string };
}) {
  const country = getCountryByCode(params.code);
  if (!country) return <>{children}</>;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: "https://sardhahab.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `سعر الذهب في ${country.nameAr}`,
        item: `https://sardhahab.com/${country.slug}`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `ما هو سعر الذهب في ${country.nameAr} اليوم؟`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `سعر الذهب في ${country.nameAr} يتغير لحظياً تبعاً للأسعار العالمية وسعر صرف ${country.currencyAr}. يمكن متابعة السعر الحالي بعيار 24 و21 و18 بالجرام والأونصة على هذه الصفحة.`,
        },
      },
      {
        "@type": "Question",
        name: `ما هو سعر عيار 21 في ${country.nameAr}؟`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `سعر عيار 21 في ${country.nameAr} يساوي سعر الأونصة الدولي × (21/24) ÷ 31.1035 × سعر صرف ${country.currencyAr} مقابل الدولار. الأسعار الدقيقة والمحدّثة لحظياً تجدها على هذه الصفحة.`,
        },
      },
      {
        "@type": "Question",
        name: `هل سعر الذهب في ${country.nameAr} يختلف عن الأسعار العالمية؟`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `سعر الذهب العالمي يُحدد بالدولار الأمريكي. الفرق في السعر المحلي بـ${country.currencyAr} يعود إلى سعر الصرف وضرائب الاستيراد وهامش التاجر. الأسعار على هذه الصفحة تعكس السعر العالمي محوّلاً بسعر الصرف الحالي.`,
        },
      },
      {
        "@type": "Question",
        name: "كيف أحسب زكاة الذهب؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "زكاة الذهب تجب إذا بلغ ما تملكه نصاب 85 غراماً من الذهب عيار 24 (أو ما يعادلها من العيارات الأخرى) وحال عليه الحول. والنسبة الواجبة هي 2.5٪ من إجمالي قيمة الذهب. للتفاصيل الكاملة راجع مقال زكاة الذهب على موقعنا.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
