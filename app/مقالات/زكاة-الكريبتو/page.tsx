"use client";

import ArticlePage from "@/components/ArticlePage";
import Link from "next/link";
import { useLang } from "@/components/LanguageContext";

const sources = {
  ar: [
    {
      label: "هيئة كبار العلماء — المملكة العربية السعودية",
      note: "قرار بوجوب الزكاة في العملات الرقمية كعروض التجارة",
      url: "https://www.spa.gov.sa",
    },
    {
      label: "المجمع الفقهي الإسلامي الدولي — رابطة العالم الإسلامي",
      note: "قرار رقم 214 (د 23 / ق 3) بشأن حكم العملات الافتراضية المشفرة",
      url: "https://www.themwl.org",
    },
    {
      label: "دار الإفتاء المصرية",
      note: "فتاوى الزكاة على الأصول الرقمية والعملات الإلكترونية",
      url: "https://www.dar-alifta.org",
    },
    {
      label: "إسلام ويب — الشبكة الإسلامية",
      note: "فتاوى متعددة في حكم زكاة العملات الرقمية وشروطها",
      url: "https://www.islamweb.net",
    },
    {
      label: "CoinGecko API",
      note: "مصدر بيانات أسعار العملات الرقمية اللحظية المستخدمة في الحاسبة",
      url: "https://www.coingecko.com",
    },
    {
      label: "GoldAPI.io",
      note: "مصدر بيانات سعر الذهب اللحظي لحساب النصاب",
      url: "https://goldapi.io",
    },
  ],
  en: [
    {
      label: "Council of Senior Scholars — Saudi Arabia",
      note: "Ruling on Zakat for cryptocurrencies treated as trade goods",
      url: "https://www.spa.gov.sa",
    },
    {
      label: "International Islamic Fiqh Academy — Muslim World League",
      note: "Resolution No. 214 on the ruling for encrypted virtual currencies",
      url: "https://www.themwl.org",
    },
    {
      label: "Dar al-Ifta al-Misriyyah (Egyptian Fatwa Authority)",
      note: "Fatwas on Zakat for digital assets and electronic currencies",
      url: "https://www.dar-alifta.org",
    },
    {
      label: "IslamWeb — Islamic Network",
      note: "Multiple fatwas on the ruling and conditions of crypto Zakat",
      url: "https://www.islamweb.net",
    },
    {
      label: "CoinGecko API",
      note: "Live cryptocurrency price data source used in the calculator",
      url: "https://www.coingecko.com",
    },
    {
      label: "GoldAPI.io",
      note: "Live gold price source used for nisab calculation",
      url: "https://goldapi.io",
    },
  ],
};

export default function Page() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const dir = ar ? "rtl" : "ltr";
  const srcList = ar ? sources.ar : sources.en;

  return (
    <>
      <ArticlePage
        icon="₿"
        category="إسلامي"
        date="2026-04-17"
        readMins={8}
        titleAr="زكاة العملات الرقمية — أحكامها وكيفية حسابها (دليل 2026)"
        titleEn="Crypto Zakat — Rules, Calculation & Scholarly Opinions (2026 Guide)"
        descAr="دليل شامل يجيب على أبرز أسئلة زكاة الكريبتو: هل تجب على البيتكوين وBNB وSOL؟ كيف يُحسب النصاب؟ وما رأي هيئة كبار العلماء؟"
        descEn="A comprehensive guide answering key questions about crypto Zakat: Is it due on Bitcoin, BNB, SOL? How is nisab calculated? What do scholars say?"
        sectionsAr={[
          {
            heading: "هل تجب الزكاة على العملات الرقمية؟",
            body: "نعم، ذهب جمهور العلماء المعاصرين إلى وجوب الزكاة في العملات الرقمية — بيتكوين وإيثيريوم وBNB وسولانا وغيرها — وذلك لأنها أموال لها قيمة مالية متعارف عليها، وقابلة للتداول والتبادل والاستخدام في المعاملات.\n\nأصدرت هيئة كبار العلماء في المملكة العربية السعودية، والمجمع الفقهي الإسلامي الدولي، وعدد من دور الإفتاء فتاوى بوجوب الزكاة فيها، معاملةً إياها كعروض التجارة."
          },
          {
            heading: "ما هو نصاب زكاة الكريبتو؟",
            body: "النصاب هو الحد الأدنى الذي يجب أن تبلغه الثروة لتجب فيها الزكاة. ويُحدَّد بما يعادل 85 جراماً من الذهب الخالص (عيار 24).\n\nبناءً على سعر الذهب الحالي يتغير هذا المبلغ يومياً. إذا بلغت قيمة ما تملكه من عملات رقمية — مجتمعةً — هذا المبلغ أو تجاوزته، وجبت الزكاة بشرط الحول.\n\nمثال: إذا كان سعر جرام الذهب عيار 24 يساوي 150 دولاراً، فالنصاب = 85 × 150 = 12,750 دولاراً."
          },
          {
            heading: "هل يُشترط الحول؟",
            body: "نعم، يُشترط مرور سنة هجرية كاملة (354 يوماً تقريباً) على ملك النصاب. وهذا يعني:\n\n• إذا امتلكت كريبتو بقيمة أعلى من النصاب في رمضان 1446، يبدأ الحول.\n• إذا انخفضت قيمة محفظتك عن النصاب في أي وقت خلال السنة — ينقطع الحول ويبدأ من جديد عند عودتها فوق النصاب.\n• يُزكى الكريبتو بقيمته السوقية لحظة تمام الحول، سواء ارتفع سعره أم انخفض."
          },
          {
            heading: "هل تجب الزكاة على BNB وSOL؟",
            body: "نعم. أي عملة رقمية ذات قيمة سوقية — BNB وSOL وXRP وغيرها — تخضع لنفس الحكم. الملاك يزكون قيمتها السوقية كاملةً في نهاية الحول بنسبة 2.5%.\n\nلا يُستثنى نوع بعينه من العملات طالما كانت لها قيمة مالية متعارف عليها وقابلة للبيع والشراء."
          },
          {
            heading: "هل تجب الزكاة على USDT وستيبل كوين؟",
            body: "نعم. الستيبل كوين كـUSDT وUSDC تُعامل معاملة النقد السائل، وتجب فيها الزكاة كالأموال. يُضاف مجموعها إلى بقية الأصول لاحتساب ما إذا كانت المحفظة بلغت النصاب."
          },
          {
            heading: "كيف أحسب زكاتي خطوة بخطوة؟",
            body: "1. اجمع قيمة كل ما تملكه من عملات رقمية (BTC + ETH + BNB + SOL + USDT + غيرها) بالدولار أو بعملتك.\n2. تأكد أن المبلغ الكلي ≥ النصاب (85 جرام ذهب × سعر الجرام الحالي).\n3. تحقق أن مضى على هذا المبلغ سنة هجرية كاملة.\n4. إذا تحققت الشروط، اضرب القيمة الكلية × 2.5% = الزكاة الواجبة.\n\nاستخدم حاسبة زكاة الكريبتو على موقعنا للحصول على النتيجة فوراً بأسعار لحظية."
          },
          {
            heading: "هل أُزكي الأرباح غير المحققة؟",
            body: "نعم، عند حلول وقت الزكاة تُحسب القيمة السوقية لكل ما تملكه من عملات رقمية، سواء بعت أم لم تبع. فإذا اشتريت بيتكوين بـ40,000 دولار وأصبح يساوي 80,000 دولار، تُزكي على 80,000 دولار."
          },
          {
            heading: "آراء العلماء والمؤسسات الفقهية",
            body: "• هيئة كبار العلماء (السعودية): أصدرت قراراً بوجوب زكاة العملات الرقمية كعروض التجارة بنسبة 2.5%.\n• المجمع الفقهي الإسلامي الدولي: نفس الموقف — تزكى بقيمتها السوقية في نهاية الحول.\n• دار الإفتاء المصرية: يرى بعض علمائها إخراج الزكاة احتياطاً ولا حرج.\n• بعض العلماء المعاصرين: يميزون بين المحتفظ بها للاستثمار (كعروض تجارة) والمستخدمة للتحويل والدفع (كالنقد).\n\nالأحوط والأبرأ للذمة: إخراج الزكاة إذا بلغت القيمة النصاب ومضى الحول."
          },
        ]}
        sectionsEn={[
          {
            heading: "Is Zakat Due on Cryptocurrencies?",
            body: "Yes, the majority of contemporary scholars hold that Zakat is due on cryptocurrencies — Bitcoin, Ethereum, BNB, Solana, and others — because they are financial assets with recognized value that can be traded and exchanged.\n\nThe Council of Senior Scholars in Saudi Arabia, the International Islamic Fiqh Academy, and numerous fatwa councils have issued rulings requiring Zakat on cryptocurrencies, treating them as trade goods."
          },
          {
            heading: "What is the Nisab for Crypto Zakat?",
            body: "The nisab is the minimum threshold for Zakat to be obligatory. It equals 85 grams of pure (24K) gold.\n\nThis amount changes daily with the gold price. If the total value of your cryptocurrency holdings reaches or exceeds this threshold and you've held it for a full lunar year, Zakat is due.\n\nExample: If the price of 24K gold is $150/gram, the nisab = 85 × $150 = $12,750."
          },
          {
            heading: "Is the Hawl (One Year) Required?",
            body: "Yes, a full lunar year (approximately 354 days) must pass while you own the nisab amount. This means:\n\n• If your portfolio exceeds the nisab in Ramadan 1446, your hawl begins.\n• If its value drops below the nisab at any point, the hawl resets when it returns above it.\n• Zakat is calculated on the market value at the moment the hawl completes, regardless of price movement."
          },
          {
            heading: "Is Zakat Due on BNB and SOL?",
            body: "Yes. Any cryptocurrency with recognized market value — BNB, SOL, XRP and others — follows the same ruling. Holders pay 2.5% of the total market value at the end of each lunar year.\n\nNo specific coin is exempt as long as it has measurable financial value and can be bought and sold."
          },
          {
            heading: "Is Zakat Due on USDT Stablecoins?",
            body: "Yes. Stablecoins like USDT and USDC are treated like cash and are subject to the same 2.5% Zakat. Their value is added to your total holdings when determining whether the nisab is reached."
          },
          {
            heading: "How to Calculate: Step by Step",
            body: "1. Sum the total USD value of all your crypto (BTC + ETH + BNB + SOL + USDT + others).\n2. Check if the total ≥ nisab (85g gold × current gold price per gram).\n3. Confirm a full lunar year has passed since you owned the nisab amount.\n4. If all conditions are met: multiply total value × 2.5% = Zakat due.\n\nUse our Crypto Zakat Calculator for instant results with live prices."
          },
          {
            heading: "Do I Pay Zakat on Unrealized Gains?",
            body: "Yes. At the time Zakat is due, you calculate the market value of everything you hold, whether sold or not. If you bought Bitcoin at $40,000 and it's now worth $80,000, you pay Zakat on $80,000."
          },
          {
            heading: "Scholarly & Institutional Opinions",
            body: "• Council of Senior Scholars (Saudi Arabia): Issued a ruling requiring Zakat on cryptocurrencies as trade goods at 2.5%.\n• International Islamic Fiqh Academy: Same position — pay 2.5% of market value at the end of the lunar year.\n• Egyptian Dar al-Ifta: Some scholars recommend paying Zakat as a precaution.\n• Contemporary scholars generally agree that crypto held for investment is treated like trade goods.\n\nThe safest and most conscientious position: pay Zakat if the value reaches the nisab and the hawl completes."
          },
        ]}
      />
      {/* Calculator CTA */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4 pb-4">
        <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-text-primary mb-1">₿ {ar ? "احسب زكاة كريبتوك الآن" : "Calculate Your Crypto Zakat"}</p>
            <p className="text-text-secondary text-sm">{ar ? "حاسبة BTC + ETH + BNB + SOL + USDT بأسعار لحظية" : "BTC + ETH + BNB + SOL + USDT with live prices"}</p>
          </div>
          <Link
            href="/zakat-crypto"
            className="bg-gold text-background font-bold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-colors whitespace-nowrap"
          >
            {ar ? "الحاسبة" : "Calculator"}
          </Link>
        </div>
      </div>

      {/* Sources */}
      <div dir={dir} className="max-w-3xl mx-auto px-3 sm:px-4 pb-10">
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <span>📚</span>
            {ar ? "المصادر والمراجع" : "Sources & References"}
          </h2>
          <ol className="space-y-3">
            {srcList.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-gold font-bold shrink-0 w-5">{i + 1}.</span>
                <div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-text-primary hover:text-gold transition-colors"
                  >
                    {s.label}
                  </a>
                  <p className="text-text-secondary text-xs mt-0.5">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-text-secondary text-xs mt-4 border-t border-border pt-3">
            {ar
              ? "⚠️ هذا المقال لأغراض تعليمية وإعلامية. يُنصح بمراجعة عالم شرعي معتمد للحصول على فتوى شخصية."
              : "⚠️ This article is for educational purposes. Consult a qualified Islamic scholar for a personal fatwa."}
          </p>
        </div>
      </div>
    </>
  );
}
