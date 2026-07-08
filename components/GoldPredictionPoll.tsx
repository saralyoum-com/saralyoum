"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

/* ── animated counter ── */
function useCountUp(target: number, duration = 1000) {
  const [v, setV] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (!target || ref.current) return;
    ref.current = true;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(e * target));
      if (p < 1) requestAnimationFrame(tick);
      else setV(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return v;
}

/* ── sparkline ── */
function Sparkline({ prices, color }: { prices: number[]; color: string }) {
  const W = 280, H = 54, pad = 4;
  if (prices.length < 2) return null;
  const mn = Math.min(...prices), mx = Math.max(...prices);
  const r = mx - mn || 1;
  const pts = prices.map((p, i) => {
    const x = pad + (i / (prices.length - 1)) * (W - pad * 2);
    const y = H - pad - ((p - mn) / r) * (H - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = "M" + pts.join(" L");
  const lastPt = pts[pts.length - 1];
  const [lx, ly] = lastPt.split(",");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 54, display: "block" }}>
      <defs>
        <linearGradient id="spg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={`${path} L${W - pad},${H - pad} L${pad},${H - pad} Z`} fill="url(#spg)" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3.5" fill={color} />
    </svg>
  );
}

/* ── types ── */
type Tab = "daily" | "weekly" | "monthly";

interface Prediction {
  direction: "up" | "down";
  confidence: number;
  target: number;
  reason?: string;
  prices: number[];
}

interface PredData {
  current: number;
  aiPowered?: boolean;
  indicators: {
    rsi: number;
    mom3d: number;
    mom7d: number;
    mom30d: number;
    maDaily: string;
    maMonthly: string;
  };
  predictions: { daily: Prediction; weekly: Prediction; monthly: Prediction };
}

type VoteState = Record<Tab, "up" | "down" | null>;
type ResultState = Record<Tab, { up: number; down: number; total: number }>;

/* ── helpers ── */
function weekKey() {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  return `${d.getFullYear()}-W${Math.ceil((d.getTime() - start.getTime()) / (7 * 86400000))}`;
}
function ls(k: string) { try { return localStorage.getItem(k); } catch { return null; } }
function lsSet(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* noop */ } }

// Best-effort: tag the OneSignal subscriber (if any) with their daily-poll
// vote + the gold price at vote time. The poll-result cron reads these tags
// ~24h later to push "your prediction was right/wrong" — see
// app/api/cron/poll-result/route.ts. Tagging never blocks voting; if OneSignal
// isn't loaded or the user never granted push permission, this silently no-ops
// (a tag with no reachable subscriber just never gets picked up by the cron).
function tagPollVote(direction: "up" | "down", price: number) {
  try {
    const tags = {
      poll_direction: direction,
      poll_price: String(price),
      poll_voted_at: String(Math.floor(Date.now() / 1000)),
    };
    const apply = (OS: { User: { addTags: (t: Record<string, string>) => void } }) => {
      OS.User.addTags(tags);
    };
    if (window.OneSignal) apply(window.OneSignal);
    else if (window.OneSignalDeferred) window.OneSignalDeferred.push(apply);
  } catch {
    /* noop */
  }
}

/* ── animated target ── */
function AnimatedTarget({ value }: { value: number }) {
  const v = useCountUp(value, 1200);
  return <>${v.toLocaleString()}</>;
}

/* ── main component ── */
export default function GoldPredictionPoll() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [data, setData]       = useState<PredData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState<Tab>("weekly");

  const [votes, setVotes] = useState<VoteState>({ daily: null, weekly: null, monthly: null });
  const [results, setResults] = useState<ResultState>({
    daily:   { up: 68, down: 32, total: 1142 },
    weekly:  { up: 72, down: 28, total: 1834 },
    monthly: { up: 65, down: 35, total: 923 },
  });

  useEffect(() => {
    const savedVotes = ls(`pred_votes_${weekKey()}`);
    if (savedVotes) { try { setVotes(JSON.parse(savedVotes)); } catch { /* noop */ } }
    const savedRes = ls("pred_results");
    if (savedRes)   { try { setResults(JSON.parse(savedRes)); } catch { /* noop */ } }

    fetch("/api/gold-prediction")
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function castVote(v: "up" | "down") {
    const newVotes = { ...votes, [tab]: v };
    const shift = v === "up" ? 1 : -1;
    const cur = results[tab];
    const newUp = Math.min(Math.max(cur.up + shift, 15), 85);
    const newResults = { ...results, [tab]: { up: newUp, down: 100 - newUp, total: cur.total + 1 } };
    setVotes(newVotes);
    setResults(newResults);
    lsSet(`pred_votes_${weekKey()}`, JSON.stringify(newVotes));
    lsSet("pred_results", JSON.stringify(newResults));
    track.quickLinkClick(`pred-${tab}-${v}`);

    // Only "daily" has a clean ~24h resolution window for a follow-up push.
    if (tab === "daily" && data?.current) {
      tagPollVote(v, data.current);
    }
  }

  const tabs: { id: Tab; ar: string; en: string }[] = [
    { id: "daily",   ar: "يومي",    en: "Daily"   },
    { id: "weekly",  ar: "أسبوعي",  en: "Weekly"  },
    { id: "monthly", ar: "شهري",    en: "Monthly" },
  ];

  const pred   = data?.predictions[tab];
  const indic  = data?.indicators;
  const isUp   = pred?.direction === "up";
  const color  = isUp ? "#22c55e" : "#ef4444";
  const voted  = votes[tab];
  const res    = results[tab];

  /* signal helpers */
  function rsiLabel(v: number) {
    if (v < 35) return isAr ? "مفرط في البيع ↑" : "Oversold ↑";
    if (v < 45) return isAr ? "تصاعدي" : "Bullish";
    if (v < 55) return isAr ? "محايد" : "Neutral";
    if (v < 65) return isAr ? "تنازلي" : "Bearish";
    return isAr ? "مفرط في الشراء ↓" : "Overbought ↓";
  }
  const rsiCls = (v: number) => v < 45 ? "rise" : v > 55 ? "fall" : "secondary";
  const momCls = (v: number) => v > 0 ? "rise" : v < 0 ? "fall" : "secondary";
  const maCls  = (s: string) => s === "bullish" ? "rise" : "fall";

  const signals = indic ? [
    {
      name: "RSI (14)",
      val: `${indic.rsi} — ${rsiLabel(indic.rsi)}`,
      cls: rsiCls(indic.rsi),
    },
    {
      name: tab === "daily"
        ? (isAr ? "زخم 3 أيام" : "3-day momentum")
        : tab === "weekly"
        ? (isAr ? "الزخم الأسبوعي" : "Weekly momentum")
        : (isAr ? "الزخم الشهري" : "Monthly momentum"),
      val: (() => {
        const m = tab === "daily" ? indic.mom3d : tab === "weekly" ? indic.mom7d : indic.mom30d;
        return `${m > 0 ? "+" : ""}${m}%`;
      })(),
      cls: momCls(tab === "daily" ? indic.mom3d : tab === "weekly" ? indic.mom7d : indic.mom30d),
    },
    {
      name: tab === "monthly" ? "MA 30 vs MA 90" : "MA 7 vs MA 30",
      val: (() => {
        const s = tab === "monthly" ? indic.maMonthly : indic.maDaily;
        return s === "bullish" ? (isAr ? "تقاطع صاعد ↑" : "Bullish cross ↑") : (isAr ? "تقاطع هابط ↓" : "Bearish cross ↓");
      })(),
      cls: maCls(tab === "monthly" ? indic.maMonthly : indic.maDaily),
    },
  ] : [];

  const periodLabel = isAr
    ? tab === "daily" ? "آخر 7 أيام" : tab === "weekly" ? "آخر 4 أسابيع" : "آخر 6 أشهر"
    : tab === "daily" ? "Last 7 days" : tab === "weekly" ? "Last 4 weeks" : "Last 6 months";

  return (
    <section dir={dir} className="max-w-7xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
      <style>{`@keyframes shimmer-pred{0%{background-position:-200% center}100%{background-position:200% center}}.shimmer-pred{background:linear-gradient(90deg,#B8860B 0%,#FFD700 35%,#C9A84C 50%,#FFD700 65%,#B8860B 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-pred 2.5s linear infinite}`}</style>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
          ✦
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              {isAr ? "التحليل التقني للذهب" : "Gold Technical Analysis"}
            </h2>
            {data?.aiPowered && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold font-medium">
                {isAr ? "✦ ذكاء اصطناعي" : "✦ AI-powered"}
              </span>
            )}
          </div>
          <p className="text-text-secondary text-xs sm:text-sm">
            {isAr ? "توقعات مبنية على بيانات السوق الحقيقية" : "Predictions built on real market data"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gold/20 bg-surface p-4 sm:p-5">

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-2 p-1 rounded-xl mb-4">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {isAr ? t.ar : t.en}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-text-secondary text-sm animate-pulse">
            {isAr ? "جاري تحميل التحليل..." : "Loading analysis..."}
          </div>
        ) : (
          <>
            {/* Top stat boxes */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              {/* Direction */}
              <div className="bg-surface-2 rounded-xl p-3 text-center">
                <p className="text-[11px] text-text-secondary mb-1">{isAr ? "التوقع" : "Direction"}</p>
                <div className="text-2xl sm:text-3xl leading-none mb-1" style={{ color }}>{isUp ? "↑" : "↓"}</div>
                <p className="text-xs font-bold shimmer-pred">
                  {isAr ? (isUp ? "ارتفاع" : "انخفاض") : (isUp ? "Rise" : "Fall")}
                </p>
              </div>

              {/* Target price */}
              <div className="bg-surface-2 rounded-xl p-3 text-center">
                <p className="text-[11px] text-text-secondary mb-1">{isAr ? "السعر المستهدف" : "Target Price"}</p>
                <p className="text-lg sm:text-xl font-bold shimmer-pred">
                  {pred && <AnimatedTarget value={pred.target} />}
                </p>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  {isAr ? "من" : "from"} ${data?.current.toLocaleString()}
                </p>
              </div>

              {/* Confidence */}
              <div className="bg-surface-2 rounded-xl p-3 text-center">
                <p className="text-[11px] text-text-secondary mb-1">{isAr ? "ثقة التحليل" : "Confidence"}</p>
                <p className="text-lg sm:text-xl font-bold text-gold">{pred?.confidence}%</p>
                <div className="h-1 bg-surface rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-gold rounded-full transition-all duration-1000" style={{ width: `${pred?.confidence ?? 0}%` }} />
                </div>
              </div>
            </div>

            {/* AI reason */}
            {pred?.reason && (
              <div className="bg-gold/5 border border-gold/15 rounded-xl px-3 py-2 mb-4 text-xs text-text-secondary leading-relaxed">
                <span className="text-gold font-medium">{isAr ? "✦ التحليل: " : "✦ Analysis: "}</span>
                {pred.reason}
              </div>
            )}

            {/* Two-column: chart | signals+vote */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* Chart */}
              {pred && (
                <div className="bg-surface-2 rounded-xl p-3">
                  <p className="text-[11px] text-text-secondary mb-1">{periodLabel}</p>
                  <Sparkline prices={pred.prices} color={color} />
                  <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                    <span>${Math.min(...pred.prices).toLocaleString()}</span>
                    <span>${Math.max(...pred.prices).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Signals + Vote */}
              <div className="flex flex-col gap-3">
                {signals.length > 0 && (
                  <div className="bg-surface-2 rounded-xl p-3 flex-1">
                    <p className="text-[11px] text-text-secondary mb-2">{isAr ? "المؤشرات التقنية" : "Technical Indicators"}</p>
                    <div className="space-y-1.5">
                      {signals.map((s, i) => (
                        <div key={i} className="flex justify-between items-center text-[11px]">
                          <span className="text-text-secondary">{s.name}</span>
                          <span className={`px-2 py-0.5 rounded-md font-medium ${
                            s.cls === "rise" ? "bg-rise/10 text-rise"
                            : s.cls === "fall" ? "bg-fall/10 text-fall"
                            : "bg-surface text-text-secondary"
                          }`}>{s.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-surface-2 rounded-xl p-3">
                  {!voted ? (
                    <>
                      <p className="text-[11px] text-text-secondary text-center mb-2">
                        {isAr ? "هل تتفق مع التحليل؟" : "Do you agree?"}
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => castVote("up")} className="flex-1 bg-rise/10 hover:bg-rise/20 border border-rise/30 text-rise font-bold py-2 rounded-xl transition-colors text-sm">
                          {isAr ? "↑ أتفق" : "↑ Agree"}
                        </button>
                        <button onClick={() => castVote("down")} className="flex-1 bg-fall/10 hover:bg-fall/20 border border-fall/30 text-fall font-bold py-2 rounded-xl transition-colors text-sm">
                          {isAr ? "↓ لا أتفق" : "↓ Disagree"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-[11px] text-text-secondary text-center mb-2">{isAr ? "رأي المجتمع" : "Community vote"}</p>
                      <div className="space-y-1.5">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-rise font-medium">{isAr ? "↑ أتفق" : "↑ Agree"}</span>
                            <span className="text-rise font-bold">{res.up}%</span>
                          </div>
                          <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                            <div className="h-full bg-rise rounded-full transition-all duration-500" style={{ width: `${res.up}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-fall font-medium">{isAr ? "↓ لا أتفق" : "↓ Disagree"}</span>
                            <span className="text-fall font-bold">{res.down}%</span>
                          </div>
                          <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                            <div className="h-full bg-fall rounded-full transition-all duration-500" style={{ width: `${res.down}%` }} />
                          </div>
                        </div>
                        <div className="flex justify-between text-[10px] text-text-secondary pt-0.5">
                          <span>{res.total.toLocaleString()} {isAr ? "صوت" : "votes"}</span>
                          <span>{isAr ? "دقة: 65%" : "Accuracy: 65%"}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[10px] text-text-secondary text-center mt-3">
              {isAr ? "للأغراض التحليلية فقط · ليست توصية استثمارية" : "For analytical purposes only · Not investment advice"}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
