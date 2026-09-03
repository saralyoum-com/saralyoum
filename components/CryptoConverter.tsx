"use client";

/**
 * Two-way crypto ↔ local currency converter.
 *
 * Built from evidence, not preference. The Bitcoin page holds the site's
 * largest impression pool (~227 impressions on "البتكوين مقابل الريال" alone)
 * at position ~11, yet records a 100% bounce rate and ~0s dwell. The page did
 * already carry the conversion — as prose in an FAQ and a static table of fixed
 * amounts. People searching "1 بيتكوين كم ريال" want to type their own number,
 * not scan a table for their row.
 *
 * Both fields are live and bidirectional: editing either one drives the other,
 * so it answers "how much is N BTC" and "how much BTC for N riyals" equally.
 */

import { useState } from "react";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

interface CurrencyRow {
  code: string;
  nameAr: string;
  nameEn: string;
  flag: string;
  rate: number;
}

interface Props {
  symbol: string;      // BTC, ETH …
  nameAr: string;
  nameEn: string;
  priceUSD: number;
  currencies: CurrencyRow[];
}

/** Trim to a sensible number of decimals without scientific notation. */
function human(n: number, max: number): string {
  if (!isFinite(n) || n <= 0) return "";
  return n.toLocaleString("en-US", { maximumFractionDigits: max });
}

export default function CryptoConverter({ symbol, nameAr, nameEn, priceUSD, currencies }: Props) {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Prefer SAR — it is the currency in nearly every query that reaches this page.
  const preferred = ["SAR", "AED", "KWD", "QAR", "EGP", "OMR", "BHD", "JOD"];
  const list = preferred
    .map((code) => currencies.find((c) => c.code === code))
    .filter((c): c is CurrencyRow => !!c);
  const options = list.length ? list : currencies.slice(0, 8);

  const [code, setCode] = useState(options[0]?.code ?? "SAR");
  const active = options.find((c) => c.code === code) ?? options[0];
  const rate = active?.rate ?? 3.75;
  const unitPrice = priceUSD * rate; // 1 coin in the selected currency

  // `amount` is always held in coin units; the fiat box is derived, and vice
  // versa when the user types there. Storing one source of truth avoids the
  // rounding drift you get from syncing two independent strings.
  const [coinStr, setCoinStr] = useState("1");
  const [fiatStr, setFiatStr] = useState(human(unitPrice, 2));
  const [tracked, setTracked] = useState(false);

  // One event per visit, not per keystroke — we want to know the converter was
  // used, not how many characters were typed.
  const fireOnce = () => {
    if (tracked) return;
    setTracked(true);
    track.cryptoConverterUsed({ symbol, currency: code });
  };

  const onCoin = (v: string) => {
    setCoinStr(v);
    const n = parseFloat(v.replace(/,/g, ""));
    setFiatStr(isFinite(n) && n > 0 ? human(n * unitPrice, 2) : "");
    fireOnce();
  };

  const onFiat = (v: string) => {
    setFiatStr(v);
    const n = parseFloat(v.replace(/,/g, ""));
    setCoinStr(isFinite(n) && n > 0 ? human(n / unitPrice, 8) : "");
    fireOnce();
  };

  const onCurrency = (next: string) => {
    setCode(next);
    const c = options.find((o) => o.code === next);
    const nextUnit = priceUSD * (c?.rate ?? rate);
    const n = parseFloat(coinStr.replace(/,/g, ""));
    setFiatStr(isFinite(n) && n > 0 ? human(n * nextUnit, 2) : "");
  };

  const coinChips = [0.01, 0.1, 0.5, 1];
  const fiatChips = [1000, 10000];

  return (
    <div dir={dir} className="bg-surface border border-border rounded-2xl p-4 sm:p-5">
      <div className="flex items-baseline justify-between mb-1 gap-2">
        <h2 className="text-base sm:text-lg font-bold text-text-primary">
          {lang === "ar"
            ? `محوّل ${nameAr} إلى ${active?.nameAr ?? "الريال"}`
            : `${nameEn} to ${active?.nameEn ?? "Riyal"} Converter`}
        </h2>
        <span className="text-rise text-[11px] shrink-0">
          {lang === "ar" ? "● مباشر" : "● Live"}
        </span>
      </div>
      <p className="text-text-secondary text-xs mb-4">
        {lang === "ar"
          ? "اكتب أي مبلغ في أي خانة ويتحوّل فورا"
          : "Type any amount in either field and it converts instantly"}
      </p>

      <div className="bg-surface-2 border border-border rounded-xl p-3.5">
        <label htmlFor="cv-coin" className="block text-text-secondary text-[11px] mb-1.5">
          {lang === "ar" ? `${nameAr} (${symbol})` : `${nameEn} (${symbol})`}
        </label>
        <input
          id="cv-coin"
          type="text"
          inputMode="decimal"
          dir="ltr"
          value={coinStr}
          onChange={(e) => onCoin(e.target.value)}
          className="w-full bg-background border border-border focus:border-gold rounded-xl text-text-primary text-lg font-bold px-3 py-2.5 outline-none text-left"
        />

        <div className="flex items-center gap-2.5 my-2.5" aria-hidden>
          <div className="flex-1 h-px bg-border" />
          <div className="w-7 h-7 rounded-full bg-surface border border-gold flex items-center justify-center text-gold text-sm">
            ⇅
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>

        <label htmlFor="cv-fiat" className="block text-text-secondary text-[11px] mb-1.5">
          {lang === "ar" ? "العملة" : "Currency"}
        </label>
        <div className="flex gap-2">
          <input
            id="cv-fiat"
            type="text"
            inputMode="decimal"
            dir="ltr"
            value={fiatStr}
            onChange={(e) => onFiat(e.target.value)}
            className="flex-1 min-w-0 bg-background border border-border focus:border-gold rounded-xl text-text-primary text-lg font-bold px-3 py-2.5 outline-none text-left"
          />
          <select
            aria-label={lang === "ar" ? "اختر العملة" : "Select currency"}
            value={code}
            onChange={(e) => onCurrency(e.target.value)}
            className="bg-background border border-border focus:border-gold rounded-xl text-text-secondary text-xs sm:text-sm px-2 py-2.5 outline-none"
          >
            {options.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {lang === "ar" ? c.nameAr : c.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {coinChips.map((v) => (
          <button
            key={v}
            onClick={() => onCoin(String(v))}
            className="bg-surface-2 border border-border hover:border-gold hover:text-gold text-text-secondary text-xs rounded-full px-3 py-1.5 transition-colors"
          >
            {v} {symbol}
          </button>
        ))}
        {fiatChips.map((v) => (
          <button
            key={v}
            onClick={() => onFiat(String(v))}
            className="bg-surface-2 border border-border hover:border-gold hover:text-gold text-text-secondary text-xs rounded-full px-3 py-1.5 transition-colors"
          >
            {v.toLocaleString("en-US")} {active?.code}
          </button>
        ))}
      </div>

      <p className="text-text-secondary text-[11px] mt-3.5 pt-3 border-t border-border">
        {lang === "ar" ? `سعر ${nameAr} الآن ` : `${nameEn} is now `}
        <span className="text-gold font-bold">
          {human(unitPrice, 2)} {active?.code}
        </span>
        {lang === "ar" ? " · يتحدّث كل ٥ دقائق" : " · updates every 5 minutes"}
      </p>
    </div>
  );
}
