import { PriceData } from "@/types";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

// The live price must always sit inside [low24h, high24h]. CoinGecko serves the
// current price and the 24h range from separately-cached fields, so a lagging
// range contradicts a fresher price — ETH shipped as "1,921.79" with a stated
// 24h high of "1,919.45", which the share card renders literally as
// "أعلى اليوم" *below* the current price. lib/goldapi.ts already clamps for
// the same reason (same bug hit gold in July); crypto was never covered.
function clampRange(price: number, high: number, low: number): { high: number; low: number } {
  return { high: Math.max(high, price), low: Math.min(low, price) };
}

export async function getCryptoPrice(
  coinId: "bitcoin" | "ethereum"
): Promise<PriceData> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error("CoinGecko error");
    const data = await res.json();
    const market = data.market_data;
    const range = clampRange(market.current_price.usd, market.high_24h.usd, market.low_24h.usd);

    return {
      symbol: coinId === "bitcoin" ? "BTC" : "ETH",
      nameAr: coinId === "bitcoin" ? "بيتكوين" : "إيثيريوم",
      price: market.current_price.usd,
      change: market.price_change_24h,
      changePercent: market.price_change_percentage_24h,
      currency: "USD",
      high24h: range.high,
      low24h: range.low,
      marketCap: market.market_cap.usd,
      volume24h: market.total_volume.usd,
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return getMockCrypto(coinId);
  }
}

export async function getAllCryptoPrices(): Promise<PriceData[]> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error("CoinGecko error");
    const data = await res.json();

    const nameMap: Record<string, string> = {
      bitcoin: "بيتكوين",
      ethereum: "إيثيريوم",
      binancecoin: "بينانس كوين",
      solana: "سولانا",
      ripple: "ريبل",
    };

    return data.map((coin: Record<string, unknown>) => {
      const range = clampRange(coin.current_price as number, coin.high_24h as number, coin.low_24h as number);
      return {
        symbol: (coin.symbol as string).toUpperCase(),
        nameAr: nameMap[coin.id as string] || (coin.name as string),
        price: coin.current_price,
        change: coin.price_change_24h,
        changePercent: coin.price_change_percentage_24h,
        currency: "USD",
        high24h: range.high,
        low24h: range.low,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        lastUpdated: new Date().toISOString(),
      };
    });
  } catch {
    return [getMockCrypto("bitcoin"), getMockCrypto("ethereum")];
  }
}

function getMockCrypto(coinId: string): PriceData {
  // Realistic fallback prices — update when CoinGecko is unavailable
  if (coinId === "bitcoin") {
    return {
      symbol: "BTC",
      nameAr: "بيتكوين",
      price: 103000.0,
      change: 850.0,
      changePercent: 0.83,
      currency: "USD",
      high24h: 104500.0,
      low24h: 101200.0,
      marketCap: 2040000000000,
      volume24h: 35000000000,
      lastUpdated: new Date().toISOString(),
    };
  }
  return {
    symbol: "ETH",
    nameAr: "إيثيريوم",
    price: 2350.0,
    change: 18.5,
    changePercent: 0.79,
    currency: "USD",
    high24h: 2400.0,
    low24h: 2290.0,
    marketCap: 283000000000,
    volume24h: 16000000000,
    lastUpdated: new Date().toISOString(),
  };
}
