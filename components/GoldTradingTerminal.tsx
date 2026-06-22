"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/components/LanguageContext";

// ── SVG layout constants ─────────────────────────────────────────────────
const W = 960, ML = 8, MR = 72;
const CHART_TOP = 10, H_CHART = 228, CHART_BOT = CHART_TOP + H_CHART; // 238
const VOL_TOP = CHART_BOT + 6, H_VOL = 42, VOL_BOT = VOL_TOP + H_VOL;  // 286
const IND_TOP = VOL_BOT + 8,   H_IND = 114, IND_BOT = IND_TOP + H_IND; // 408
const TOTAL_H = IND_BOT + 22;  // 430
const CW = W - ML - MR;        // 880

const TF_AR    = ["1م",  "5م",  "15م", "30م", "1س", "4س", "1ي"];
const TF_EN    = ["1m",  "5m",  "15m", "30m", "1h", "4h", "1d"];
const TF_CODES = ["1m",  "5m",  "15m", "30m", "1h", "4h", "1d"];

const IND = [
  { key: "RSI",  ar: "RSI",  en: "RSI"  },
  { key: "MACD", ar: "MACD", en: "MACD" },
  { key: "VOL",  ar: "حجم",  en: "Vol"  },
] as const;
type IndKey = "RSI" | "MACD" | "VOL";

// ── Types ─────────────────────────────────────────────────────────────────
interface Candle { t: number; o: number; h: number; l: number; c: number; v: number }
interface ChartData {
  candles: Candle[];
  current: number; change: number; changePercent: number;
  ohlc: { o: number; h: number; l: number; c: number };
  rsiValues: number[]; currentRsi: number;
  macd: { line: number[]; signal: number[]; hist: number[] };
  levels: { r2: number; r1: number; s1: number; s2: number };
  signal: { direction: "up" | "down"; entry: number; tp: number; sl: number };
}

// ── Helpers ───────────────────────────────────────────────────────────────
function ls(k: string) { try { return localStorage.getItem(k); } catch { return null; } }

function formatTime(ts: number, tfCode: string): string {
  const d = new Date(ts);
  if (["1m","5m","15m","30m","1h"].includes(tfCode))
    return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  return `${d.getMonth()+1}/${d.getDate()}`;
}

function linReg(vals: number[]): { start: number; end: number } {
  const n = vals.length;
  if (n < 2) return { start: vals[0] ?? 0, end: vals[0] ?? 0 };
  const mx = (n-1)/2, my = vals.reduce((a,b)=>a+b,0)/n;
  const num = vals.reduce((s,v,i)=>s+(i-mx)*(v-my),0);
  const den = vals.reduce((s,_,i)=>s+(i-mx)**2,0);
  const slope = den===0?0:num/den;
  const int = my - slope*mx;
  return { start: int, end: int+slope*(n-1) };
}

// ── Main component ────────────────────────────────────────────────────────
export default function GoldTradingTerminal() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [tfIdx, setTfIdx]         = useState(6); // default 1ي
  const [indicator, setIndicator] = useState<IndKey>("RSI");
  const [data, setData]           = useState<ChartData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [longPct, setLongPct]     = useState(72);
  const [shortPct, setShortPct]   = useState(28);
  const [voters, setVoters]       = useState(1834);
  const [livePrice, setLivePrice] = useState<{price:number;change:number;changePercent:number}|null>(null);
  const timer      = useRef<ReturnType<typeof setInterval> | null>(null);
  const priceTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Read community votes
  useEffect(() => {
    const raw = ls("pred_results");
    if (!raw) return;
    try {
      const r = JSON.parse(raw).weekly;
      if (r) { setLongPct(r.up); setShortPct(r.down); setVoters(r.total); }
    } catch { /* noop */ }
    // Sync when votes change in another tab
    const handle = () => {
      const r2 = ls("pred_results");
      if (!r2) return;
      try {
        const r = JSON.parse(r2).weekly;
        if (r) { setLongPct(r.up); setShortPct(r.down); setVoters(r.total); }
      } catch { /* noop */ }
    };
    window.addEventListener("storage", handle);
    return () => window.removeEventListener("storage", handle);
  }, []);

  // Live price ticker — every 5 s
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const r = await fetch("/api/live-price");
        if (!r.ok) return;
        const d = await r.json();
        if (!d.error) setLivePrice(d);
      } catch { /* noop */ }
    };
    fetchLive();
    if (priceTimer.current) clearInterval(priceTimer.current);
    priceTimer.current = setInterval(fetchLive, 5000);
    return () => { if (priceTimer.current) clearInterval(priceTimer.current); };
  }, []);

  // Fetch chart data when timeframe changes
  useEffect(() => {
    const tfCode = TF_CODES[tfIdx];
    const load = async () => {
      try {
        const r = await fetch(`/api/gold-chart?tf=${tfCode}`);
        if (!r.ok) throw new Error();
        setData(await r.json());
      } catch { /* keep stale data */ }
      finally { setLoading(false); }
    };
    setLoading(true);
    load();
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(load, 30000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [tfIdx]);

  const tfCode        = TF_CODES[tfIdx];
  const displayPrice  = livePrice?.price      ?? data?.current      ?? 0;
  const displayChange = livePrice?.change     ?? data?.change       ?? 0;
  const displayPct    = livePrice?.changePercent ?? data?.changePercent ?? 0;
  const isUp          = displayPct >= 0;
  const sigUp         = data?.signal.direction === "up";

  // ── SVG chart renderer ─────────────────────────────────────────────────
  function Chart({ d }: { d: ChartData }) {
    const { candles, rsiValues, macd, levels, signal } = d;
    const N     = candles.length;
    const SLOTS = N + 1;
    const slotW = CW / SLOTS;
    const bodyW = slotW * 0.64;

    const cX = (i: number) => ML + (i + 0.5) * slotW;
    const bX = (i: number) => ML + i * slotW + slotW * 0.18;

    // Price range
    const rawMin = Math.min(...candles.map(c => c.l));
    const rawMax = Math.max(...candles.map(c => c.h));
    const aiClose = sigUp ? signal.tp : signal.sl;
    const pMin = Math.min(rawMin, aiClose, levels.s2) * 0.9996;
    const pMax = Math.max(rawMax, aiClose, levels.r2) * 1.0004;
    const pRange = pMax - pMin || 1;
    const pY = (p: number) => CHART_TOP + (pMax - p) / pRange * H_CHART;

    // Volume
    const vMax = Math.max(...candles.map(c => c.v), 1);
    const vY   = (v: number) => VOL_BOT - (v / vMax) * H_VOL;

    // RSI
    const rY = (r: number) => IND_TOP + (100 - Math.max(0, Math.min(100, r))) / 100 * H_IND;

    // MACD
    const mMax = Math.max(...[...macd.line, ...macd.signal].map(Math.abs), 0.001);
    const mCtr = (IND_TOP + IND_BOT) / 2;
    const mY   = (v: number) => mCtr - (v / mMax) * (H_IND / 2);

    // Trend line
    const trend = linReg(candles.map(c => c.c));

    // Price axis labels (5 levels)
    const pLabels = Array.from({length:5},(_,i) => pMin + pRange*i/4);

    // Time labels (≈5 evenly spaced)
    const step = Math.max(1, Math.round(N/5));
    const tLabels = Array.from({length:Math.floor(N/step)},(_,i)=>({
      i: i*step, label: formatTime(candles[i*step].t, tfCode)
    }));

    // S/R lines in view
    const srLines = [
      {lbl:"R2", p:levels.r2, col:"#ef4444"},
      {lbl:"R1", p:levels.r1, col:"#f97316"},
      {lbl:"S1", p:levels.s1, col:"#22c55e"},
      {lbl:"S2", p:levels.s2, col:"#16a34a"},
    ].filter(l => l.p > pMin*0.995 && l.p < pMax*1.005);

    // Build RSI polyline
    const rsiPts = rsiValues.map((v,i) => `${cX(i)},${rY(v)}`).join(" ");
    const macdPts   = macd.line.map((v,i) => `${cX(i)},${mY(v)}`).join(" ");
    const signalPts = macd.signal.map((v,i) => `${cX(i)},${mY(v)}`).join(" ");

    // AI candle
    const aiOpen = candles[N-1]?.c ?? 0;
    const aiHigh = (sigUp ? Math.max(aiOpen,aiClose) : Math.max(aiOpen,aiClose)) * 1.0004;
    const aiLow  = (sigUp ? Math.min(aiOpen,aiClose) : Math.min(aiOpen,aiClose)) * 0.9996;
    const aiColor= sigUp ? "#22c55e" : "#ef4444";
    const aiBodyTop = Math.min(pY(aiOpen), pY(aiClose));
    const aiBodyH   = Math.max(2, Math.abs(pY(aiClose)-pY(aiOpen)));

    return (
      <svg viewBox={`0 0 ${W} ${TOTAL_H}`} width="100%" style={{display:"block"}} aria-hidden>

        {/* Grid */}
        {pLabels.map((p,i) => <line key={i} x1={ML} y1={pY(p)} x2={W-MR} y2={pY(p)} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>)}

        {/* S/R horizontal lines */}
        {srLines.map(l => (
          <g key={l.lbl}>
            <line x1={ML} y1={pY(l.p)} x2={W-MR} y2={pY(l.p)} stroke={l.col} strokeWidth={0.8} strokeDasharray="4 4" opacity={0.45}/>
            <text x={W-MR+3} y={pY(l.p)+4} fontSize={8.5} fill={l.col} opacity={0.8}>{l.lbl}</text>
          </g>
        ))}

        {/* Trend line */}
        <line x1={cX(0)} y1={pY(trend.start)} x2={cX(N-1)} y2={pY(trend.end)}
          stroke={trend.end>trend.start?"#22c55e":"#ef4444"} strokeWidth={1.2} strokeDasharray="5 3" opacity={0.55}/>

        {/* Candles */}
        {candles.map((c,i) => {
          const up = c.c >= c.o;
          const col = up ? "#22c55e" : "#ef4444";
          const bt = Math.min(pY(c.o), pY(c.c));
          const bh = Math.max(1.5, Math.abs(pY(c.c)-pY(c.o)));
          return (
            <g key={i}>
              <line x1={cX(i)} y1={pY(c.h)} x2={cX(i)} y2={pY(c.l)} stroke={col} strokeWidth={1.2}/>
              <rect x={bX(i)} y={bt} width={bodyW} height={bh} fill={col} rx={0.5}/>
            </g>
          );
        })}

        {/* AI prediction candle */}
        <g opacity={0.7}>
          <text x={cX(N)} y={pY(aiHigh)-5} fontSize={9} fill="#22c55e" textAnchor="middle" fontWeight="bold">AI</text>
          <line x1={cX(N)} y1={pY(aiHigh)} x2={cX(N)} y2={pY(aiLow)} stroke={aiColor} strokeWidth={1.2} strokeDasharray="3 2"/>
          <rect x={bX(N)} y={aiBodyTop} width={bodyW} height={aiBodyH}
            fill="none" stroke={aiColor} strokeWidth={1.5} strokeDasharray="3 2" rx={0.5}/>
        </g>

        {/* Volume mini-bars */}
        {candles.map((c,i) => (
          <rect key={i} x={bX(i)} y={vY(c.v)} width={bodyW} height={VOL_BOT-vY(c.v)}
            fill={c.c>=c.o?"rgba(34,197,94,0.32)":"rgba(239,68,68,0.32)"} rx={0.3}/>
        ))}

        {/* Indicator panel divider */}
        <line x1={ML} y1={IND_TOP-4} x2={W-MR} y2={IND_TOP-4} stroke="rgba(255,255,255,0.08)" strokeWidth={1}/>

        {/* RSI panel */}
        {indicator==="RSI" && (
          <g>
            {[70,50,30].map(r=>(
              <g key={r}>
                <line x1={ML} y1={rY(r)} x2={W-MR} y2={rY(r)}
                  stroke={r===70?"rgba(239,68,68,0.25)":r===30?"rgba(34,197,94,0.25)":"rgba(255,255,255,0.1)"}
                  strokeWidth={1} strokeDasharray={r===50?"0":"3 3"}/>
                <text x={W-MR+3} y={rY(r)+4} fontSize={8} fill="rgba(255,255,255,0.3)">{r}</text>
              </g>
            ))}
            <polyline points={rsiPts} fill="none" stroke="#C9A84C" strokeWidth={1.8}/>
            <circle cx={cX(N-1)} cy={rY(d.currentRsi)} r={3} fill="#ef4444"/>
            <rect x={W-MR+1} y={rY(d.currentRsi)-8} width={MR-3} height={14} rx={3} fill="#ef4444" opacity={0.9}/>
            <text x={W-MR+MR/2} y={rY(d.currentRsi)+4} fontSize={8.5} fill="white" textAnchor="middle" fontWeight="bold">
              RSI:{d.currentRsi}
            </text>
          </g>
        )}

        {/* MACD panel */}
        {indicator==="MACD" && (
          <g>
            <line x1={ML} y1={mCtr} x2={W-MR} y2={mCtr} stroke="rgba(255,255,255,0.12)" strokeWidth={1}/>
            {macd.hist.map((v,i)=>(
              <rect key={i} x={bX(i)} y={Math.min(mY(v),mCtr)} width={bodyW}
                height={Math.max(1,Math.abs(mY(v)-mCtr))}
                fill={v>=0?"rgba(34,197,94,0.45)":"rgba(239,68,68,0.45)"}/>
            ))}
            <polyline points={macdPts}   fill="none" stroke="#3b82f6" strokeWidth={1.5}/>
            <polyline points={signalPts} fill="none" stroke="#f97316" strokeWidth={1.2}/>
          </g>
        )}

        {/* Volume big panel */}
        {indicator==="VOL" && candles.map((c,i)=>{
          const bh = (c.v/vMax)*H_IND;
          return <rect key={i} x={bX(i)} y={IND_BOT-bh} width={bodyW} height={bh}
            fill={c.c>=c.o?"rgba(34,197,94,0.45)":"rgba(239,68,68,0.45)"} rx={0.5}/>;
        })}

        {/* Price labels */}
        {pLabels.map((p,i)=>(
          <text key={i} x={W-MR+5} y={pY(p)+4} fontSize={9} fill="rgba(255,255,255,0.38)">
            ${Math.round(p).toLocaleString()}
          </text>
        ))}

        {/* Current price badge */}
        <line x1={ML} y1={pY(d.current)} x2={W-MR} y2={pY(d.current)}
          stroke={isUp?"rgba(34,197,94,0.35)":"rgba(239,68,68,0.35)"} strokeWidth={1} strokeDasharray="2 2"/>
        <rect x={W-MR+1} y={pY(d.current)-7} width={MR-3} height={15} rx={3}
          fill={isUp?"#22c55e":"#ef4444"}/>
        <text x={W-MR+MR/2} y={pY(d.current)+4.5} fontSize={9} fill="white" textAnchor="middle" fontWeight="bold">
          ${Math.round(d.current).toLocaleString()}
        </text>

        {/* Time labels */}
        {tLabels.map(({i,label})=>(
          <text key={i} x={cX(i)} y={TOTAL_H-5} fontSize={9} fill="rgba(255,255,255,0.28)" textAnchor="middle">{label}</text>
        ))}
      </svg>
    );
  }

  const tpDiff = data ? Math.abs(data.signal.tp - data.signal.entry) : 0;
  const slDiff = data ? Math.abs(data.signal.sl - data.signal.entry) : 0;

  return (
    <div dir={isAr?"rtl":"ltr"} className="rounded-2xl border border-gold/20 bg-surface overflow-hidden">
      <style>{`@keyframes gt-spin{to{transform:rotate(360deg);}}.gt-spin{animation:gt-spin 1s linear infinite;transform-origin:center;}@keyframes gt-blink{0%,100%{opacity:1}50%{opacity:0.25}}.gt-blink{animation:gt-blink 1.4s ease-in-out infinite;}`}</style>

      {/* ── Price header ── */}
      <div className="px-4 sm:px-5 pt-4 pb-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              {(data || livePrice)
                ? <p className="text-xl font-black text-text-primary">${displayPrice.toLocaleString()}</p>
                : <div className="h-7 w-28 bg-surface-2 rounded animate-pulse"/>}
              {(data || livePrice) && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-rise">
                  <span className="gt-blink inline-block w-1.5 h-1.5 rounded-full bg-rise"/>
                  LIVE
                </span>
              )}
            </div>
            <p className={`text-sm font-semibold ${isUp?"text-rise":"text-fall"}`}>
              {(data || livePrice) ? `${isUp?"+":""}${displayChange.toFixed(2)} (${isUp?"+":""}${displayPct.toFixed(2)}%)` : "—"}
              {" "}<span className="text-text-secondary text-xs font-normal">XAU/USD</span>
            </p>
          </div>
          {data && (
            <div className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border ${sigUp?"bg-rise/10 text-rise border-rise/25":"bg-fall/10 text-fall border-fall/25"}`}>
              {sigUp?"↑ ":"↓ "}{isAr?(sigUp?"شراء":"بيع"):(sigUp?"Buy":"Sell")}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-text-secondary font-mono">
          {data && (
            <>
              <span>O <span className="text-text-primary font-bold">{data.ohlc.o.toLocaleString()}</span></span>
              <span>H <span className="text-rise font-bold">{data.ohlc.h.toLocaleString()}</span></span>
              <span>L <span className="text-fall font-bold">{data.ohlc.l.toLocaleString()}</span></span>
              <span>C <span className="text-text-primary font-bold">{data.ohlc.c.toLocaleString()}</span></span>
            </>
          )}
        </div>
      </div>

      {/* ── TF tabs + Indicator selector ── */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-2 border-b border-border flex-wrap gap-1">
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] text-text-secondary me-1.5">{isAr?"الفترة:":"TF:"}</span>
          {TF_CODES.map((_,i)=>(
            <button key={i} onClick={()=>setTfIdx(i)}
              className={`px-2 py-1 text-[11px] rounded-lg font-medium transition-colors ${tfIdx===i?"bg-gold/15 text-gold":"text-text-secondary hover:text-text-primary"}`}>
              {isAr ? TF_AR[i] : TF_EN[i]}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {IND.map(ind=>(
            <button key={ind.key} onClick={()=>setIndicator(ind.key)}
              className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors border ${indicator===ind.key?"bg-surface-2 text-text-primary border-border":"text-text-secondary border-transparent hover:text-text-primary"}`}>
              {isAr ? ind.ar : ind.en}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="relative bg-background/50">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10">
            <svg width={28} height={28} viewBox="0 0 24 24" className="gt-spin">
              <circle cx={12} cy={12} r={10} fill="none" stroke="#C9A84C" strokeWidth={2.5} strokeDasharray="30 10"/>
            </svg>
          </div>
        )}
        {data ? <Chart d={displayPrice ? {...data, current: displayPrice} : data}/> : (
          <div style={{height:TOTAL_H}} className="bg-surface-2/20 animate-pulse"/>
        )}
      </div>

      {/* ── Long / Short bar ── */}
      <div className="px-4 sm:px-5 py-3 border-t border-border">
        <div className="flex justify-between text-[11px] font-bold mb-1.5">
          <span className="text-rise">↑ {isAr?"شراء":"Long"} {longPct}%</span>
          <span className="text-text-secondary text-[10px]">{voters.toLocaleString()} {isAr?"متداول":"traders"}</span>
          <span className="text-fall">{shortPct}% {isAr?"بيع":"Short"} ↓</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden flex">
          <div className="rounded-s-full transition-all duration-700" style={{width:`${longPct}%`,background:"linear-gradient(90deg,#16a34a,#22c55e)"}}/>
          <div className="flex-1 rounded-e-full" style={{background:"linear-gradient(90deg,#ef4444,#b91c1c)"}}/>
        </div>
      </div>

      {/* ── S/R grid ── */}
      {data && (
        <div className="px-4 sm:px-5 pb-3 border-t border-border">
          <div className="grid grid-cols-5 gap-1.5 mt-3">
            {[
              {lbl:"R2",         val:data.levels.r2,   cls:"border-fall/25   text-fall"},
              {lbl:"R1",         val:data.levels.r1,   cls:"border-orange-500/25 text-orange-400"},
              {lbl:isAr?"الحالي":"Now", val:data.signal.entry, cls:"border-gold/40 text-gold bg-gold/5"},
              {lbl:"S1",         val:data.levels.s1,   cls:"border-rise/25   text-rise"},
              {lbl:"S2",         val:data.levels.s2,   cls:"border-rise/20   text-rise/70"},
            ].map(({lbl,val,cls})=>(
              <div key={lbl} className={`rounded-xl border ${cls} p-2 text-center`}>
                <p className="text-[10px] mb-0.5 opacity-70">{lbl}</p>
                <p className="text-[11px] font-black">{val.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Entry / TP / SL ── */}
      {data && (
        <div className="grid grid-cols-3 gap-2 px-4 sm:px-5 pb-4 pt-3 border-t border-border">
          <div className="rounded-xl border border-border bg-surface-2 p-3 text-center">
            <p className="text-[10px] text-text-secondary mb-1">{isAr?"إشارة الدخول":"Entry"}</p>
            <p className={`text-sm font-black ${sigUp?"text-rise":"text-fall"}`}>{sigUp?"شراء ↑":"بيع ↓"}</p>
            <p className="text-[11px] text-text-secondary mt-0.5">${data.signal.entry.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-rise/20 bg-rise/5 p-3 text-center">
            <p className="text-[10px] text-text-secondary mb-1">{isAr?"الهدف (TP)":"Target (TP)"}</p>
            <p className="text-sm font-black text-text-primary">${data.signal.tp.toLocaleString()}</p>
            <p className="text-[11px] text-rise mt-0.5">+${tpDiff} ({((tpDiff/data.signal.entry)*100).toFixed(1)}%)</p>
          </div>
          <div className="rounded-xl border border-fall/20 bg-fall/5 p-3 text-center">
            <p className="text-[10px] text-text-secondary mb-1">{isAr?"وقف الخسارة (SL)":"Stop Loss"}</p>
            <p className="text-sm font-black text-fall">${data.signal.sl.toLocaleString()}</p>
            <p className="text-[11px] text-fall mt-0.5">-${slDiff} (-{((slDiff/data.signal.entry)*100).toFixed(1)}%)</p>
          </div>
        </div>
      )}
    </div>
  );
}
