import { NextRequest, NextResponse } from "next/server";
import { NewsItem } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 900; // 15 minutes

const AR_RSS_SOURCES = [
  {
    url: "https://feeds.bbci.co.uk/arabic/business/rss.xml",
    source: "BBC عربي",
  },
  {
    url: "https://www.aljazeera.net/aljazeerarss/a3c32dff-a375-4b40-a519-59f122abcd38/5413f4a6-fe4e-4e37-bab8-e04e3e38a5f2",
    source: "الجزيرة",
  },
];

const EN_RSS_SOURCES = [
  {
    url: "https://feeds.reuters.com/reuters/businessNews",
    source: "Reuters",
  },
  {
    url: "https://www.kitco.com/rss/",
    source: "Kitco",
  },
  {
    url: "https://finance.yahoo.com/news/rssindex",
    source: "Yahoo Finance",
  },
  {
    url: "https://feeds.marketwatch.com/marketwatch/marketpulse/",
    source: "MarketWatch",
  },
];

async function fetchRSS(url: string, source: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SaralYoum/1.0" },
      next: { revalidate: 900 },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
        || item.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const description =
        item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1]
        || item.match(/<description>(.*?)<\/description>/)?.[1] || "";
      const link = item.match(/<link>(.*?)<\/link>/)?.[1]
        || item.match(/<guid>(.*?)<\/guid>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      const imageUrl = item.match(/url="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"/)?.[1];

      if (title && link) {
        items.push({
          id: Buffer.from(link).toString("base64").slice(0, 20),
          title: title.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim(),
          description: description
            .replace(/<[^>]*>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .trim()
            .slice(0, 200),
          url: link,
          source,
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          imageUrl,
        });
      }

      if (items.length >= 10) break;
    }

    return items;
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") === "en" ? "en" : "ar";

    const sources = lang === "en" ? EN_RSS_SOURCES : AR_RSS_SOURCES;

    const results = await Promise.allSettled(
      sources.map((s) => fetchRSS(s.url, s.source))
    );

    const allNews: NewsItem[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        allNews.push(...result.value);
      }
    }

    const mockFallback = lang === "en" ? getMockNewsEn() : getMockNewsAr();
    const news = allNews.length > 0 ? allNews : mockFallback;
    const sorted = news.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json({ news: sorted.slice(0, 20) });
  } catch {
    return NextResponse.json({ news: getMockNewsAr() });
  }
}

function getMockNewsAr(): NewsItem[] {
  const now = new Date();
  return [
    {
      id: "1",
      title: "الذهب يرتفع مع تراجع الدولار وترقب قرارات الفيدرالي",
      description:
        "ارتفعت أسعار الذهب في التداولات الآسيوية مع تراجع مؤشر الدولار الأمريكي قبيل اجتماع الاحتياطي الفيدرالي.",
      url: "#",
      source: "أرقام",
      publishedAt: new Date(now.getTime() - 3600000).toISOString(),
    },
    {
      id: "2",
      title: "بيتكوين يتجاوز 83,000 دولار وسط تدفقات قياسية للصناديق",
      description:
        "سجل بيتكوين مستويات قياسية جديدة مدفوعاً بتدفقات ضخمة إلى صناديق ETF وتراجع المخاوف التضخمية.",
      url: "#",
      source: "مباشر",
      publishedAt: new Date(now.getTime() - 7200000).toISOString(),
    },
    {
      id: "3",
      title: "أسعار الفضة تسجل أعلى مستوياتها منذ 12 عاماً",
      description:
        "قفزت أسعار الفضة بشكل لافت وسط ارتفاع الطلب الصناعي وتراجع المخزونات العالمية.",
      url: "#",
      source: "رويترز عربي",
      publishedAt: new Date(now.getTime() - 10800000).toISOString(),
    },
    {
      id: "4",
      title: "الريال السعودي يحافظ على استقراره أمام الدولار",
      description:
        "واصل الريال السعودي استقراره في نطاق الربط الثابت مع الدولار الأمريكي.",
      url: "#",
      source: "الجزيرة",
      publishedAt: new Date(now.getTime() - 14400000).toISOString(),
    },
    {
      id: "5",
      title: "إيثيريوم يتراجع قبيل ترقية الشبكة المرتقبة",
      description:
        "تراجع سعر إيثيريوم مع خروج السيولة قبيل ترقية الشبكة المخططة الشهر القادم.",
      url: "#",
      source: "أرقام",
      publishedAt: new Date(now.getTime() - 18000000).toISOString(),
    },
  ];
}

function getMockNewsEn(): NewsItem[] {
  const now = new Date();
  return [
    {
      id: "en1",
      title: "Gold Rises as Dollar Weakens Ahead of Fed Decision",
      description:
        "Gold prices climbed in Asian trading as the US dollar index declined ahead of the Federal Reserve meeting.",
      url: "#",
      source: "Reuters",
      publishedAt: new Date(now.getTime() - 3600000).toISOString(),
    },
    {
      id: "en2",
      title: "Bitcoin Surpasses $83,000 on Record ETF Inflows",
      description:
        "Bitcoin hit new highs driven by massive ETF inflows and easing inflation concerns.",
      url: "#",
      source: "MarketWatch",
      publishedAt: new Date(now.getTime() - 7200000).toISOString(),
    },
    {
      id: "en3",
      title: "Silver Prices Reach 12-Year Highs on Industrial Demand",
      description:
        "Silver surged sharply amid rising industrial demand and declining global inventories.",
      url: "#",
      source: "Kitco",
      publishedAt: new Date(now.getTime() - 10800000).toISOString(),
    },
    {
      id: "en4",
      title: "Ethereum Dips Ahead of Anticipated Network Upgrade",
      description:
        "Ethereum prices fell as liquidity exited ahead of the planned network upgrade next month.",
      url: "#",
      source: "Yahoo Finance",
      publishedAt: new Date(now.getTime() - 14400000).toISOString(),
    },
    {
      id: "en5",
      title: "Oil Prices Steady Amid OPEC+ Supply Discussions",
      description:
        "Crude oil prices stabilized as OPEC+ members discussed potential supply adjustments.",
      url: "#",
      source: "Reuters",
      publishedAt: new Date(now.getTime() - 18000000).toISOString(),
    },
  ];
}
