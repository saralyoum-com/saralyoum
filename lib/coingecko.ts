import { PriceData } from "@/types";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

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

    return {
      symbol: coinId === "bitcoin" ? "BTC" : "ETH",
      nameAr: coinId === "bitcoin" ? "بيتكوين" : "إيثيريوم",
      price: market.current_price.usd,
      change: market.price_change_24h,
      changePercent: market.price_change_percentage_24h,
      currency: "USD",
      high24h: market.high_24h.usd,
      low24h: market.low_24h.usd,
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

    return data.map((coin: Record<string, unknown>) => ({
      symbol: (coin.symbol as string).toUpperCase(),
      nameAr: nameMap[coin.id as string] || (coin.name as string),
      price: coin.current_price,
      change: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      currency: "USD",
      high24h: coin.high_24h,
      low24h: coin.low_24h,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      lastUpdated: new Date().toISOString(),
    }));
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
      price: 72864.0,
      change: 291.5,
      changePercent: 0.40,
      currency: "USD",
      high24h: 73500.0,
      low24h: 71200.0,
      marketCap: 1440000000000,
      volume24h: 28000000000,
      lastUpdated: new Date().toISOString(),
    };
  }
  return {
    symbol: "ETH",
    nameAr: "إيثيريوم",
    price: 2248.77,
    change: 21.2,
    changePercent: 0.94,
    currency: "USD",
    high24h: 2290.0,
    low24h: 2190.0,
    marketCap: 270000000000,
    volume24h: 14000000000,
    lastUpdated: new Date().toISOString(),
  };
}
