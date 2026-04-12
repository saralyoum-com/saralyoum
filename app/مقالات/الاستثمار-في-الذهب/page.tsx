import ArticlePage from "@/components/ArticlePage";
export default function Page() {
  return (
    <ArticlePage
      icon="💰" category="استثمار" date="2026-04-08" readMins={7}
      titleAr="كيف تستثمر في الذهب؟ — دليل المبتدئين"
      titleEn="How to Invest in Gold? — Beginner's Guide"
      descAr="دليل شامل لطرق الاستثمار في الذهب: سبائك، مجوهرات، ETF، وعقود الفيوتشر — مع مقارنة بين كل طريقة."
      descEn="A complete guide to gold investment methods: bullion, jewelry, ETFs, and futures — with a comparison."
      sectionsAr={[
        { heading: "لماذا الاستثمار في الذهب؟", body: "الذهب أثبت على مدى آلاف السنين أنه مخزن موثوق للقيمة. يحمي من التضخم، يتحرك عكس الدولار، ويُعدّ ملاذاً آمناً في أوقات الأزمات." },
        { heading: "1. السبائك والمسكوكات", body: "الطريقة الأكثر مباشرةً. تشتري ذهباً فعلياً بعيار 24. الإيجابيات: تملك حقيقي. السلبيات: تحتاج تخزيناً آمناً وقد تكون الفروقات السعرية مرتفعة." },
        { heading: "2. المجوهرات — استثمار أم زينة؟", body: "المجوهرات ليست استثماراً مثالياً لأن ثمة أجرة صياغة تُدفع عند الشراء ولا تُسترد عند البيع. لكنها مقبولة كمخزن قيمة على المدى البعيد." },
        { heading: "3. صناديق الذهب المتداولة (ETF)", body: "تمكّنك من الاستثمار في الذهب دون تخزينه فعلياً. تُتداول في البورصة كالأسهم. مناسبة للمستثمرين الذين يريدون المرونة والسيولة." },
        { heading: "4. عقود الفيوتشر", body: "للمستثمرين المتقدمين فقط. تُتيح الرفع المالي (الليفرج) وقد تحقق أرباحاً كبيرة أو خسائر كبيرة. غير مناسبة للمبتدئين." },
        { heading: "نصائح عملية للمبتدئ", body: "• لا تضع أكثر من 10-15% من محفظتك في الذهب\n• ابدأ بالسبائك الصغيرة أو صناديق ETF\n• فكّر في الذهب كتأمين طويل الأمد لا للمضاربة\n• تابع أسعار الذهب يومياً عبر sardhahab.com" },
      ]}
      sectionsEn={[
        { heading: "Why Invest in Gold?", body: "Gold has proven over thousands of years to be a reliable store of value. It protects against inflation, moves inversely to the dollar, and serves as a safe haven during crises." },
        { heading: "1. Bullion & Coins", body: "The most direct method. You buy physical 24K gold. Pros: real ownership. Cons: requires secure storage and spreads can be high." },
        { heading: "2. Jewelry — Investment or Adornment?", body: "Jewelry is not an ideal investment because fabrication costs paid at purchase are not recovered on sale. But it's acceptable as a long-term value store." },
        { heading: "3. Gold ETFs", body: "Allows you to invest in gold without physical storage. Traded on exchanges like stocks. Suitable for investors wanting flexibility and liquidity." },
        { heading: "4. Futures Contracts", body: "For advanced investors only. Leverage allows large gains or large losses. Not suitable for beginners." },
        { heading: "Practical Tips for Beginners", body: "• Don't put more than 10-15% of your portfolio in gold\n• Start with small bars or ETFs\n• Think of gold as long-term insurance, not speculation\n• Track daily gold prices at sardhahab.com" },
      ]}
    />
  );
}
