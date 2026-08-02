import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Defaults to gold; the analysis terminal passes SI=F / BTC-USD / ETH-USD.
  const symbol = new URL(req.url).searchParams.get("symbol") ?? "GC=F";
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`,
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 3 } }
    );
    if (!res.ok) throw new Error();
    const json = await res.json();
    const r = json.chart.result[0];
    const q = r.indicators.quote[0];
    const meta = r.meta as { regularMarketPrice?: number; previousClose?: number };
    const closes = (q.close as (number | null)[]).filter((c): c is number => c != null && c > 0);
    const current = closes[closes.length - 1];
    const livePrice = meta.regularMarketPrice ?? current;
    const prevClose = meta.previousClose ?? (closes[closes.length - 2] ?? closes[0]);

    return NextResponse.json(
      {
        price: Math.round(livePrice * 100) / 100,
        change: Math.round((livePrice - prevClose) * 100) / 100,
        changePercent: Math.round(((livePrice - prevClose) / prevClose) * 10000) / 100,
        ts: Date.now(),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
