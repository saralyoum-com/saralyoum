import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حاسبة زكاة الكريبتو — زكاة البيتكوين والإيثيريوم",
  description:
    "احسب زكاة عملاتك الرقمية بدقة — بيتكوين وإيثيريوم وغيرها. النصاب لحظياً، آراء العلماء، وحساب فوري بعملتك المحلية.",
  keywords: [
    "زكاة الكريبتو",
    "زكاة البيتكوين",
    "زكاة العملات الرقمية",
    "حاسبة زكاة بيتكوين",
    "هل في زكاة على البيتكوين",
    "نصاب الكريبتو",
    "زكاة الإيثيريوم",
    "زكاة crypto",
    "bitcoin zakat calculator",
    "زكاة العملات المشفرة",
  ],
  openGraph: {
    title: "حاسبة زكاة الكريبتو | بيتكوين وإيثيريوم — سعر الذهب",
    description:
      "احسب زكاة البيتكوين والإيثيريوم وكل عملاتك الرقمية بأسعار لحظية وآراء العلماء.",
    type: "website",
  },
  alternates: { canonical: "https://sardhahab.com/زكاة-الكريبتو" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "هل تجب الزكاة على البيتكوين؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نعم، ذهب جمهور العلماء المعاصرين إلى وجوب الزكاة في العملات الرقمية كالبيتكوين والإيثيريوم إذا بلغت النصاب وحال عليها الحول، وتُحسب بنسبة 2.5% من قيمتها السوقية.",
        },
      },
      {
        "@type": "Question",
        name: "ما هو نصاب زكاة الكريبتو؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "النصاب هو ما يعادل 85 جراماً من الذهب عيار 24. بناءً على السعر اللحظي للذهب يتغير النصاب يومياً. إذا بلغت قيمة ما تملكه من عملات رقمية هذا المبلغ أو تجاوزته، وجبت الزكاة.",
        },
      },
      {
        "@type": "Question",
        name: "هل يُشترط الحول لزكاة الكريبتو؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نعم، يُشترط الحول (مرور سنة هجرية كاملة = 354 يوماً) على ملك النصاب. أما المتاجر في الكريبتو بشكل يومي فزكاتهم كأموال التجارة تُحسب على رأس السنة.",
        },
      },
      {
        "@type": "Question",
        name: "كيف أحسب زكاة البيتكوين؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "احسب القيمة الإجمالية لما تملكه بالدولار الأمريكي، تأكد أنها تبلغ النصاب (ما يعادل 85 جرام ذهب)، ثم اضرب القيمة الكاملة في 2.5% للحصول على الزكاة الواجبة.",
        },
      },
      {
        "@type": "Question",
        name: "ما رأي العلماء في زكاة العملات الرقمية؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "أصدرت هيئة كبار العلماء في السعودية وعدد من المجامع الفقهية فتاوى بوجوب الزكاة في العملات الرقمية. الرأي الأكثر انتشاراً أنها تُعامل كعروض التجارة وتجب فيها الزكاة بنسبة 2.5%.",
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "حاسبة زكاة الكريبتو", item: "https://sardhahab.com/زكاة-الكريبتو" },
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
