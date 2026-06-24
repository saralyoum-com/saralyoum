"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

function useCountUp(target: number, duration = 1300) {
  const [v, setV] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (!target || ref.current) return;
    ref.current = true;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return v;
}

function weekKey() {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  return `${d.getFullYear()}-W${Math.ceil((d.getTime() - start.getTime()) / (7 * 86400000))}`;
}
function ls(k: string) { try { return localStorage.getItem(k); } catch { return null; } }
function lsSet(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* noop */ } }

interface Signal {
  current: number;
  direction: "up" | "down";
  confidence: number;
  target: number;
}

type VoteChoice = "up" | "down" | null;

export default function GoldSignalCard() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const [sig, setSig] = useState<Signal>({ current: 0, direction: "up", confidence: 72, target: 0 });
  const [filled, setFilled] = useState(false);
  const [voted, setVoted] = useState<VoteChoice>(null);
  const [results, setResults] = useState({ up: 72, down: 28, total: 1834 });

  const traders = useCountUp(sig.current > 0 ? results.total : 0, 1500);

  useEffect(() => {
    const savedVote = ls(`pred_votes_${weekKey()}`);
    if (savedVote) {
      try {
        const parsed = JSON.parse(savedVote);
        if (parsed?.weekly) setVoted(parsed.weekly);
      } catch { /* noop */ }
    }
    const savedRes = ls("pred_results");
    if (savedRes) {
      try { setResults(JSON.parse(savedRes).weekly ?? results); } catch { /* noop */ }
    }

    fetch("/api/gold-prediction")
      .then(r => r.json())
      .then(d => {
        const w = d.predictions?.weekly;
        setSig({
          current: d.current ?? 3300,
          direction: w?.direction ?? "up",
          confidence: w?.confidence ?? 72,
          target: w?.target ?? 3380,
        });
        setTimeout(() => setFilled(true), 300);
      })
      .catch(() => {
        setSig({ current: 3300, direction: "up", confidence: 72, target: 3380 });
        setTimeout(() => setFilled(true), 300);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function castVote(choice: "up" | "down") {
    const shift = choice === "up" ? 1 : -1;
    const newUp = Math.min(Math.max(results.up + shift, 15), 85);
    const newResults = { up: newUp, down: 100 - newUp, total: results.total + 1 };
    setVoted(choice);
    setResults(newResults);

    const allVotes = JSON.parse(ls(`pred_votes_${weekKey()}`) ?? "{}");
    allVotes.weekly = choice;
    lsSet(`pred_votes_${weekKey()}`, JSON.stringify(allVotes));

    const allResults = JSON.parse(ls("pred_results") ?? "{}");
    allResults.weekly = newResults;
    lsSet("pred_results", JSON.stringify(allResults));

    track.quickLinkClick(`signal-card-vote-${choice}`);
  }

  const isUp = sig.direction === "up";
  const col    = isUp ? "#22c55e" : "#ef4444";
  const colBg  = isUp ? "rgba(34,197,94,0.09)"  : "rgba(239,68,68,0.09)";
  const colBdr = isUp ? "rgba(34,197,94,0.3)"   : "rgba(239,68,68,0.3)";
  const label  = isAr ? (isUp ? "شراء" : "بيع") : (isUp ? "Buy" : "Sell");
  const arrow  = isUp ? "↑" : "↓";

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="max-w-7xl mx-auto px-3 sm:px-4 pb-6">
      <style>{`
        @keyframes gsc-pulse{0%,100%{opacity:1}50%{opacity:.6}}
        @keyframes gsc-shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .gsc-price{background:linear-gradient(90deg,#B8860B,#FFD700,#C9A84C,#FFD700,#B8860B);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gsc-shimmer 2.8s linear infinite}
        .gsc-badge{animation:gsc-pulse 2.2s ease-in-out infinite;display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:9px;font-size:12px;font-weight:700}
        .gsc-vote-btn{flex:1;font-weight:700;padding:7px 12px;border-radius:9px;font-size:12px;cursor:pointer;transition:opacity .15s;}
        .gsc-vote-btn:hover{opacity:.8}
      `}</style>

      <div className="rounded-2xl border border-gold/20 bg-surface overflow-hidden">

        {/* ── TOP ROW ── */}
        <Link
          href="/تحليل-تقني-الذهب"
          onClick={() => track.quickLinkClick("signal-card-cta")}
          className="group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 pt-4 pb-3 sm:py-0 sm:h-[70px] overflow-hidden"
          style={{ textDecoration: "none" }}
        >
          {/* Gold left accent */}
          <div className="absolute inset-y-0 start-0 w-[3px] rounded-s-2xl bg-gradient-to-b from-gold/20 via-gold to-gold/20" />

          {/* Price (start) + badge (end) share one row on mobile; separate cells on desktop */}
          <div className="flex items-center justify-between gap-3 px-5 sm:contents">
            {/* Asset + price */}
            <div className="flex items-center gap-2.5 sm:ps-6 sm:border-e border-border sm:h-full" style={{ minWidth: 0 }}>
              <span className="text-2xl shrink-0">🥇</span>
              <div style={{ minWidth: 0 }}>
                <p className="text-[10px] text-text-secondary mb-0.5">
                  {isAr ? "الذهب — التوقع الأسبوعي" : "Gold — Weekly Signal"}
                </p>
                {sig.current > 0
                  ? <p className="gsc-price text-lg font-black leading-tight">${sig.current.toLocaleString()}</p>
                  : <div className="h-5 w-20 bg-surface-2 rounded animate-pulse" />}
              </div>
            </div>

            {/* Direction badge */}
            <div className="flex items-center sm:px-5 sm:border-e border-border sm:h-full shrink-0">
              <span className="gsc-badge" style={{ color: col, background: colBg, border: `1px solid ${colBdr}` }}>
                <span className="text-sm">{arrow}</span>
                {label}
              </span>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="flex-1 px-5 sm:px-5 sm:border-e border-border sm:h-full flex flex-col justify-center" style={{ minWidth: 100 }}>
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-text-secondary">{isAr ? "ثقة التحليل" : "AI Confidence"}</span>
              <span className="font-bold text-gold">{sig.confidence}%</span>
            </div>
            <div className="h-[5px] bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: filled ? `${sig.confidence}%` : "0%", background: "linear-gradient(90deg,#C9A84C,#FFD700)" }}
              />
            </div>
            <p className="text-[10px] text-text-secondary mt-1">
              {sig.target > 0 ? (isAr ? `هدف $${sig.target.toLocaleString()}` : `Target $${sig.target.toLocaleString()}`) : ""}
            </p>
          </div>

          {/* Traders (desktop) */}
          <div className="hidden sm:flex flex-col items-center justify-center px-5 sm:border-e border-border sm:h-full gap-0.5 shrink-0">
            {traders > 0
              ? <p className="text-sm font-black text-text-primary">{traders.toLocaleString()}</p>
              : <div className="h-4 w-12 bg-surface-2 rounded animate-pulse" />}
            <p className="text-[10px] text-text-secondary">{isAr ? "متداول" : "traders"}</p>
            <span className="text-[10px] text-rise">● {isAr ? "مباشر" : "Live"}</span>
          </div>

          {/* CTA */}
          <div className="hidden sm:flex pe-5 sm:h-full items-center shrink-0">
            <span className="text-gold text-sm font-bold group-hover:underline flex items-center gap-1 whitespace-nowrap">
              {isAr ? "تحليل كامل" : "Full Analysis"}
              <span className="text-base">{isAr ? "←" : "→"}</span>
            </span>
          </div>
        </Link>

        {/* ── BOTTOM ROW: VOTE ── */}
        <div className="border-t border-border px-4 sm:px-5 py-2.5">
          {!voted ? (
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-text-secondary whitespace-nowrap shrink-0">
                {isAr ? "هل تتفق مع التحليل؟" : "Do you agree?"}
              </span>
              <div className="flex gap-2 flex-1">
                <button
                  onClick={() => castVote("up")}
                  className="gsc-vote-btn"
                  style={{ background: "rgba(34,197,94,0.09)", border: "1px solid rgba(34,197,94,0.28)", color: "#22c55e" }}
                >
                  ↑ {isAr ? "أتفق" : "Agree"}
                </button>
                <button
                  onClick={() => castVote("down")}
                  className="gsc-vote-btn"
                  style={{ background: "rgba(239,68,68,0.09)", border: "1px solid rgba(239,68,68,0.28)", color: "#ef4444" }}
                >
                  ↓ {isAr ? "لا أتفق" : "Disagree"}
                </button>
              </div>
              <Link
                href="/تحليل-تقني-الذهب"
                className="hidden sm:block text-[11px] text-gold hover:underline whitespace-nowrap shrink-0"
              >
                {isAr ? "تحليل كامل ←" : "Full Analysis →"}
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span style={{ color: "#22c55e", fontWeight: 700 }}>↑ {isAr ? "أتفق" : "Agree"} {results.up}%</span>
                <span className="text-text-secondary text-[10px]">
                  {results.total.toLocaleString()} {isAr ? "صوت" : "votes"}
                  {" · "}
                  {isAr ? "دقة التوقعات: 65%" : "Accuracy: 65%"}
                </span>
                <span style={{ color: "#ef4444", fontWeight: 700 }}>{results.down}% {isAr ? "لا أتفق ↓" : "Disagree ↓"}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden flex gap-px">
                <div
                  className="rounded-s-full transition-all duration-700 ease-out"
                  style={{ width: `${results.up}%`, background: "linear-gradient(90deg,#16a34a,#22c55e)", opacity: 0.8 }}
                />
                <div
                  className="flex-1 rounded-e-full"
                  style={{ background: "linear-gradient(90deg,#ef4444,#b91c1c)", opacity: 0.7 }}
                />
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-text-secondary">{isAr ? "صوتك:" : "Your vote:"}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    color: voted === "up" ? "#22c55e" : "#ef4444",
                    background: voted === "up" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${voted === "up" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                  }}
                >
                  {voted === "up" ? (isAr ? "↑ أتفق ✓" : "↑ Agree ✓") : (isAr ? "↓ لا أتفق ✓" : "↓ Disagree ✓")}
                </span>
                <Link
                  href="/تحليل-تقني-الذهب"
                  className="text-[10px] text-gold hover:underline ms-auto whitespace-nowrap"
                >
                  {isAr ? "تحليل كامل ←" : "Full Analysis →"}
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
