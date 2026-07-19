import { TechnicalSignal } from "@/types";

// Real technical indicators computed from live daily closes (Yahoo Finance,
// cached 1h). This replaced getMockTechnicalData(), whose hardcoded RSI values
// (58.4 / 51.2 / 68.9 / 44.3) sat unchanged on the site for weeks — a
// credibility bug on a price site. Assets whose data fetch fails are simply
// omitted from the result: the UI hides the badge rather than showing a fake
// number.
//
// Wording note: signals are direction labels (صاعد/هابط/محايد), never
// شراء/بيع — an explicit buy/sell recommendation is a legal exposure even
// with a disclaimer.

const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  Accept: "application/json",
};

const YF_SYMBOLS: Record<string, string> = {
  gold: "GC=F",
  silver: "SI=F",
  bitcoin: "BTC-USD",
  ethereum: "ETH-USD",
};

async function fetchDailyCloses(symbol: string): Promise<number[] | null> {
  try {
    const res = await fetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1y`,
      { headers: YF_HEADERS, next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const closes: number[] = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
    const valid = closes.filter((c) => typeof c === "number" && !isNaN(c));
    return valid.length >= 60 ? valid : null;
  } catch {
    return null;
  }
}

// RSI(14) with Wilder's smoothing over the full series.
function computeRSI(closes: number[], period = 14): number | null {
  if (closes.length < period + 1) return null;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) gain += d;
    else loss -= d;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  for (let i = period + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(d, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-d, 0)) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function sma(closes: number[], period: number): number | null {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

// Direction labels from RSI + moving-average posture (neutral wording only).
export function calculateTechnicalSignal(
  price: number,
  ma50: number,
  ma200: number,
  rsi: number
): Pick<TechnicalSignal, "signal" | "trend"> {
  let signal: "صاعد" | "هابط" | "محايد" = "محايد";
  let trend: "صاعد" | "هابط" | "جانبي" = "جانبي";

  if (price > ma50 && ma50 > ma200) {
    trend = "صاعد";
  } else if (price < ma50 && ma50 < ma200) {
    trend = "هابط";
  }

  if (rsi < 30 && trend !== "هابط") {
    signal = "صاعد"; // oversold in a non-bearish structure
  } else if (rsi > 70 && trend !== "صاعد") {
    signal = "هابط"; // overbought in a non-bullish structure
  } else if (rsi < 45 && trend === "صاعد") {
    signal = "صاعد";
  } else if (rsi > 55 && trend === "هابط") {
    signal = "هابط";
  }

  return { signal, trend };
}

export async function getTechnicalData(): Promise<Record<string, TechnicalSignal>> {
  const out: Record<string, TechnicalSignal> = {};

  const entries = await Promise.all(
    Object.entries(YF_SYMBOLS).map(async ([asset, symbol]) => {
      const closes = await fetchDailyCloses(symbol);
      if (!closes) return null;

      const price = closes[closes.length - 1];
      const rsi = computeRSI(closes);
      const ma50 = sma(closes, 50);
      const ma200 = sma(closes, 200) ?? sma(closes, Math.min(closes.length, 150));
      if (rsi == null || ma50 == null || ma200 == null) return null;

      const { signal, trend } = calculateTechnicalSignal(price, ma50, ma200, rsi);
      return {
        asset,
        signal,
        rsi: +rsi.toFixed(1),
        ma50: +ma50.toFixed(2),
        ma200: +ma200.toFixed(2),
        trend,
      } satisfies TechnicalSignal;
    })
  );

  for (const e of entries) {
    if (e) out[e.asset] = e;
  }
  return out;
}
