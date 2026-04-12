import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  Accept: "application/json",
};

// Yahoo Finance range → interval mapping
const YF_RANGES: Record<string, { range: string; interval: string }> = {
  "1d": { range: "1d", interval: "5m" },
  "1w": { range: "5d", interval: "60m" },
  "1m": { range: "1mo", interval: "1d" },
  "1y": { range: "1y", interval: "1wk" },
  "5y": { range: "5y", interval: "1mo" },
};

// CoinGecko days mapping
const CG_DAYS: Record<string, string> = {
  "1d": "1",
  "1w": "7",
  "1m": "30",
  "1y": "365",
  "5y": "1825",
};

type HistoryPoint = { t: number; p: number };

async function fetchYahooHistory(symbol: string, range: string): Promise<HistoryPoint[]> {
  const cfg = YF_RANGES[range] || YF_RANGES["1m"];
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${cfg.interval}&range=${cfg.range}`;
  const res = await fetch(url, { headers: YF_HEADERS, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`YF ${res.status}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error("No chart data");
  const timestamps: number[] = result.timestamp || [];
  const closes: number[] = result.indicators?.quote?.[0]?.close || [];
  return timestamps
    .map((t, i) => ({ t: t * 1000, p: closes[i] }))
    .filter((pt) => pt.p != null && !isNaN(pt.p));
}

async function fetchCoinGeckoHistory(coinId: string, range: string): Promise<HistoryPoint[]> {
  const days = CG_DAYS[range] || "30";
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`CG ${res.status}`);
  const json = await res.json();
  const prices: [number, number][] = json?.prices || [];
  return prices.map(([t, p]) => ({ t, p }));
}

// Lightweight mock fallback — generates realistic looking data
function generateMockHistory(basePrice: number, range: string, volatility = 0.015): HistoryPoint[] {
  const pointsMap: Record<string, number> = {
    "1d": 78, "1w": 120, "1m": 30, "1y": 52, "5y": 60,
  };
  const msMap: Record<string, number> = {
    "1d": 5 * 60 * 1000,
    "1w": 60 * 60 * 1000,
    "1m": 24 * 60 * 60 * 1000,
    "1y": 7 * 24 * 60 * 60 * 1000,
    "5y": 30 * 24 * 60 * 60 * 1000,
  };
  const n = pointsMap[range] || 30;
  const step = msMap[range] || 24 * 60 * 60 * 1000;
  const now = Date.now();
  const points: HistoryPoint[] = [];
  let p = basePrice * (1 - volatility * n * 0.3);
  for (let i = n; i >= 0; i--) {
    p = p * (1 + (Math.random() - 0.48) * volatility);
    points.push({ t: now - i * step, p: Math.round(p * 100) / 100 });
  }
  // Last point = current price
  points[points.length - 1].p = basePrice;
  return points;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const asset = searchParams.get("asset") || "gold";
  const range = searchParams.get("range") || "1m";

  try {
    let data: HistoryPoint[] = [];

    if (asset === "gold") {
      try { data = await fetchYahooHistory("GC=F", range); }
      catch { data = generateMockHistory(4787, range, 0.008); }
    } else if (asset === "silver") {
      try { data = await fetchYahooHistory("SI=F", range); }
      catch { data = generateMockHistory(76.48, range, 0.012); }
    } else if (asset === "bitcoin") {
      try { data = await fetchCoinGeckoHistory("bitcoin", range); }
      catch { data = generateMockHistory(72864, range, 0.025); }
    } else if (asset === "ethereum") {
      try { data = await fetchCoinGeckoHistory("ethereum", range); }
      catch { data = generateMockHistory(2249, range, 0.03); }
    }

    return NextResponse.json(
      { asset, range, data },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" } }
    );
  } catch (err) {
    console.error("[history]", err);
    return NextResponse.json({ asset, range, data: [] }, { status: 200 });
  }
}
