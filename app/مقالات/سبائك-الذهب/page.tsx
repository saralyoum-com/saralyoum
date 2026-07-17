import ArticlePage from "@/components/ArticlePage";

export default function Page() {
  return (
    <ArticlePage
      slug="سبائك-الذهب"
      icon="🪙"
      category="استثمار"
      date="2026-07-16"
      readMins={7}
      titleAr="سبائك الذهب للمبتدئين — الأوزان والأسعار وكيف تشتري أول سبيكة"
      titleEn="Gold Bullion for Beginners — Weights, Prices, and Buying Your First Bar"
      descAr="دليل شراء سبائك الذهب: الأوزان الشائعة من 1 جرام إلى الكيلو، كيف يحسب سعر السبيكة وعلاوة السك، الفرق بينها وبين المشغولات للاستثمار، والضريبة في الدول العربية."
      descEn="Gold bullion buying guide: common weights from 1g to 1kg, how bar prices and premiums work, bullion vs jewelry for investment, and VAT across Arab countries."
      sectionsAr={[
        {
          heading: "ما هي سبيكة الذهب؟ وما أوزانها الشائعة؟",
          body: "السبيكة هي ذهب نقي عيار 24 (نقاء 999.9) مصبوب في قالب موحد ومختوم من مصفاة معتمدة، بدون أي صياغة أو تصميم — أقرب شكل لامتلاك الذهب 'الخام' مباشرة.\n\nالأوزان الشائعة في الأسواق العربية:\n• 1 جرام: نقطة دخول رمزية، لكن علاوتها النسبية مرتفعة\n• 5 و10 جرام: الأكثر شعبية للمدخرين المبتدئين\n• 20 و50 جرام: توازن جيد بين السعر والعلاوة\n• 100 جرام: خيار المدخرين الجادين\n• الأونصة (31.1 جرام): المعيار العالمي، شائعة في سبائك المصافي السويسرية\n• الكيلو: للمستثمرين الكبار والمؤسسات\n\nالقاعدة: كلما كبر وزن السبيكة انخفضت علاوة السك نسبيا — الكيلو أرخص لكل جرام من سبيكة 1 جرام.",
        },
        {
          heading: "كيف يحسب سعر السبيكة؟",
          body: "سعر السبيكة = (الوزن × سعر جرام عيار 24) + علاوة السك\n\nعلاوة السك (البريميوم) هي أجرة المصفاة للصب والختم والتغليف، وتتراوح عادة:\n• سبيكة 1 جرام: 8-15% فوق سعر الذهب\n• سبيكة 10 جرام: 3-6%\n• سبيكة 100 جرام: 1-3%\n• الكيلو: أقل من 1%\n\nمثال: سبيكة 10 جرام وسعر جرام 24 هو 494 ريال:\n• قيمة الذهب: 4,940 ريال\n• علاوة 4%: حوالي 198 ريال\n• السعر النهائي التقريبي: 5,138 ريال\n\nتجد أسعار السبائك المحدثة لكل الأوزان في صفحة دولتك على سرد الذهب — قارنها بما يعرضه عليك البائع لتعرف إن كانت العلاوة عادلة.",
        },
        {
          heading: "سبائك أم مشغولات؟ حسم مسألة الاستثمار",
          body: "المقارنة الحاسمة للمدخر:\n\nالسبائك:\n• مصنعية شبه معدومة (علاوة سك صغيرة فقط)\n• معفاة من ضريبة القيمة المضافة في السعودية والإمارات وعُمان (كذهب استثماري نقاء 99%+)\n• تباع بسهولة قريبا جدا من سعر السوق — الفجوة 2-5% فقط\n• لا متعة اقتناء — قطعة معدنية في خزنة\n\nالمشغولات:\n• مصنعية 10-20% لا تستردها + ضريبة في معظم الدول\n• فجوة إعادة البيع قد تصل 25%\n• لكنها تلبس وتهدى ولها قيمة اجتماعية وجمالية\n\nالخلاصة الصريحة: إذا كان هدفك نمو المال وحفظه — السبائك بلا منازع. المشغولات شراء استهلاكي جميل وليست أداة استثمار. راجع مقال الفرق بين سعر البيع والشراء للأرقام الكاملة.",
        },
        {
          heading: "كيف تشتري أول سبيكة بأمان؟",
          body: "خمس خطوات عملية:\n\n1. اشتر من جهة موثوقة: محلات الذهب الكبرى المرخصة، البنوك التي تبيع سبائك، أو وكلاء المصافي المعتمدين. تجنب البائعين الأفراد والعروض 'المغرية' في الإنترنت.\n\n2. تحقق من الختم: السبيكة الأصلية مختومة بوزنها ونقائها (999.9) واسم المصفاة ورقم تسلسلي. المصافي المعتمدة عالميا (بختم LBMA) هي الأعلى ثقة وأسهل بيعا لاحقا.\n\n3. اطلب فاتورة مفصلة: بالوزن والنقاء والرقم التسلسلي — هي وثيقتك عند البيع لاحقا.\n\n4. ابدأ صغيرا: سبيكة 5 أو 10 جرام كافية لفهم العملية قبل مبالغ أكبر.\n\n5. قارن العلاوة قبل الدفع: احسب (سعر البائع − قيمة الذهب الخام) ÷ قيمة الذهب الخام. إن تجاوزت النسب المذكورة أعلاه بكثير، اشتر من مكان آخر.",
        },
        {
          heading: "التخزين والبيع لاحقا",
          body: "التخزين:\n• المبالغ الصغيرة: خزنة منزلية جيدة غير معلنة\n• المبالغ الكبيرة: صناديق أمانات البنوك (رسوم سنوية رمزية مقابل أمان كامل)\n• احتفظ بالسبيكة في تغليفها الأصلي المختوم — فتح التغليف قد ينقص قيمتها عند البيع\n\nالبيع:\n• السبائك المختومة من مصافي معروفة تباع في دقائق لدى أي محل ذهب كبير\n• قارن عروض أكثر من مشتر — حتى في السبائك توجد فروقات\n• وقت البيع الأفضل هو قمم السعر: تابع الرسم البياني وفعل تنبيهات سرد الذهب لتعرف لحظة الارتفاعات القوية\n\nوتذكر أن زكاة الذهب تجب على السبائك المدخرة إذا بلغت النصاب وحال عليها الحول — راجع مقال زكاة الذهب وحاسبة الزكاة في الموقع.",
        },
      ]}
      sectionsEn={[
        {
          heading: "What Is a Gold Bar? Common Weights",
          body: "A bullion bar is pure 24K gold (999.9 fine) cast in a standard mold and stamped by an accredited refinery, with no craftsmanship or design — the closest thing to owning 'raw' gold directly.\n\nCommon weights in Arab markets:\n• 1 gram: symbolic entry point, but relatively high premium\n• 5 and 10 grams: most popular with beginner savers\n• 20 and 50 grams: good balance of price and premium\n• 100 grams: the serious saver's choice\n• The ounce (31.1g): the global standard, common in Swiss refinery bars\n• The kilo: for large investors and institutions\n\nThe rule: the heavier the bar, the lower the relative minting premium — a kilo is cheaper per gram than a 1g bar.",
        },
        {
          heading: "How Bar Prices Are Calculated",
          body: "Bar price = (weight × 24K gram price) + minting premium\n\nThe premium covers the refinery's casting, stamping and packaging, typically:\n• 1g bar: 8-15% over gold value\n• 10g bar: 3-6%\n• 100g bar: 1-3%\n• Kilo: under 1%\n\nExample: a 10g bar with the 24K gram at 494 SAR:\n• Gold value: 4,940 SAR\n• 4% premium: ~198 SAR\n• Approximate final price: 5,138 SAR\n\nYou'll find updated bullion prices for every weight on your country's page at sardhahab.com — compare them against any seller's quote to judge whether the premium is fair.",
        },
        {
          heading: "Bullion or Jewelry? Settling the Investment Question",
          body: "The decisive comparison for savers:\n\nBullion:\n• Near-zero making charge (small minting premium only)\n• VAT-exempt in Saudi Arabia, the UAE and Oman (as investment gold, 99%+ purity)\n• Resells easily, very close to market — a 2-5% gap only\n• No enjoyment of ownership — a metal slab in a safe\n\nJewelry:\n• 10-20% making charge you never recover + VAT in most countries\n• Resale gap can reach 25%\n• But it's worn, gifted, and carries social and aesthetic value\n\nThe honest conclusion: if your goal is growing and preserving money — bullion, no contest. Jewelry is a beautiful consumer purchase, not an investment vehicle.",
        },
        {
          heading: "Buying Your First Bar Safely",
          body: "Five practical steps:\n\n1. Buy from a trusted source: major licensed gold shops, banks that sell bullion, or accredited refinery dealers. Avoid individual sellers and 'tempting' online offers.\n\n2. Verify the stamp: a genuine bar is stamped with weight, purity (999.9), refinery name and a serial number. Globally accredited refineries (LBMA-stamped) are the most trusted and easiest to resell.\n\n3. Demand an itemized invoice: weight, purity, serial number — your document for future resale.\n\n4. Start small: a 5g or 10g bar is enough to learn the process before larger amounts.\n\n5. Compare the premium before paying: (seller price − raw gold value) ÷ raw gold value. If it far exceeds the ranges above, buy elsewhere.",
        },
        {
          heading: "Storage and Selling Later",
          body: "Storage:\n• Small amounts: a good undisclosed home safe\n• Larger amounts: bank safe deposit boxes (token annual fee for full security)\n• Keep the bar in its original sealed packaging — opening it can reduce resale value\n\nSelling:\n• Bars stamped by known refineries sell within minutes at any major gold shop\n• Compare several buyers' offers — spreads exist even in bullion\n• The best time to sell is at price peaks: watch the chart and enable sardhahab.com alerts to catch strong rallies\n\nAnd remember zakat applies to saved bullion once it reaches the nisab and a lunar year passes — see the site's zakat guide and calculator.",
        },
      ]}
    />
  );
}
