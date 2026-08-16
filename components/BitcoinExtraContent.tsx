"use client";

import { useLang } from "@/components/LanguageContext";

interface Props {
  priceUSD: number;
}

const RATES_FALLBACK = {
  SAR: 3.75,
  AED: 3.6725,
  KWD: 0.3075,
  QAR: 3.64,
  EGP: 54.41,
  OMR: 0.385,
  BHD: 0.377,
  JOD: 0.709,
};

const CURRENCIES = [
  { code: "SAR", symbolAr: "ريال سعودي", nameEn: "Saudi Riyal", flag: "🇸🇦" },
  { code: "AED", symbolAr: "درهم إماراتي", nameEn: "UAE Dirham", flag: "🇦🇪" },
  { code: "KWD", symbolAr: "دينار كويتي", nameEn: "Kuwaiti Dinar", flag: "🇰🇼" },
  { code: "QAR", symbolAr: "ريال قطري", nameEn: "Qatari Riyal", flag: "🇶🇦" },
  { code: "EGP", symbolAr: "جنيه مصري", nameEn: "Egyptian Pound", flag: "🇪🇬" },
  { code: "OMR", symbolAr: "ريال عُماني", nameEn: "Omani Rial", flag: "🇴🇲" },
  { code: "BHD", symbolAr: "دينار بحريني", nameEn: "Bahraini Dinar", flag: "🇧🇭" },
  { code: "JOD", symbolAr: "دينار أردني", nameEn: "Jordanian Dinar", flag: "🇯🇴" },
] as const;

export default function BitcoinExtraContent({ priceUSD }: Props) {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const fmt = (n: number, dec = 0) => n.toLocaleString("en-US", { maximumFractionDigits: dec });

  /* JSON-LD FAQ schema for rich snippets */
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "كم سعر البيتكوين اليوم بالريال السعودي؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: `سعر البيتكوين اليوم بالريال السعودي ${fmt(priceUSD * RATES_FALLBACK.SAR)} ريال سعودي تقريباً. السعر يتحدث كل 5 دقائق من المصادر العالمية الرسمية.`,
        },
      },
      {
        "@type": "Question",
        name: "كم سعر البيتكوين بالدرهم الإماراتي؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: `سعر البيتكوين اليوم يعادل تقريباً ${fmt(priceUSD * RATES_FALLBACK.AED)} درهم إماراتي. الأسعار محدّثة لحظياً من سوق العملات الرقمية العالمي.`,
        },
      },
      {
        "@type": "Question",
        name: "كيف يُحسب سعر البيتكوين بالعملات العربية؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "يُحسب سعر البيتكوين بالعملات العربية من خلال ضرب السعر العالمي بالدولار الأمريكي بسعر صرف العملة العربية. مثلاً لو كان سعر البيتكوين 100,000 دولار وسعر الدولار 3.75 ريال سعودي، فإن سعر البيتكوين بالريال = 100,000 × 3.75 = 375,000 ريال.",
        },
      },
      {
        "@type": "Question",
        name: "هل البيتكوين حلال أم حرام؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "اختلف العلماء المسلمون في حكم البيتكوين، حيث رأى بعضهم جوازه باعتباره وسيلة دفع كأي عملة أخرى، بينما حرّمه آخرون لعدم استناده على أصل مادي. في الإمارات والبحرين تم تنظيم تداول البيتكوين بضوابط شرعية. يُنصح بمراجعة دار الإفتاء في بلدك للحصول على رأي فقهي محدد.",
        },
      },
      {
        "@type": "Question",
        name: "كيف أشتري البيتكوين بالريال السعودي؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "لشراء البيتكوين بالريال السعودي، يمكنك استخدام منصات تداول معتمدة مثل Binance, Rain.bh (للخليج), Bybit. اربط حسابك البنكي السعودي، حوّل المبلغ بالريال، واشترِ البيتكوين مباشرة. تأكد من التحقق من الهوية (KYC) قبل البدء.",
        },
      },
      {
        "@type": "Question",
        name: "ما هو أقل مبلغ لشراء البيتكوين؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "يمكنك شراء كسور صغيرة جداً من البيتكوين تُسمّى Satoshi (1 بيتكوين = 100 مليون ساتوشي). في معظم المنصات، الحد الأدنى للشراء يبدأ من 10-50 ريال سعودي تقريباً. لست مضطراً لشراء بيتكوين كامل.",
        },
      },
    ],
  };

  return (
    <section dir={dir} className="max-w-4xl mx-auto px-3 sm:px-4 pb-10 sm:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-8">
        {/* SSR-visible price summary in Arabic */}
        <div className="sr-only">
          <h2>سعر البيتكوين اليوم بالريال السعودي والدرهم الإماراتي والدينار الكويتي</h2>
          <p>
            سعر البيتكوين اليوم بالدولار الأمريكي {fmt(priceUSD, 2)} دولار.
            بالريال السعودي {fmt(priceUSD * RATES_FALLBACK.SAR)} ريال.
            بالدرهم الإماراتي {fmt(priceUSD * RATES_FALLBACK.AED)} درهم.
            بالدينار الكويتي {fmt(priceUSD * RATES_FALLBACK.KWD, 2)} دينار.
            بالجنيه المصري {fmt(priceUSD * RATES_FALLBACK.EGP)} جنيه.
          </p>
        </div>

        {/* H2: Bitcoin vs Riyal — direct query match */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
            {lang === "ar"
              ? "البيتكوين مقابل الريال السعودي اليوم"
              : "Bitcoin vs Saudi Riyal Today"}
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-3">
            {lang === "ar"
              ? `سعر البيتكوين اليوم بالريال السعودي ${fmt(priceUSD * RATES_FALLBACK.SAR)} ريال تقريباً. تتحدّث الأسعار لحظياً مع تقلبات سوق العملات الرقمية العالمي، ويُعدّ الريال السعودي من العملات المستقرة المربوطة بالدولار الأمريكي بسعر صرف ثابت (3.75 ريال للدولار)، مما يجعل سعر البيتكوين بالريال يعكس مباشرة الحركة العالمية بدون تأثير محلي.`
              : `Today's Bitcoin price in Saudi Riyal is approximately SAR ${fmt(priceUSD * RATES_FALLBACK.SAR)}. Prices update by the moment with global crypto market fluctuations. The Saudi Riyal is among stable currencies pegged to USD at fixed rate (3.75 SAR/USD), making Bitcoin's SAR price directly reflect global movements without local impact.`}
          </p>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            {lang === "ar"
              ? "البيتكوين أصبح من أكثر الأصول الرقمية تداولاً في السوق السعودي، خاصةً بعد إعلان البنك المركزي السعودي (ساما) في 2024 عن خطط لإصدار الريال الرقمي. كما يتزايد إقبال المستثمرين السعوديين على البيتكوين كأداة للتنويع وحفظ القيمة."
              : "Bitcoin has become one of the most traded digital assets in the Saudi market, especially after SAMA's 2024 announcement of plans to issue a digital Riyal. Saudi investor interest in Bitcoin as a diversification and value preservation tool continues to grow."}
          </p>
        </section>

        {/* Live Conversion Table */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
            {lang === "ar"
              ? "سعر البيتكوين بالعملات العربية اليوم"
              : "Bitcoin Price in Arab Currencies Today"}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            {lang === "ar"
              ? "جدول تحويل بيتكوين واحد إلى أهم العملات العربية، محدّث بناءً على أسعار الصرف الحالية:"
              : "Conversion table of 1 Bitcoin to major Arab currencies, updated based on current exchange rates:"}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden min-w-[360px]">
              <thead className="bg-surface-2">
                <tr>
                  <th className="text-start p-3 text-text-secondary font-medium">
                    {lang === "ar" ? "العملة" : "Currency"}
                  </th>
                  <th className="text-start p-3 text-text-secondary font-medium">
                    {lang === "ar" ? "1 بيتكوين =" : "1 Bitcoin ="}
                  </th>
                  <th className="text-start p-3 text-text-secondary font-medium hidden sm:table-cell">
                    {lang === "ar" ? "0.01 بيتكوين =" : "0.01 BTC ="}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CURRENCIES.map((c) => {
                  const rate = RATES_FALLBACK[c.code as keyof typeof RATES_FALLBACK];
                  const value1 = priceUSD * rate;
                  const value01 = value1 * 0.01;
                  const dec = rate < 1 ? 2 : 0;
                  return (
                    <tr key={c.code} className="border-t border-border">
                      <td className="p-3 text-text-primary">
                        <span className="me-2">{c.flag}</span>
                        {lang === "ar" ? c.symbolAr : c.nameEn}
                      </td>
                      <td className="p-3 text-gold font-bold">
                        {fmt(value1, dec)} {c.code}
                      </td>
                      <td className="p-3 text-text-secondary hidden sm:table-cell">
                        {fmt(value01, 2)} {c.code}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs mt-3 italic">
            {lang === "ar"
              ? "* الأسعار تقريبية، تتحدّث كل 5 دقائق من المصادر العالمية الرسمية"
              : "* Prices are approximate, updated every 5 minutes from official global sources"}
          </p>
        </section>

        {/* Amount conversions. The table above answers "what is 1 BTC worth" —
            this answers "what is MY amount worth", which is what searchers
            actually ask ("واحد بتكوين كم يساوي ريال", "1 بيتكوين كم ريال
            سعودي", "100 بيتكوين كم ريال سعودي", "تحويل بيتكوين الى ريال"). */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
            {lang === "ar"
              ? "كم يساوي البيتكوين بالريال السعودي؟"
              : "How Much Is Bitcoin Worth in Saudi Riyals?"}
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4">
            {lang === "ar"
              ? "يتساءل كثيرون عن قيمة كمية معينة من البيتكوين (أو البتكوين) بالريال السعودي. الجدول التالي يوضّح قيمة أشهر الكميات المتداولة بأسعار اليوم:"
              : "A common question is what a specific amount of Bitcoin is worth in Saudi Riyals. The table below shows the most commonly traded amounts at today's prices:"}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden min-w-[360px]">
              <thead>
                <tr className="bg-surface-2">
                  <th className="text-start text-gold font-bold p-2.5 border border-border">
                    {lang === "ar" ? "الكمية" : "Amount"}
                  </th>
                  <th className="text-end text-gold font-bold p-2.5 border border-border">
                    {lang === "ar" ? "ريال سعودي" : "Saudi Riyal"}
                  </th>
                  <th className="text-end text-gold font-bold p-2.5 border border-border">
                    {lang === "ar" ? "درهم إماراتي" : "UAE Dirham"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[0.001, 0.01, 0.1, 0.5, 1, 10, 100].map((amt) => {
                  const isOne = amt === 1;
                  return (
                    <tr key={amt} className={isOne ? "bg-gold/5" : ""}>
                      <td className={`p-2.5 border border-border ${isOne ? "text-gold font-bold" : "text-text-primary"}`}>
                        {amt} {lang === "ar" ? "بيتكوين" : "BTC"}
                      </td>
                      <td className={`p-2.5 border border-border text-end tabular-nums ${isOne ? "text-gold font-bold" : "text-text-primary"}`}>
                        {fmt(priceUSD * RATES_FALLBACK.SAR * amt)}
                      </td>
                      <td className={`p-2.5 border border-border text-end tabular-nums ${isOne ? "text-gold font-bold" : "text-text-secondary"}`}>
                        {fmt(priceUSD * RATES_FALLBACK.AED * amt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mt-3">
            {lang === "ar"
              ? "لتحويل أي كمية أخرى: اضرب عدد البيتكوين في سعر البيتكوين الحالي بالريال. الأسعار تتغيّر لحظيا مع السوق العالمي."
              : "To convert any other amount, multiply the number of Bitcoin by the current BTC price in your currency. Prices change continuously with the global market."}
          </p>
        </section>

        {/* How to buy section */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
            {lang === "ar"
              ? "كيف أشتري البيتكوين بالريال السعودي والدرهم الإماراتي؟"
              : "How to Buy Bitcoin with SAR and AED?"}
          </h2>
          <ul className="space-y-2 text-text-secondary text-sm sm:text-base leading-relaxed list-disc pr-5 mb-3">
            <li>
              {lang === "ar"
                ? "اختر منصة تداول موثوقة ومرخّصة مثل Binance أو Rain.bh أو Bybit أو CoinMENA."
                : "Choose a trusted licensed exchange like Binance, Rain.bh, Bybit, or CoinMENA."}
            </li>
            <li>
              {lang === "ar"
                ? "قم بإنشاء حساب وأكمل عملية التحقق من الهوية (KYC) — تتطلب صورة بطاقة الهوية وصورة شخصية."
                : "Create account and complete identity verification (KYC) — requires ID and selfie."}
            </li>
            <li>
              {lang === "ar"
                ? "اربط حسابك البنكي أو بطاقة الائتمان السعودية أو الإماراتية بالمنصة."
                : "Link your Saudi or Emirati bank account or credit card to the platform."}
            </li>
            <li>
              {lang === "ar"
                ? "حوّل المبلغ بالريال أو الدرهم — أقل مبلغ يبدأ عادة من 50 ريال (تقريباً 13 دولار)."
                : "Transfer amount in SAR or AED — minimum usually starts at SAR 50 (~$13)."}
            </li>
            <li>
              {lang === "ar"
                ? "اشترِ البيتكوين مباشرة أو ضع أمر شراء بسعر محدد، ثم احفظ العملات في محفظتك الشخصية."
                : "Buy Bitcoin directly or place a limit order at a specific price, then store coins in your personal wallet."}
            </li>
            <li>
              {lang === "ar"
                ? "تذكّر: استثمر فقط المبلغ الذي تستطيع تحمّل خسارته، فالبيتكوين عالي التقلبات."
                : "Remember: only invest what you can afford to lose — Bitcoin is highly volatile."}
            </li>
          </ul>
        </section>

        {/* Bitcoin vs other arab currencies */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
            {lang === "ar"
              ? "تقلبات البيتكوين والعملات الرقمية الكبرى"
              : "Bitcoin & Major Crypto Volatility"}
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-3">
            {lang === "ar"
              ? "يتميّز البيتكوين بتقلبات سعرية حادة قد تصل إلى 5-10% في اليوم الواحد، مما يجعله أصلاً عالي المخاطر وعالي العائد في نفس الوقت. خلال السنوات الأخيرة، شهد البيتكوين قفزات تاريخية: من 30,000 دولار في 2023 إلى أكثر من 100,000 دولار في 2025، ثم استمر في الصعود مع تبنّي الدول والبنوك المركزية للعملات الرقمية."
              : "Bitcoin features sharp price volatility reaching 5-10% in a single day, making it a high-risk, high-return asset. In recent years, Bitcoin saw historic jumps: from $30,000 in 2023 to over $100,000 in 2025, continuing to rise as nations and central banks adopt digital currencies."}
          </p>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            {lang === "ar"
              ? "في السوق السعودي والخليجي، يتزايد الاهتمام بالبيتكوين كأداة استثمار بديلة عن الذهب التقليدي. كما أن منصات مثل Binance قدّمت خدمات الدفع بالريال السعودي والدرهم الإماراتي بشكل مباشر، مما سهّل عملية الشراء على المستثمرين العرب."
              : "In Saudi and Gulf markets, interest in Bitcoin as an alternative investment to traditional gold continues to grow. Platforms like Binance offer direct SAR and AED payment services, facilitating purchases for Arab investors."}
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">
            {lang === "ar" ? "أسئلة شائعة عن البيتكوين" : "Bitcoin FAQs"}
          </h2>
          <div className="space-y-3">
            {[
              {
                q: lang === "ar" ? "كم سعر البيتكوين اليوم بالريال السعودي؟" : "What's Bitcoin price in SAR today?",
                a: lang === "ar"
                  ? `سعر البيتكوين اليوم بالريال السعودي ${fmt(priceUSD * RATES_FALLBACK.SAR)} ريال تقريباً. السعر يتحدث كل 5 دقائق ويتأثر بحركة السوق العالمي.`
                  : `Today's Bitcoin price in SAR is approximately ${fmt(priceUSD * RATES_FALLBACK.SAR)} SAR. Price updates every 5 minutes affected by global market.`,
              },
              {
                q: lang === "ar" ? "كم سعر البيتكوين بالدرهم الإماراتي؟" : "What's Bitcoin price in AED?",
                a: lang === "ar"
                  ? `سعر البيتكوين اليوم بالدرهم الإماراتي ${fmt(priceUSD * RATES_FALLBACK.AED)} درهم تقريباً. الأسعار محدّثة لحظياً من سوق العملات الرقمية العالمي.`
                  : `Today's Bitcoin price in AED is approximately ${fmt(priceUSD * RATES_FALLBACK.AED)} AED. Prices updated by the moment from the global crypto market.`,
              },
              {
                q: lang === "ar" ? "كيف يُحسب سعر البيتكوين بالعملات العربية؟" : "How is Bitcoin price calculated in Arab currencies?",
                a: lang === "ar"
                  ? "يُحسب سعر البيتكوين بالعملات العربية من خلال ضرب السعر العالمي بالدولار الأمريكي بسعر صرف العملة المحلية. لو كان سعر البيتكوين 100,000 دولار وسعر الدولار 3.75 ريال، فإن سعر البيتكوين بالريال = 375,000 ريال."
                  : "Bitcoin price in Arab currencies is calculated by multiplying the global USD price by the local currency exchange rate. If Bitcoin is $100,000 and USD = 3.75 SAR, then Bitcoin in SAR = 375,000 SAR.",
              },
              {
                q: lang === "ar" ? "هل البيتكوين حلال أم حرام؟" : "Is Bitcoin halal or haram?",
                a: lang === "ar"
                  ? "اختلف العلماء المسلمون في حكم البيتكوين. بعضهم يرى جوازه كوسيلة دفع، وآخرون يرونه محرّماً لعدم استناده على أصل مادي. في الإمارات والبحرين تم تنظيم تداول البيتكوين بضوابط شرعية. يُنصح بمراجعة دار الإفتاء في بلدك."
                  : "Muslim scholars differ on Bitcoin's ruling. Some consider it permissible as a payment method, others see it as prohibited for not being backed by physical assets. UAE and Bahrain regulate Bitcoin trading with Sharia controls. Consult your country's fatwa authority.",
              },
              {
                q: lang === "ar" ? "كيف أشتري البيتكوين بالريال السعودي؟" : "How to buy Bitcoin with Saudi Riyal?",
                a: lang === "ar"
                  ? "يمكنك شراء البيتكوين بالريال السعودي من منصات معتمدة مثل Binance أو Rain.bh أو Bybit. اربط حسابك البنكي، حوّل المبلغ بالريال، واشترِ البيتكوين مباشرة. تأكد من إكمال التحقق من الهوية (KYC) قبل البدء."
                  : "You can buy Bitcoin with SAR from certified platforms like Binance, Rain.bh, or Bybit. Link your bank account, transfer SAR amount, and buy Bitcoin directly. Complete KYC verification before starting.",
              },
              {
                q: lang === "ar" ? "ما هو أقل مبلغ لشراء البيتكوين؟" : "What's the minimum to buy Bitcoin?",
                a: lang === "ar"
                  ? "يمكنك شراء كسور صغيرة جداً من البيتكوين تُسمّى Satoshi (1 بيتكوين = 100 مليون ساتوشي). في معظم المنصات، الحد الأدنى للشراء يبدأ من 10-50 ريال سعودي تقريباً (3-13 دولار). لست مضطراً لشراء بيتكوين كامل."
                  : "You can buy tiny fractions of Bitcoin called Satoshi (1 BTC = 100 million satoshis). On most platforms, minimum starts at SAR 10-50 (~$3-13). You don't need to buy a whole Bitcoin.",
              },
            ].map((f, i) => (
              <details key={i} className="bg-surface-2 border border-border rounded-xl p-4 group">
                <summary className="font-bold text-text-primary cursor-pointer text-sm sm:text-base list-none flex items-center justify-between">
                  <span>{f.q}</span>
                  <span className="text-gold text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-text-secondary text-sm leading-relaxed mt-3">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
