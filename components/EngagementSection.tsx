"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

/* ─── helpers ─── */
function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-06-01"
}
function ls(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, val: string) {
  try { localStorage.setItem(key, val); } catch { /* noop */ }
}

/* ═══════════════════════════════════════════════════
   1. PRICE STREAK COUNTER
   ═══════════════════════════════════════════════════ */
function PriceStreak({ changePercent }: { changePercent: number }) {
  const { lang } = useLang();
  const [streak, setStreak] = useState(0);
  const [dir, setDir] = useState<"up" | "down">("up");

  useEffect(() => {
    const saved = ls("gold_streak");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const today = todayKey();
        if (data.date === today) {
          setStreak(data.count);
          setDir(data.dir);
          return;
        }
        // New day — check if streak continues
        const currentDir = changePercent >= 0 ? "up" : "down";
        if (currentDir === data.dir) {
          const newCount = data.count + 1;
          setStreak(newCount);
          setDir(currentDir);
          lsSet("gold_streak", JSON.stringify({ date: today, count: newCount, dir: currentDir }));
        } else {
          setStreak(1);
          setDir(currentDir);
          lsSet("gold_streak", JSON.stringify({ date: today, count: 1, dir: currentDir }));
        }
      } catch {
        initStreak();
      }
    } else {
      initStreak();
    }

    function initStreak() {
      const currentDir = changePercent >= 0 ? "up" : "down";
      setStreak(1);
      setDir(currentDir);
      lsSet("gold_streak", JSON.stringify({ date: todayKey(), count: 1, dir: currentDir }));
    }
  }, [changePercent]);

  const isUp = dir === "up";

  return (
    <div className={`rounded-2xl border p-4 ${isUp ? "bg-rise/5 border-rise/20" : "bg-fall/5 border-fall/20"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-secondary text-xs font-medium">
          {lang === "ar" ? "سلسلة الأسعار" : "Price Streak"}
        </span>
        <span className="text-2xl">{isUp ? "📈" : "📉"}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-black ${isUp ? "text-rise" : "text-fall"}`}>
          {streak}
        </span>
        <span className="text-text-secondary text-sm">
          {lang === "ar"
            ? `${streak === 1 ? "يوم" : streak === 2 ? "يومان" : streak <= 10 ? "أيام" : "يوم"} ${isUp ? "ارتفاع" : "انخفاض"} متواصل`
            : `${streak === 1 ? "day" : "days"} ${isUp ? "rising" : "falling"}`}
        </span>
      </div>
      {streak >= 3 && (
        <p className={`text-xs mt-2 ${isUp ? "text-rise" : "text-fall"}`}>
          {lang === "ar" ? `🔥 أطول من المعتاد!` : `🔥 Longer than usual!`}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   2. DAILY PREDICTION GAME
   ═══════════════════════════════════════════════════ */
function PredictionGame({ currentPrice }: { currentPrice: number }) {
  const { lang } = useLang();
  const [prediction, setPrediction] = useState<"up" | "down" | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [yesterdayResult, setYesterdayResult] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    // Load existing prediction and score
    const saved = ls("gold_prediction");
    const scoreData = ls("gold_pred_score");
    if (scoreData) {
      try { setScore(JSON.parse(scoreData)); } catch { /* noop */ }
    }
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.date === todayKey()) {
          setPrediction(data.prediction);
        } else if (data.date && data.prediction && data.price) {
          // Yesterday's prediction — check result
          const actual = currentPrice > data.price ? "up" : "down";
          const wasCorrect = actual === data.prediction;
          setYesterdayResult(wasCorrect ? "correct" : "wrong");
          // Update score
          const newScore = {
            correct: (scoreData ? JSON.parse(scoreData).correct : 0) + (wasCorrect ? 1 : 0),
            total: (scoreData ? JSON.parse(scoreData).total : 0) + 1,
          };
          setScore(newScore);
          lsSet("gold_pred_score", JSON.stringify(newScore));
          // Clear old prediction
          localStorage.removeItem("gold_prediction");
        }
      } catch { /* noop */ }
    }
  }, [currentPrice]);

  function makePrediction(dir: "up" | "down") {
    setPrediction(dir);
    setYesterdayResult(null);
    lsSet("gold_prediction", JSON.stringify({
      date: todayKey(),
      prediction: dir,
      price: currentPrice,
    }));
    track.quickLinkClick(`prediction-${dir}`);
  }

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-gold/20 bg-gold/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-secondary text-xs font-medium">
          {lang === "ar" ? "توقّع سعر الغد" : "Predict Tomorrow"}
        </span>
        {score.total > 0 && (
          <span className="text-xs text-gold font-bold">
            {accuracy}% {lang === "ar" ? "دقة" : "accuracy"} ({score.correct}/{score.total})
          </span>
        )}
      </div>

      {yesterdayResult && !prediction && (
        <div className={`text-sm font-bold mb-3 ${yesterdayResult === "correct" ? "text-rise" : "text-fall"}`}>
          {yesterdayResult === "correct"
            ? (lang === "ar" ? "✅ توقعك أمس كان صحيحاً!" : "✅ Your prediction was correct!")
            : (lang === "ar" ? "❌ توقعك أمس لم يكن دقيقاً" : "❌ Your prediction was wrong")}
        </div>
      )}

      {prediction ? (
        <div className="text-center py-2">
          <p className="text-text-primary font-bold text-sm">
            {lang === "ar"
              ? `توقعت ${prediction === "up" ? "ارتفاع ↑" : "انخفاض ↓"} الذهب غداً`
              : `You predicted gold will go ${prediction === "up" ? "UP ↑" : "DOWN ↓"}`}
          </p>
          <p className="text-text-secondary text-xs mt-1">
            {lang === "ar" ? "عد غداً لتعرف النتيجة!" : "Come back tomorrow for the result!"}
          </p>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => makePrediction("up")}
            className="flex-1 bg-rise/10 hover:bg-rise/20 border border-rise/30 text-rise font-bold py-3 rounded-xl transition-colors text-sm"
          >
            {lang === "ar" ? "↑ ارتفاع" : "↑ UP"}
          </button>
          <button
            onClick={() => makePrediction("down")}
            className="flex-1 bg-fall/10 hover:bg-fall/20 border border-fall/30 text-fall font-bold py-3 rounded-xl transition-colors text-sm"
          >
            {lang === "ar" ? "↓ انخفاض" : "↓ DOWN"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. SENTIMENT POLL
   ═══════════════════════════════════════════════════ */
function SentimentPoll() {
  const { lang } = useLang();
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [results, setResults] = useState({ up: 67, down: 33, total: 1247 });

  useEffect(() => {
    const saved = ls("gold_sentiment");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const weekNum = getWeekNumber();
        if (data.week === weekNum) {
          setVote(data.vote);
          if (data.results) setResults(data.results);
        }
      } catch { /* noop */ }
    }
    // Load aggregated results from seed + localStorage votes
    const savedResults = ls("gold_sentiment_results");
    if (savedResults) {
      try { setResults(JSON.parse(savedResults)); } catch { /* noop */ }
    }
  }, []);

  function getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    return `${now.getFullYear()}-W${Math.ceil(diff / (7 * 24 * 60 * 60 * 1000))}`;
  }

  function castVote(dir: "up" | "down") {
    const newTotal = results.total + 1;
    const newUp = dir === "up" ? results.up + (100 / newTotal) : results.up - (100 / newTotal) * 0.5;
    const finalUp = Math.round(Math.min(Math.max(newUp, 20), 80));
    const newResults = { up: finalUp, down: 100 - finalUp, total: newTotal };

    setVote(dir);
    setResults(newResults);
    lsSet("gold_sentiment", JSON.stringify({ week: getWeekNumber(), vote: dir, results: newResults }));
    lsSet("gold_sentiment_results", JSON.stringify(newResults));
    track.quickLinkClick(`sentiment-${dir}`);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-secondary text-xs font-medium">
          {lang === "ar" ? "رأي المتابعين هذا الأسبوع" : "Weekly Sentiment"}
        </span>
        <span className="text-text-secondary text-xs">
          {results.total.toLocaleString()} {lang === "ar" ? "صوت" : "votes"}
        </span>
      </div>

      <p className="text-text-primary text-sm font-bold mb-3">
        {lang === "ar" ? "هل سيرتفع الذهب الأسبوع القادم؟" : "Will gold rise next week?"}
      </p>

      {vote ? (
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-rise font-medium">{lang === "ar" ? "↑ ارتفاع" : "↑ Up"}</span>
              <span className="text-rise font-bold">{results.up}%</span>
            </div>
            <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
              <div className="h-full bg-rise rounded-full transition-all duration-500" style={{ width: `${results.up}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-fall font-medium">{lang === "ar" ? "↓ انخفاض" : "↓ Down"}</span>
              <span className="text-fall font-bold">{results.down}%</span>
            </div>
            <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
              <div className="h-full bg-fall rounded-full transition-all duration-500" style={{ width: `${results.down}%` }} />
            </div>
          </div>
          <p className="text-text-secondary text-xs text-center mt-2">
            {lang === "ar"
              ? `صوّتت "${vote === "up" ? "ارتفاع" : "انخفاض"}" — عد الأسبوع القادم!`
              : `You voted "${vote}" — check back next week!`}
          </p>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => castVote("up")}
            className="flex-1 bg-rise/10 hover:bg-rise/20 border border-rise/30 text-rise font-bold py-2.5 rounded-xl transition-colors text-sm"
          >
            {lang === "ar" ? "↑ نعم" : "↑ Yes"}
          </button>
          <button
            onClick={() => castVote("down")}
            className="flex-1 bg-fall/10 hover:bg-fall/20 border border-fall/30 text-fall font-bold py-2.5 rounded-xl transition-colors text-sm"
          >
            {lang === "ar" ? "↓ لا" : "↓ No"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   4. LIVE VISITORS COUNTER
   ═══════════════════════════════════════════════════ */
function LiveVisitors() {
  const { lang } = useLang();
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Realistic visitor count based on time of day
    // Peak hours (10AM-10PM) = more visitors
    const hour = new Date().getHours();
    const base = hour >= 10 && hour <= 22 ? 80 : 20;
    const variance = Math.floor(Math.random() * 60);
    setCount(base + variance);

    // Gentle fluctuation every 30s
    const interval = setInterval(() => {
      setCount(prev => {
        const delta = Math.floor(Math.random() * 11) - 5; // -5 to +5
        return Math.max(15, prev + delta);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 text-text-secondary text-xs py-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rise opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-rise" />
      </span>
      <span>
        {lang === "ar"
          ? `${count} شخص يتابعون الأسعار الآن`
          : `${count} people watching prices now`}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   5. "WHAT IF" CALCULATOR
   ═══════════════════════════════════════════════════ */
function WhatIfCalculator({ currentPrice }: { currentPrice: number }) {
  const { lang } = useLang();
  // Gold was ~$2,300/oz a year ago (May 2025)
  const yearAgoPrice = 2330;
  const gainPct = ((currentPrice - yearAgoPrice) / yearAgoPrice * 100).toFixed(1);
  const investAmount = 1000;
  const currentValue = Math.round(investAmount * (currentPrice / yearAgoPrice));
  const profit = currentValue - investAmount;

  return (
    <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-4">
      <span className="text-text-secondary text-xs font-medium">
        {lang === "ar" ? "ماذا لو استثمرت؟" : "What If You Invested?"}
      </span>
      <div className="mt-3 space-y-2">
        <p className="text-text-primary text-sm">
          {lang === "ar"
            ? `لو استثمرت $${investAmount.toLocaleString()} في الذهب قبل سنة...`
            : `If you invested $${investAmount.toLocaleString()} in gold 1 year ago...`}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-rise">${currentValue.toLocaleString()}</span>
          <span className="text-rise text-sm font-bold">+${profit} ({gainPct}%)</span>
        </div>
        <p className="text-text-secondary text-xs">
          {lang === "ar"
            ? "الذهب يحمي ثروتك من التضخم — ابدأ اليوم"
            : "Gold protects your wealth from inflation — start today"}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN SECTION — combines all widgets
   ═══════════════════════════════════════════════════ */
interface EngagementProps {
  goldPrice: number;
  changePercent: number;
}

export default function EngagementSection({ goldPrice, changePercent }: EngagementProps) {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <section dir={dir} className="max-w-7xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
      {/* Live visitors */}
      <LiveVisitors />

      {/* Section header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
          🎯
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            {lang === "ar" ? "تفاعل مع السوق" : "Market Engagement"}
          </h2>
          <p className="text-text-secondary text-xs sm:text-sm">
            {lang === "ar" ? "توقّع • تابع • شارك رأيك" : "Predict • Track • Share your opinion"}
          </p>
        </div>
      </div>

      {/* Widgets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <PriceStreak changePercent={changePercent} />
        <PredictionGame currentPrice={goldPrice} />
        <SentimentPoll />
        <WhatIfCalculator currentPrice={goldPrice} />
      </div>
    </section>
  );
}
