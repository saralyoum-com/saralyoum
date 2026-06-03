import type { ContentSection, CountryFAQ } from "@/components/CountryContent";

export const saudiContent: {
  intro: ContentSection;
  market: ContentSection;
  culture: ContentSection;
  dealers: ContentSection;
  history: ContentSection;
  buyingGuide: ContentSection;
  faq: CountryFAQ[];
} = {
  intro: {
    ar: {
      heading: "الذهب في المملكة العربية السعودية",
      body: "تُعدّ المملكة العربية السعودية من أكبر أسواق الذهب في الشرق الأوسط، وتستهلك ما يزيد على 50 طناً من الذهب سنوياً وفق إحصائيات مجلس الذهب العالمي. ويُمثّل الذهب جزءاً أصيلاً من الثقافة السعودية، فهو حاضر في كل مناسبة من الأعراس إلى الأعياد، ويُعتبر شكلاً مفضّلاً للادخار في مواجهة تقلبات العملات. سعر الذهب اليوم في السعودية يُحسب من السعر العالمي بالأوقية مضروباً بسعر صرف الريال السعودي مقابل الدولار الأمريكي، مع إضافة المصنعية وضريبة القيمة المضافة على بعض المنتجات.",
    },
    en: {
      heading: "Gold in Saudi Arabia",
      body: "Saudi Arabia is one of the largest gold markets in the Middle East, consuming over 50 tons of gold annually according to the World Gold Council. Gold is deeply embedded in Saudi culture — present at every wedding, Eid celebration, and considered a preferred form of savings against currency fluctuations. Today's gold price in Saudi Arabia is calculated from the global ounce price multiplied by the SAR/USD exchange rate, plus craftsmanship fees and VAT on certain products.",
    },
  },

  market: {
    ar: {
      heading: "سوق الذهب في المملكة",
      body: [
        "سوق طيبة للذهب في المدينة المنورة — يُعدّ من أعرق الأسواق التقليدية ويتميز بأسعار منافسة قرب الحرم.",
        "سوق الذهب في جدة (شارع قابل) — قلب تجارة الذهب في المنطقة الغربية مع أكثر من 200 محل.",
        "سوق الذهب في الرياض (شارع الأمير محمد بن عبد العزيز - التحلية) — يضم كبرى الماركات العالمية والمحلية.",
        "سوق الذهب القديم في مكة المكرمة (سوق الليل) — وجهة الحجاج والمعتمرين لشراء الذهب.",
        "أسواق الدمام والخبر — تنشط بشكل كبير خلال موسم الصيف ومع توافد الزوار من دول الخليج.",
      ],
    },
    en: {
      heading: "Gold Markets in Saudi Arabia",
      body: [
        "Taibah Gold Market in Medina — one of the oldest traditional souks with competitive prices near the Haram.",
        "Jeddah Gold Market (Gabel Street) — heart of gold trade in the Western region with 200+ shops.",
        "Riyadh Gold Market (Tahlia Street) — home to major international and local brands.",
        "Makkah's Old Gold Market (Souq Al-Layl) — destination for pilgrims and Umrah visitors.",
        "Dammam and Khobar markets — active during summer and Gulf visitors season.",
      ],
    },
  },

  culture: {
    ar: {
      heading: "الذهب في الأعراس والمناسبات السعودية",
      body: "لا يكتمل الزواج السعودي بدون شبكة الذهب التي يقدّمها العريس للعروس قبل عقد القران. وتختلف قيمة الشبكة باختلاف المناطق والأسر، لكن المتوسط يتراوح بين 20 إلى 50 جراماً من الذهب عيار 21، وقد يصل في الأعراس الفاخرة إلى 200 جرام أو أكثر. كما يُعدّ توزيع الذهب في يوم العيد على البنات تقليداً راسخاً، خاصةً عيد الفطر. ومن العادات السعودية المميزة شراء الذهب عند ولادة المولود الجديد، حيث يُهدى للأم قطعة ذهبية تذكاراً للمناسبة.",
    },
    en: {
      heading: "Gold in Saudi Weddings & Occasions",
      body: "No Saudi wedding is complete without the gold shabka (engagement gift) that the groom presents to the bride before marriage. The shabka value varies by region and family — averaging 20-50 grams of 21-karat gold, though luxury weddings can exceed 200 grams. Distributing gold to daughters during Eid is also a deep-rooted tradition, especially Eid Al-Fitr. A unique Saudi custom is buying gold at a newborn's birth, where the mother receives a gold piece commemorating the occasion.",
    },
  },

  dealers: {
    ar: {
      heading: "أكبر محلات الذهب والمجوهرات في السعودية",
      body: [
        "الراجحي للمجوهرات (الراجحي ذهب) — أكبر سلسلة محلية بأكثر من 100 فرع في المملكة.",
        "لازوردي — علامة سعودية رائدة في المجوهرات الذهبية والألماس.",
        "دار جوهرة — متخصصة في الذهب التراثي والمعاصر.",
        "موجود (Mouawad) — للمجوهرات الفاخرة وقطع المناسبات.",
        "دمج وأبيات — لسبائك الاستثمار الذهبية بأوزان مختلفة.",
        "محلات الذهب المحلية في الأسواق التقليدية — تقدم أسعاراً أكثر تنافسية مع مصنعية أقل.",
      ],
    },
    en: {
      heading: "Top Gold Retailers in Saudi Arabia",
      body: [
        "Al Rajhi Jewelry — largest local chain with 100+ branches in the Kingdom.",
        "L'azurde — leading Saudi brand for gold jewelry and diamonds.",
        "Dar Jawhara — specialized in heritage and contemporary gold pieces.",
        "Mouawad — luxury jewelry and special occasion pieces.",
        "Damaj and Abyat — for investment gold bars in various weights.",
        "Local jewelers in traditional souks — offer competitive prices with lower craftsmanship fees.",
      ],
    },
  },

  history: {
    ar: {
      heading: "تاريخ سعر الذهب في السعودية",
      body: "شهد سعر الذهب في السعودية ارتفاعاً ملحوظاً خلال السنوات الأخيرة. في 2020، كان سعر جرام عيار 21 يتراوح حول 200 ريال، وبحلول 2024 تجاوز 300 ريال، ثم قفز إلى أكثر من 470 ريال في 2026. هذا الارتفاع التاريخي يعكس عدة عوامل: انخفاض الدولار عالمياً، ارتفاع التضخم، والتوترات الجيوسياسية. ومع ربط الريال بالدولار (3.75 ريال للدولار)، فإن أسعار الذهب في المملكة تتبع المؤشرات العالمية مباشرة دون تأثير من تقلبات العملة المحلية. وتُشير التوقعات إلى استمرار قوة الذهب كملاذ آمن للمستثمرين السعوديين.",
    },
    en: {
      heading: "Saudi Gold Price History",
      body: "Gold prices in Saudi Arabia have seen significant increases in recent years. In 2020, the price per gram of 21K gold averaged around SAR 200; by 2024 it exceeded SAR 300; and in 2026 it surpassed SAR 470. This historic rise reflects multiple factors: global dollar weakness, rising inflation, and geopolitical tensions. With the Saudi Riyal pegged to the US Dollar (3.75 SAR/USD), Saudi gold prices track global indices directly without local currency volatility. Forecasts suggest continued gold strength as a safe haven for Saudi investors.",
    },
  },

  buyingGuide: {
    ar: {
      heading: "دليل شراء الذهب في السعودية",
      body: [
        "تحقّق من الدمغة الرسمية للذهب (دمغة 875 لعيار 21، أو 750 لعيار 18) قبل الشراء.",
        "اطلب فاتورة رسمية تتضمن الوزن والعيار وسعر الجرام والمصنعية بشكل منفصل.",
        "اشترِ من محلات معتمدة من وزارة التجارة لضمان حقوقك في حال البيع لاحقاً.",
        "عند الشراء للاستثمار، اختر السبائك بدل المجوهرات لتجنّب فقدان قيمة المصنعية عند البيع.",
        "متوسط مصنعية الذهب في السعودية: 5-15% للذهب العادي، وقد تصل إلى 40% للقطع المصممة.",
        "ضريبة القيمة المضافة 15% تُطبق على المصنعية فقط وليس على قيمة الذهب الخام.",
        "أفضل أوقات الشراء: يناير وفبراير (انخفاض الطلب بعد موسم الأعراس)، وفي حالات انخفاض السعر العالمي.",
      ],
    },
    en: {
      heading: "Guide to Buying Gold in Saudi Arabia",
      body: [
        "Always verify the official hallmark (875 for 21K, 750 for 18K) before purchase.",
        "Request an official invoice listing weight, karat, gram price, and craftsmanship separately.",
        "Buy from Ministry of Commerce certified shops to protect resale rights.",
        "For investment, choose bars over jewelry to avoid losing craftsmanship value on resale.",
        "Average craftsmanship in Saudi: 5-15% for standard gold, up to 40% for designer pieces.",
        "15% VAT applies only to craftsmanship, not the raw gold value.",
        "Best buying times: January-February (lower demand after wedding season), and during global price dips.",
      ],
    },
  },

  faq: [
    {
      q: { ar: "ما هو العيار الأكثر شيوعاً في السعودية؟", en: "What's the most popular karat in Saudi Arabia?" },
      a: { ar: "عيار 21 هو الأكثر طلباً ويمثّل أكثر من 70% من مبيعات الذهب في المملكة، يليه عيار 18 للمجوهرات الفاخرة وعيار 24 للسبائك والاستثمار.",
            en: "21-karat is the most demanded, representing over 70% of gold sales in the Kingdom, followed by 18K for luxury jewelry and 24K for bars and investment." },
    },
    {
      q: { ar: "هل يوجد ضريبة على شراء الذهب في السعودية؟", en: "Is there VAT on buying gold in Saudi Arabia?" },
      a: { ar: "ضريبة القيمة المضافة 15% تُطبق على المصنعية فقط في حال الذهب المصنّع (مجوهرات). أما السبائك الاستثمارية بنقاء 99% فما فوق فهي معفاة من الضريبة.",
            en: "15% VAT applies only to craftsmanship for manufactured gold (jewelry). Investment bars of 99%+ purity are VAT-exempt." },
    },
    {
      q: { ar: "كم متوسط شبكة الذهب للزواج في السعودية؟", en: "What's the average wedding gold shabka in Saudi Arabia?" },
      a: { ar: "متوسط شبكة الذهب يتراوح بين 20 إلى 50 جراماً من عيار 21، أي ما يعادل تقريباً 9,000 إلى 23,000 ريال بحسب سعر الذهب الحالي. تختلف القيمة باختلاف المنطقة والأسرة.",
            en: "Wedding shabka averages 20-50 grams of 21K gold, roughly SAR 9,000-23,000 at current prices. The value varies by region and family." },
    },
    {
      q: { ar: "كيف أتأكد من جودة الذهب قبل الشراء؟", en: "How do I verify gold quality before buying?" },
      a: { ar: "ابحث عن الدمغة الرسمية المختومة بالليزر (875 لعيار 21)، اطلب الفاتورة الرسمية مع كل التفاصيل، واشترِ من محلات معتمدة. يمكنك أيضاً اختبار الذهب بحامض النيتريك في معامل التحاليل المعتمدة.",
            en: "Look for the laser-stamped official hallmark (875 for 21K), request a detailed official invoice, and buy from certified shops. You can also test gold with nitric acid at certified labs." },
    },
    {
      q: { ar: "ما الفرق بين الذهب السعودي والذهب الإماراتي؟", en: "What's the difference between Saudi and UAE gold?" },
      a: { ar: "لا يوجد فرق في جودة المعدن، فالعيار 21 هو نفسه في كلا البلدين. الفرق يكون في المصنعية والتصاميم، وأحياناً في الأسعار بسبب ضريبة القيمة المضافة (15% بالسعودية، 5% بالإمارات).",
            en: "No difference in metal quality — 21K is the same in both countries. Differences are in craftsmanship, designs, and sometimes prices due to VAT (15% in Saudi, 5% in UAE)." },
    },
    {
      q: { ar: "أين أبيع الذهب بأفضل سعر في الرياض؟", en: "Where to sell gold at the best price in Riyadh?" },
      a: { ar: "أفضل أماكن البيع هي محلات الذهب الكبرى في شارع التحلية وسوق الزل، حيث يُحسب السعر على أساس سعر الجرام اليومي العالمي مع خصم بسيط (عادة 5-10% أقل من سعر الشراء).",
            en: "Best selling spots are major gold shops in Tahlia Street and Souq Al-Zal, where prices are based on daily global gram rates with a small markdown (typically 5-10% below buying price)." },
    },
  ],
};
