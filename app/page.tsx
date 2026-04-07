import PriceTicker from "@/components/PriceTicker";
import Disclaimer from "@/components/Disclaimer";
import PriceCardsClient from "@/components/PriceCardsClient";
import { HomeHero, HomeAdAndCTA, HomeNewsSection, HomeQuickLinks } from "@/components/HomeContent";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { getMockTechnicalData } from "@/lib/technical";
import { NewsItem } from "@/types";

export const revalidate = 60;

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

  return (
    <div className="min-h-screen">
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

      {/* قسم الأخبار */}
      <HomeNewsSection news={news} />

      {/* روابط الصفحات */}
      <HomeQuickLinks />
    </div>
  );
}
