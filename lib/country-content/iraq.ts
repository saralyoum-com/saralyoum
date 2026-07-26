import type { ContentSection, CountryFAQ } from "@/components/CountryContent";

export const iraqContent: {
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
      heading: "الذهب في جمهورية العراق",
      body: "للعراق تاريخ عريق في صناعة الذهب، وسوق السراي في بغداد كان لقرون مركزا لصياغة الذهب وتجارته. ويُعدّ الذهب في العراق وسيلة ادخار أساسية للأسر خصوصا في ظل تقلبات الاقتصاد. سعر الذهب اليوم في العراق يُحسب من سعر الأونصة العالمي بالدولار مضروبا في سعر صرف الدينار العراقي، ثم تُضاف أجرة الصياغة. ومن خصوصيات السوق العراقي التمييز بين «الذهب العراقي» المصنوع محليا و«الذهب الخليجي» المستورد، وهو تمييز يؤثر في السعر والتصميم وأجرة الصياغة.",
    },
    en: {
      heading: "Gold in Iraq",
      body: "Iraq has a long heritage in goldsmithing — Souk al-Saray in Baghdad was for centuries a centre of gold craft and trade. Gold is a primary household savings vehicle in Iraq, especially amid economic volatility. Today's gold price in Iraq is calculated from the global ounce price in USD multiplied by the Iraqi Dinar exchange rate, then craftsmanship is added. A distinctive feature of the Iraqi market is the distinction between locally made \"Iraqi gold\" and imported \"Gulf gold\", which affects price, design and making charges.",
    },
  },

  market: {
    ar: {
      heading: "أسواق الذهب في العراق",
      body: [
        "سوق السراي في بغداد — من أقدم مراكز صياغة الذهب في العراق وله تاريخ ممتد لقرون.",
        "أسواق الذهب في شارع النهر ببغداد — من أشهر وجهات شراء الذهب والمجوهرات في العاصمة.",
        "أسواق النجف وكربلاء — تنشط بحركة الزوار وتشتهر بالقطع التقليدية.",
        "أسواق البصرة وأربيل والموصل — تخدم جنوب العراق وشماله بتصاميم وأسعار متفاوتة.",
        "محلات الذهب المرخّصة المنتشرة في المحافظات — تبيع المجوهرات والليرات الذهبية.",
      ],
    },
    en: {
      heading: "Gold Markets in Iraq",
      body: [
        "Souk al-Saray in Baghdad — among Iraq's oldest goldsmithing centres, with a history spanning centuries.",
        "The gold shops of Al-Nahr Street in Baghdad — one of the capital's best-known destinations for gold and jewellery.",
        "The markets of Najaf and Karbala — busy with pilgrims and known for traditional pieces.",
        "Markets in Basra, Erbil and Mosul — serving Iraq's south and north with varying designs and prices.",
        "Licensed gold shops across the governorates — selling jewellery and gold liras.",
      ],
    },
  },

  culture: {
    ar: {
      heading: "الذهب في الأعراس والمناسبات العراقية",
      body: "يحتل الذهب مكانة مركزية في الأعراس العراقية، حيث تُزيَّن العروس بأطقم ذهبية كاملة تشمل العقود والأساور والأقراط وقطع الرأس التقليدية، وتُعدّ هذه الأطقم جزءا من مراسم الزفاف وليست مجرد هدية. وتختلف قيمة الشبكة باختلاف المحافظة والعائلة والوضع الاقتصادي. ومن العادات الراسخة تقديم الذهب في المواليد والخطوبة، إضافة إلى شراء الليرات الذهبية بغرض الادخار. ويميل كثير من العراقيين إلى اعتبار الذهب أكثر أمانا من الاحتفاظ بالنقد نظرا لتقلبات سعر الصرف.",
    },
    en: {
      heading: "Gold in Iraqi Weddings & Occasions",
      body: "Gold is central to Iraqi weddings, where the bride is adorned with full gold sets including necklaces, bangles, earrings and traditional headpieces — part of the ceremony itself rather than merely a gift. Shabka values vary by governorate, family and economic circumstances. Giving gold at births and engagements is well established, alongside buying gold liras for savings. Many Iraqis regard gold as safer than holding cash given exchange rate volatility.",
    },
  },

  dealers: {
    ar: {
      heading: "أين تشتري الذهب في العراق",
      body: [
        "أسواق الذهب التقليدية في بغداد — أوسع خيارات المقارنة بين المحلات والتفاوض على أجرة الصياغة.",
        "المحلات المرخّصة في المحافظات — اشترِ منها لضمان الفاتورة وإمكانية إعادة البيع.",
        "شركات استيراد الذهب الخليجي — تبيع قطعا خليجية بعيارات مرتفعة وتصاميم مختلفة عن الصياغة المحلية.",
        "للادخار: الليرات (الجنيهات) الذهبية والسبائك هي الخيار الأفضل للاحتفاظ بالقيمة.",
        "قارن السعر بين الذهب العراقي والخليجي، فالفارق يكون في أجرة الصياغة والتصميم لا في سعر المعدن.",
      ],
    },
    en: {
      heading: "Where to Buy Gold in Iraq",
      body: [
        "Baghdad's traditional gold markets — the widest scope for comparing shops and negotiating craftsmanship.",
        "Licensed shops in the governorates — buy from them to ensure an invoice and future resale.",
        "Gulf gold importers — selling high-karat Gulf pieces with designs distinct from local craft.",
        "For savings: gold liras (sovereigns) and bars are the best option for retaining value.",
        "Compare Iraqi against Gulf gold — the difference is in craftsmanship and design, not the metal price.",
      ],
    },
  },

  history: {
    ar: {
      heading: "سعر الذهب في العراق وأثر سعر الصرف",
      body: "يتأثر سعر الذهب في العراق بعاملين معا: السعر العالمي للأونصة، وسعر صرف الدينار العراقي مقابل الدولار. وقد شهد العراق خلال السنوات الماضية تغيّرات في سعر الصرف الرسمي وفوارق بينه وبين السعر في السوق الموازية، وهو ما ينعكس أحيانا على أسعار الذهب المعروضة في المحلات ويجعلها تختلف بين محافظة وأخرى. ومع الصعود العالمي القوي للذهب، ارتفعت الأسعار المحلية بشكل ملحوظ، وزاد إقبال الأسر على شراء الليرات الذهبية باعتبارها مخزنا للقيمة. ولهذا يُنصح دائما بمراجعة السعر لحظة الشراء لا الاعتماد على سعر قديم.",
    },
    en: {
      heading: "Iraq Gold Prices and the Exchange Rate Factor",
      body: "Gold prices in Iraq are driven by two factors together: the global ounce price and the Iraqi Dinar's exchange rate against the dollar. In recent years Iraq has seen changes in the official rate and gaps between it and the parallel market — which sometimes feeds into shop prices and makes them differ from one governorate to another. With gold's strong global rally, local prices have risen markedly and household demand for gold liras as a store of value has increased. It is therefore always advisable to check the price at the moment of purchase rather than rely on an older quote.",
    },
  },

  buyingGuide: {
    ar: {
      heading: "دليل شراء الذهب في العراق",
      body: [
        "تأكد من العيار المدموغ على القطعة: 875 لعيار 21، و916 لعيار 22، و750 لعيار 18.",
        "اشترِ من محل مرخّص واطلب فاتورة رسمية تتضمن الوزن والعيار وسعر الجرام وأجرة الصياغة.",
        "زن القطعة أمامك على ميزان معايَر ولا تكتفِ بالوزن المذكور شفهيا.",
        "اسأل صراحة إن كانت القطعة عراقية الصنع أم خليجية، فلكل منهما سعر صياغة وتصميم مختلف.",
        "راجع سعر الجرام لحظة الشراء، لأن تقلب سعر الصرف قد يغيّر السعر خلال اليوم نفسه.",
        "للادخار اختر الليرات الذهبية أو السبائك بدل المجوهرات لتقليل الخسارة عند إعادة البيع.",
        "احتفظ بالفاتورة، فهي تثبت العيار والوزن وتساعدك على الحصول على سعر أفضل عند البيع.",
      ],
    },
    en: {
      heading: "Guide to Buying Gold in Iraq",
      body: [
        "Check the hallmark stamped on the piece: 875 for 21K, 916 for 22K, 750 for 18K.",
        "Buy from a licensed shop and request an official invoice with weight, karat, gram price and craftsmanship.",
        "Have the piece weighed in front of you on a calibrated scale — do not rely on a verbally stated weight.",
        "Ask explicitly whether the piece is Iraqi-made or Gulf gold; each carries different craftsmanship and design.",
        "Check the gram price at the moment of purchase, as exchange rate moves can change it within the same day.",
        "For savings choose gold liras or bars over jewellery to reduce loss on resale.",
        "Keep the invoice — it proves karat and weight and helps you get a better price when selling.",
      ],
    },
  },

  faq: [
    {
      q: { ar: "ما الفرق بين الذهب العراقي والذهب الخليجي؟", en: "What's the difference between Iraqi and Gulf gold?" },
      a: { ar: "الفرق ليس في المعدن نفسه بل في مكان الصياغة والتصميم وأجرة الصياغة. الذهب العراقي مصنوع محليا بتصاميم تقليدية، بينما يُستورد الذهب الخليجي من دول الخليج بتصاميم مختلفة وغالبا بعيارات مرتفعة. تحقّق دائما من العيار المدموغ في الحالتين.",
            en: "The difference is not in the metal itself but in where it is crafted, the design and the making charge. Iraqi gold is made locally in traditional designs, while Gulf gold is imported with different designs and often higher karats. Always check the stamped hallmark in either case." },
    },
    {
      q: { ar: "لماذا يختلف سعر الذهب بين المحافظات العراقية؟", en: "Why do gold prices differ between Iraqi governorates?" },
      a: { ar: "سعر الذهب الخام واحد عالميا، لكن الاختلاف يأتي من أجرة الصياغة وهوامش المحلات ومن فوارق سعر صرف الدولار بين السوق الرسمية والموازية، إضافة إلى تكاليف النقل ومستوى الطلب في كل محافظة.",
            en: "The raw gold price is globally uniform, but differences arise from craftsmanship charges, shop margins, gaps between official and parallel dollar rates, plus transport costs and demand levels in each governorate." },
    },
    {
      q: { ar: "ما هو سوق السراي؟", en: "What is Souk al-Saray?" },
      a: { ar: "سوق السراي في بغداد من أقدم أسواق العراق، وكان لقرون مركزا لصياغة الذهب وتجارته، ويمثّل جزءا من التراث التجاري لبغداد إلى جانب أسواقها التاريخية الأخرى.",
            en: "Souk al-Saray in Baghdad is among Iraq's oldest markets and was for centuries a centre of goldsmithing and trade, forming part of Baghdad's commercial heritage alongside its other historic souks." },
    },
    {
      q: { ar: "هل الليرة الذهبية استثمار جيد في العراق؟", en: "Are gold liras a good investment in Iraq?" },
      a: { ar: "الليرات الذهبية من أكثر أشكال الادخار شيوعا في العراق لأنها سهلة التخزين والبيع وتحتفظ بقيمتها أفضل من المجوهرات، إذ لا تتحمّل أجرة صياغة مرتفعة تُخصم عند إعادة البيع. اشترِها من محل مرخّص واحتفظ بالفاتورة.",
            en: "Gold liras are among the most common savings forms in Iraq — easy to store and sell, and they hold value better than jewellery since they do not carry the high craftsmanship charge that is deducted on resale. Buy from a licensed shop and keep the invoice." },
    },
    {
      q: { ar: "ما العيار الأكثر شيوعا في السوق العراقي؟", en: "Which karat is most common in the Iraqi market?" },
      a: { ar: "يشيع عيار 21 في المجوهرات والمناسبات في العراق، ويتوفر أيضا عيار 22 خصوصا في القطع الخليجية المستوردة، بينما يُستخدم عيار 18 في بعض التصاميم الحديثة والقطع المرصّعة.",
            en: "21K is common in Iraqi jewellery and occasions, with 22K also available especially in imported Gulf pieces, while 18K is used in some modern and gem-set designs." },
    },
    {
      q: { ar: "كيف أتجنّب الغش عند شراء الذهب في العراق؟", en: "How do I avoid being cheated when buying gold in Iraq?" },
      a: { ar: "اشترِ من محل مرخّص ومعروف، وتحقّق من الدمغة على القطعة، واطلب وزنها أمامك على ميزان معايَر، واحصل على فاتورة رسمية تفصل الوزن والعيار وسعر الجرام وأجرة الصياغة. تجنّب الشراء من باعة غير معروفين أو بدون فاتورة.",
            en: "Buy from a licensed, well-known shop, verify the hallmark, have it weighed in front of you on a calibrated scale, and get an official invoice separating weight, karat, gram price and craftsmanship. Avoid unknown sellers or purchases without an invoice." },
    },
  ],
};
