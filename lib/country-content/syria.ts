import type { ContentSection, CountryFAQ } from "@/components/CountryContent";

export const syriaContent: {
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
      heading: "الذهب في الجمهورية العربية السورية",
      body: "لسوريا تاريخ عريق في صياغة الذهب، ودمشق وحلب من أقدم مراكز هذه الحرفة في المنطقة. ويُعدّ الذهب في سوريا الملاذ الأول للأسر للحفاظ على قيمة مدخراتها بعد سنوات من تراجع قيمة العملة. سعر الذهب اليوم في سوريا يُحسب من سعر الأونصة العالمي بالدولار مضروبا في سعر صرف الليرة السورية، ثم تُضاف أجرة الصياغة. وينظّم القطاع في سوريا الهيئة العامة لإدارة المعادن الثمينة عبر جمعيات مرخّصة في المحافظات، وهي التي تعلن الأسعار الاسترشادية للجرام.",
    },
    en: {
      heading: "Gold in Syria",
      body: "Syria has a long heritage in goldsmithing, with Damascus and Aleppo among the region's oldest centres of the craft. Gold is the primary refuge for Syrian households seeking to preserve savings after years of currency depreciation. Today's gold price in Syria is calculated from the global ounce price in USD multiplied by the Syrian Pound exchange rate, then craftsmanship is added. The sector is regulated by the General Authority for the Management of Precious Metals through licensed associations in the provinces, which publish indicative gram prices.",
    },
  },

  market: {
    ar: {
      heading: "أسواق الذهب في سوريا",
      body: [
        "سوق الحميدية في دمشق القديمة — من أشهر أسواق الشام التاريخية وتتفرّع منه أسواق الصاغة.",
        "سوق الصاغة في دمشق — المركز الرئيسي لتجارة الذهب في العاصمة.",
        "أسواق حلب — لمدينة حلب تاريخ طويل في صياغة الذهب والمجوهرات التقليدية.",
        "أسواق حمص وحماة واللاذقية وطرطوس — تخدم أسواقا محلية نشطة في الوسط والساحل.",
        "الجمعيات الحرفية المرخّصة في المحافظات — تعمل تحت إشراف الهيئة العامة لإدارة المعادن الثمينة.",
      ],
    },
    en: {
      heading: "Gold Markets in Syria",
      body: [
        "Souk Al-Hamidiyah in Old Damascus — one of the Levant's most famous historic markets, with goldsmith souks branching from it.",
        "Souq Al-Sagha in Damascus — the capital's main gold trading centre.",
        "Aleppo's markets — the city has a long history in goldsmithing and traditional jewellery.",
        "Markets in Homs, Hama, Latakia and Tartus — serving active local markets in the centre and coast.",
        "Licensed craft associations in the provinces — operating under the General Authority for the Management of Precious Metals.",
      ],
    },
  },

  culture: {
    ar: {
      heading: "الذهب في الأعراس والمناسبات السورية",
      body: "تُعدّ الشبكة الذهبية ركنا أساسيا في الزواج السوري، ويقدّمها العريس للعروس، وتختلف قيمتها ومكوّناتها باختلاف المنطقة والعائلة والظروف الاقتصادية. ويغلب على المجوهرات في سوريا عيار 21، وتشتهر الصياغة الدمشقية والحلبية بالنقوش الدقيقة والقطع التقليدية المتوارثة. ومن العادات الراسخة إهداء الذهب في المواليد والخطوبة والأعياد. وفي السنوات الأخيرة تغيّر نمط الشراء، إذ صار كثير من السوريين يفضّلون القطع الخفيفة والسبائك الصغيرة بغرض الادخار بدل المجوهرات الثقيلة، وذلك بسبب ارتفاع الأسعار وتراجع القدرة الشرائية.",
    },
    en: {
      heading: "Gold in Syrian Weddings & Occasions",
      body: "The gold shabka is a cornerstone of Syrian marriage, presented by the groom to the bride, with its value and composition varying by region, family and economic circumstances. Syrian jewellery is predominantly 21K, and Damascene and Aleppan craft is known for fine engraving and traditional inherited pieces. Giving gold at births, engagements and Eid is well established. In recent years buying patterns have shifted: many Syrians now prefer lightweight pieces and small bars for savings rather than heavy jewellery, owing to high prices and reduced purchasing power.",
    },
  },

  dealers: {
    ar: {
      heading: "أين تشتري الذهب في سوريا",
      body: [
        "محلات الصاغة المرخّصة والمسجّلة في الجمعيات الحرفية — اشترِ منها لضمان العيار والفاتورة.",
        "سوق الصاغة في دمشق وأسواق حلب — أوسع خيارات المقارنة بين المحلات.",
        "تحقّق من السعر الاسترشادي المعلن من الجهات المنظّمة قبل الشراء لتعرف السعر العادل للجرام.",
        "للادخار: القطع الخفيفة والسبائك الصغيرة والليرات الذهبية هي الأكثر احتفاظا بالقيمة.",
        "تجنّب الشراء من باعة غير مرخّصين أو بدون فاتورة، خصوصا في ظروف السوق المتقلبة.",
      ],
    },
    en: {
      heading: "Where to Buy Gold in Syria",
      body: [
        "Licensed jewellers registered with the craft associations — buy from them to ensure purity and an invoice.",
        "Souq Al-Sagha in Damascus and Aleppo's markets — the widest scope for comparing shops.",
        "Check the indicative price published by the regulating bodies before buying, so you know the fair gram rate.",
        "For savings: lightweight pieces, small bars and gold liras hold value best.",
        "Avoid unlicensed sellers or purchases without an invoice, especially in volatile market conditions.",
      ],
    },
  },

  history: {
    ar: {
      heading: "سعر الذهب في سوريا وتغيّر العملة",
      body: "شهدت سوريا تحوّلا نقديا مهما مطلع عام 2026، إذ أُطلقت الليرة السورية الجديدة بحذف صفرين من العملة القديمة، بحيث تعادل كل مئة ليرة قديمة ليرة جديدة واحدة، وجرى تداول العملتين معا لفترة انتقالية. وهذا التغيير تقني في جوهره ولا يغيّر القيمة الحقيقية للذهب، لكنه غيّر الأرقام المعروضة في المحلات بشكل جذري، فما كان يُعرض بمئات الآلاف صار يُعرض بالآلاف. ومن المهم عند مقارنة الأسعار التأكد ممّا إذا كان السعر مذكورا بالعملة الجديدة أم القديمة لتجنّب الالتباس. أما اتجاه السعر فقد بقي صاعدا تبعا للسوق العالمي ولتراجع القوة الشرائية، ما جعل الذهب الوسيلة الأبرز لحفظ القيمة لدى الأسر السورية.",
    },
    en: {
      heading: "Syria Gold Prices and the Currency Change",
      body: "Syria underwent a significant monetary change at the start of 2026 with the launch of the new Syrian Pound, removing two zeros from the old currency so that every 100 old pounds equals one new pound, with both circulating together during a transition period. The change is technical in nature and does not alter gold's real value, but it dramatically changed the figures displayed in shops — what was quoted in hundreds of thousands is now quoted in thousands. When comparing prices it is important to confirm whether a figure is in the new or old currency to avoid confusion. The price trend has remained upward in line with the global market and declining purchasing power, making gold the foremost store of value for Syrian households.",
    },
  },

  buyingGuide: {
    ar: {
      heading: "دليل شراء الذهب في سوريا",
      body: [
        "تأكد أولا إن كان السعر المعروض بالليرة الجديدة أم القديمة، فالفارق بينهما مئة ضعف.",
        "راجع السعر الاسترشادي المعلن من الجهة المنظّمة قبل الشراء لتقارن به عرض المحل.",
        "تحقّق من الدمغة على القطعة: 875 لعيار 21، و750 لعيار 18، و916 لعيار 22.",
        "اشترِ من محل مرخّص واطلب فاتورة تتضمن الوزن والعيار وسعر الجرام وأجرة الصياغة.",
        "زن القطعة أمامك على ميزان معايَر واطلب رؤية القراءة بنفسك.",
        "للادخار فضّل السبائك الصغيرة والليرات الذهبية والقطع الخفيفة على المجوهرات الثقيلة المزخرفة.",
        "راجع السعر لحظة الشراء، فتقلب سعر الصرف قد يغيّر سعر الجرام خلال اليوم نفسه.",
      ],
    },
    en: {
      heading: "Guide to Buying Gold in Syria",
      body: [
        "First confirm whether the quoted price is in new or old pounds — the difference is a factor of one hundred.",
        "Check the indicative price published by the regulator before buying, to compare against the shop's offer.",
        "Verify the hallmark: 875 for 21K, 750 for 18K, 916 for 22K.",
        "Buy from a licensed shop and request an invoice with weight, karat, gram price and craftsmanship.",
        "Have the piece weighed in front of you on a calibrated scale and see the reading yourself.",
        "For savings prefer small bars, gold liras and lightweight pieces over heavy ornate jewellery.",
        "Check the price at the moment of purchase — exchange rate volatility can change the gram price within a day.",
      ],
    },
  },

  faq: [
    {
      q: { ar: "ما هي الليرة السورية الجديدة وكيف تؤثر على سعر الذهب؟", en: "What is the new Syrian Pound and how does it affect gold prices?" },
      a: { ar: "أُطلقت الليرة السورية الجديدة مطلع عام 2026 بحذف صفرين من العملة القديمة، فكل 100 ليرة قديمة تساوي ليرة جديدة واحدة. هذا التغيير لا يغيّر القيمة الحقيقية للذهب، لكنه يغيّر الأرقام المعروضة، لذا تأكد دائما من وحدة العملة عند مقارنة الأسعار.",
            en: "The new Syrian Pound was launched at the start of 2026, removing two zeros from the old currency so 100 old pounds equal one new pound. This does not change gold's real value but does change the displayed figures — so always confirm which currency unit a price is quoted in." },
    },
    {
      q: { ar: "من يحدّد سعر الذهب الرسمي في سوريا؟", en: "Who sets the official gold price in Syria?" },
      a: { ar: "تنظّم القطاع الهيئة العامة لإدارة المعادن الثمينة عبر جمعيات حرفية مرخّصة في المحافظات، وتُعلن أسعار استرشادية للجرام تُتّخذ مرجعا في السوق. ومن المفيد مراجعة هذه الأسعار قبل الشراء أو البيع.",
            en: "The sector is regulated by the General Authority for the Management of Precious Metals through licensed craft associations in the provinces, which publish indicative gram prices used as a market reference. It is useful to check these before buying or selling." },
    },
    {
      q: { ar: "ما هو العيار الأكثر شيوعا في سوريا؟", en: "Which karat is most common in Syria?" },
      a: { ar: "عيار 21 هو الأكثر شيوعا في المجوهرات السورية والمناسبات والشبكة، ويتوفر عيار 18 في بعض التصاميم الحديثة، بينما تُستخدم السبائك والليرات الذهبية بعيارات أعلى لأغراض الادخار.",
            en: "21K is the most common in Syrian jewellery, occasions and the wedding shabka, with 18K available in some modern designs, while bars and gold liras in higher karats are used for savings." },
    },
    {
      q: { ar: "لماذا يشتري السوريون الذهب بكثافة؟", en: "Why do Syrians buy gold so heavily?" },
      a: { ar: "لأن الذهب يمثّل وسيلة عملية للحفاظ على قيمة المدخرات في ظل تراجع القوة الشرائية للعملة المحلية. فهو سهل التخزين وقابل للبيع سريعا عند الحاجة، ويحتفظ بقيمته أمام التضخم على عكس الاحتفاظ بالنقد.",
            en: "Because gold is a practical way to preserve savings amid the local currency's declining purchasing power. It is easy to store, can be sold quickly when needed, and holds value against inflation unlike holding cash." },
    },
    {
      q: { ar: "لماذا يفضّل السوريون القطع الخفيفة والسبائك؟", en: "Why do Syrians prefer lightweight pieces and bars?" },
      a: { ar: "لأن ارتفاع الأسعار جعل المجوهرات الثقيلة بعيدة عن متناول كثيرين، ولأن القطع الخفيفة والسبائك الصغيرة تحمل أجرة صياغة أقل، فتخسر أقل عند إعادة البيع وتتيح ادخار مبالغ أصغر تدريجيا.",
            en: "Because high prices have put heavy jewellery out of reach for many, and because lightweight pieces and small bars carry lower craftsmanship charges — losing less on resale and allowing smaller amounts to be saved gradually." },
    },
    {
      q: { ar: "أين يقع سوق الذهب الرئيسي في دمشق؟", en: "Where is the main gold market in Damascus?" },
      a: { ar: "يقع سوق الصاغة في دمشق القديمة قرب سوق الحميدية، وهو المركز الرئيسي لتجارة الذهب في العاصمة ويضم عددا كبيرا من محلات الصاغة التي تتيح المقارنة بين الأسعار والتصاميم.",
            en: "Souq Al-Sagha lies in Old Damascus near Souk Al-Hamidiyah. It is the capital's main gold trading centre and hosts a large number of jewellers, allowing comparison of prices and designs." },
    },
  ],
};
