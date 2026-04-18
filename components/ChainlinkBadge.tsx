"use client";

import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

// ── Constants ──────────────────────────────────────────────────────────────
const CONTRACT  = "0x214eD9Da11D2fbe465a6fc601a91E62EbEc1a0D6";
const SELECTOR  = "0xfeaf968c"; // latestRoundData()
const ETHERSCAN = `https://etherscan.io/address/${CONTRACT}`;
const RPCS = [
  "https://eth.llamarpc.com",
  "https://cloudflare-eth.com",
  "https://rpc.ankr.com/eth",
];

// ── Types ──────────────────────────────────────────────────────────────────
interface ChainlinkData {
  price: number;
  updatedAt: number;
}

// ── Alert level config ─────────────────────────────────────────────────────
function getAlertLevel(absDiff: number) {
  if (absDiff < 1)  return { color: "text-rise",    bg: "bg-rise/10",    border: "border-rise/30",    icon: "✅", labelAr: "الأسعار متطابقة — موثوق",         labelEn: "Prices match — Trusted"                };
  if (absDiff < 2)  return { color: "text-[#F5A623]", bg: "bg-[#F5A623]/10", border: "border-[#F5A623]/30", icon: "⚠️", labelAr: "فرق ملحوظ — الأسعار في مراجعة",    labelEn: "Notable gap — Prices under review"     };
  return              { color: "text-fall",    bg: "bg-fall/10",    border: "border-fall/30",    icon: "🚨", labelAr: "تنبيه: فرق كبير بين المصدرين",     labelEn: "Alert: Large gap between sources"      };
}

// ── Fetch on-chain price ───────────────────────────────────────────────────
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

      const hex        = json.result.slice(2);
      const answerHex    = hex.slice(64, 128);
      const updatedAtHex = hex.slice(192, 256);
      const answer    = BigInt("0x" + answerHex);
      const updatedAt = parseInt(updatedAtHex, 16);
      const price     = Number(answer) / 1e8;

      return { price, updatedAt };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

// ── Tooltip ────────────────────────────────────────────────────────────────
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onTouchStart={() => setShow(v => !v)}
        className="w-4 h-4 rounded-full bg-surface border border-border text-text-secondary text-[9px] font-black flex items-center justify-center hover:border-gold/40 hover:text-gold transition-all select-none"
        aria-label="معلومات"
      >
        i
      </button>
      {show && (
        <span className="absolute z-10 bottom-6 start-0 w-52 bg-surface border border-border rounded-xl p-2.5 text-[10px] text-text-secondary leading-relaxed shadow-xl pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
interface Props {
  goldPriceUSD: number;
}

export default function ChainlinkBadge({ goldPriceUSD }: Props) {
  const { lang } = useLang();
  const ar  = lang === "ar";
  const dir = ar ? "rtl" : "ltr";

  const [open, setOpen]       = useState(false);
  const [cl, setCl]           = useState<ChainlinkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(false);

  const load = useCallback(async () => {
    if (cl) return;
    setLoading(true);
    setError(false);
    try {
      setCl(await fetchChainlinkPrice());
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

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  const absDiff     = cl ? Math.abs((goldPriceUSD - cl.price) / goldPriceUSD * 100) : null;
  const matchPct    = absDiff !== null ? (100 - absDiff) : null;
  const alert       = absDiff !== null ? getAlertLevel(absDiff) : null;

  const fmt     = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtTime = (ts: number) =>
    new Date(ts * 1000).toLocaleTimeString(ar ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" });

  // Tooltip copy
  const ttChainlink = ar
    ? "يحدّث عند تغيّر السعر 0.5% أو كل 24 ساعة — مصدر DeFi موثوق"
    : "Updates when price moves 0.5% or every 24h — trusted DeFi oracle";
  const ttGoldapi = ar
    ? "يحدّث كل دقيقة — أدق للتداول اللحظي"
    : "Updates every minute — most accurate for live trading";

  return (
    <>
      {/* ── Badge ── */}
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 bg-rise/10 hover:bg-rise/20 border border-rise/30 text-rise rounded-full px-3 py-1 text-xs font-bold transition-all"
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
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          <div
            dir={dir}
            className="relative bg-surface border border-border rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 end-4 text-text-secondary hover:text-text-primary text-xl leading-none"
            >✕</button>

            {/* header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#375BD2]/10 border border-[#375BD2]/30 rounded-xl flex items-center justify-center shrink-0">
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

            {/* loading */}
            {loading && (
              <div className="flex flex-col items-center py-8 gap-3">
                <div className="w-8 h-8 border-2 border-[#375BD2] border-t-transparent rounded-full animate-spin" />
                <p className="text-text-secondary text-sm">
                  {ar ? "جلب البيانات من البلوكتشين..." : "Fetching on-chain data..."}
                </p>
              </div>
            )}

            {/* error */}
            {error && !loading && (
              <div className="text-center py-8">
                <p className="text-fall text-sm mb-3">
                  {ar ? "⚠️ تعذر الاتصال بالشبكة" : "⚠️ Could not reach the network"}
                </p>
                <button onClick={() => { setCl(null); load(); }} className="text-gold text-xs underline">
                  {ar ? "إعادة المحاولة" : "Retry"}
                </button>
              </div>
            )}

            {/* content */}
            {cl && !loading && alert && matchPct !== null && (
              <div className="space-y-3">

                {/* Chainlink price card */}
                <div className="bg-surface-2 border border-border rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-text-secondary text-xs">
                        {ar ? "سعر Chainlink" : "Chainlink Price"}
                      </p>
                      <Tooltip text={ttChainlink} />
                    </div>
                    <p className="font-black text-xl text-[#375BD2]">${fmt(cl.price)}</p>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {ar ? `آخر تحديث: ${fmtTime(cl.updatedAt)}` : `Last update: ${fmtTime(cl.updatedAt)}`}
                    </p>
                  </div>
                  <div className="text-3xl select-none">⛓️</div>
                </div>

                {/* Our price card */}
                <div className="bg-surface-2 border border-border rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-text-secondary text-xs">
                        {ar ? "سعرنا (GoldAPI)" : "Our Price (GoldAPI)"}
                      </p>
                      <Tooltip text={ttGoldapi} />
                    </div>
                    <p className="font-black text-xl text-gold">${fmt(goldPriceUSD)}</p>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {ar ? "لحظي — يحدّث كل دقيقة" : "Live — updates every minute"}
                    </p>
                  </div>
                  <div className="text-3xl select-none">🏅</div>
                </div>

                {/* Match percentage block */}
                <div className={`rounded-2xl p-4 text-center border ${alert.bg} ${alert.border}`}>
                  <p className="text-text-secondary text-xs mb-1">
                    {ar ? "نسبة التطابق" : "Match Rate"}
                  </p>
                  <p className={`font-black text-3xl ${alert.color}`}>
                    {matchPct.toFixed(3)}%
                  </p>
                  <p className={`text-sm font-bold mt-1 ${alert.color}`}>
                    {alert.icon} {ar ? alert.labelAr : alert.labelEn}
                  </p>
                  <p className="text-text-secondary text-[10px] mt-2 leading-relaxed">
                    {ar
                      ? "الفرق الطبيعي يعود لاختلاف توقيت تحديث كل مصدر"
                      : "Normal gap due to different update frequencies between sources"}
                  </p>
                </div>

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
                    ? "البيانات مباشرة من بلوكتشين إيثيريوم — عقد قراءة فقط، لا توجد رسوم."
                    : "Data fetched live from Ethereum mainnet — read-only contract, no gas fees."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
