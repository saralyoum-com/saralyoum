import type { ContentSection, CountryFAQ } from "@/components/CountryContent";

export const bahrainContent: {
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
      heading: "الذهب في مملكة البحرين",
      body: "تُعدّ البحرين من أقدم مراكز تجارة الذهب واللؤلؤ في الخليج، ويشتهر سوقها بأن كل قطعة ذهب معروضة فيه تحمل دمغة رسمية إلزامية توضّح العيار والمنشأ. سعر الذهب اليوم في البحرين يُحسب من سعر الأونصة العالمي بالدولار مضروبا في سعر صرف الدينار البحريني المربوط بالدولار عند 0.376 دينار تقريبا، ثم تُضاف المصنعية وضريبة القيمة المضافة. والدينار البحريني من أقوى العملات في العالم، لذا يبدو سعر جرام الذهب بالدينار رقما صغيرا مقارنة بالعملات العربية الأخرى.",
    },
    en: {
      heading: "Gold in Bahrain",
      body: "Bahrain is one of the Gulf's oldest gold and pearl trading centres, and its market is known for mandatory official hallmarking — every piece carries a stamp showing purity and origin. Today's gold price in Bahrain is calculated from the global ounce price in USD multiplied by the Bahraini Dinar, pegged to the dollar at roughly 0.376 BHD, then craftsmanship and VAT are added. The Bahraini Dinar is one of the world's strongest currencies, so the gram price in BHD looks small compared with other Arab currencies.",
    },
  },

  market: {
    ar: {
      heading: "أسواق الذهب في البحرين",
      body: [
        "سوق الذهب في المنامة — السوق التاريخي في قلب العاصمة، ومركز تجارة الذهب في المملكة منذ عقود.",
        "مدينة الذهب (Gold City) في المنامة — مبنى حديث من طابقين افتُتح عام 2011 ويضم أكثر من 100 محل للمجوهرات، وهو امتداد عصري للسوق التاريخي.",
        "من أبرز المحلات داخل مدينة الذهب: جويالوكاس وأطلس وأريهانت للمجوهرات.",
        "محلات المجوهرات في مجمّع سيتي سنتر البحرين وباقي المراكز التجارية — للماركات العالمية والقطع الفاخرة.",
        "يتوفر في السوق البحريني إلى جانب الذهب: اللؤلؤ الطبيعي والألماس والعملات القديمة، وهي من خصوصيات هذا السوق.",
      ],
    },
    en: {
      heading: "Gold Markets in Bahrain",
      body: [
        "Manama Gold Souq — the historic market in the heart of the capital and the Kingdom's gold trading hub for decades.",
        "Gold City in Manama — a modern two-storey building opened in 2011 with over 100 jewellery stores, a contemporary extension of the historic souq.",
        "Notable retailers inside Gold City include Joyalukkas, Atlas and Arihant Jewellers.",
        "Jewellery stores at Bahrain City Centre and other malls — for international brands and luxury pieces.",
        "Alongside gold, the Bahraini market is known for natural pearls, diamonds and old coins — a distinctive feature of this souq.",
      ],
    },
  },

  culture: {
    ar: {
      heading: "الذهب في المناسبات البحرينية",
      body: "يرتبط الذهب في البحرين بتاريخ طويل من تجارة اللؤلؤ، وما زالت القطع التي تجمع بين الذهب واللؤلؤ الطبيعي من أكثر الهدايا قيمة في الأعراس البحرينية. وتُعدّ الشبكة الذهبية جزءا أساسيا من مراسم الزواج، وتُقدَّم عادة من عيار 21 و22. كما يشيع تقديم الذهب في المناسبات العائلية والأعياد، وينشط السوق بشكل ملحوظ في رمضان وعيد الفطر. ويجذب سوق الذهب البحريني زوارا من السعودية عبر جسر الملك فهد، خاصة في عطلات نهاية الأسبوع.",
    },
    en: {
      heading: "Gold in Bahraini Occasions",
      body: "Gold in Bahrain is tied to a long history of pearl trading, and pieces combining gold with natural pearls remain among the most prized wedding gifts. The gold shabka is a core part of marriage customs, usually given in 21K and 22K. Gold is also commonly given at family occasions and Eid, with the market notably busier during Ramadan and Eid Al-Fitr. Bahrain's gold souq draws visitors from Saudi Arabia via the King Fahd Causeway, especially at weekends.",
    },
  },

  dealers: {
    ar: {
      heading: "أين تشتري الذهب في البحرين",
      body: [
        "مدينة الذهب في المنامة — أكبر تجمّع للمجوهرات في المملكة وأفضل مكان للمقارنة بين أكثر من 100 محل.",
        "سوق الذهب التاريخي في المنامة — للمحلات التقليدية والقطع ذات الطابع المحلي وأسعار مصنعية أقل غالبا.",
        "سلاسل المجوهرات العالمية والهندية الكبرى — تقدّم شهادات وضمانات وخدمة ما بعد البيع.",
        "للاستثمار: اطلب سبائك بنقاء 99.5% فما فوق، فهي الفئة التي تخضع لمعاملة ضريبية مختلفة عن المجوهرات.",
        "تأكد دائما من وجود الدمغة الرسمية، فالدمغة إلزامية في البحرين وتوضّح العيار والمنشأ.",
      ],
    },
    en: {
      heading: "Where to Buy Gold in Bahrain",
      body: [
        "Gold City in Manama — the Kingdom's largest jewellery cluster and the best place to compare over 100 shops.",
        "The historic Manama Gold Souq — for traditional shops, locally styled pieces and often lower making charges.",
        "Major international and Indian jewellery chains — offering certificates, warranties and after-sales service.",
        "For investment: ask for bars of 99.5%+ purity, the category treated differently for tax than jewellery.",
        "Always check for the official hallmark — hallmarking is mandatory in Bahrain and shows purity and origin.",
      ],
    },
  },

  history: {
    ar: {
      heading: "سعر الذهب في البحرين وضريبة القيمة المضافة",
      body: "ارتفع سعر الذهب في البحرين خلال السنوات الأخيرة تبعا للاتجاه العالمي الصاعد، ومع ربط الدينار البحريني بالدولار بسعر ثابت فإن الأسعار المحلية تعكس السوق العالمي مباشرة دون تأثير من تقلبات العملة. التغيير الأهم محليا كان تطبيق ضريبة القيمة المضافة اعتبارا من عام 2019 ثم رفع نسبتها إلى 10% في عام 2022. وبحسب الهيئة الوطنية للإيرادات، تخضع مجوهرات الذهب وأجور المصنعية للضريبة بالنسبة القياسية، بينما يخضع الذهب الاستثماري لنسبة صفرية بشرط أن يكون نقاؤه 99% فما فوق وقابلا للتداول في أسواق السبائك العالمية. هذا الفارق يجعل السبائك خيارا أوفر للمستثمر مقارنة بالمجوهرات.",
    },
    en: {
      heading: "Bahrain Gold Prices and VAT",
      body: "Gold prices in Bahrain have risen in recent years in line with the global uptrend, and because the Dinar is pegged to the dollar at a fixed rate, local prices mirror the global market without currency effects. The most significant local change was the introduction of VAT in 2019 and its increase to 10% in 2022. According to the National Bureau for Revenue, gold jewellery and making charges are subject to VAT at the standard rate, while investment gold is zero-rated provided it is at least 99% pure and tradeable on global bullion markets. That distinction makes bars a cheaper option for investors than jewellery.",
    },
  },

  buyingGuide: {
    ar: {
      heading: "دليل شراء الذهب في البحرين",
      body: [
        "الدمغة إلزامية في البحرين — تأكد من وجودها: 916 لعيار 22، و875 لعيار 21، و750 لعيار 18.",
        "اطلب فاتورة رسمية تفصل الوزن والعيار وسعر الجرام والمصنعية وقيمة الضريبة كل على حدة.",
        "للاستثمار اختر السبائك بنقاء 99% فما فوق للاستفادة من المعاملة الضريبية الصفرية بدل شراء المجوهرات.",
        "تفاوض على المصنعية، فهي البند القابل للتفاوض، أما سعر الذهب الخام فيتحدّد يوميا عالميا.",
        "زن القطعة أمامك على ميزان معايَر واطلب رؤية الوزن بنفسك قبل الدفع.",
        "قارن بين مدينة الذهب والسوق التاريخي، فالفارق في المصنعية بين الاثنين قد يكون ملموسا.",
        "احتفظ بالفاتورة والشهادة، فهما يرفعان قيمة إعادة البيع خصوصا للقطع المصنّعة والماركات.",
      ],
    },
    en: {
      heading: "Guide to Buying Gold in Bahrain",
      body: [
        "Hallmarking is mandatory in Bahrain — check for it: 916 for 22K, 875 for 21K, 750 for 18K.",
        "Request an official invoice separating weight, karat, gram price, craftsmanship and VAT.",
        "For investment choose bars of 99%+ purity to benefit from zero-rated treatment rather than buying jewellery.",
        "Negotiate on making charges — the negotiable item; the raw gold price is set globally each day.",
        "Have the piece weighed in front of you on a calibrated scale before paying.",
        "Compare Gold City against the historic souq — the craftsmanship difference can be noticeable.",
        "Keep the invoice and certificate; they raise resale value, especially for branded and crafted pieces.",
      ],
    },
  },

  faq: [
    {
      q: { ar: "كم نسبة ضريبة القيمة المضافة على الذهب في البحرين؟", en: "What is the VAT rate on gold in Bahrain?" },
      a: { ar: "النسبة القياسية لضريبة القيمة المضافة في البحرين هي 10%، وتُطبّق على مجوهرات الذهب وعلى أجور المصنعية. أما الذهب الاستثماري بنقاء 99% فما فوق والقابل للتداول في أسواق السبائك العالمية فيخضع لنسبة صفرية.",
            en: "Bahrain's standard VAT rate is 10%, applied to gold jewellery and to making charges. Investment gold of 99%+ purity that is tradeable on global bullion markets is zero-rated." },
    },
    {
      q: { ar: "هل الذهب في البحرين معفى من الضريبة تماما؟", en: "Is gold in Bahrain completely tax-free?" },
      a: { ar: "لا. تنتشر معلومة خاطئة بأن الذهب في البحرين معفى بالكامل، والصحيح أن المجوهرات والمصنعية تخضع لضريبة 10%، والإعفاء (النسبة الصفرية) يقتصر على الذهب الاستثماري عالي النقاء وفق شروط الهيئة الوطنية للإيرادات.",
            en: "No. A common misconception claims gold in Bahrain is entirely tax-free. In fact jewellery and making charges are subject to 10% VAT; zero-rating applies only to high-purity investment gold under the National Bureau for Revenue's conditions." },
    },
    {
      q: { ar: "ما هي مدينة الذهب في المنامة؟", en: "What is Gold City in Manama?" },
      a: { ar: "مدينة الذهب مبنى حديث من طابقين في المنامة افتُتح عام 2011، ويضم أكثر من 100 محل للمجوهرات، وهو أكبر تجمّع لتجارة الذهب في البحرين وامتداد عصري لسوق الذهب التاريخي.",
            en: "Gold City is a modern two-storey building in Manama opened in 2011 with over 100 jewellery stores. It is Bahrain's largest gold trading cluster and a contemporary extension of the historic gold souq." },
    },
    {
      q: { ar: "هل الدمغة إلزامية على الذهب في البحرين؟", en: "Is hallmarking mandatory on gold in Bahrain?" },
      a: { ar: "نعم، الدمغة إلزامية في البحرين، ويجب أن تحمل كل قطعة ذهب ختما يوضّح درجة النقاء والمنشأ. وهذا من أبرز ما يميّز السوق البحريني ويمنح المشتري ضمانا إضافيا.",
            en: "Yes. Hallmarking is mandatory in Bahrain and every gold piece must carry a stamp showing purity and origin. This is a distinguishing feature of the Bahraini market and gives buyers extra assurance." },
    },
    {
      q: { ar: "لماذا يبدو سعر جرام الذهب بالدينار البحريني صغيرا؟", en: "Why does the gram price look so small in Bahraini Dinars?" },
      a: { ar: "لأن الدينار البحريني من أقوى العملات في العالم، إذ يساوي الدولار نحو 0.376 دينار فقط. فالرقم يبدو صغيرا لكنه يعادل قيمة مماثلة لأسعار الذهب في بقية دول الخليج بعد التحويل.",
            en: "Because the Bahraini Dinar is one of the world's strongest currencies — one dollar equals only about 0.376 BHD. The number looks small but converts to a value comparable with gold prices elsewhere in the Gulf." },
    },
    {
      q: { ar: "ما العيارات المتوفرة في سوق البحرين؟", en: "Which karats are available in the Bahraini market?" },
      a: { ar: "يتوفر في سوق البحرين عيار 18 و21 و22 و24، ويشيع الطلب على العيارات المرتفعة 21 و22 في المجوهرات والمناسبات، بينما يُستخدم عيار 18 في التصاميم الحديثة والقطع المرصّعة.",
            en: "The Bahraini market offers 18K, 21K, 22K and 24K. Demand concentrates on higher karats — 21K and 22K — for jewellery and occasions, while 18K is used in modern and gem-set designs." },
    },
  ],
};
