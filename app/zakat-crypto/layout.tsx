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
  alternates: { canonical: "https://sardhahab.com/زكاة-الكريبتو" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: "حاسبة زكاة العملات الرقمية", item: "https://sardhahab.com/زكاة-الكريبتو" },
    ],
  };

  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "حاسبة زكاة العملات الرقمية",
    url: "https://sardhahab.com/زكاة-الكريبتو",
    description: "حاسبة تفاعلية لزكاة العملات الرقمية بأسعار لحظية من CoinGecko",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }} />
      {children}
    </>
  );
}
