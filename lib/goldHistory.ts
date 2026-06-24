// Real 7-day gold history (USD/oz daily closes) from Yahoo Finance.
// Server-side only. Falls back to an empty array on failure so the page
// can simply hide the history section rather than break.

export interface GoldDay { date: string; usdPerOz: number; }

export async function getGoldHistory7d(): Promise<GoldDay[]> {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=10d",
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const r = json.chart?.result?.[0];
    if (!r) return [];
    const ts: number[] = r.timestamp ?? [];
    const closes: (number | null)[] = r.indicators?.quote?.[0]?.close ?? [];

    const days: GoldDay[] = [];
    for (let i = ts.length - 1; i >= 0 && days.length < 7; i--) {
      const c = closes[i];
      if (c == null || c <= 0) continue;
      const d = new Date(ts[i] * 1000);
      const date = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      days.push({ date, usdPerOz: c });
    }
    return days; // newest first
  } catch {
    return [];
  }
}
