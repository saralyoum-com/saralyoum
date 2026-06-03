import type { ContentSection, CountryFAQ } from "@/components/CountryContent";

export const egyptContent: {
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
      heading: "الذهب في مصر — حكاية حضارة وادّخار",
      body: "ارتبط الذهب بمصر منذ آلاف السنين، فقد كان الفراعنة أوّل من اعتبر الذهب رمزاً للقوة والخلود. اليوم، مصر من أكبر مستهلكي الذهب في إفريقيا، حيث يُقبل المصريون على شراء الذهب كملاذ آمن في مواجهة تقلبات الجنيه المصري وارتفاع التضخم. شهدت السنوات الأخيرة اهتماماً متزايداً بالذهب كأداة استثمار وادّخار، خاصةً بعد التعويم المتكرر للجنيه. سوق الصاغة في وسط القاهرة يُعدّ من أعرق أسواق الذهب في الوطن العربي، ويستقطب آلاف المشترين يومياً.",
    },
    en: {
      heading: "Gold in Egypt — A Story of Civilization and Savings",
      body: "Gold has been linked to Egypt for thousands of years — pharaohs were among the first to view gold as a symbol of power and eternity. Today, Egypt is one of Africa's largest gold consumers, with Egyptians buying gold as a safe haven against Egyptian Pound volatility and rising inflation. Recent years saw growing interest in gold as investment and savings tool, especially after repeated EGP floats. Khan El-Khalili Gold Bazaar in central Cairo is one of the oldest gold markets in the Arab world, attracting thousands of buyers daily.",
    },
  },

  market: {
    ar: {
      heading: "أشهر أسواق الذهب في مصر",
      body: [
        "سوق الصاغة في خان الخليلي (القاهرة) — أعرق أسواق الذهب وأكثرها شهرة، يضم مئات المحلات في منطقة الحسين.",
        "سوق الذهب في الصاغة بالإسكندرية — منافس قوي لسوق القاهرة بأسعار تنافسية.",
        "سوق ميدان التحرير وشارع المعز — تشتهر بالذهب الحديث والتصاميم العصرية.",
        "أسواق المنصورة والمحلة الكبرى ودمياط — معروفة بمصنعية متميزة وأسعار جيدة لأهل الدلتا.",
        "سوق الذهب في أسيوط وسوهاج — شائع في الصعيد ويستقبل الخليجيين القادمين للسياحة العلاجية.",
        "محلات الذهب في المولات الحديثة (سيتي ستارز، مول العرب) — تقدّم تجربة شراء عصرية بأسعار أعلى قليلاً.",
      ],
    },
    en: {
      heading: "Famous Gold Markets in Egypt",
      body: [
        "Khan El-Khalili Gold Bazaar (Cairo) — oldest and most famous gold market with hundreds of shops in Hussein area.",
        "Alexandria Gold Souk — strong competitor with competitive prices.",
        "Tahrir Square and Al-Muizz Street — known for modern gold and contemporary designs.",
        "Mansoura, Mahalla El-Kubra, and Damietta markets — known for fine craftsmanship and good prices for Delta residents.",
        "Assiut and Sohag gold markets — popular in Upper Egypt, hosting Gulf visitors on medical tourism.",
        "Mall gold stores (City Stars, Mall of Arabia) — modern shopping experience at slightly higher prices.",
      ],
    },
  },

  culture: {
    ar: {
      heading: "الذهب في الأعراس والمناسبات المصرية",
      body: "الشبكة في الزواج المصري عادة راسخة منذ قرون، حيث يُقدّمها العريس للعروس قبل عقد القران كرمز للالتزام. تختلف قيمة الشبكة باختلاف الطبقة الاجتماعية والمنطقة، لكن المتوسط يتراوح بين 20-40 جراماً من الذهب عيار 21، مع طقم كامل من الإكسسوارات الذهبية في الأعراس الفاخرة. الذهب أيضاً عنصر أساسي في 'الشبكة' و'حق المتعة' و'المؤخر' في عقد الزواج المصري. ومن العادات المميزة في الصعيد تقديم الذهب للمرأة عند ولادة أول مولود ذكر. وفي شم النسيم وعيد الفطر، تنتشر هدايا الذهب الصغيرة (حلقان وخواتم) للفتيات الصغيرات.",
    },
    en: {
      heading: "Gold in Egyptian Weddings & Occasions",
      body: "The shabka (engagement gold) in Egyptian weddings is a centuries-old tradition, presented by the groom to the bride before marriage as a commitment symbol. Shabka value varies by social class and region — averaging 20-40 grams of 21K gold, with complete gold accessory sets in luxury weddings. Gold also forms part of 'shabka', 'haq al-mata', and 'mu'akhar' in Egyptian marriage contracts. In Upper Egypt, presenting gold to a wife upon birth of first son is unique tradition. During Sham El-Nessim and Eid Al-Fitr, small gold gifts (earrings, rings) for young girls are common.",
    },
  },

  dealers: {
    ar: {
      heading: "أكبر محلات وماركات الذهب في مصر",
      body: [
        "لازوردي — أكبر مُصنّع مجوهرات في مصر والشرق الأوسط، له فروع في كل المحافظات.",
        "ماكلين (Maclain) — سلسلة مصرية معروفة بالذهب التقليدي والكلاسيكي.",
        "بريمو (Primo) — متخصصة في المجوهرات الفاخرة والذهب الإيطالي.",
        "الصاغة (Sagha) — اتحاد محلات الصاغة المعتمدة من شعبة الذهب.",
        "بي بي (BB Gold) — تقدّم تصاميم عصرية وذهب الاستثمار.",
        "محلات سوق الصاغة التقليدية في خان الخليلي — أفضل الأسعار للمشتري الذي يجيد المساومة.",
        "سبائك ذهب من البنوك (البنك الأهلي، CIB، بنك مصر) — للاستثمار طويل الأمد بضمانات رسمية.",
      ],
    },
    en: {
      heading: "Top Gold Brands & Shops in Egypt",
      body: [
        "L'azurde — largest jewelry manufacturer in Egypt and Middle East, branches in all governorates.",
        "Maclain — Egyptian chain known for traditional and classic gold.",
        "Primo — specialized in luxury jewelry and Italian gold.",
        "Sagha — certified gold shops federation from Gold Division.",
        "BB Gold — offers contemporary designs and investment gold.",
        "Traditional shops in Khan El-Khalili — best prices for skilled negotiators.",
        "Bank gold bars (National Bank of Egypt, CIB, Banque Misr) — for long-term investment with official guarantees.",
      ],
    },
  },

  history: {
    ar: {
      heading: "تطور سعر الذهب في مصر — قصة تضخم وادّخار",
      body: "سعر الذهب في مصر مرتبط ارتباطاً وثيقاً بسعر الجنيه المصري مقابل الدولار. في 2016، كان جرام عيار 21 يُباع بحوالي 380 جنيهاً، ثم قفز إلى 700 جنيه بعد تعويم 2016. في 2022 وصل إلى 1,000 جنيه، وبعد تعويم مارس 2024 قفز السعر إلى أكثر من 3,500 جنيه. في 2026، يتجاوز سعر الجرام 6,500 جنيه، وهو ما يُعدّ ارتفاعاً غير مسبوق. هذا الارتفاع جعل الذهب الملاذ الأول للمصريين لحماية مدخراتهم من التضخم، وأصبحت المنازل المصرية تكتنز الذهب بكميات قياسية. ووفقاً لتقديرات شعبة الذهب، فإن المصريين يمتلكون أكثر من 1,500 طن من الذهب في صورة مدخرات وحلي.",
    },
    en: {
      heading: "Gold Price History in Egypt — Inflation & Savings Story",
      body: "Egyptian gold prices are closely tied to EGP/USD rate. In 2016, 21K gram sold for ~EGP 380, jumping to EGP 700 after 2016 float. In 2022 reached EGP 1,000; after March 2024 float jumped to over EGP 3,500. In 2026, gram price exceeds EGP 6,500 — unprecedented rise. This pushed gold to become Egyptians' primary safe haven against inflation, with Egyptian homes hoarding gold at record levels. According to Gold Division estimates, Egyptians hold over 1,500 tons of gold in savings and jewelry form.",
    },
  },

  buyingGuide: {
    ar: {
      heading: "كيف تشتري الذهب بأمان في مصر",
      body: [
        "تأكد من وجود الدمغة المصرية الرسمية (875 لعيار 21، 750 لعيار 18) من مصلحة الدمغة والموازين.",
        "اطلب فاتورة رسمية مختومة، فهي ضرورية لإثبات الملكية في حالة البيع لاحقاً.",
        "في سوق الصاغة، اشترِ من محلات معتمدة من شعبة الذهب — احذر من التجار غير المسجّلين.",
        "متوسط المصنعية في مصر: 5-10% للذهب العادي، و20-30% للقطع المصممة.",
        "للاستثمار، اختر السبائك من البنوك أو الذهب الإنجليزي/السويسري عيار 24.",
        "تجنّب الذهب 'الخردة' أو 'المستعمل' إلا من محلات موثوقة، فهو قد يكون مغشوشاً.",
        "أفضل أوقات الشراء: شهري يونيو ويوليو (انخفاض الطلب)، وقبل عيد الفطر مباشرةً.",
        "احذر من إعلانات 'أرخص ذهب في مصر' على فيسبوك — معظمها عمليات نصب.",
      ],
    },
    en: {
      heading: "How to Buy Gold Safely in Egypt",
      body: [
        "Verify Egyptian official hallmark (875 for 21K, 750 for 18K) from Hallmark & Scales Authority.",
        "Request stamped official invoice — essential for proving ownership when reselling.",
        "In Khan El-Khalili, buy from Gold Division certified shops — avoid unregistered dealers.",
        "Average craftsmanship in Egypt: 5-10% for standard gold, 20-30% for designer pieces.",
        "For investment, choose bank bars or English/Swiss 24K gold.",
        "Avoid 'scrap' or 'used' gold unless from trusted shops — may be counterfeit.",
        "Best buying times: June-July (lower demand) and just before Eid Al-Fitr.",
        "Beware 'cheapest gold in Egypt' Facebook ads — most are scams.",
      ],
    },
  },

  faq: [
    {
      q: { ar: "لماذا يرتفع سعر الذهب في مصر باستمرار؟", en: "Why do gold prices keep rising in Egypt?" },
      a: { ar: "يرتبط سعر الذهب في مصر بسعر الجنيه مقابل الدولار. مع كل انخفاض في قيمة الجنيه، يرتفع سعر الذهب بنفس النسبة تقريباً. إضافة إلى ذلك، الأسعار العالمية للذهب في ارتفاع مستمر بسبب التضخم العالمي والتوترات الاقتصادية.",
            en: "Egyptian gold prices are tied to EGP/USD rate. Each EGP depreciation pushes gold up proportionally. Plus global gold prices continuously rise due to global inflation and economic tensions." },
    },
    {
      q: { ar: "هل عيار 21 أفضل من عيار 18 في مصر؟", en: "Is 21K better than 18K in Egypt?" },
      a: { ar: "للاستثمار وحفظ القيمة، عيار 21 أفضل بكثير لأنه يحتوي نسبة ذهب أعلى (87.5%) مقابل (75%) للعيار 18. أما للارتداء اليومي، عيار 18 أقوى وأصلب ويتحمّل الاستخدام الطويل بدون خدش. عيار 21 هو الأكثر شعبية في مصر للاستثمار والادّخار.",
            en: "For investment and value preservation, 21K is much better (87.5% gold vs 75% for 18K). For daily wear, 18K is stronger and resists scratching. 21K is most popular in Egypt for investment and saving." },
    },
    {
      q: { ar: "ما الفرق بين الذهب المصري والذهب السعودي؟", en: "What's the difference between Egyptian and Saudi gold?" },
      a: { ar: "العيار نفسه في كلا البلدين (21 و18 و24)، والفرق يكون في التصاميم والمصنعية. الذهب المصري معروف بالتصاميم التراثية والكلاسيكية، بينما السعودي يميل للتصاميم العصرية. أحياناً يكون سعر المصنعية في مصر أقل بسبب انخفاض تكاليف العمالة.",
            en: "Same karats in both countries (21, 18, 24K). Differences are in designs and craftsmanship. Egyptian gold is known for heritage and classic designs; Saudi tends toward modern designs. Craftsmanship is sometimes cheaper in Egypt due to lower labor costs." },
    },
    {
      q: { ar: "هل يجب أن أشتري ذهب الآن أم أنتظر؟", en: "Should I buy gold now or wait?" },
      a: { ar: "مع التضخم المرتفع وتقلبات الجنيه، الذهب يظل ملاذاً آمناً للحفاظ على القوة الشرائية. خبراء الاستثمار ينصحون بشراء كميات صغيرة بانتظام (شراء تدريجي) بدلاً من شراء كمية كبيرة دفعة واحدة، لتقليل المخاطر مع التقلبات.",
            en: "With high inflation and EGP volatility, gold remains a safe haven for preserving purchasing power. Investment experts recommend regular small purchases (dollar-cost averaging) rather than one large purchase, to reduce volatility risks." },
    },
    {
      q: { ar: "كيف أتعرف على الذهب الأصلي من المغشوش؟", en: "How to spot fake gold from real?" },
      a: { ar: "اطلب اختبار الذهب بحامض النيتريك من محل مختص، فحامض النيتريك يُغيّر لون الذهب المغشوش. كما يمكن استخدام جهاز قياس كثافة الذهب. الذهب الأصلي يحمل الدمغة الرسمية المصرية المختومة بالليزر، وله رنين معدني مميز عند الضرب.",
            en: "Request nitric acid test from a specialist shop — acid changes color of fake gold. You can also use a gold density tester. Authentic gold carries Egyptian official laser hallmark and has distinctive metallic ring when tapped." },
    },
    {
      q: { ar: "ما هي ضرائب شراء الذهب في مصر؟", en: "What taxes apply to gold purchase in Egypt?" },
      a: { ar: "في مصر لا تُطبق ضريبة القيمة المضافة على الذهب الخام أو المسبوك، لكنها تُطبق على المصنعية فقط (14%). الذهب من البنوك الحكومية معفى من بعض الضرائب لأنه مخصص للاستثمار.",
            en: "In Egypt, VAT doesn't apply to raw or molded gold, but applies to craftsmanship only (14%). Gold from government banks is exempt from some taxes as it's for investment." },
    },
  ],
};
