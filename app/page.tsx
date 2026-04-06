import Link from "next/link";
import PriceTicker from "@/components/PriceTicker";
import PriceCard from "@/components/PriceCard";
import Disclaimer from "@/components/Disclaimer";
import AdSense from "@/components/AdSense";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { getMockTechnicalData } from "@/lib/technical";
import { formatDate } from "@/lib/format";
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
    <div dir="rtl" className="min-h-screen">
      {/* شريط الأسعار المتحرك */}
      <PriceTicker prices={tickerPrices} />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-3">
            أسعار{" "}
            <span className="text-gold">لحظية</span>
          </h1>
          <p className="text-text-secondary text-lg">
            الذهب • الفضة • البيتكوين • الإيثيريوم — محدّث كل دقيقة
          </p>
          <p className="text-text-secondary text-sm mt-2">
            {new Intl.DateTimeFormat("ar-SA", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              numberingSystem: "latn",
            }).format(new Date())}
          </p>
        </div>

        {/* بطاقات الأسعار */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <PriceCard data={gold} signal={signals.gold} index={0} />
          <PriceCard data={silver} signal={signals.silver} index={1} />
          <PriceCard data={bitcoin} signal={signals.bitcoin} index={2} />
          <PriceCard data={ethereum} signal={signals.ethereum} index={3} />
        </div>

        {/* إخلاء المسؤولية */}
        <Disclaimer />

        {/* إعلان بعد البطاقات */}
        <AdSense slot="1234567890" format="horizontal" className="my-6" />

        {/* CTA التنبيهات */}
        <div className="bg-gradient-to-l from-gold/5 to-gold/10 border border-gold/20 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-1">
              🔔 اشترك في التنبيه اليومي
            </h2>
            <p className="text-text-secondary text-sm">
              احصل على أسعار الذهب والعملات كل صباح الساعة 8 — مجاناً
            </p>
          </div>
          <Link
            href="/تنبيهات"
            className="bg-gold text-background font-bold px-6 py-3 rounded-xl hover:bg-gold-light transition-colors whitespace-nowrap"
          >
            اشترك الآن
          </Link>
        </div>
      </section>

      {/* قسم الأخبار */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">📰 أبرز الأخبار</h2>
          <Link
            href="/اخبار"
            className="text-gold hover:text-gold-light text-sm font-medium transition-colors"
          >
            عرض الكل ←
          </Link>
        </div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target={item.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="bg-surface border border-border rounded-2xl p-5 hover:border-gold/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                    {item.source}
                  </span>
                  <span className="text-text-secondary text-xs">
                    {formatDate(item.publishedAt)}
                  </span>
                </div>
                <h3 className="text-text-primary font-bold text-sm leading-relaxed group-hover:text-gold transition-colors mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-secondary">
            <p className="text-4xl mb-3">📡</p>
            <p>جاري تحميل الأخبار...</p>
            <Link href="/اخبار" className="text-gold text-sm mt-2 inline-block">
              تصفح الأخبار
            </Link>
          </div>
        )}
      </section>

      {/* إعلان بين الأخبار والروابط */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <AdSense slot="0987654321" format="auto" />
      </div>

      {/* روابط الصفحات */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/اسعار"
            className="bg-surface border border-border rounded-2xl p-6 hover:border-gold/30 transition-all group text-center"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-text-primary font-bold mb-2 group-hover:text-gold transition-colors">
              جدول الأسعار
            </h3>
            <p className="text-text-secondary text-sm">
              عرض تفصيلي لجميع الأسعار مع الرسوم البيانية
            </p>
          </Link>
          <Link
            href="/اخبار"
            className="bg-surface border border-border rounded-2xl p-6 hover:border-gold/30 transition-all group text-center"
          >
            <div className="text-4xl mb-3">📰</div>
            <h3 className="text-text-primary font-bold mb-2 group-hover:text-gold transition-colors">
              الأخبار الاقتصادية
            </h3>
            <p className="text-text-secondary text-sm">
              آخر أخبار الأسواق من مصادر موثوقة
            </p>
          </Link>
          <Link
            href="/تنبيهات"
            className="bg-surface border border-border rounded-2xl p-6 hover:border-gold/30 transition-all group text-center"
          >
            <div className="text-4xl mb-3">🔔</div>
            <h3 className="text-text-primary font-bold mb-2 group-hover:text-gold transition-colors">
              التنبيهات الذكية
            </h3>
            <p className="text-text-secondary text-sm">
              تنبيهات يومية وتنبيهات سعرية مخصصة
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
