import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface DayData { close: number; high: number; low: number }

function sma(prices: number[], n: number) {
  const s = prices.slice(-n);
  return s.reduce((a, b) => a + b, 0) / s.length;
}

function rsi(closes: number[], n = 14) {
  if (closes.length < n + 1) return 50;
  const diffs = closes.slice(-(n + 1)).map((c, i, a) => i === 0 ? 0 : c - a[i - 1]).slice(1);
  const ag = diffs.map(d => d > 0 ? d : 0).reduce((a, b) => a + b, 0) / n;
  const al = diffs.map(d => d < 0 ? -d : 0).reduce((a, b) => a + b, 0) / n;
  if (al === 0) return 100;
  return 100 - 100 / (1 + ag / al);
}

function calcATR(data: DayData[], n = 14) {
  if (data.length < 2) return data[0].close * 0.01;
  const trs = data.slice(-n).map((d, i, a) => {
    const prev = i === 0 ? d.close : a[i - 1].close;
    return Math.max(d.high - d.low, Math.abs(d.high - prev), Math.abs(d.low - prev));
  });
  return trs.reduce((a, b) => a + b, 0) / trs.length;
}

async function askDeepSeek(indicators: {
  cur: number; rsi: number; sma7: number; sma30: number; sma90: number;
  mom3: number; mom7: number; mom30: number; atr: number;
}) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("no key");

  const prompt = `بيانات الذهب الحالية:
- السعر الحالي: $${indicators.cur}
- RSI (14): ${indicators.rsi}
- SMA7: $${indicators.sma7} | SMA30: $${indicators.sma30} | SMA90: $${indicators.sma90}
- ATR اليومي: $${Math.round(indicators.atr)}
- الزخم 3 أيام: ${indicators.mom3}%
- الزخم 7 أيام: ${indicators.mom7}%
- الزخم 30 يوم: ${indicators.mom30}%
- الاتجاه الأسبوعي: ${indicators.sma7 > indicators.sma30 ? "صاعد" : "هابط"} (SMA7 ${indicators.sma7 > indicators.sma30 ? ">" : "<"} SMA30)
- الاتجاه الشهري: ${indicators.sma30 > indicators.sma90 ? "صاعد" : "هابط"} (SMA30 ${indicators.sma30 > indicators.sma90 ? ">" : "<"} SMA90)

أعطني توقعاً دقيقاً لكل فترة. للسعر المستهدف اعتمد على ATR (اليومي = ATR×0.6، الأسبوعي = ATR×2، الشهري = ATR×5) مضافاً أو مطروحاً من السعر الحالي حسب الاتجاه. أجب بـ JSON فقط:
{"daily":{"direction":"up|down","confidence":55-80,"target":رقم,"reason":"جملة واحدة"},"weekly":{"direction":"up|down","confidence":55-80,"target":رقم,"reason":"جملة واحدة"},"monthly":{"direction":"up|down","confidence":55-80,"target":رقم,"reason":"جملة واحدة"}}`;

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "أنت محلل تقني متخصص في أسواق الذهب. أجب بـ JSON فقط بدون أي نص إضافي." },
        { role: "user", content: prompt },
      ],
      max_tokens: 350,
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) throw new Error("deepseek error");
  const json = await res.json();
  return JSON.parse(json.choices[0].message.content) as {
    daily:   { direction: "up" | "down"; confidence: number; target: number; reason: string };
    weekly:  { direction: "up" | "down"; confidence: number; target: number; reason: string };
    monthly: { direction: "up" | "down"; confidence: number; target: number; reason: string };
  };
}

export async function GET() {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=3mo",
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Yahoo unavailable");

    const json = await res.json();
    const r = json.chart.result[0];
    const q = r.indicators.quote[0];

    const data: DayData[] = (r.timestamp as number[])
      .map((_: number, i: number) => ({ close: q.close[i], high: q.high[i], low: q.low[i] }))
      .filter((d: DayData) => d.close != null && d.high != null && d.low != null);

    const closes = data.map(d => d.close);
    const cur    = closes[closes.length - 1];
    const RSI    = rsi(closes);
    const SMA7   = sma(closes, 7);
    const SMA30  = sma(closes, 30);
    const SMA90  = sma(closes, Math.min(90, closes.length));
    const ATR    = calcATR(data);

    const mom3  = closes.length > 4  ? ((cur - closes[closes.length - 4])  / closes[closes.length - 4])  * 100 : 0;
    const mom7  = closes.length > 8  ? ((cur - closes[closes.length - 8])  / closes[closes.length - 8])  * 100 : 0;
    const mom30 = closes.length > 31 ? ((cur - closes[closes.length - 31]) / closes[closes.length - 31]) * 100 : 0;

    // Sparkline prices — rounded integers
    const dailyPrices   = closes.slice(-7).map(Math.round);
    const weeklyPrices  = closes.filter((_, i) => i % 5 === 0).slice(-8).map(Math.round);
    const monthlyPrices = closes.filter((_, i) => i % 15 === 0).slice(-6).map(Math.round);

    const indicators = {
      cur: Math.round(cur), rsi: Math.round(RSI),
      sma7: Math.round(SMA7), sma30: Math.round(SMA30), sma90: Math.round(SMA90),
      mom3: parseFloat(mom3.toFixed(1)), mom7: parseFloat(mom7.toFixed(1)), mom30: parseFloat(mom30.toFixed(1)),
      atr: ATR,
    };

    // DeepSeek analysis
    const ai = await askDeepSeek(indicators);

    return NextResponse.json({
      current: indicators.cur,
      aiPowered: true,
      indicators: {
        rsi: indicators.rsi, sma7: indicators.sma7, sma30: indicators.sma30, sma90: indicators.sma90,
        mom3d: indicators.mom3, mom7d: indicators.mom7, mom30d: indicators.mom30,
        maDaily:   SMA7  > SMA30 ? "bullish" : "bearish",
        maMonthly: SMA30 > SMA90 ? "bullish" : "bearish",
      },
      predictions: {
        daily:   { ...ai.daily,   prices: dailyPrices   },
        weekly:  { ...ai.weekly,  prices: weeklyPrices  },
        monthly: { ...ai.monthly, prices: monthlyPrices },
      },
    });

  } catch (err) {
    // Fallback: algorithmic only (no DeepSeek)
    try {
      const res2 = await fetch(
        "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=3mo",
        { headers: { "User-Agent": "Mozilla/5.0" } }
      );
      if (res2.ok) {
        const j2 = await res2.json();
        const r2 = j2.chart.result[0];
        const q2 = r2.indicators.quote[0];
        const data2: DayData[] = (r2.timestamp as number[])
          .map((_: number, i: number) => ({ close: q2.close[i], high: q2.high[i], low: q2.low[i] }))
          .filter((d: DayData) => d.close != null);
        const c2 = data2.map(d => d.close);
        const cur2 = c2[c2.length - 1];
        const RSI2 = rsi(c2);
        const SMA72 = sma(c2, 7); const SMA302 = sma(c2, 30); const SMA902 = sma(c2, Math.min(90, c2.length));
        const ATR2 = calcATR(data2);
        const mom32  = c2.length > 4  ? ((cur2 - c2[c2.length - 4])  / c2[c2.length - 4])  * 100 : 0;
        const mom72  = c2.length > 8  ? ((cur2 - c2[c2.length - 8])  / c2[c2.length - 8])  * 100 : 0;
        const mom302 = c2.length > 31 ? ((cur2 - c2[c2.length - 31]) / c2[c2.length - 31]) * 100 : 0;
        const pred = (bulls: number, total: number, mult: number) => {
          const d = bulls >= Math.ceil(total / 2) ? "up" : "down";
          const conf = Math.round(Math.min(78, 55 + (Math.abs(bulls - (total - bulls)) / total) * 18));
          return { direction: d as "up" | "down", confidence: conf, target: d === "up" ? Math.round(cur2 + ATR2 * mult) : Math.round(cur2 - ATR2 * mult), reason: "" };
        };
        const dB = (RSI2 < 45 ? 1 : 0) + (SMA72 > SMA302 ? 1 : 0) + (mom32 > 0 ? 1 : 0);
        const wB = (SMA72 > SMA302 ? 1 : 0) + (mom72 > 0 ? 1 : 0) + (RSI2 < 52 ? 1 : 0);
        const mB = (SMA302 > SMA902 ? 1 : 0) + (mom302 > 0 ? 1 : 0) + (RSI2 < 62 ? 1 : 0);
        return NextResponse.json({
          current: Math.round(cur2), aiPowered: false,
          indicators: { rsi: Math.round(RSI2), sma7: Math.round(SMA72), sma30: Math.round(SMA302), sma90: Math.round(SMA902), mom3d: parseFloat(mom32.toFixed(1)), mom7d: parseFloat(mom72.toFixed(1)), mom30d: parseFloat(mom302.toFixed(1)), maDaily: SMA72 > SMA302 ? "bullish" : "bearish", maMonthly: SMA302 > SMA902 ? "bullish" : "bearish" },
          predictions: {
            daily:   { ...pred(dB, 3, 0.6), prices: c2.slice(-7).map(Math.round) },
            weekly:  { ...pred(wB, 3, 2.0), prices: c2.filter((_, i) => i % 5 === 0).slice(-8).map(Math.round) },
            monthly: { ...pred(mB, 3, 5.0), prices: c2.filter((_, i) => i % 15 === 0).slice(-6).map(Math.round) },
          },
        });
      }
    } catch { /* fall through */ }
    void err;

    // Hard fallback mock
    return NextResponse.json({
      current: 3341, aiPowered: false,
      indicators: { rsi: 48, sma7: 3320, sma30: 3280, sma90: 3100, mom3d: 0.4, mom7d: 1.8, mom30d: 5.2, maDaily: "bullish", maMonthly: "bullish" },
      predictions: {
        daily:   { direction: "up", confidence: 65, target: 3362, reason: "", prices: [3295,3310,3288,3320,3335,3341,3341] },
        weekly:  { direction: "up", confidence: 68, target: 3401, reason: "", prices: [3150,3220,3280,3320,3341] },
        monthly: { direction: "up", confidence: 62, target: 3476, reason: "", prices: [2980,3050,3120,3200,3280,3341] },
      },
    });
  }
}
