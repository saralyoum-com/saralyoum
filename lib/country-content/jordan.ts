import type { ContentSection, CountryFAQ } from "@/components/CountryContent";

export const jordanContent: {
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
      heading: "الذهب في المملكة الأردنية الهاشمية",
      body: "يحتل الذهب مكانة خاصة في الأردن باعتباره وسيلة ادخار تقليدية للأسر، وسوق الصاغة في وسط عمّان من أعرق أسواق الذهب في بلاد الشام. سعر الذهب اليوم في الأردن يُحسب من سعر الأونصة العالمي بالدولار مضروبا في سعر صرف الدينار الأردني المربوط بالدولار عند 0.709 دينار تقريبا، ثم تُضاف المصنعية ورسم الدمغة. وثبات سعر صرف الدينار منذ عقود يعني أن أسعار الذهب المحلية تتبع السوق العالمي مباشرة، على عكس دول المنطقة ذات العملات المتقلبة.",
    },
    en: {
      heading: "Gold in Jordan",
      body: "Gold holds a special place in Jordan as a traditional household savings vehicle, and the Souq Al-Sagha in downtown Amman is one of the Levant's oldest gold markets. Today's gold price in Jordan is calculated from the global ounce price in USD multiplied by the Jordanian Dinar, pegged to the dollar at roughly 0.709 JOD, then craftsmanship and the hallmark fee are added. The Dinar's decades-long stability means local gold prices track the global market directly, unlike regional countries with volatile currencies.",
    },
  },

  market: {
    ar: {
      heading: "أسواق الذهب في الأردن",
      body: [
        "سوق الصاغة في وسط البلد بعمّان — السوق التاريخي الأشهر ويضم أكثر من مئة محل للذهب والمجوهرات في أزقة متجاورة.",
        "محلات الذهب في مناطق عمّان الحديثة كالصويفية وعبدون — تركّز على التصاميم العصرية والماركات.",
        "أسواق الذهب في إربد والزرقاء والسلط — تخدم شمال المملكة ووسطها بأسعار مصنعية تنافسية.",
        "محلات العقبة — تنشط مع حركة السياحة والزوار القادمين من دول الجوار.",
        "معارض ومهرجانات المجوهرات التي تُقام في عمّان موسميا وتقدّم عروضا على المصنعية.",
      ],
    },
    en: {
      heading: "Gold Markets in Jordan",
      body: [
        "Souq Al-Sagha in downtown Amman — the best-known historic market, with over a hundred gold and jewellery shops in adjoining lanes.",
        "Gold shops in modern Amman districts such as Sweifieh and Abdoun — focused on contemporary designs and brands.",
        "Gold markets in Irbid, Zarqa and Salt — serving the north and centre with competitive making charges.",
        "Aqaba's shops — busier with tourism and visitors from neighbouring countries.",
        "Seasonal jewellery exhibitions and festivals held in Amman, often with craftsmanship discounts.",
      ],
    },
  },

  culture: {
    ar: {
      heading: "الذهب في الأعراس والمناسبات الأردنية",
      body: "تُعدّ الشبكة الذهبية ركنا أساسيا في الزواج الأردني، ويقدّمها العريس للعروس قبل عقد القران، وتختلف قيمتها باختلاف المناطق والأسر والظروف الاقتصادية. ويغلب على الشبكة عيار 21 لأنه الأكثر تفضيلا في الأردن، ويشمل عادة طقما من العقد والأساور والخاتم. ومن العادات الراسخة تقديم الذهب في المناسبات العائلية كالمواليد والخطوبة والأعياد. كما يُنظر إلى الذهب في الأردن باعتباره مدخرات يمكن تسييلها وقت الحاجة، ولهذا يرتفع الإقبال على البيع في المواسم التي تزيد فيها المصاريف كبداية العام الدراسي.",
    },
    en: {
      heading: "Gold in Jordanian Weddings & Occasions",
      body: "The gold shabka is a cornerstone of Jordanian marriage, presented by the groom to the bride before the marriage contract, with values varying by region, family and economic conditions. It is usually 21K — the most preferred karat in Jordan — and typically comprises a necklace, bracelets and a ring set. Giving gold at family occasions such as births, engagements and Eid is well established. Jordanians also view gold as savings that can be liquidated when needed, so selling rises in seasons of higher expenses such as the start of the school year.",
    },
  },

  dealers: {
    ar: {
      heading: "أين تشتري الذهب في الأردن",
      body: [
        "سوق الصاغة في وسط عمّان — الخيار الأفضل لتنوّع المحلات والمقارنة والتفاوض على المصنعية.",
        "محلات الأحياء الحديثة — أسعار مصنعية أعلى غالبا مقابل تصاميم عصرية وخدمة أرقى.",
        "المحلات المرخّصة والمسجّلة رسميا — تضمن حقك في الفاتورة والدمغة وإعادة البيع لاحقا.",
        "للاستثمار: اسأل عن السبائك والليرات (الجنيهات) الذهبية، فهي الأكثر احتفاظا بالقيمة عند البيع.",
        "قارن سعر الجرام المعلن في أكثر من محل، فالفرق يكون في المصنعية وليس في سعر الذهب الخام.",
      ],
    },
    en: {
      heading: "Where to Buy Gold in Jordan",
      body: [
        "Souq Al-Sagha in downtown Amman — best for variety, comparison and negotiating craftsmanship.",
        "Shops in modern districts — usually higher making charges in exchange for contemporary designs and service.",
        "Licensed, officially registered shops — protecting your right to an invoice, hallmark and future resale.",
        "For investment: ask about bars and gold liras (sovereigns), which hold value best on resale.",
        "Compare the quoted gram price across shops — the difference lies in craftsmanship, not the raw gold price.",
      ],
    },
  },

  history: {
    ar: {
      heading: "سعر الذهب في الأردن ورسم الدمغة",
      body: "ارتفع سعر الذهب في الأردن خلال السنوات الأخيرة تبعا للاتجاه العالمي الصاعد، ومع ثبات سعر صرف الدينار مقابل الدولار انعكست الزيادات العالمية مباشرة على السوق المحلي. الملف الأبرز محليا هو رسم الدمغة على الذهب: ففي أعقاب رفع الرسم تراجعت المبيعات بشكل حاد واحتج أصحاب محلات الذهب وأضربوا عن العمل، ما دفع الحكومة إلى خفض رسم الدمغة على الذهب المحلي والمستورد والسبائك بأكثر من 50%. ومن المهم للمشتري أن يعرف أن الذهب في الأردن معفى من ضريبة المبيعات العامة، وأن ما يُضاف إلى السعر هو المصنعية ورسم الدمغة وليس ضريبة مبيعات.",
    },
    en: {
      heading: "Jordan Gold Prices and the Hallmark Fee",
      body: "Gold prices in Jordan have risen in recent years with the global uptrend, and because the Dinar's exchange rate against the dollar is stable, global increases pass straight through to the local market. The most prominent local issue is the hallmark fee: after it was raised, sales fell sharply and gold shop owners protested and went on strike, prompting the government to cut the hallmark fee on local, imported and bullion gold by more than 50%. Buyers should know that gold in Jordan is exempt from general sales tax — what is added to the price is craftsmanship and the hallmark fee, not sales tax.",
    },
  },

  buyingGuide: {
    ar: {
      heading: "دليل شراء الذهب في الأردن",
      body: [
        "تأكد من الدمغة الرسمية على القطعة: 875 لعيار 21، و750 لعيار 18، و916 لعيار 22.",
        "اطلب فاتورة رسمية تفصل الوزن والعيار وسعر الجرام والمصنعية ورسم الدمغة بشكل واضح.",
        "اعلم أن الذهب معفى من ضريبة المبيعات العامة في الأردن، فلا تقبل إضافة ضريبة مبيعات على الفاتورة.",
        "تفاوض على المصنعية تحديدا، فهي البند القابل للتفاوض أما سعر الذهب الخام فموحّد يوميا.",
        "زن القطعة أمامك على ميزان معايَر واطلب رؤية القراءة بنفسك قبل الدفع.",
        "للاستثمار اختر السبائك أو الليرات الذهبية بدل المجوهرات لتتجنّب خسارة المصنعية عند البيع.",
        "احتفظ بالفاتورة، فهي مرجعك عند البيع أو الاستبدال وتثبت العيار والوزن.",
      ],
    },
    en: {
      heading: "Guide to Buying Gold in Jordan",
      body: [
        "Check the official hallmark: 875 for 21K, 750 for 18K, 916 for 22K.",
        "Request an official invoice separating weight, karat, gram price, craftsmanship and the hallmark fee.",
        "Know that gold is exempt from general sales tax in Jordan — do not accept sales tax added to the invoice.",
        "Negotiate specifically on making charges; the raw gold price is set daily and is not negotiable.",
        "Have the piece weighed in front of you on a calibrated scale before paying.",
        "For investment choose bars or gold liras over jewellery to avoid losing craftsmanship value on resale.",
        "Keep the invoice — it is your reference when selling or exchanging and proves karat and weight.",
      ],
    },
  },

  faq: [
    {
      q: { ar: "هل يوجد ضريبة مبيعات على الذهب في الأردن؟", en: "Is there sales tax on gold in Jordan?" },
      a: { ar: "الذهب في الأردن معفى من ضريبة المبيعات العامة سواء كان مجوهرات أو سبائك أو ليرات ذهبية. لكن هناك رسم دمغة يُضاف إلى السعر، وهو غير ضريبة المبيعات، وقد خُفّض بأكثر من 50% بعد تراجع المبيعات واحتجاج أصحاب المحلات.",
            en: "Gold in Jordan is exempt from general sales tax, whether jewellery, bullion or gold liras. There is, however, a hallmark fee added to the price — separate from sales tax — which was cut by more than 50% after sales fell and shop owners protested." },
    },
    {
      q: { ar: "ما هو العيار الأكثر تفضيلا في الأردن؟", en: "Which karat is most preferred in Jordan?" },
      a: { ar: "عيار 21 هو الأكثر تفضيلا لدى الأردنيين في المجوهرات اليومية والمناسبات والشبكة، بينما يُستخدم عيار 18 في بعض التصاميم الحديثة والقطع المرصّعة بالأحجار.",
            en: "21K is the most preferred among Jordanians for everyday jewellery, occasions and the wedding shabka, while 18K is used in some modern designs and gem-set pieces." },
    },
    {
      q: { ar: "أين يقع سوق الذهب الرئيسي في عمّان؟", en: "Where is Amman's main gold market?" },
      a: { ar: "سوق الصاغة في وسط البلد هو سوق الذهب الرئيسي في عمّان، وهو سوق تاريخي يضم أكثر من مئة محل للصاغة والمجوهرات في شبكة أزقة متجاورة، ويوفّر أفضل فرصة للمقارنة والتفاوض.",
            en: "Souq Al-Sagha in downtown Amman is the city's main gold market — a historic souq with over a hundred goldsmiths and jewellers across a maze of adjoining lanes, offering the best chance to compare and negotiate." },
    },
    {
      q: { ar: "ما هو رسم الدمغة ولماذا يُضاف للسعر؟", en: "What is the hallmark fee and why is it added?" },
      a: { ar: "رسم الدمغة رسم رسمي مقابل ختم القطعة بعلامة تثبت درجة نقائها، وهو ضمان للمشتري بأن العيار المكتوب صحيح. يُضاف إلى سعر القطعة إلى جانب المصنعية، وقد خُفّض مؤخرا بأكثر من النصف بعد تأثيره على حجم المبيعات.",
            en: "The hallmark fee is an official charge for stamping a piece with a mark certifying its purity — an assurance to the buyer that the stated karat is accurate. It is added alongside craftsmanship, and was recently cut by more than half after it hurt sales volumes." },
    },
    {
      q: { ar: "هل سعر الذهب في الأردن يتأثر بتقلبات العملة؟", en: "Do currency swings affect gold prices in Jordan?" },
      a: { ar: "لا تقريبا، لأن الدينار الأردني مربوط بالدولار الأمريكي بسعر ثابت منذ عقود عند 0.709 دينار للدولار. لذلك تعكس أسعار الذهب المحلية تحرّكات السوق العالمي مباشرة دون تشويه من العملة، بخلاف دول تعاني تقلبات حادة في عملاتها.",
            en: "Almost not at all — the Jordanian Dinar has been pegged to the US dollar at a fixed rate for decades at about 0.709 JOD. Local gold prices therefore mirror global moves directly, without the currency distortion seen in countries with volatile exchange rates." },
    },
    {
      q: { ar: "كيف أبيع ذهبي بأفضل سعر في الأردن؟", en: "How do I sell my gold at the best price in Jordan?" },
      a: { ar: "قارن العرض بين أكثر من محل في سوق الصاغة، واحضر الفاتورة الأصلية إن توفرت لأنها تثبت العيار والوزن. يُحتسب سعر البيع على أساس سعر الجرام اليومي مطروحا منه المصنعية، لذلك تحقّق السبائك والليرات الذهبية عائدا أفضل من المجوهرات.",
            en: "Compare offers across several shops in Souq Al-Sagha and bring the original invoice if you have it, as it proves karat and weight. Sale prices are based on the daily gram rate minus craftsmanship, which is why bars and gold liras return more than jewellery." },
    },
  ],
};
