import { TechnicalSignal } from "@/types";

// حساب الإشارات التقنية من RSI والمتوسطات المتحركة
export function calculateTechnicalSignal(
  price: number,
  ma50: number,
  ma200: number,
  rsi: number
): Pick<TechnicalSignal, "signal" | "trend"> {
  let signal: "شراء" | "بيع" | "محايد" = "محايد";
  let trend: "صاعد" | "هابط" | "جانبي" = "جانبي";

  // تحديد الاتجاه
  if (price > ma50 && ma50 > ma200) {
    trend = "صاعد";
  } else if (price < ma50 && ma50 < ma200) {
    trend = "هابط";
  }

  // تحديد الإشارة
  if (rsi < 30 && trend !== "هابط") {
    signal = "شراء"; // ذروة البيع
  } else if (rsi > 70 && trend !== "صاعد") {
    signal = "بيع"; // ذروة الشراء
  } else if (rsi < 45 && trend === "صاعد") {
    signal = "شراء"; // ضغط شرائي
  } else if (rsi > 55 && trend === "هابط") {
    signal = "بيع"; // ضغط بيعي
  }

  return { signal, trend };
}

// بيانات تقنية تقريبية للعرض
export function getMockTechnicalData(): Record<string, TechnicalSignal> {
  return {
    gold: {
      asset: "gold",
      signal: "شراء",
      rsi: 58.4,
      ma50: 2980.0,
      ma200: 2750.0,
      trend: "صاعد",
    },
    silver: {
      asset: "silver",
      signal: "محايد",
      rsi: 51.2,
      ma50: 33.5,
      ma200: 28.8,
      trend: "جانبي",
    },
    bitcoin: {
      asset: "bitcoin",
      signal: "بيع",
      rsi: 68.9,
      ma50: 78000,
      ma200: 55000,
      trend: "صاعد",
    },
    ethereum: {
      asset: "ethereum",
      signal: "محايد",
      rsi: 44.3,
      ma50: 2100,
      ma200: 2800,
      trend: "هابط",
    },
  };
}
