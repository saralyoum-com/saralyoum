import { PriceData } from "@/types";

const YF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Accept": "application/json",
};

async function fetchYahooFinance(symbol: string): Promise<{ price: number; prevClose: number; high: number; low: number } | null> {
  try {
    // no-store: Next's Data Cache serves the last SUCCESSFUL response when a
    // revalidation fails ("stale-while-error"), which froze the gold price at
    // a day-old value on 2 Jul when GoldAPI's quota died. The /api/prices
    // route's s-maxage=300 still shields these upstreams from real traffic.
    const res = await fetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`,
      { headers: YF_HEADERS, cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return null;
    return {
      price: meta.regularMarketPrice,
      prevClose: meta.previousClose || meta.chartPreviousClose || meta.regularMarketPrice,
      high: meta.regularMarketDayHigh || meta.regularMarketPrice * 1.005,
      low: meta.regularMarketDayLow || meta.regularMarketPrice * 0.995,
    };
  } catch {
    return null;
  }
}

async function fetchGoldAPI(symbol: string): Promise<{ price: number; ch: number; chp: number; high: number; low: number } | null> {
  try {
    const key = process.env.GOLDAPI_KEY;
    if (!key) return null;
    const res = await fetch(`https://www.goldapi.io/api/${symbol}/USD`, {
      headers: { "x-access-token": key },
      cache: "no-store", // see note in fetchYahooFinance — cached-200 freeze
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    return {
      price: data.price,
      ch: data.ch,
      chp: data.chp,
      // GoldAPI's real day-range fields. (Former code derived "high" from
      // price_gram_24k × 31.1035 — which mathematically equals the CURRENT
      // price, so the displayed high was never the day's high, and a stale
      // low_price could sit ABOVE the live price: users saw low > current.)
      high: data.high_price || data.price * 1.005,
      low: data.low_price || data.price * 0.995,
    };
  } catch {
    return null;
  }
}

// Chainlink XAU/USD on-chain oracle — same feed /api/chainlink proxies. Free,
// no quota, no datacenter-IP blocking; price only (no 24h change data), so it
// sits between Yahoo and the mock in the fallback chain.
const CHAINLINK_XAU = "0x214eD9Da11D2fbe465a6fc601a91E62EbEc1a0D6";
const CHAINLINK_RPCS = [
  "https://ethereum.publicnode.com",
  "https://eth.drpc.org",
  "https://1rpc.io/eth",
  "https://cloudflare-eth.com",
];

async function fetchChainlinkGold(): Promise<number | null> {
  const body = JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_call",
    params: [{ to: CHAINLINK_XAU, data: "0xfeaf968c" }, "latest"],
    id: 1,
  });
  for (const rpc of CHAINLINK_RPCS) {
    try {
      const res = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "sardhahab.com/1.0" },
        body,
        signal: AbortSignal.timeout(7000),
        cache: "no-store",
      });
      if (!res.ok) continue;
      const json = await res.json();
      if (!json.result || json.result === "0x") continue;
      const price = Number(BigInt("0x" + json.result.slice(2).slice(64, 128))) / 1e8;
      if (price > 0 && price < 100_000) return price;
    } catch {
      /* try next RPC */
    }
  }
  return null;
}

// The current price must always sit inside [low24h, high24h]. Sources can
// disagree (the 3-tier fallback may serve price from one source and range
// from another's cache) and a stale range then contradicts the live price —
// which is how users saw "low $4,086" under a $4,018 current. Clamp at the
// edge so the invariant holds no matter which source produced what.
function clampRange(price: number, high: number, low: number): { high: number; low: number } {
  return { high: Math.max(high, price), low: Math.min(low, price) };
}

export async function getGoldPrice(): Promise<PriceData> {
  // Primary: GoldAPI.io (if available and quota not exceeded)
  const goldApi = await fetchGoldAPI("XAU");
  if (goldApi) {
    const range = clampRange(goldApi.price, goldApi.high, goldApi.low);
    return {
      symbol: "XAU",
      nameAr: "الذهب",
      price: goldApi.price,
      change: goldApi.ch,
      changePercent: goldApi.chp,
      currency: "USD",
      unit: "أوقية",
      high24h: range.high,
      low24h: range.low,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Fallback: Yahoo Finance (GC=F — COMEX Gold Futures ≈ spot price)
  const yf = await fetchYahooFinance("GC=F");
  if (yf) {
    const change = yf.price - yf.prevClose;
    const changePercent = (change / yf.prevClose) * 100;
    const range = clampRange(yf.price, yf.high, yf.low);
    return {
      symbol: "XAU",
      nameAr: "الذهب",
      price: yf.price,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      currency: "USD",
      unit: "أوقية",
      high24h: range.high,
      low24h: range.low,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Fallback 2: Chainlink on-chain oracle (price only — change unknowable here,
  // report 0 rather than invent one)
  const chainlink = await fetchChainlinkGold();
  if (chainlink) {
    return {
      symbol: "XAU",
      nameAr: "الذهب",
      price: chainlink,
      change: 0,
      changePercent: 0,
      currency: "USD",
      unit: "أوقية",
      high24h: chainlink * 1.005,
      low24h: chainlink * 0.995,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Final fallback: realistic mock (updated periodically)
  return getMockGoldPrice();
}

export async function getSilverPrice(): Promise<PriceData> {
  // Primary: GoldAPI.io
  const goldApi = await fetchGoldAPI("XAG");
  if (goldApi) {
    const range = clampRange(goldApi.price, goldApi.high, goldApi.low);
    return {
      symbol: "XAG",
      nameAr: "الفضة",
      price: goldApi.price,
      change: goldApi.ch,
      changePercent: goldApi.chp,
      currency: "USD",
      unit: "أوقية",
      high24h: range.high,
      low24h: range.low,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Fallback: Yahoo Finance (SI=F — COMEX Silver Futures)
  const yf = await fetchYahooFinance("SI=F");
  if (yf) {
    const change = yf.price - yf.prevClose;
    const changePercent = (change / yf.prevClose) * 100;
    const range = clampRange(yf.price, yf.high, yf.low);
    return {
      symbol: "XAG",
      nameAr: "الفضة",
      price: yf.price,
      change: parseFloat(change.toFixed(4)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      currency: "USD",
      unit: "أوقية",
      high24h: range.high,
      low24h: range.low,
      lastUpdated: new Date().toISOString(),
    };
  }

  return getMockSilverPrice();
}

// Average of the last 30 daily |% moves| for gold — the adaptive baseline
// price-alert uses to decide what counts as "unusual" (vs. a flat threshold).
// Cached 1h via Next's fetch cache so the every-30-min cron doesn't hit Yahoo
// Finance on every run.
export async function getGoldUsualDailyMovePct(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://query2.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d&range=1mo",
      { headers: YF_HEADERS, next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const closes: number[] = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
    const valid = closes.filter((c) => typeof c === "number" && !isNaN(c));
    if (valid.length < 5) return null;

    const moves: number[] = [];
    for (let i = 1; i < valid.length; i++) {
      moves.push(Math.abs(valid[i] - valid[i - 1]) / valid[i - 1]);
    }
    return moves.reduce((a, b) => a + b, 0) / moves.length;
  } catch {
    return null;
  }
}

// ── Mock fallback (realistic — update quarterly) ──────────────────────────────
function getMockGoldPrice(): PriceData {
  // Checked against Chainlink $4,079.59 / GC=F $4,089 on 2 Jul 2026
  return {
    symbol: "XAU",
    nameAr: "الذهب",
    price: 4080.0,
    change: 0,
    changePercent: 0,
    currency: "USD",
    unit: "أوقية",
    high24h: 4100.0,
    low24h: 4060.0,
    lastUpdated: new Date().toISOString(),
  };
}

function getMockSilverPrice(): PriceData {
  // Checked against SI=F $60.69 on 2 Jul 2026
  return {
    symbol: "XAG",
    nameAr: "الفضة",
    price: 60.7,
    change: 0,
    changePercent: 0,
    currency: "USD",
    unit: "أوقية",
    lastUpdated: new Date().toISOString(),
  };
}
