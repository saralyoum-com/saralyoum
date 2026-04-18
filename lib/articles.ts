export interface Article {
  slug: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  category: string;
  date: string;
  readMins: number;
  icon: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "ما-يؤثر-على-سعر-الذهب",
    titleAr: "ما الذي يؤثر على سعر الذهب؟ — 7 عوامل رئيسية",
    titleEn: "What Affects Gold Price? — 7 Key Factors",
    descAr: "تعرّف على أهم العوامل التي تحرّك سعر الذهب عالمياً، من الفائدة الأمريكية إلى الأزمات الجيوسياسية.",
    descEn: "Discover the main factors that drive gold prices globally, from US interest rates to geopolitical crises.",
    category: "تحليل",
    date: "2026-04-10",
    readMins: 5,
    icon: "📊",
  },
  {
    slug: "الاستثمار-في-الذهب",
    titleAr: "كيف تستثمر في الذهب؟ — دليل المبتدئين",
    titleEn: "How to Invest in Gold? — Beginner's Guide",
    descAr: "دليل شامل لطرق الاستثمار في الذهب: سبائك، مجوهرات، ETF، وعقود الفيوتشر — مع مقارنة بين كل طريقة.",
    descEn: "A complete guide to gold investment methods: bullion, jewelry, ETFs, and futures — with a comparison.",
    category: "استثمار",
    date: "2026-04-08",
    readMins: 7,
    icon: "💰",
  },
  {
    slug: "عيارات-الذهب",
    titleAr: "دليل عيارات الذهب — ما الفرق بين 24 و21 و18؟",
    titleEn: "Gold Karats Guide — Difference Between 24K, 21K, 18K",
    descAr: "شرح مبسط لعيارات الذهب المختلفة وكيف تؤثر على السعر والجودة والاستخدام.",
    descEn: "A simple explanation of gold karats and how they affect price, quality, and use.",
    category: "تعليم",
    date: "2026-04-06",
    readMins: 4,
    icon: "🥇",
  },
  {
    slug: "زكاة-الذهب",
    titleAr: "زكاة الذهب — كيف تحسبها بالطريقة الصحيحة؟",
    titleEn: "Gold Zakat — How to Calculate It Correctly",
    descAr: "شرح تفصيلي لأحكام زكاة الذهب: النصاب، الحول، النسبة، وكيفية الحساب بالأسعار الحالية.",
    descEn: "Detailed explanation of gold zakat rules: nisab, hawl, rate, and how to calculate with current prices.",
    category: "إسلامي",
    date: "2026-04-04",
    readMins: 6,
    icon: "☪️",
  },
  {
    slug: "زكاة-الكريبتو",
    titleAr: "زكاة العملات الرقمية — أحكامها وكيفية حسابها (دليل 2026)",
    titleEn: "Crypto Zakat — Rules, Calculation & Scholarly Opinions (2026 Guide)",
    descAr: "هل تجب الزكاة على البيتكوين وBNB وSOL وUSDT؟ الأحكام الفقهية، النصاب، آراء هيئة كبار العلماء، وطريقة الحساب خطوة بخطوة.",
    descEn: "Is Zakat due on Bitcoin, BNB, SOL, and USDT? Rulings, nisab, scholarly opinions, and step-by-step calculation.",
    category: "إسلامي",
    date: "2026-04-17",
    readMins: 8,
    icon: "₿",
  },
];
