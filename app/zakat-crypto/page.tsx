"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLocation } from "@/components/LocalCurrency";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";
import AdSlot from "@/components/AdSlot";

// ── Constants ──────────────────────────────────────────────────────────────
const NISAB_GOLD_GRAMS = 85;
const OZ_TO_GRAM = 31.1035;
const ZAKAT_RATE = 0.025;

interface CoinPrices {
  goldPerGram: number;
  btc: number;
  eth: number;
  bnb: number;
  sol: number;
  nisabUSD: number;
}

const FALLBACK: CoinPrices = {
  goldPerGram: 154.0,
  btc: 84000,
  eth: 2600,
  bnb: 580,
  sol: 135,
  nisabUSD: 154.0 * NISAB_GOLD_GRAMS,
};

// ── Component ──────────────────────────────────────────────────────────────
export default function ZakatCryptoPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const dir = ar ? "rtl" : "ltr";
  const loc = useLocation();

  const [prices, setPrices] = useState<CoinPrices>(FALLBACK);
  const [loading, setLoading] = useState(true);

  // holdings inputs
  const [btc, setBtc]   = useState("");
  const [eth, setEth]   = useState("");
  const [bnb, setBnb]   = useState("");
  const [sol, setSol]   = useState("");
  const [usdt, setUsdt] = useState(""); // USD value
  const [other, setOther] = useState(""); // other coins USD value

  interface CalcResult {
    total: number;
    meetsNisab: boolean;
    zakat: number;
    zakatLocal: number;
    nisabUSD: number;
    short: number;
  }

  const [result, setResult] = useState<CalcResult | null>(null);

  // ── Fetch live prices ──────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [metalRes, cryptoRes] = await Promise.all([
          fetch("/api/prices?type=metals"),
          fetch("/api/prices?type=crypto"),
        ]);
        const metals = await metalRes.json();
        const crypto = await cryptoRes.json();

        const goldOz = metals?.gold?.price ?? FALLBACK.goldPerGram * OZ_TO_GRAM;
        const goldPerGram = goldOz / OZ_TO_GRAM;

        setPrices({
          goldPerGram,
          btc: crypto?.bitcoin?.price ?? FALLBACK.btc,
          eth: crypto?.ethereum?.price ?? FALLBACK.eth,
          bnb: crypto?.binancecoin?.price ?? FALLBACK.bnb,
          sol: crypto?.solana?.price ?? FALLBACK.sol,
          nisabUSD: goldPerGram * NISAB_GOLD_GRAMS,
        });
      } catch {
        // keep fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Calculate ────────────────────────────────────────────────────────────
  const calculate = useCallback(() => {
    const btcVal   = (parseFloat(btc)   || 0) * prices.btc;
    const ethVal   = (parseFloat(eth)   || 0) * prices.eth;
    const bnbVal   = (parseFloat(bnb)   || 0) * prices.bnb;
    const solVal   = (parseFloat(sol)   || 0) * prices.sol;
    const usdtVal  =  parseFloat(usdt)  || 0;
    const otherVal =  parseFloat(other) || 0;

    const total = btcVal + ethVal + bnbVal + solVal + usdtVal + otherVal;
    const meetsNisab = total >= prices.nisabUSD;
    const zakat = meetsNisab ? total * ZAKAT_RATE : 0;

    setResult({
      total,
      meetsNisab,
      zakat,
      zakatLocal: zakat * loc.rate,
      nisabUSD: prices.nisabUSD,
      short: meetsNisab ? 0 : prices.nisabUSD - total,
    });

    track.navClick?.("crypto-zakat-calc");
  }, [btc, eth, bnb, sol, usdt, other, prices, loc.rate]);

  const fmt = (n: number, d = 2) =>
    n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  const fmtLocal = (usd: number) => {
    const val = usd * loc.rate;
    const d = loc.rate > 100 ? 0 : 2;
    return `${val.toLocaleString("en-US", { maximumFractionDigits: d })} ${loc.currency}`;
  };

  // ── Share ────────────────────────────────────────────────────────────────
  const getShareText = () => {
    if (!result) return "";
    if (!result.meetsNisab) {
      return ar
        ? `💰 حسبت زكاة الكريبتو على sardhahab.com\n🔢 قيمة المحفظة: $${fmt(result.total, 0)}\n⚖️ النصاب: $${fmt(result.nisabUSD, 0)}\n⏳ لم تبلغ النصاب بعد\n\nاحسب زكاتك 👇\nhttps://sardhahab.com/zakat-crypto`
        : `💰 I calculated crypto Zakat on sardhahab.com\n🔢 Portfolio: $${fmt(result.total, 0)}\n⚖️ Nisab: $${fmt(result.nisabUSD, 0)}\n⏳ Below Nisab — No Zakat yet\n\nCalculate yours 👇\nhttps://sardhahab.com/zakat-crypto`;
    }
    return ar
      ? `🤲 حسبت زكاة الكريبتو على sardhahab.com\n💼 قيمة المحفظة: $${fmt(result.total, 0)}\n✅ تجب الزكاة!\n💸 الزكاة الواجبة: $${fmt(result.zakat)} (${fmtLocal(result.zakat)})\n\nاحسب زكاتك الآن 👇\nhttps://sardhahab.com/zakat-crypto`
      : `🤲 Calculated crypto Zakat on sardhahab.com\n💼 Portfolio: $${fmt(result.total, 0)}\n✅ Zakat is Due!\n💸 Zakat amount: $${fmt(result.zakat)} (${fmtLocal(result.zakat)})\n\nCalculate yours 👇\nhttps://sardhahab.com/zakat-crypto`;
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
    track.navClick?.("crypto-zakat-share-wa");
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://t.me/share/url?url=https://sardhahab.com/zakat-crypto&text=${text}`, "_blank");
    track.navClick?.("crypto-zakat-share-tg");
  };

  const nisabInBtc = prices.nisabUSD / prices.btc;
  const nisabInEth = prices.nisabUSD / prices.eth;

  const scholars = ar ? [
    { icon: "🕌", title: "هيئة كبار العلماء (السعودية)", text: "العملات الرقمية أموال لها قيمة مالية وتجب فيها الزكاة كعروض التجارة بنسبة 2.5% إذا بلغت النصاب وحال عليها الحول." },
    { icon: "📜", title: "المجمع الفقهي الإسلامي الدولي", text: "العملات الرقمية يجري عليها حكم عروض التجارة؛ وتزكَّى بتقويم قيمتها السوقية في نهاية كل حول بنسبة ربع العشر (2.5%)." },
    { icon: "🎓", title: "رأي العلماء المعاصرين", text: "من يتاجر في الكريبتو يومياً يزكيه زكاة عروض التجارة. أما الممسك للتخزين فيزكي قيمته رأس الحول إذا بلغ النصاب. جميع الكوينات — BTC وETH وBNB وSOL وغيرها — تخضع لنفس الحكم." },
  ] : [
    { icon: "🕌", title: "Council of Senior Scholars (Saudi Arabia)", text: "Cryptocurrencies are financial assets subject to zakat at 2.5% as trade goods, provided they reach the nisab and a full lunar year has passed." },
    { icon: "📜", title: "International Islamic Fiqh Academy", text: "Cryptocurrencies follow the ruling of trade goods; zakat is due at 2.5% of their market value at the end of each lunar year." },
    { icon: "🎓", title: "Contemporary Scholars' View", text: "Active traders pay zakat as trade goods. Long-term holders pay 2.5% of market value at the end of the lunar year. All coins — BTC, ETH, BNB, SOL and others — follow the same ruling." },
  ];

  const faqs = ar ? [
    { q: "هل تجب الزكاة على البيتكوين؟", a: "نعم، جمهور العلماء المعاصرين على وجوبها إذا بلغت قيمته النصاب (85 جرام ذهب) وحال عليه الحول." },
    { q: "هل تجب الزكاة على BNB وSOL؟", a: "نعم، كل عملة رقمية لها قيمة سوقية تخضع لنفس حكم الزكاة — إذا بلغت قيمتك الإجمالية النصاب وحال الحول وجبت الزكاة." },
    { q: "هل تجب الزكاة على USDT وستيبل كوين؟", a: "نعم، الستيبل كوين (USDT، USDC) تُعامل معاملة النقد وتجب فيها الزكاة كالأموال السائلة." },
    { q: "هل يُشترط الحول لزكاة الكريبتو؟", a: "نعم، يجب مرور سنة هجرية كاملة (354 يوماً) على ملك النصاب. إذا انخفضت القيمة عن النصاب خلال الحول يبدأ الحول من جديد." },
    { q: "هل أزكي الأرباح غير المحققة؟", a: "نعم، تُزكى القيمة السوقية كاملةً لما تملكه عند تمام الحول، سواء بعت أم لم تبع." },
    { q: "ما نسبة زكاة الكريبتو؟", a: "2.5% من إجمالي قيمة ما تملكه من عملات رقمية، وهي نفس نسبة زكاة الأموال والتجارة." },
  ] : [
    { q: "Is Zakat due on Bitcoin?", a: "Yes, most contemporary scholars agree Zakat is due if Bitcoin's value reaches the nisab (85g gold) and is held for a full lunar year." },
    { q: "Is Zakat due on BNB and SOL?", a: "Yes, all cryptocurrencies with market value follow the same zakat ruling — if your total holdings reach the nisab and a lunar year passes, zakat is due at 2.5%." },
    { q: "Is Zakat due on USDT stablecoins?", a: "Yes, stablecoins (USDT, USDC) are treated like cash and are subject to the same 2.5% Zakat." },
    { q: "Is the hawl (one year) required for crypto Zakat?", a: "Yes, a full lunar year (354 days) must pass while owning the nisab. If the value drops below nisab during the year, the year count restarts." },
    { q: "Do I pay Zakat on unrealized gains?", a: "Yes, Zakat is calculated on the full market value of your holdings at the end of the lunar year, whether sold or not." },
    { q: "What is the Zakat rate for crypto?", a: "2.5% (one quarter of one-tenth) of the total market value of your cryptocurrency holdings." },
  ];

  // coin fields config
  const coinFields = [
    { id: "btc", label: ar ? "بيتكوين (BTC)" : "Bitcoin (BTC)", symbol: "₿", color: "#F7931A", price: prices.btc, value: btc, setter: setBtc, step: "0.00001" },
    { id: "eth", label: ar ? "إيثيريوم (ETH)" : "Ethereum (ETH)", symbol: "⟠", color: "#627EEA", price: prices.eth, value: eth, setter: setEth, step: "0.0001" },
    { id: "bnb", label: ar ? "بينانس كوين (BNB)" : "BNB", symbol: "🔶", color: "#F3BA2F", price: prices.bnb, value: bnb, setter: setBnb, step: "0.001" },
    { id: "sol", label: ar ? "سولانا (SOL)" : "Solana (SOL)", symbol: "◎", color: "#9945FF", price: prices.sol, value: sol, setter: setSol, step: "0.01" },
  ];

  return (
    <div dir={dir} className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-text-secondary text-sm mb-6 flex-wrap">
        <Link href="/" className="hover:text-gold transition-colors">{ar ? "الرئيسية" : "Home"}</Link>
        <span>/</span>
        <Link href="/حاسبة-الذهب" className="hover:text-gold transition-colors">{ar ? "الحاسبة" : "Calculator"}</Link>
        <span>/</span>
        <span className="text-text-primary">{ar ? "زكاة الكريبتو" : "Crypto Zakat"}</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">₿⚖️</div>
        <h1 className="text-3xl sm:text-4xl font-black text-text-primary mb-3">
          {ar ? "حاسبة زكاة العملات الرقمية" : "Crypto Zakat Calculator"}
        </h1>
        <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
          {ar
            ? "احسب زكاة البيتكوين والإيثيريوم وBNB وSOL والعملات الرقمية — نصاب لحظي، آراء العلماء، نتائج فورية بعملتك."
            : "Calculate Zakat on Bitcoin, Ethereum, BNB, SOL & all your crypto — live nisab, scholarly opinions, instant results in your currency."}
        </p>
      </div>

      {/* Live Prices Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: ar ? "نصاب الذهب" : "Gold Nisab", value: `$${fmt(prices.nisabUSD, 0)}`, sub: ar ? "85 جرام ذهب" : "85g gold", color: "text-gold" },
          { label: "Bitcoin", value: `$${fmt(prices.btc, 0)}`, sub: `${nisabInBtc.toFixed(4)} BTC`, color: "text-[#F7931A]" },
          { label: "Ethereum", value: `$${fmt(prices.eth, 0)}`, sub: `${nisabInEth.toFixed(3)} ETH`, color: "text-[#627EEA]" },
          { label: "BNB", value: `$${fmt(prices.bnb, 0)}`, sub: `${(prices.nisabUSD / prices.bnb).toFixed(2)} BNB`, color: "text-[#F3BA2F]" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-surface border border-border rounded-2xl p-3 sm:p-4 text-center">
            <p className="text-text-secondary text-xs mb-1">{label}</p>
            <p className={`font-black text-lg sm:text-xl ${color}`}>{loading ? "..." : value}</p>
            <p className="text-text-secondary text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <AdSlot size="leaderboard" slot="9876543210" className="mb-6" />
      <AdSlot size="mobile-banner" slot="9876543211" className="mb-6" />

      {/* Calculator */}
      <div className="bg-surface border border-border rounded-3xl p-5 sm:p-8 mb-6">
        <h2 className="text-xl font-black text-text-primary mb-5">
          🧮 {ar ? "أدخل ما تملكه من عملات رقمية" : "Enter Your Crypto Holdings"}
        </h2>

        {/* Coin fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {coinFields.map(({ id, label, symbol, color, price, value, setter, step }) => (
            <div key={id}>
              <label className="block text-text-secondary text-sm mb-1.5">
                <span style={{ color }}>{symbol}</span> {label}
              </label>
              <input
                type="number" min="0" step={step}
                placeholder="0.00"
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-text-primary"
              />
              {value && (
                <p className="text-text-secondary text-xs mt-1">
                  ≈ ${fmt((parseFloat(value) || 0) * price, 0)}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* USDT + Other row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">
              💵 {ar ? "USDT / USDC (بالدولار)" : "USDT / USDC (USD value)"}
            </label>
            <input
              type="number" min="0"
              placeholder="0.00"
              value={usdt}
              onChange={(e) => setUsdt(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-text-primary"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">
              🪙 {ar ? "عملات أخرى (قيمتها بالدولار)" : "Other Coins (USD value)"}
            </label>
            <input
              type="number" min="0"
              placeholder="0.00"
              value={other}
              onChange={(e) => setOther(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-text-primary"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-gold text-background font-black py-4 rounded-xl hover:bg-gold-light transition-colors text-lg"
        >
          {ar ? "احسب الزكاة" : "Calculate Zakat"}
        </button>

        {/* Results */}
        {result && (
          <div className={`mt-6 rounded-2xl p-5 border ${result.meetsNisab ? "bg-rise/5 border-rise/30" : "bg-fall/5 border-fall/30"}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{result.meetsNisab ? "✅" : "⏳"}</span>
              <h3 className="font-black text-lg text-text-primary">
                {result.meetsNisab
                  ? (ar ? "تجب عليك الزكاة" : "Zakat is Due")
                  : (ar ? "لم تبلغ النصاب بعد" : "Below Nisab — No Zakat Yet")}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface rounded-xl p-3 text-center">
                <p className="text-text-secondary text-xs mb-1">{ar ? "إجمالي ما تملكه" : "Total Holdings"}</p>
                <p className="font-black text-xl text-text-primary">${fmt(result.total, 0)}</p>
                <p className="text-text-secondary text-xs">{fmtLocal(result.total)}</p>
              </div>
              <div className="bg-surface rounded-xl p-3 text-center">
                <p className="text-text-secondary text-xs mb-1">{ar ? "النصاب المطلوب" : "Required Nisab"}</p>
                <p className="font-black text-xl text-gold">${fmt(result.nisabUSD, 0)}</p>
                <p className="text-text-secondary text-xs">{fmtLocal(result.nisabUSD)}</p>
              </div>

              {result.meetsNisab ? (
                <div className="col-span-2 bg-rise/10 border border-rise/30 rounded-xl p-4 text-center">
                  <p className="text-text-secondary text-sm mb-1">{ar ? "الزكاة الواجبة (2.5%)" : "Zakat Due (2.5%)"}</p>
                  <p className="font-black text-3xl text-rise">${fmt(result.zakat)}</p>
                  <p className="text-rise font-bold text-sm mt-1">{fmtLocal(result.zakat)}</p>
                </div>
              ) : (
                <div className="col-span-2 bg-surface rounded-xl p-4 text-center">
                  <p className="text-text-secondary text-sm mb-1">{ar ? "تحتاج للوصول للنصاب" : "Still Need"}</p>
                  <p className="font-black text-2xl text-fall">${fmt(result.short, 0)}</p>
                  <p className="text-text-secondary text-xs mt-1">
                    {ar ? "إذا بلغت هذا المبلغ وحال الحول وجبت الزكاة" : "Reach this amount and hold for one lunar year for Zakat to apply"}
                  </p>
                </div>
              )}
            </div>

            {result.meetsNisab && (
              <p className="text-text-secondary text-xs text-center mb-4">
                {ar
                  ? "* بشرط مرور الحول الهجري (354 يوماً) وأن تبقى قيمتك فوق النصاب"
                  : "* Provided a full lunar year (354 days) has passed and your value stays above nisab"}
              </p>
            )}

            {/* Share Buttons */}
            <div className="border-t border-border pt-4">
              <p className="text-text-secondary text-xs text-center mb-3">
                {ar ? "📤 شارك النتيجة" : "📤 Share Result"}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={shareWhatsApp}
                  className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  واتساب
                </button>
                <button
                  onClick={shareTelegram}
                  className="flex items-center gap-2 bg-[#0088CC] text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  تيليجرام
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nisab Explanation */}
      <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5 mb-6">
        <h2 className="font-black text-text-primary text-lg mb-3">
          ⚖️ {ar ? "كيف يُحسب النصاب؟" : "How is Nisab Calculated?"}
        </h2>
        <div className="space-y-2 text-sm text-text-secondary">
          <p>
            {ar
              ? `النصاب = 85 جرام من الذهب عيار 24 × سعر الجرام ($${fmt(prices.goldPerGram)}) = $${fmt(prices.nisabUSD, 0)}`
              : `Nisab = 85g of 24K gold × price per gram ($${fmt(prices.goldPerGram)}) = $${fmt(prices.nisabUSD, 0)}`}
          </p>
          <p>
            {ar
              ? `أي ما يعادل ${nisabInBtc.toFixed(5)} BTC أو ${nisabInEth.toFixed(4)} ETH بالأسعار الحالية.`
              : `That's equivalent to ${nisabInBtc.toFixed(5)} BTC or ${nisabInEth.toFixed(4)} ETH at current prices.`}
          </p>
          <p className="text-gold text-xs">
            {ar ? "* النصاب يتغير يومياً مع تغير سعر الذهب." : "* Nisab changes daily with the gold price."}
          </p>
        </div>
      </div>

      {/* Scholarly Opinions */}
      <div className="mb-6">
        <h2 className="font-black text-text-primary text-xl mb-4">
          📚 {ar ? "آراء العلماء في زكاة الكريبتو" : "Scholarly Opinions on Crypto Zakat"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {scholars.map(({ icon, title, text }) => (
            <div key={title} className="bg-surface border border-border rounded-2xl p-4">
              <div className="text-2xl mb-2">{icon}</div>
              <h3 className="font-bold text-text-primary text-sm mb-2">{title}</h3>
              <p className="text-text-secondary text-xs leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <AdSlot size="rectangle" slot="9876543212" className="mb-6" />

      {/* FAQ */}
      <div className="mb-6">
        <h2 className="font-black text-text-primary text-xl mb-4">
          ❓ {ar ? "أسئلة شائعة عن زكاة الكريبتو" : "Crypto Zakat FAQ"}
        </h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q} className="bg-surface border border-border rounded-2xl group">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-bold text-text-primary text-sm hover:text-gold transition-colors">
                {q}
                <span className="text-gold text-lg group-open:rotate-45 transition-transform duration-200 shrink-0 ms-2">+</span>
              </summary>
              <div className="px-4 pb-4 text-text-secondary text-sm leading-relaxed border-t border-border pt-3">
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Article CTA */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <p className="text-text-secondary text-sm">
          📖{" "}
          {ar
            ? "اقرأ مقالنا الشامل عن زكاة الكريبتو — أحكامها الفقهية التفصيلية وآراء العلماء:"
            : "Read our comprehensive article on Crypto Zakat — detailed rulings and scholarly opinions:"}
        </p>
        <Link
          href="/مقالات/زكاة-الكريبتو"
          className="inline-flex items-center gap-2 mt-2 text-gold font-bold text-sm hover:underline"
        >
          ₿ {ar ? "مقال زكاة العملات الرقمية ←" : "Crypto Zakat Article →"}
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="bg-surface-2 border border-border rounded-2xl p-4 text-xs text-text-secondary text-center mb-6">
        {ar
          ? "⚠️ هذه الحاسبة للإرشاد فقط. استشر عالماً أو مفتياً معتمداً للفتوى الشخصية. الأسعار من CoinGecko وGoldAPI وقد تختلف."
          : "⚠️ This calculator is for guidance only. Consult a qualified Islamic scholar for a personal fatwa. Prices sourced from CoinGecko & GoldAPI and may vary."}
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/حاسبة-الذهب" className="flex items-center justify-center gap-2 bg-gold text-background font-bold py-3.5 rounded-xl hover:bg-gold-light transition-colors">
          🥇 {ar ? "زكاة الذهب والمال" : "Gold & Cash Zakat"}
        </Link>
        <Link href="/اسعار" className="flex items-center justify-center gap-2 border border-border text-text-secondary hover:text-text-primary font-bold py-3.5 rounded-xl transition-colors">
          📊 {ar ? "أسعار الكريبتو الآن" : "Live Crypto Prices"}
        </Link>
      </div>
    </div>
  );
}
