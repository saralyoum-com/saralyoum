export interface PriceData {
  symbol: string;
  nameAr: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  unit?: string;
  high24h?: number;
  low24h?: number;
  marketCap?: number;
  volume24h?: number;
  lastUpdated: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

export interface Alert {
  id: string;
  email: string;
  asset: "gold" | "silver" | "bitcoin" | "ethereum";
  type: "daily" | "price";
  targetPrice?: number;
  condition?: "above" | "below";
  active: boolean;
  createdAt: string;
}

export interface TechnicalSignal {
  asset: string;
  signal: "شراء" | "بيع" | "محايد";
  rsi: number;
  ma50: number;
  ma200: number;
  trend: "صاعد" | "هابط" | "جانبي";
}
