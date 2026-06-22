import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Candle { t: number; o: number; h: number; l: number; c: number; v: number }

function calcRsi(closes: number[], n = 14): number {
  if (closes.length < n + 1) return 50;
  const diffs = closes.slice(-(n + 1)).map((c, i, a) => i === 0 ? 0 : c - a[i - 1]).slice(1);
  const ag = diffs.map(d => d > 0 ? d : 0).reduce((a, b) => a + b, 0) / n;
  const al = diffs.map(d => d < 0 ? -d : 0).reduce((a, b) => a + b, 0) / n;
  if (al === 0) return 100;
  return +(100 - 100 / (1 + ag / al)).toFixed(1);
}

function calcAtr(candles: Candle[], n = 14): number {
  if (candles.length < 2) return (candles[0]?.c ?? 3300) * 0.01;
  const trs = candles.slice(-n).map((c, i, a) => {
    const prev = i === 0 ? c.c : a[i - 1].c;
    return Math.max(c.h - c.l, Math.abs(c.h - prev), Math.abs(c.l - prev));
  });
  return trs.reduce((a, b) => a + b, 0) / trs.length;
}

function emaArr(data: number[], period: number): number[] {
  if (data.length === 0) return [];
  const k = 2 / (period + 1);
  const result = [data[0]];
  for (let i = 1; i < data.length; i++) result.push(data[i] * k + result[i - 1] * (1 - k));
  return result;
}

const TF_PARAMS: Record<string, { interval: string; range: string; agg?: number }> = {
  "1m":  { interval: "1m",  range: "1d" },
  "5m":  { interval: "5m",  range: "5d" },
  "15m": { interval: "15m", range: "5d" },
  "30m": { interval: "30m", range: "1mo" },
  "1h":  { interval: "1h",  range: "1mo" },
  "4h":  { interval: "1h",  range: "3mo", agg: 4 },
  "1d":  { interval: "1d",  range: "6mo" },
};

export async function GET(req: Request) {
  const tf = new URL(req.url).searchParams.get("tf") ?? "1d";
  const { interval, range, agg } = TF_PARAMS[tf] ?? TF_PARAMS["1d"];

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=${interval}&range=${range}`,
      { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" }
    );
    if (!res.ok) throw new Error("Yahoo unavailable");
    const json = await res.json();
    const r = json.chart.result[0];
    const q = r.indicators.quote[0];

    let candles: Candle[] = (r.timestamp as number[])
      .map((t: number, i: number) => ({ t: t * 1000, o: q.open[i], h: q.high[i], l: q.low[i], c: q.close[i], v: q.volume?.[i] ?? 0 }))
      .filter((c: Candle) => c.o != null && c.h != null && c.l != null && c.c != null && c.c > 0);

    if (agg) {
      const aggd: Candle[] = [];
      for (let i = 0; i < candles.length; i += agg) {
        const g = candles.slice(i, i + agg);
        if (!g.length) continue;
        aggd.push({ t: g[0].t, o: g[0].o, h: Math.max(...g.map(c => c.h)), l: Math.min(...g.map(c => c.l)), c: g[g.length - 1].c, v: g.reduce((s, c) => s + c.v, 0) });
      }
      candles = aggd;
    }

    candles = candles.slice(-40);
    const closes = candles.map(c => c.c);
    const last = candles[candles.length - 1];
    const prev = candles[candles.length - 2]?.c ?? last.c;
    const current = last.c;

    // RSI series
    const rsiValues = candles.map((_, i) => i < 14 ? 50 : calcRsi(closes.slice(0, i + 1)));
    const currentRsi = rsiValues[rsiValues.length - 1];

    // MACD
    const ema12 = emaArr(closes, 12);
    const ema26 = emaArr(closes, 26);
    const macdLine = ema12.map((v, i) => v - ema26[i]);
    const signalLine = emaArr(macdLine, 9);
    const macdHist = macdLine.map((v, i) => v - signalLine[i]);

    // Pivot levels from last candle
    const pp = (last.h + last.l + last.c) / 3;
    const levels = {
      r2: Math.round(pp + (last.h - last.l)),
      r1: Math.round(2 * pp - last.l),
      s1: Math.round(2 * pp - last.h),
      s2: Math.round(pp - (last.h - last.l)),
    };

    // Signal
    const atr = calcAtr(candles);
    const closes7 = closes.slice(-7);
    const sma7 = closes7.reduce((a, b) => a + b, 0) / closes7.length;
    const direction = current > sma7 ? "up" : "down";
    const mult = direction === "up" ? 1 : -1;

    return NextResponse.json({
      candles,
      current: Math.round(current * 100) / 100,
      change: Math.round((current - prev) * 100) / 100,
      changePercent: Math.round(((current - prev) / prev) * 10000) / 100,
      ohlc: { o: Math.round(last.o), h: Math.round(last.h), l: Math.round(last.l), c: Math.round(last.c) },
      rsiValues,
      currentRsi: Math.round(currentRsi),
      macd: { line: macdLine.slice(-40), signal: signalLine.slice(-40), hist: macdHist.slice(-40) },
      levels,
      signal: {
        direction,
        entry: Math.round(current),
        tp: Math.round(current + mult * atr * 0.6),
        sl: Math.round(current - mult * atr * 0.4),
      },
    });

  } catch {
    // Fallback mock data
    const base = 3247;
    const mock: Candle[] = Array.from({ length: 40 }, (_, i) => {
      const c = base + Math.sin(i * 0.5) * 12 + Math.cos(i * 0.3) * 6 + i * 0.2;
      return { t: Date.now() - (40 - i) * 3600000, o: c - 2, h: c + 5, l: c - 6, c, v: 800 + Math.random() * 400 };
    });
    return NextResponse.json({
      candles: mock,
      current: base + 5.2,
      change: 12.3,
      changePercent: 0.38,
      ohlc: { o: 3247, h: 3254, l: 3245, c: 3252 },
      rsiValues: mock.map((_, i) => 50 + Math.sin(i * 0.4) * 22),
      currentRsi: 79,
      macd: { line: mock.map((_, i) => Math.sin(i * 0.3) * 3), signal: mock.map((_, i) => Math.sin(i * 0.3 - 0.5) * 2.5), hist: mock.map((_, i) => Math.sin(i * 0.3) * 0.5) },
      levels: { r2: 3340, r1: 3295, s1: 3213, s2: 3168 },
      signal: { direction: "up", entry: 3247, tp: 3310, sl: 3200 },
    });
  }
}
