import { PriceData } from "@/types";

const GOLDAPI_BASE = "https://www.goldapi.io/api";

export async function getGoldPrice(): Promise<PriceData> {
  try {
    const res = await fetch(`${GOLDAPI_BASE}/XAU/USD`, {
      headers: { "x-access-token": process.env.GOLDAPI_KEY || "" },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error("GoldAPI error");
    const data = await res.json();

    return {
      symbol: "XAU",
      nameAr: "الذهب",
      price: data.price,
      change: data.ch,
      changePercent: data.chp,
      currency: "USD",
      unit: "أوقية",
      high24h: data.price_gram_24k * 31.1035,
      low24h: data.low_price,
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    // Fallback mock data
    return getMockGoldPrice();
  }
}

export async function getSilverPrice(): Promise<PriceData> {
  try {
    const res = await fetch(`${GOLDAPI_BASE}/XAG/USD`, {
      headers: { "x-access-token": process.env.GOLDAPI_KEY || "" },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error("GoldAPI error");
    const data = await res.json();

    return {
      symbol: "XAG",
      nameAr: "الفضة",
      price: data.price,
      change: data.ch,
      changePercent: data.chp,
      currency: "USD",
      unit: "أوقية",
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return getMockSilverPrice();
  }
}

function getMockGoldPrice(): PriceData {
  return {
    symbol: "XAU",
    nameAr: "الذهب",
    price: 3120.5,
    change: 12.3,
    changePercent: 0.4,
    currency: "USD",
    unit: "أوقية",
    high24h: 3135.0,
    low24h: 3098.0,
    lastUpdated: new Date().toISOString(),
  };
}

function getMockSilverPrice(): PriceData {
  return {
    symbol: "XAG",
    nameAr: "الفضة",
    price: 34.82,
    change: -0.15,
    changePercent: -0.43,
    currency: "USD",
    unit: "أوقية",
    lastUpdated: new Date().toISOString(),
  };
}
