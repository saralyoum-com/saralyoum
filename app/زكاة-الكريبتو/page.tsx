"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLocation } from "@/components/LocalCurrency";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";
import AdSlot from "@/components/AdSlot";

// ── Constants ──────────────────────────────────────────────────────────────
const NISAB_GOLD_GRAMS = 85;   // 85g of 24K gold
const OZ_TO_GRAM = 31.1035;
const ZAKAT_RATE = 0.025;

interface Prices {
  goldPerGram: number;   // USD
  btcPrice: number;      // USD
  ethPrice: number;      // USD
  nisabUSD: number;      // USD
}

const FALLBACK: Prices = {
  goldPerGram: 154.0,
  btcPrice: 84000,
  ethPrice: 2600,
  nisabUSD: 154.0 * NISAB_GOLD_GRAMS,
};

// ── Component ──────────────────────────────────────────────────────────────
export default function CryptoZakatPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const dir = ar ? "rtl" : "ltr";
  const loc = useLocation();

  const [prices, setPrices] = useState<Prices>(FALLBACK);
  const [loading, setLoading] = useState(true);

  // holdings inputs
  const [btc, setBtc] = useState("");
  const [eth, setEth] = useState("");
  const [other, setOther] = useState(""); // USD value of other coins
  const [cash, setCash] = useState("");   // USD cash / stablecoins

  // results
  const [result, setResult] = useState<{
    total: number;
    meetsNisab: boolean;
    zakat: number;
    zakatLocal: number;
    nisabUSD: number;
    short: number; // how much more needed to reach nisab
  } | null>(null);

  // ── Fetch live prices ────────────────────────────────────────────────────
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
        const btcPrice = crypto?.bitcoin?.price ?? FALLBACK.btcPrice;
        const ethPrice = crypto?.ethereum?.price ?? FALLBACK.ethPrice;

        setPrices({
          goldPerGram,
          btcPrice,
          ethPrice,
          nisabUSD: goldPerGram * NISAB_GOLD_GRAMS,
        });
      } catch {
        // use fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Calculate ────────────────────────────────────────────────────────────
  const calculate = useCallback(() => {
    const btcVal   = (parseFloat(btc)   || 0) * prices.btcPrice;
    const ethVal   = (parseFloat(eth)   || 0) * prices.ethPrice;
    const otherVal =  parseFloat(other) || 0;
    const cashVal  =  parseFloat(cash)  || 0;

    const total = btcVal + ethVal + otherVal + cashVal;
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
  }, [btc, eth, other, cash, prices, loc.rate]);

  const fmt = (n: number, decimals = 2) =>
    n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const fmtLocal = (usd: number) => {
    const val = usd * loc.rate;
    const d = loc.rate > 100 ? 0 : 2;
    return `${val.toLocaleString("en-US", { maximumFractionDigits: d })} ${loc.currency}`;
  };

  // how many BTC / ETH = nisab
  const nisabInBtc = prices.nisabUSD / prices.btcPrice;
  const nisabInEth = prices.nisabUSD / prices.ethPrice;

  // ── scholars data ────────────────────────────────────────────────────────
  const scholars = ar ? [
    { icon: "🕌", title: "هيئة كبار العلماء (السعودية)", text: "العملات الرقمية أموال لها قيمة مالية وتجب فيها الزكاة كعروض التجارة بنسبة 2.5% إذا بلغت النصاب وحال عليها الحول." },
    { icon: "📜", title: "المجمع الفقهي الإسلامي الدولي", text: "العملات الرقمية يجري عليها حكم عروض التجارة؛ وتزكَّى بتقويم قيمتها السوقية في نهاية كل حول بنسبة ربع العشر (2.5%)." },
    { icon: "🎓", title: "رأي بعض العلماء المعاصرين", text: "من يتاجر في الكريبتو يومياً يزكيه زكاة عروض التجارة. أما الممسك للتخزين فيزكي قيمته رأس الحول إذا بلغ النصاب." },
  ] : [
    { icon: "🕌", title: "Council of Senior Scholars (Saudi Arabia)", text: "Cryptocurrencies are financial assets and are subject to zakat at 2.5% as trade goods, provided they reach the nisab and a full lunar year has passed." },
    { icon: "📜", title: "International Islamic Fiqh Academy", text: "Cryptocurrencies follow the ruling of trade goods; zakat is due at 2.5% of their market value at the end of each lunar year." },
    { icon: "🎓", title: "Contemporary Scholars' View", text: "Active traders pay zakat as trade goods. Long-term holders pay 2.5% of market value at the end of the lunar year if they meet the nisab threshold." },
  ];

  // ── FAQs ─────────────────────────────────────────────────────────────────
  const faqs = ar ? [
    { q: "هل تجب الزكاة على البيتكوين؟", a: "نعم، جمهور العلماء المعاصرين على وجوبها إذا بلغت قيمته النصاب (85 جرام ذهب) وحال عليه الحول." },
    { q: "هل يُشترط الحول لزكاة الكريبتو؟", a: "نعم، يجب مرور سنة هجرية كاملة (354 يوماً) على ملك النصاب. إذا انخفضت القيمة عن النصاب خلال الحول يبدأ الحول من جديد." },
    { q: "هل أزكي الأرباح غير المحققة؟", a: "نعم، تُزكى القيمة السوقية كاملةً لما تملكه عند تمام الحول، سواء بعت أم لم تبع." },
    { q: "ما نسبة زكاة الكريبتو؟", a: "2.5% من إجمالي قيمة ما تملكه من عملات رقمية (ربع العشر)، وهي نفس نسبة زكاة الأموال والتجارة." },
    { q: "هل تجب الزكاة على الستيبل كوين؟", a: "نعم، الستيبل كوين (USDT, USDC) تُعامل معاملة النقد وتجب فيها الزكاة كالأموال." },
    { q: "ما حكم زكاة الإيثيريوم؟", a: "نفس حكم البيتكوين — تجب فيه الزكاة بنسبة 2.5% إذا بلغت قيمته النصاب عند تمام الحول." },
  ] : [
    { q: "Is Zakat due on Bitcoin?", a: "Yes, most contemporary scholars agree Zakat is due if Bitcoin's value reaches the nisab (85g gold) and is held for a full lunar year." },
    { q: "Is the hawl (one year) required for crypto Zakat?", a: "Yes, a full lunar year (354 days) must pass while owning the nisab. If the value drops below nisab during the year, the year count restarts." },
    { q: "Do I pay Zakat on unrealized gains?", a: "Yes, Zakat is calculated on the full market value of your holdings at the end of the lunar year, whether sold or not." },
    { q: "What is the Zakat rate for crypto?", a: "2.5% (one quarter of one-tenth) of the total market value of your cryptocurrency holdings." },
    { q: "Is Zakat due on stablecoins?", a: "Yes, stablecoins (USDT, USDC) are treated like cash and are subject to the same 2.5% Zakat." },
    { q: "What about Ethereum Zakat?", a: "Same ruling as Bitcoin — Zakat is due at 2.5% if the value reaches the nisab at the end of the lunar year." },
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
        <div className="text-5xl mb-3">₿🤲</div>
        <h1 className="text-3xl sm:text-4xl font-black text-text-primary mb-3">
          {ar ? "حاسبة زكاة الكريبتو" : "Crypto Zakat Calculator"}
        </h1>
        <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
          {ar
            ? "احسب زكاة البيتكوين والإيثيريوم وكل عملاتك الرقمية — نصاب لحظي، آراء العلماء، نتائج فورية بعملتك."
            : "Calculate Zakat on Bitcoin, Ethereum & all your crypto — live nisab, scholarly opinions, instant results in your currency."}
        </p>
      </div>

      {/* Live Prices Strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: ar ? "نصاب الذهب" : "Gold Nisab", value: `$${fmt(prices.nisabUSD, 0)}`, sub: ar ? "85 جرام ذهب" : "85g gold", color: "text-gold" },
          { label: "Bitcoin", value: `$${fmt(prices.btcPrice, 0)}`, sub: `${nisabInBtc.toFixed(4)} BTC = نصاب`, color: "text-[#F7931A]" },
          { label: "Ethereum", value: `$${fmt(prices.ethPrice, 0)}`, sub: `${nisabInEth.toFixed(3)} ETH = نصاب`, color: "text-[#627EEA]" },
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* BTC */}
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">
              <span className="text-[#F7931A]">₿</span> {ar ? "البيتكوين (BTC)" : "Bitcoin (BTC)"}
            </label>
            <input
              type="number" min="0" step="0.00001"
              placeholder="0.00"
              value={btc}
              onChange={(e) => setBtc(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-text-primary"
            />
            {btc && (
              <p className="text-text-secondary text-xs mt-1">
                ≈ ${fmt((parseFloat(btc) || 0) * prices.btcPrice, 0)}
              </p>
            )}
          </div>

          {/* ETH */}
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">
              <span className="text-[#627EEA]">⟠</span> {ar ? "الإيثيريوم (ETH)" : "Ethereum (ETH)"}
            </label>
            <input
              type="number" min="0" step="0.0001"
              placeholder="0.00"
              value={eth}
              onChange={(e) => setEth(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-text-primary"
            />
            {eth && (
              <p className="text-text-secondary text-xs mt-1">
                ≈ ${fmt((parseFloat(eth) || 0) * prices.ethPrice, 0)}
              </p>
            )}
          </div>

          {/* Other */}
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

          {/* Cash / Stablecoins */}
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">
              💵 {ar ? "نقد وستيبل كوين (USDT/USDC بالدولار)" : "Cash & Stablecoins (USD)"}
            </label>
            <input
              type="number" min="0"
              placeholder="0.00"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
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

            <div className="grid grid-cols-2 gap-3">
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
              <p className="text-text-secondary text-xs mt-3 text-center">
                {ar
                  ? "* بشرط مرور الحول الهجري (354 يوماً) وأن تبقى قيمتك فوق النصاب"
                  : "* Provided a full lunar year (354 days) has passed and your value stays above nisab"}
              </p>
            )}
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
              ? `النصاب = 85 جرام من الذهب عيار 24 × سعر الجرام الحالي ($${fmt(prices.goldPerGram)}) = $${fmt(prices.nisabUSD, 0)}`
              : `Nisab = 85g of 24K gold × current price per gram ($${fmt(prices.goldPerGram)}) = $${fmt(prices.nisabUSD, 0)}`}
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

      {/* FAQ — SEO section */}
      <div className="mb-6">
        <h2 className="font-black text-text-primary text-xl mb-4">
          ❓ {ar ? "أسئلة شائعة عن زكاة الكريبتو" : "Crypto Zakat FAQ"}
        </h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q} className="bg-surface border border-border rounded-2xl group">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-bold text-text-primary text-sm hover:text-gold transition-colors">
                {q}
                <span className="text-gold text-lg group-open:rotate-45 transition-transform duration-200 shrink-0 ml-2">+</span>
              </summary>
              <div className="px-4 pb-4 text-text-secondary text-sm leading-relaxed border-t border-border mt-0 pt-3">
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-surface-2 border border-border rounded-2xl p-4 text-xs text-text-secondary text-center mb-6">
        {ar
          ? "⚠️ هذه الحاسبة للإرشاد فقط. استشر عالماً أو مفتياً معتمداً للفتوى الشخصية. الأسعار من المصادر العالمية وقد تختلف."
          : "⚠️ This calculator is for guidance only. Consult a qualified Islamic scholar for a personal fatwa. Prices are from global sources and may vary."}
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
