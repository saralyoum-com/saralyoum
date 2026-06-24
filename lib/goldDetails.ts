// Comprehensive gold-price model for the country pages.
// Everything is derived from the live spot price (USD/oz) + the local FX rate,
// plus per-market constants (مصنعية ranges, VAT, retail spreads). All retail
// figures are clearly "تقديري" — they approximate shop pricing, which varies.

export const OZ = 31.1035;

export const KARATS = [
  { karat: 24, factor: 1 },
  { karat: 22, factor: 22 / 24 },
  { karat: 21, factor: 21 / 24 },
  { karat: 18, factor: 18 / 24 },
  { karat: 14, factor: 14 / 24 },
] as const;

// Bullion sizes (grams) + typical retail premium over 24K spot.
// Premiums calibrated to real Gulf bullion pricing (smaller bar = higher premium).
export const BULLION_SIZES = [
  { key: "1g", grams: 1, premium: 0.10, ar: "سبيكة 1 جرام", en: "1 g bar" },
  { key: "2.5g", grams: 2.5, premium: 0.07, ar: "سبيكة 2.5 جرام", en: "2.5 g bar" },
  { key: "5g", grams: 5, premium: 0.05, ar: "سبيكة 5 جرام", en: "5 g bar" },
  { key: "10g", grams: 10, premium: 0.035, ar: "سبيكة 10 جرام", en: "10 g bar" },
  { key: "20g", grams: 20, premium: 0.025, ar: "سبيكة 20 جرام", en: "20 g bar" },
  { key: "halfOz", grams: 15.55175, premium: 0.03, ar: "نصف أونصة", en: "Half ounce" },
  { key: "oz", grams: 31.1035, premium: 0.02, ar: "أونصة", en: "Ounce" },
  { key: "tola", grams: 11.6638, premium: 0.04, ar: "تولة", en: "Tola" },
  { key: "50g", grams: 50, premium: 0.018, ar: "سبيكة 50 جرام", en: "50 g bar" },
  { key: "100g", grams: 100, premium: 0.012, ar: "سبيكة 100 جرام", en: "100 g bar" },
  { key: "halfKilo", grams: 500, premium: 0.009, ar: "نصف كيلو", en: "Half kilo" },
  { key: "kilo", grams: 1000, premium: 0.008, ar: "كيلو", en: "1 kilo" },
] as const;

export interface MarketConfig {
  vat: number;            // VAT rate on jewellery (المشغولات)
  vat24Exempt: boolean;   // investment bullion (999) VAT-exempt
  usedSellFactor: number; // shop's used-gold buy-back vs spot
  // typical مصنعية range per gram in LOCAL currency (simple vs designer/branded)
  masnaeyaSimple: [number, number];
  masnaeyaDesigner: [number, number];
  // مصنعية midpoint per karat used for the "شراء جديد" estimate (local/gram)
  masnaeyaMid: Record<number, number>;
}

// Per-country market constants. Saudi is calibrated; others get added at rollout.
export const MARKETS: Record<string, MarketConfig> = {
  sa: {
    vat: 0.15,
    vat24Exempt: true,
    usedSellFactor: 0.985,
    masnaeyaSimple: [40, 60],
    masnaeyaDesigner: [60, 100],
    masnaeyaMid: { 24: 0, 22: 50, 21: 55, 18: 65, 14: 70 },
  },
  ae: {
    vat: 0.05,
    vat24Exempt: true,
    usedSellFactor: 0.985,
    masnaeyaSimple: [10, 18],
    masnaeyaDesigner: [18, 35],
    masnaeyaMid: { 24: 0, 22: 14, 21: 16, 18: 22, 14: 25 },
  },
  eg: {
    vat: 0.14,
    vat24Exempt: true,
    usedSellFactor: 0.985,
    masnaeyaSimple: [50, 200],
    masnaeyaDesigner: [200, 450],
    masnaeyaMid: { 24: 0, 22: 170, 21: 180, 18: 300, 14: 330 },
  },
  om: {
    vat: 0.05,
    vat24Exempt: true,
    usedSellFactor: 0.985,
    masnaeyaSimple: [4, 8],
    masnaeyaDesigner: [8, 20],
    masnaeyaMid: { 24: 0, 22: 5, 21: 6, 18: 8, 14: 9 },
  },
};

// Sensible default for any country without a tuned config yet.
export const DEFAULT_MARKET: MarketConfig = {
  vat: 0.05,
  vat24Exempt: true,
  usedSellFactor: 0.985,
  masnaeyaSimple: [8, 16],
  masnaeyaDesigner: [16, 35],
  masnaeyaMid: { 24: 0, 22: 12, 21: 14, 18: 18, 14: 20 },
};

export function getMarket(code: string): MarketConfig {
  return MARKETS[code] ?? DEFAULT_MARKET;
}

export interface KaratRow { karat: number; local: number; usd: number; }
export interface BuySellRow { karat: number; newBuy: number; usedSell: number; }
export interface BullionRow { key: string; ar: string; en: string; grams: number; local: number; usd: number; }

// Spot gram price per karat (raw, no مصنعية).
export function karatGramPrices(goldUSDperOz: number, rate: number): KaratRow[] {
  const gram24USD = goldUSDperOz / OZ;
  return KARATS.map(({ karat, factor }) => ({
    karat,
    local: gram24USD * factor * rate,
    usd: gram24USD * factor,
  }));
}

// Shop buy (new, incl مصنعية, pre-VAT) and sell (used) per karat — تقديري.
export function buySellPrices(goldUSDperOz: number, rate: number, m: MarketConfig): BuySellRow[] {
  const gram24Local = (goldUSDperOz / OZ) * rate;
  return KARATS.filter((k) => k.karat !== 14).map(({ karat, factor }) => {
    const spot = gram24Local * factor;
    const newBuy =
      karat === 24 ? spot * 1.02 : spot + (m.masnaeyaMid[karat] ?? 0);
    return { karat, newBuy, usedSell: spot * m.usedSellFactor };
  });
}

// Bullion (24K / 999) prices by size in local + USD.
export function bullionPrices(goldUSDperOz: number, rate: number): BullionRow[] {
  const gram24USD = goldUSDperOz / OZ;
  return BULLION_SIZES.map((b) => {
    const usd = gram24USD * b.grams * (1 + b.premium);
    return { key: b.key, ar: b.ar, en: b.en, grams: b.grams, local: usd * rate, usd };
  });
}
