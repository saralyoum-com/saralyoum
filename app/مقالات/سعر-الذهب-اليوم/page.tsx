import ArticlePage from "@/components/ArticlePage";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <ArticlePage
        icon="📈"
        category="تحليل"
        date="2026-04-18"
        readMins={7}
        titleAr="سعر الذهب اليوم — عيار 24 و21 و18 بالجرام والأونصة (2026)"
        titleEn="Gold Price Today — 24K, 21K, 18K per Gram & Ounce (2026)"
        descAr="دليلك الشامل لفهم سعر الذهب اليومي: لماذا يتغير، كيف تقرأ السوق، وما الفرق بين العيارات — مع أسعار لحظية مباشرة."
        descEn="Your complete guide to understanding today's gold price: why it moves, how to read the market, and what the karat differences mean — with live prices."
        sectionsAr={[
          {
            heading: "سعر الذهب اليوم — لماذا يتغير يومياً؟",
            body: "يتحدد سعر الذهب اليومي بسعر الأونصة الدولية (XAU/USD) على منصات التداول العالمية ويُحوَّل بعدها إلى سعر الجرام لكل عيار.\n\nيتغير السعر كل ثانية خلال ساعات التداول بناءً على:\n• قوة الدولار الأمريكي (علاقة عكسية — ارتفاع الدولار يخفض الذهب)\n• قرارات الفائدة من الفيدرالي الأمريكي\n• بيانات التضخم والتوظيف\n• التوترات الجيوسياسية والحروب\n• طلب البنوك المركزية على الذهب كاحتياطي",
          },
          {
            heading: "جدول أسعار العيارات — كيف تُحسب؟",
            body: "كل العيارات مشتقة من سعر عيار 24 (الأنقى 99.9%):\n\n• عيار 24 = سعر الأونصة ÷ 31.1035 (السعر الكامل)\n• عيار 22 = سعر عيار 24 × (22÷24) = 91.67%\n• عيار 21 = سعر عيار 24 × (21÷24) = 87.50%\n• عيار 18 = سعر عيار 24 × (18÷24) = 75.00%\n• عيار 14 = سعر عيار 24 × (14÷24) = 58.33%\n\nمثال: إذا كان سعر عيار 24 = 280 ريال/جرام:\n← عيار 21 = 280 × 87.5% = 245 ريال/جرام\n← عيار 18 = 280 × 75% = 210 ريال/جرام",
          },
          {
            heading: "ما الفرق بين سعر الذهب في المحلات وسعر الموقع؟",
            body: "السعر الذي تراه على موقعنا هو السعر العالمي الفوري (Spot Price) بدون هامش ربح.\n\nأما سعر المحلات فيختلف بسبب:\n• هامش ربح التاجر (عادةً 1-3% للسبائك و5-15% للمجوهرات)\n• تكلفة التصنيع (أُجرة الصياغة) للمجوهرات\n• الضرائب والرسوم المحلية\n• تكاليف الاستيراد في بعض الدول\n\nلهذا السعر العالمي هو المرجع وليس سعر الشراء الفعلي من المحلات.",
          },
          {
            heading: "كيف أتابع سعر الذهب اليومي بدقة؟",
            body: "أفضل طريقة لمتابعة سعر الذهب اليومي:\n\n1. تابع سعر الأونصة العالمية مباشرةً على موقعنا — يُحدَّث كل دقيقة\n2. فعّل التنبيهات الذكية لتصلك إشعار فور وصول السعر لهدفك\n3. شاهد الرسم البياني اليومي والأسبوعي لرصد الاتجاه العام\n4. انضم لقناتنا على تيليجرام للحصول على تحديث يومي الساعة 8 صباحاً\n\nتجنب الاعتماد على مصادر واحدة — قارن دائماً بين مصدرين على الأقل.",
          },
          {
            heading: "متى يكون سعر الذهب في أعلى مستوياته؟",
            body: "تاريخياً، يرتفع سعر الذهب في:\n\n• فترات عدم اليقين الاقتصادي (ركود، أزمات بنكية)\n• أوقات الحروب والتوترات الجيوسياسية\n• عندما تخفض البنوك المركزية أسعار الفائدة\n• موسم الزفاف في الهند (أكتوبر-نوفمبر) — أكبر مستهلك للذهب عالمياً\n• نهاية العام المالي حين تزيد البنوك مشترياتها\n\nأما أدنى مستوياته فعادةً عند ارتفاع الفائدة الأمريكية وقوة الدولار.",
          },
          {
            heading: "هل الوقت الحالي مناسب للشراء؟",
            body: "لا يوجد إجابة موحدة — يعتمد على هدفك:\n\nللاستثمار طويل الأمد (5+ سنوات):\nالذهب أثبت تاريخياً أنه مخزن قيمة موثوق. المستثمر طويل الأمد لا يُركز على السعر اليومي.\n\nللادخار الدوري:\nأفضل استراتيجية هي الشراء بمبالغ ثابتة شهرياً (Dollar Cost Averaging) بدلاً من انتظار «الوقت المناسب».\n\nللمضاربة القصيرة:\nعالية المخاطرة — تستلزم متابعة يومية لمؤشرات الاقتصاد الأمريكي وقرارات الفائدة.\n\nاستشر مستشاراً مالياً مرخصاً قبل قرار استثماري كبير.",
          },
          {
            heading: "أسعار الذهب في الدول العربية — لماذا تختلف؟",
            body: "سعر الذهب في كل دولة عربية يختلف عن الأخرى لأسباب:\n\n• سعر صرف العملة المحلية مقابل الدولار\n• الضرائب والجمارك المحلية (مثل ضريبة القيمة المضافة 15% في السعودية)\n• تكاليف الشحن والتأمين\n• عرض وطلب السوق المحلي\n\nمثال: سعر الذهب في السعودية بالريال ≠ سعره في مصر بالجنيه — لكن قيمتهما بالدولار متقاربة.",
          },
        ]}
        sectionsEn={[
          {
            heading: "Gold Price Today — Why Does It Change Daily?",
            body: "The daily gold price is determined by the international spot price (XAU/USD) on global trading platforms, then converted to per-gram prices for each karat.\n\nIt changes every second during trading hours based on:\n• US dollar strength (inverse relationship — stronger dollar lowers gold)\n• Federal Reserve interest rate decisions\n• Inflation and employment data\n• Geopolitical tensions and conflicts\n• Central bank demand for gold reserves",
          },
          {
            heading: "Karat Price Table — How Is It Calculated?",
            body: "All karats are derived from 24K (purest, 99.9%):\n\n• 24K = Spot price ÷ 31.1035 (full price)\n• 22K = 24K price × (22÷24) = 91.67%\n• 21K = 24K price × (21÷24) = 87.50%\n• 18K = 24K price × (18÷24) = 75.00%\n• 14K = 24K price × (14÷24) = 58.33%\n\nExample: If 24K = $90/gram:\n← 21K = $90 × 87.5% = $78.75/gram\n← 18K = $90 × 75% = $67.50/gram",
          },
          {
            heading: "Spot Price vs. Jeweler's Price — What's the Difference?",
            body: "Our website shows the international spot price (no markup).\n\nJewelry store prices differ because of:\n• Dealer margin (typically 1-3% for bullion, 5-15% for jewelry)\n• Fabrication/craftsmanship charges\n• Local taxes and import duties\n• Country-specific import costs\n\nThe spot price is the reference point, not the actual purchase price from a store.",
          },
          {
            heading: "How to Track Gold Price Accurately?",
            body: "Best ways to follow the daily gold price:\n\n1. Follow the live spot price on our site — updated every minute\n2. Set smart price alerts to be notified when your target price is reached\n3. Watch the daily and weekly chart to identify the trend\n4. Join our Telegram channel for a daily 8 AM price update\n\nNever rely on a single source — always cross-reference at least two.",
          },
          {
            heading: "When Is Gold at Its Highest?",
            body: "Historically, gold rises during:\n\n• Economic uncertainty (recessions, banking crises)\n• Wars and geopolitical tensions\n• When central banks cut interest rates\n• India's wedding season (Oct-Nov) — world's largest gold consumer\n• Year-end as banks increase reserves\n\nIt tends to fall when US interest rates rise and the dollar strengthens.",
          },
          {
            heading: "Is Now a Good Time to Buy Gold?",
            body: "There's no single answer — it depends on your goal:\n\nLong-term investment (5+ years):\nGold has historically proven to be a reliable store of value. Long-term investors don't focus on daily prices.\n\nPeriodic saving:\nDollar Cost Averaging (fixed monthly purchases) is better than waiting for the 'right moment'.\n\nShort-term trading:\nHigh risk — requires daily monitoring of US economic indicators and rate decisions.\n\nConsult a licensed financial advisor before large investment decisions.",
          },
          {
            heading: "Gold Prices Across Arab Countries — Why Do They Differ?",
            body: "Gold prices in each Arab country differ because of:\n\n• Local currency exchange rate vs USD\n• Local taxes and customs (e.g., 15% VAT in Saudi Arabia)\n• Shipping and insurance costs\n• Local supply and demand\n\nExample: Gold price in Saudi Arabia in SAR ≠ Egypt in EGP — but their USD value is similar.",
          },
        ]}
      />

      {/* Live prices CTA */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/اسعار"
            className="flex items-center justify-between bg-gold/5 border border-gold/20 hover:border-gold/40 rounded-2xl p-4 transition-all group"
          >
            <div>
              <p className="font-bold text-text-primary group-hover:text-gold transition-colors mb-0.5">
                📊 أسعار الذهب الآن
              </p>
              <p className="text-text-secondary text-sm">جدول كامل بكل العيارات والعملات</p>
            </div>
            <span className="text-gold">←</span>
          </Link>
          <Link
            href="/حاسبة-الذهب"
            className="flex items-center justify-between bg-surface border border-border hover:border-gold/30 rounded-2xl p-4 transition-all group"
          >
            <div>
              <p className="font-bold text-text-primary group-hover:text-gold transition-colors mb-0.5">
                🧮 حاسبة الذهب
              </p>
              <p className="text-text-secondary text-sm">احسب قيمة ذهبك بعملتك</p>
            </div>
            <span className="text-gold">←</span>
          </Link>
        </div>
      </div>
    </>
  );
}
