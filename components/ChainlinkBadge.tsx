"use client";

import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

const CONTRACT  = "0x214eD9Da11D2fbe465a6fc601a91E62EbEc1a0D6";
const SELECTOR  = "0xfeaf968c"; // latestRoundData()
const ETHERSCAN = `https://etherscan.io/address/${CONTRACT}`;
// Public Ethereum RPC endpoints — tries in order
const RPCS = [
  "https://eth.llamarpc.com",
  "https://cloudflare-eth.com",
  "https://rpc.ankr.com/eth",
];

interface ChainlinkData {
  price: number;       // USD per troy oz
  updatedAt: number;   // unix timestamp
}

async function fetchChainlinkPrice(): Promise<ChainlinkData> {
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
        signal: AbortSignal.timeout(6000),
      });
      const json = await res.json();
      if (!json.result || json.result === "0x") throw new Error("empty result");

      // ABI decode: (uint80, int256, uint256, uint256, uint80)
      // each field = 32 bytes = 64 hex chars, skip leading 0x
      const hex = json.result.slice(2);
      const answerHex    = hex.slice(64, 128);   // 2nd field
      const updatedAtHex = hex.slice(192, 256);  // 4th field

      const answer    = BigInt("0x" + answerHex);
      const updatedAt = parseInt(updatedAtHex, 16);
      const price     = Number(answer) / 1e8;    // 8 decimals

      return { price, updatedAt };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

interface Props {
  goldPriceUSD: number;  // our live gold price (per oz)
}

export default function ChainlinkBadge({ goldPriceUSD }: Props) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const dir = ar ? "rtl" : "ltr";

  const [open, setOpen] = useState(false);
  const [cl, setCl] = useState<ChainlinkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (cl) return; // already loaded
    setLoading(true);
    setError(false);
    try {
      const data = await fetchChainlinkPrice();
      setCl(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [cl]);

  const handleOpen = () => {
    setOpen(true);
    track.navClick("chainlink-badge-open");
    load();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const diff = cl ? ((goldPriceUSD - cl.price) / cl.price) * 100 : null;
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtTime = (ts: number) => new Date(ts * 1000).toLocaleTimeString(ar ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* ── Badge ── */}
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 bg-rise/10 hover:bg-rise/20 border border-rise/30 text-rise rounded-full px-3 py-1 text-xs font-bold transition-all"
        title={ar ? "التحقق عبر Chainlink Price Feed" : "Verified via Chainlink Price Feed"}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rise animate-pulse" />
        {ar ? "✅ متحقق عبر Chainlink" : "✅ Verified via Chainlink"}
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          {/* panel */}
          <div
            dir={dir}
            className="relative bg-surface border border-border rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 end-4 text-text-secondary hover:text-text-primary text-xl leading-none"
            >
              ✕
            </button>

            {/* header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#375BD2]/10 border border-[#375BD2]/30 rounded-xl flex items-center justify-center shrink-0">
                {/* Chainlink hexagon icon */}
                <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
                  <path d="M16 3l11 6.35v12.7L16 28.35 5 22V9.35L16 3z" fill="#375BD2" opacity=".15"/>
                  <path d="M16 3l11 6.35v12.7L16 28.35 5 22V9.35L16 3z" stroke="#375BD2" strokeWidth="1.5"/>
                  <path d="M16 8.5l7 4.04v8.07L16 24.6 9 20.61v-8.07L16 8.5z" fill="#375BD2" opacity=".3"/>
                </svg>
              </div>
              <div>
                <h3 className="font-black text-text-primary text-base">
                  {ar ? "التحقق عبر Chainlink" : "Chainlink Verification"}
                </h3>
                <p className="text-text-secondary text-xs">XAU/USD Price Feed · Ethereum Mainnet</p>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center py-6 gap-3">
                <div className="w-8 h-8 border-2 border-[#375BD2] border-t-transparent rounded-full animate-spin" />
                <p className="text-text-secondary text-sm">{ar ? "جلب البيانات من الشبكة..." : "Fetching on-chain data..."}</p>
              </div>
            )}

            {error && (
              <div className="text-center py-6">
                <p className="text-fall text-sm">
                  {ar ? "⚠️ تعذر الاتصال بالشبكة. حاول لاحقاً." : "⚠️ Could not reach the network. Try again later."}
                </p>
                <button
                  onClick={load}
                  className="mt-3 text-gold text-xs underline"
                >
                  {ar ? "إعادة المحاولة" : "Retry"}
                </button>
              </div>
            )}

            {cl && !loading && (
              <div className="space-y-3">
                {/* Chainlink price */}
                <div className="bg-surface-2 border border-border rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-xs mb-0.5">{ar ? "سعر Chainlink" : "Chainlink Price"}</p>
                    <p className="font-black text-xl text-[#375BD2]">${fmt(cl.price)}</p>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {ar ? `محدّث: ${fmtTime(cl.updatedAt)}` : `Updated: ${fmtTime(cl.updatedAt)}`}
                    </p>
                  </div>
                  <div className="text-3xl">⛓️</div>
                </div>

                {/* Our price */}
                <div className="bg-surface-2 border border-border rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-xs mb-0.5">{ar ? "سعرنا (GoldAPI)" : "Our Price (GoldAPI)"}</p>
                    <p className="font-black text-xl text-gold">${fmt(goldPriceUSD)}</p>
                  </div>
                  <div className="text-3xl">🏅</div>
                </div>

                {/* Diff */}
                {diff !== null && (
                  <div className={`rounded-2xl p-4 text-center border ${
                    Math.abs(diff) < 0.5
                      ? "bg-rise/10 border-rise/30"
                      : "bg-gold/10 border-gold/30"
                  }`}>
                    <p className="text-text-secondary text-xs mb-1">{ar ? "الفرق بين المصدرين" : "Difference"}</p>
                    <p className={`font-black text-2xl ${Math.abs(diff) < 0.5 ? "text-rise" : "text-gold"}`}>
                      {diff >= 0 ? "+" : ""}{diff.toFixed(3)}%
                    </p>
                    <p className="text-text-secondary text-xs mt-1">
                      {Math.abs(diff) < 0.5
                        ? (ar ? "✅ الأسعار متطابقة — موثوق" : "✅ Prices match — Trusted")
                        : (ar ? "⚠️ فارق طفيف بين المصدرين" : "⚠️ Minor spread between sources")}
                    </p>
                  </div>
                )}

                {/* Etherscan link */}
                <a
                  href={ETHERSCAN}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track.navClick("chainlink-etherscan")}
                  className="flex items-center justify-between w-full bg-surface-2 border border-border hover:border-gold/30 rounded-2xl p-3.5 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔍</span>
                    <div>
                      <p className="text-text-primary text-xs font-bold group-hover:text-gold transition-colors">
                        {ar ? "عرض العقد على Etherscan" : "View Contract on Etherscan"}
                      </p>
                      <p className="text-text-secondary text-[10px] font-mono">
                        {CONTRACT.slice(0, 10)}...{CONTRACT.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <span className="text-gold text-sm">↗</span>
                </a>

                <p className="text-text-secondary text-[10px] text-center leading-relaxed">
                  {ar
                    ? "البيانات مباشرة من بلوكتشين إيثيريوم عبر Chainlink Price Feed — العقد الذكي للقراءة فقط."
                    : "Data fetched live from Ethereum mainnet via Chainlink Price Feed — read-only smart contract."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
