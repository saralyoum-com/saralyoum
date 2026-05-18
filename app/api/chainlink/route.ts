import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const CONTRACT = "0x214eD9Da11D2fbe465a6fc601a91E62EbEc1a0D6";
const SELECTOR = "0xfeaf968c"; // latestRoundData()
const RPCS = [
  "https://eth.llamarpc.com",
  "https://cloudflare-eth.com",
  "https://rpc.ankr.com/eth",
];

export async function GET() {
  let lastErr: unknown;

  for (const rpc of RPCS) {
    try {
      const res = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_call",
          params: [{ to: CONTRACT, data: SELECTOR }, "latest"],
          id: 1,
        }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });

      const json = await res.json();
      if (!json.result || json.result === "0x") throw new Error("empty result");

      const hex        = json.result.slice(2);
      const answerHex    = hex.slice(64, 128);
      const updatedAtHex = hex.slice(192, 256);
      const price      = Number(BigInt("0x" + answerHex)) / 1e8;
      const updatedAt  = parseInt(updatedAtHex, 16);

      return NextResponse.json(
        { price, updatedAt },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
      );
    } catch (e) {
      lastErr = e;
    }
  }

  console.error("[Chainlink] All RPCs failed:", lastErr);
  return NextResponse.json({ error: "unavailable" }, { status: 503 });
}
