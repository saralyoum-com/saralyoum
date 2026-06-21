"use client";

import { useLang } from "@/components/LanguageContext";

const KAST_LOGO = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1020 214"
    aria-label="KAST"
    className="h-6 sm:h-7 w-auto"
  >
    <g fill="#fff" clipPath="url(#kastClip)">
      <path d="M456.88 2.85h-30.82L315.03 120.44V2.85H290.2v208.06h24.83v-58.5l36.25-38.25 77.63 96.75h30.83L368.69 96.18zM552.77 2.85 472 210.91h26.54l19.13-49.94H618.7l19.13 49.94h26.54L584.17 2.85zm-27.39 137.28 30.54-79.91c3.99-10.28 7.99-21.12 12.27-33.11 4.28 11.99 8.57 22.83 12.27 33.11L611 140.13zM781.52 95.61l-37.67-7.7c-13.69-3.14-37.1-9.13-37.1-33.68 0-20.55 16.84-33.68 45.67-33.68s48.8 12.27 50.51 39.67h25.68C827.76 23.97 802.07 0 754.41 0c-44.81 0-73.92 22.83-73.92 57.37 0 41.67 39.1 50.8 58.79 54.8l36.82 7.99c9.42 2.28 33.1 7.71 33.1 33.96 0 23.4-19.12 39.1-52.23 39.1-35.96 0-54.23-15.98-55.37-46.52h-25.97c.57 38.81 26.54 67.07 81.62 67.07 47.67 0 78.49-22.55 78.49-61.36s-31.96-52.23-54.23-56.8zM843.6 2.85V25.4h75.35v185.51h25.12V25.4h75.35V2.85zM46.29 58.13l.64-55.28H0v80.56l44.98 21.7L0 127.56v83.31h46.88l-.63-57.13 100.42 57.17h36.7v-36.13l-138.4-69.66 138.4-67.33V2.85h-36.7z" />
    </g>
    <defs>
      <clipPath id="kastClip">
        <path fill="#fff" d="M0 0h1019.42v213.77H0z" />
      </clipPath>
    </defs>
  </svg>
);

const TICKER_ITEMS = [
  "حساب أمريكي حقيقي",
  "IBAN أوروبي",
  "BTC · USDT · USDC",
  "١٧٠+ دولة SWIFT",
  "١٥٠ مليون متجر Visa",
  "بدون بنك · بدون إقامة",
  "بدون رسوم خفية",
  "سحب فوري",
  "7% APY على مدخراتك",
];

export default function KastBanner() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const tickerText = TICKER_ITEMS.join("  ·  ") + "  ·  ";

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="max-w-7xl mx-auto px-3 sm:px-4 pb-8 sm:pb-10"
      aria-label="KAST — بنك رقمي"
    >
      <a
        href="https://app.kast.xyz/referral/BZQVJXQ0"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="relative block rounded-2xl overflow-hidden"
        style={{ background: "#07070D", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Scan line */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: 0,
            bottom: 0,
            width: 80,
            background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.025),transparent)",
            animation: "kastScan 4s linear infinite",
          }}
        />

        {/* Main content */}
        <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-5 sm:px-7 py-4 sm:py-5">

          {/* Logo + live badge */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {KAST_LOGO}
            <div
              className="hidden sm:flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"
                style={{ animation: "kastBlink 1.8s ease infinite" }}
              />
              {isAr ? "بنك رقمي" : "Digital Bank"}
            </div>
          </div>

          {/* Divider (desktop) */}
          <div
            className="hidden sm:block flex-shrink-0 w-px h-10"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />

          {/* Headline */}
          <div className="flex-1 text-center sm:text-start min-w-0">
            <p
              className="text-white font-bold text-sm sm:text-base leading-snug mb-0.5"
            >
              {isAr
                ? "عندك USDT وما تدري وين تصرفها؟ KAST يحولها لدولار — فوراً"
                : "Got USDT and nowhere to spend it? KAST converts it to dollars — instantly"}
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              {isAr
                ? "حساب أمريكي + IBAN أوروبي + كريبتو · ٢٠٠+ دولة · ١٥٠M متجر Visa"
                : "US account + EU IBAN + crypto · 200+ countries · 150M Visa merchants"}
            </p>
          </div>

          {/* Stats (desktop) */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <div
              className="text-center px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-white font-bold text-sm leading-none">200+</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                {isAr ? "دولة" : "Countries"}
              </div>
            </div>
            <div
              className="text-center px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.14)" }}
            >
              <div className="font-bold text-sm leading-none" style={{ color: "#4ADE80" }}>7%</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(74,222,128,0.45)" }}>APY</div>
            </div>
          </div>

          {/* CTA */}
          <span
            className="flex-shrink-0 rounded-xl px-5 py-2.5 text-sm font-extrabold transition-transform hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg,#A07020,#C9A84C)",
              color: "#07070D",
              animation: "kastGlow 2.5s ease 0.5s infinite",
              whiteSpace: "nowrap",
            }}
          >
            {isAr ? "افتح حسابك ←" : "Open Account →"}
          </span>
        </div>

        {/* Ticker strip */}
        <div
          className="overflow-hidden border-t"
          style={{ borderColor: "rgba(255,255,255,0.05)", paddingBlock: "6px" }}
        >
          <div
            className="inline-block whitespace-nowrap"
            style={{ animation: "kastTicker 20s linear infinite" }}
            aria-hidden="true"
          >
            <span className="text-xs px-6" style={{ color: "rgba(255,255,255,0.22)" }}>
              {tickerText + tickerText}
            </span>
          </div>
        </div>
      </a>

      {/* Disclosure */}
      <p className="text-center mt-1.5 text-xs" style={{ color: "rgba(255,255,255,0.12)" }}>
        {isAr ? "إعلان · رابط إحالة" : "Advertisement · Referral link"}
      </p>
    </section>
  );
}
