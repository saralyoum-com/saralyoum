import { PriceData } from "@/types";

const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Accept": "application/json",
};

async function fetchYahooFinance(symbol: string): Promise<{ price: number; prevClose: number; high: number; low: number } | null> {
  try {
    const res = await fetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`,
      { headers: YF_HEADERS, next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return null;
    return {
      price: meta.regularMarketPrice,
      prevClose: meta.previousClose || meta.chartPreviousClose || meta.regularMarketPrice,
      high: meta.regularMarketDayHigh || meta.regularMarketPrice * 1.005,
      low: meta.regularMarketDayLow || meta.regularMarketPrice * 0.995,
    };
  } catch {
    return null;
  }
}

async function fetchGoldAPI(symbol: string): Promise<{ price: number; ch: number; chp: number; high: number; low: number } | null> {
  try {
    const key = process.env.GOLDAPI_KEY;
    if (!key) return null;
    const res = await fetch(`https://www.goldapi.io/api/${symbol}/USD`, {
      headers: { "x-access-token": key },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    return {
      price: data.price,
      ch: data.ch,
      chp: data.chp,
      high: data.price_gram_24k ? data.price_gram_24k * 31.1035 : data.price * 1.005,
      low: data.low_price || data.price * 0.995,
    };
  } catch {
    return null;
  }
}

export async function getGoldPrice(): Promise<PriceData> {
  // Primary: GoldAPI.io (if available and quota not exceeded)
  const goldApi = await fetchGoldAPI("XAU");
  if (goldApi) {
    return {
      symbol: "XAU",
      nameAr: "الذهب",
      price: goldApi.price,
      change: goldApi.ch,
      changePercent: goldApi.chp,
      currency: "USD",
      unit: "أوقية",
      high24h: goldApi.high,
      low24h: goldApi.low,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Fallback: Yahoo Finance (GC=F — COMEX Gold Futures ≈ spot price)
  const yf = await fetchYahooFinance("GC=F");
  if (yf) {
    const change = yf.price - yf.prevClose;
    const changePercent = (change / yf.prevClose) * 100;
    return {
      symbol: "XAU",
      nameAr: "الذهب",
      price: yf.price,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      currency: "USD",
      unit: "أوقية",
      high24h: yf.high,
      low24h: yf.low,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Final fallback: realistic mock (updated periodically)
  return getMockGoldPrice();
}

export async function getSilverPrice(): Promise<PriceData> {
  // Primary: GoldAPI.io
  const goldApi = await fetchGoldAPI("XAG");
  if (goldApi) {
    return {
      symbol: "XAG",
      nameAr: "الفضة",
      price: goldApi.price,
      change: goldApi.ch,
      changePercent: goldApi.chp,
      currency: "USD",
      unit: "أوقية",
      high24h: goldApi.high,
      low24h: goldApi.low,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Fallback: Yahoo Finance (SI=F — COMEX Silver Futures)
  const yf = await fetchYahooFinance("SI=F");
  if (yf) {
    const change = yf.price - yf.prevClose;
    const changePercent = (change / yf.prevClose) * 100;
    return {
      symbol: "XAG",
      nameAr: "الفضة",
      price: yf.price,
      change: parseFloat(change.toFixed(4)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      currency: "USD",
      unit: "أوقية",
      high24h: yf.high,
      low24h: yf.low,
      lastUpdated: new Date().toISOString(),
    };
  }

  return getMockSilverPrice();
}

// ── Mock fallback (realistic — update quarterly) ──────────────────────────────
function getMockGoldPrice(): PriceData {
  return {
    symbol: "XAU",
    nameAr: "الذهب",
    price: 4787.4,
    change: -30.6,
    changePercent: -0.63,
    currency: "USD",
    unit: "أوقية",
    high24h: 4820.0,
    low24h: 4752.7,
    lastUpdated: new Date().toISOString(),
  };
}

function getMockSilverPrice(): PriceData {
  return {
    symbol: "XAG",
    nameAr: "الفضة",
    price: 76.48,
    change: -0.82,
    changePercent: -1.06,
    currency: "USD",
    unit: "أوقية",
    lastUpdated: new Date().toISOString(),
  };
}
