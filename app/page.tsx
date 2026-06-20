import PriceTicker from "@/components/PriceTicker";
import Disclaimer from "@/components/Disclaimer";
import PriceCardsClient from "@/components/PriceCardsClient";
import { HomeHero, HomeAdAndCTA, HomeNewsSection, HomePriceChartsSection, HomeQuickLinks } from "@/components/HomeContent";
import EngagementSection from "@/components/EngagementSection";
import GoldPredictionPoll from "@/components/GoldPredictionPoll";
import PortfolioTracker from "@/components/PortfolioTracker";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { getMockTechnicalData } from "@/lib/technical";
import { NewsItem } from "@/types";

export const revalidate = 60;

export const metadata = {
  title: "سعر الذهب | أسعار الذهب والفضة والعملات الرقمية لحظياً",
  description:
    "تابع أسعار الذهب عيار 24/22/21/18 والفضة والبيتكوين والإيثيريوم لحظياً مع أكثر من 27 عملة عربية وعالمية وأخبار اقتصادية يومية وتنبيهات ذكية.",
  keywords: [
    "سعر الذهب اليوم",
    "سعر الذهب",
    "gold price today",
    "سعر الفضة",
    "سعر البيتكوين",
    "سعر عيار 21",
    "سعر عيار 24",
    "أسعار العملات",
    "حاسبة الذهب",
    "زكاة الذهب",
  ],
  alternates: {
    canonical: "https://sardhahab.com",
    languages: {
      "ar-SA": "https://sardhahab.com",
      "x-default": "https://sardhahab.com",
    },
  },
};

async function getNews(): Promise<NewsItem[]> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/news`, { next: { revalidate: 900 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.news?.slice(0, 6) || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [gold, silver, bitcoin, ethereum] = await Promise.all([
    getGoldPrice(),
    getSilverPrice(),
    getCryptoPrice("bitcoin"),
    getCryptoPrice("ethereum"),
  ]);

  const signals = getMockTechnicalData();
  const news = await getNews();
  const tickerPrices = [gold, silver, bitcoin, ethereum];

  const goldPriceUSD = gold?.price ?? 0;
  const silverPriceUSD = silver?.price ?? 0;

  const OZ = 31.1035;
  const goldGram24USD = (goldPriceUSD / OZ).toFixed(2);
  const goldGram21USD = ((goldPriceUSD / OZ) * (21 / 24)).toFixed(2);
  const goldGram18USD = ((goldPriceUSD / OZ) * (18 / 24)).toFixed(2);
  const goldChangePct = gold?.changePercent ?? 0;
  const btcPrice = bitcoin?.price ?? 0;
  const ethPrice = ethereum?.price ?? 0;

  const homePriceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "أسعار المعادن الثمينة والعملات الرقمية اليوم",
    url: "https://sardhahab.com",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "سعر الذهب",
        description: `سعر الذهب اليوم ${goldPriceUSD.toFixed(2)} دولار للأوقية — عيار 24: ${goldGram24USD} دولار للجرام — عيار 21: ${goldGram21USD} دولار للجرام — التغيير: ${goldChangePct >= 0 ? "+" : ""}${goldChangePct.toFixed(2)}%`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "سعر الفضة",
        description: `سعر الفضة اليوم ${silverPriceUSD.toFixed(2)} دولار للأوقية`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "سعر البيتكوين",
        description: `سعر البيتكوين اليوم ${btcPrice.toLocaleString("en-US")} دولار`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "سعر الإيثيريوم",
        description: `سعر الإيثيريوم اليوم ${ethPrice.toLocaleString("en-US")} دولار`,
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePriceJsonLd) }}
      />
      {/* SSR-visible price summary — crawlers and AI engines read this */}
      <div className="sr-only">
        <h2>أسعار الذهب والعملات اليوم</h2>
        <p>سعر الذهب اليوم {goldPriceUSD.toFixed(2)} دولار للأوقية. عيار 24: {goldGram24USD} دولار للجرام. عيار 21: {goldGram21USD} دولار للجرام. عيار 18: {goldGram18USD} دولار للجرام. التغيير: {goldChangePct >= 0 ? "+" : ""}{goldChangePct.toFixed(2)}%.</p>
        <p>سعر الفضة اليوم {silverPriceUSD.toFixed(2)} دولار للأوقية.</p>
        {btcPrice > 0 && <p>سعر البيتكوين اليوم {btcPrice.toLocaleString("en-US")} دولار.</p>}
        {ethPrice > 0 && <p>سعر الإيثيريوم اليوم {ethPrice.toLocaleString("en-US")} دولار.</p>}
      </div>

      {/* شريط الأسعار المتحرك */}
      <PriceTicker prices={tickerPrices} />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <HomeHero />

        {/* بطاقات الأسعار مع كشف العملة */}
        <PriceCardsClient
          gold={gold}
          silver={silver}
          bitcoin={bitcoin}
          ethereum={ethereum}
          signals={signals}
        />

        <Disclaimer />

        {/* إعلانات + CTA */}
        <HomeAdAndCTA />
      </section>

      {/* التحليل التقني + تصويت المجتمع */}
      <GoldPredictionPoll />

      {/* قسم التفاعل — سلسلة الأسعار + ماذا لو استثمرت */}
      <EngagementSection
        goldPrice={goldPriceUSD}
        changePercent={goldChangePct}
      />

      {/* محفظتي الذهبية */}
      <PortfolioTracker
        goldPriceUSD={goldPriceUSD}
        changePercent={goldChangePct}
      />

      {/* قسم الرسوم البيانية */}
      <HomePriceChartsSection
        gold={{ price: gold?.price ?? 4787, changePercent: gold?.changePercent ?? 0 }}
        silver={{ price: silver?.price ?? 76.48, changePercent: silver?.changePercent ?? 0 }}
        bitcoin={{ price: bitcoin?.price ?? 72864, changePercent: bitcoin?.changePercent ?? 0 }}
        ethereum={{ price: ethereum?.price ?? 2249, changePercent: ethereum?.changePercent ?? 0 }}
      />

      {/* قسم الأخبار */}
      <HomeNewsSection news={news} />

      {/* روابط الصفحات */}
      <HomeQuickLinks />
    </div>
  );
}
