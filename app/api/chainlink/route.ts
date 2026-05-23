import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const CONTRACT = "0x214eD9Da11D2fbe465a6fc601a91E62EbEc1a0D6";
const SELECTOR = "0xfeaf968c"; // latestRoundData()

// Ordered by reliability from serverless/datacenter IPs.
// If one fails (rate-limit, timeout, block) the next is tried automatically.
const RPCS = [
  "https://ethereum.publicnode.com",
  "https://eth.drpc.org",
  "https://1rpc.io/eth",
  "https://rpc.payload.de",
  "https://eth.llamarpc.com",
  "https://cloudflare-eth.com",
];

const BODY = JSON.stringify({
  jsonrpc: "2.0",
  method: "eth_call",
  params: [{ to: CONTRACT, data: SELECTOR }, "latest"],
  id: 1,
});

export async function GET() {
  let lastErr: unknown;

  for (const rpc of RPCS) {
    try {
      const res = await fetch(rpc, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "sardhahab.com/1.0",
        },
        body: BODY,
        signal: AbortSignal.timeout(7000),
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (!json.result || json.result === "0x") throw new Error("empty result");

      const hex        = json.result.slice(2);
      const answerHex    = hex.slice(64, 128);
      const updatedAtHex = hex.slice(192, 256);
      const price      = Number(BigInt("0x" + answerHex)) / 1e8;
      const updatedAt  = parseInt(updatedAtHex, 16);

      if (price <= 0 || price > 100_000) throw new Error(`suspicious price: ${price}`);

      return NextResponse.json(
        { price, updatedAt },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
      );
    } catch (e) {
      console.warn(`[Chainlink] RPC failed (${rpc}):`, (e as Error).message);
      lastErr = e;
    }
  }

  console.error("[Chainlink] All RPCs failed:", lastErr);
  return NextResponse.json({ error: "unavailable" }, { status: 503 });
}
