import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حاسبة زكاة العملات الرقمية — BTC ETH BNB SOL USDT",
  description:
    "احسب زكاة البيتكوين والإيثيريوم وBNB وSOL والعملات الرقمية بدقة. النصاب لحظياً، آراء العلماء، وحساب فوري بعملتك المحلية مع مشاركة النتيجة واتساب وتيليجرام.",
  keywords: [
    "زكاة الكريبتو",
    "زكاة البيتكوين",
    "زكاة العملات الرقمية",
    "حاسبة زكاة بيتكوين",
    "زكاة BNB",
    "زكاة سولانا",
    "هل في زكاة على البيتكوين",
    "نصاب الكريبتو",
    "زكاة الإيثيريوم",
    "زكاة USDT",
    "bitcoin zakat calculator",
    "زكاة العملات المشفرة",
    "crypto zakat",
  ],
  openGraph: {
    title: "حاسبة زكاة العملات الرقمية | BTC ETH BNB SOL — سعر الذهب",
    description:
      "احسب زكاة البيتكوين والإيثيريوم وBNB وSOL وكل عملاتك الرقمية بأسعار لحظية وآراء العلماء.",
    type: "website",
  },
  alternates: { canonical: "https://sardhahab.com/zakat-crypto" },
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
          text: "النصاب هو ما يعادل 85 جراماً من الذهب عيار 24. بناءً على السعر اللحظي للذهب يتغير النصاب يومياً.",
        },
      },
      {
        "@type": "Question",
        name: "هل تجب الزكاة على BNB وSOL؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نعم، جميع العملات الرقمية ذات القيمة السوقية تخضع لنفس حكم الزكاة — إذا بلغت قيمتك الإجمالية النصاب وحال الحول، وجبت الزكاة بنسبة 2.5%.",
        },
      },
      {
        "@type": "Question",
        name: "هل تجب الزكاة على USDT وستيبل كوين؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نعم، الستيبل كوين كـUSDT وUSDC تُعامل معاملة النقد وتجب فيها الزكاة كالأموال السائلة.",
        },
      },
      {
        "@type": "Question",
        name: "كيف أشارك نتيجة حساب الزكاة؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "بعد إجراء الحساب، تظهر أزرار المشاركة عبر واتساب وتيليجرام لمشاركة النتيجة مع أهلك أو مستشارك الشرعي.",
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "حاسبة زكاة العملات الرقمية", item: "https://sardhahab.com/zakat-crypto" },
    ],
  };

  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "حاسبة زكاة العملات الرقمية",
    url: "https://sardhahab.com/zakat-crypto",
    description: "حاسبة تفاعلية لزكاة العملات الرقمية بأسعار لحظية من CoinGecko",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }} />
      {children}
    </>
  );
}
