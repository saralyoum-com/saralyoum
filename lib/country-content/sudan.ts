import type { ContentSection, CountryFAQ } from "@/components/CountryContent";

export const sudanContent: {
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
      heading: "الذهب في جمهورية السودان",
      body: "يحتل السودان موقعا خاصا في خريطة الذهب العربية، فهو من أكبر منتجي الذهب في إفريقيا، والذهب يمثّل المصدر الأهم لإيراداته. وإلى جانب الإنتاج، يمثّل الذهب وسيلة ادخار أساسية للأسر السودانية في ظل تقلبات العملة. سعر الذهب اليوم في السودان يُحسب من سعر الأونصة العالمي بالدولار مضروبا في سعر صرف الجنيه السوداني، ثم تُضاف أجرة الصياغة. وتجدر الإشارة إلى أن الفارق بين سعر الصرف الرسمي والسعر في السوق الموازية يجعل الأسعار المعروضة في المحلات تتفاوت أحيانا بشكل ملحوظ.",
    },
    en: {
      heading: "Gold in Sudan",
      body: "Sudan occupies a distinctive place on the Arab gold map as one of Africa's largest gold producers, with gold representing its single most important revenue source. Alongside production, gold is a primary savings vehicle for Sudanese households amid currency volatility. Today's gold price in Sudan is calculated from the global ounce price in USD multiplied by the Sudanese Pound exchange rate, then craftsmanship is added. Note that the gap between the official and parallel market exchange rates can make shop prices vary noticeably.",
    },
  },

  market: {
    ar: {
      heading: "سوق الذهب والتعدين في السودان",
      body: [
        "السودان من أكبر منتجي الذهب في إفريقيا، وبلغ إنتاجه نحو 70 طنا خلال الفترة بين 2023 و2025.",
        "التعدين الأهلي (التقليدي) يشكّل نحو 80% من إجمالي إنتاج الذهب في البلاد.",
        "أسواق الصاغة في الخرطوم وأم درمان — المراكز الرئيسية لتجارة الذهب والمجوهرات.",
        "أسواق ولايات نهر النيل والشمالية — قريبة من مناطق التعدين وتنشط فيها تجارة الذهب الخام.",
        "شركة الموارد المعدنية هي الجهة الرسمية المنظّمة لقطاع التعدين وتسويق الذهب.",
      ],
    },
    en: {
      heading: "Sudan's Gold Market and Mining",
      body: [
        "Sudan is one of Africa's largest gold producers, with output of around 70 tons between 2023 and 2025.",
        "Artisanal (traditional) mining accounts for roughly 80% of the country's total gold production.",
        "The goldsmith markets of Khartoum and Omdurman — the main centres for gold and jewellery trade.",
        "Markets in River Nile and Northern states — close to mining areas, with active raw gold trading.",
        "The Sudanese Mineral Resources Company is the official body regulating mining and gold marketing.",
      ],
    },
  },

  culture: {
    ar: {
      heading: "الذهب في الأعراس والمناسبات السودانية",
      body: "للذهب حضور قوي في الأعراس السودانية، وتُعدّ الشبكة الذهبية جزءا أساسيا من مراسم الزواج، وتشمل عادة أطقما من العقود والأساور والخواتم. وتشتهر المجوهرات السودانية التقليدية بقطع محلية مميزة توارثتها الأجيال وتُستخدم في المناسبات الكبرى. ومن العادات الراسخة تقديم الذهب في الأعياد والمواليد. ويُنظر إلى الذهب في السودان باعتباره مدخرات عائلية تُحفظ للأوقات الصعبة ويمكن تسييلها سريعا، وقد ازدادت أهمية هذا الدور مع الظروف الاقتصادية الصعبة التي تمر بها البلاد.",
    },
    en: {
      heading: "Gold in Sudanese Weddings & Occasions",
      body: "Gold features strongly in Sudanese weddings, where the gold shabka is a core part of marriage customs, typically comprising sets of necklaces, bracelets and rings. Traditional Sudanese jewellery is known for distinctive local pieces passed down through generations and worn at major occasions. Giving gold at Eid and births is well established. Gold is viewed in Sudan as family savings kept for difficult times and quickly liquidated when needed — a role that has grown more important amid the country's difficult economic conditions.",
    },
  },

  dealers: {
    ar: {
      heading: "أين تشتري الذهب في السودان",
      body: [
        "محلات الصاغة المرخّصة في الخرطوم وأم درمان — اشترِ منها لضمان العيار والفاتورة.",
        "أسواق الصاغة التقليدية — أوسع خيارات المقارنة بين المحلات والتفاوض على أجرة الصياغة.",
        "تحقّق من سعر الصرف المعتمد في المحل، فالفارق بين السعر الرسمي والموازي يؤثر مباشرة في سعر الجرام.",
        "للادخار: السبائك والقطع البسيطة تحتفظ بقيمتها أفضل من المجوهرات المزخرفة.",
        "تجنّب شراء الذهب الخام غير المدموغ من مصادر غير مرخّصة.",
      ],
    },
    en: {
      heading: "Where to Buy Gold in Sudan",
      body: [
        "Licensed jewellers in Khartoum and Omdurman — buy from them to ensure purity and an invoice.",
        "Traditional goldsmith markets — the widest scope for comparing shops and negotiating craftsmanship.",
        "Check which exchange rate the shop uses, as the official-versus-parallel gap directly affects the gram price.",
        "For savings: bars and simple pieces hold value better than ornate jewellery.",
        "Avoid buying unhallmarked raw gold from unlicensed sources.",
      ],
    },
  },

  history: {
    ar: {
      heading: "الذهب والاقتصاد السوداني",
      body: "يمثّل الذهب العمود الفقري للإيرادات السودانية، وقد شكّل نحو 70% من الإيرادات الوطنية خلال الفترة بين 2023 و2025. غير أن القطاع يواجه تحديات كبيرة، أبرزها التهريب: فمن أصل نحو 70 طنا أُنتجت، لم يُصدَّر عبر القنوات الرسمية سوى نحو 20 طنا، بينما خرج الباقي عبر قنوات غير رسمية إلى دول الجوار ثم إلى أسواق عالمية. كما يعاني التعدين الأهلي من ظروف عمل خطرة تسبّبت في حوادث انهيار مناجم. وقد فرض الاتحاد الأوروبي في عام 2026 عقوبات تستهدف تجارة الذهب السودانية. هذه العوامل مجتمعة تجعل سوق الذهب المحلي شديد التأثر بسعر الصرف وبظروف السوق الموازية.",
    },
    en: {
      heading: "Gold and Sudan's Economy",
      body: "Gold is the backbone of Sudan's revenues, accounting for around 70% of national revenue between 2023 and 2025. The sector faces major challenges, chief among them smuggling: of roughly 70 tons produced, only about 20 tons were exported through official channels, with the remainder leaving via informal routes to neighbouring countries and on to global markets. Artisanal mining also suffers dangerous working conditions that have caused mine collapse incidents. In 2026 the European Union imposed sanctions targeting Sudan's gold trade. Together these factors leave the domestic gold market highly sensitive to the exchange rate and parallel market conditions.",
    },
  },

  buyingGuide: {
    ar: {
      heading: "دليل شراء الذهب في السودان",
      body: [
        "تحقّق من الدمغة على القطعة: 875 لعيار 21، و916 لعيار 22، و750 لعيار 18.",
        "اشترِ من محل صاغة مرخّص واطلب فاتورة تتضمن الوزن والعيار وسعر الجرام وأجرة الصياغة.",
        "اسأل عن سعر الصرف المعتمد في حساب سعر الجرام، فهو سبب رئيسي لاختلاف الأسعار بين المحلات.",
        "زن القطعة أمامك على ميزان معايَر ولا تعتمد على وزن مذكور شفهيا.",
        "راجع سعر الجرام لحظة الشراء لأن تقلب سعر الصرف قد يغيّره خلال اليوم.",
        "للادخار فضّل السبائك والقطع البسيطة على المجوهرات المزخرفة لتقليل الخسارة عند البيع.",
        "احتفظ بالفاتورة لأنها تثبت العيار والوزن وتساعدك على الحصول على سعر أفضل عند إعادة البيع.",
      ],
    },
    en: {
      heading: "Guide to Buying Gold in Sudan",
      body: [
        "Check the hallmark: 875 for 21K, 916 for 22K, 750 for 18K.",
        "Buy from a licensed jeweller and request an invoice with weight, karat, gram price and craftsmanship.",
        "Ask which exchange rate is used to calculate the gram price — a main reason prices differ between shops.",
        "Have the piece weighed in front of you on a calibrated scale; do not rely on a verbal weight.",
        "Check the gram price at the moment of purchase, as exchange rate swings can change it within the day.",
        "For savings prefer bars and simple pieces over ornate jewellery to reduce loss on resale.",
        "Keep the invoice — it proves karat and weight and helps you get a better price when reselling.",
      ],
    },
  },

  faq: [
    {
      q: { ar: "كم ينتج السودان من الذهب سنويا؟", en: "How much gold does Sudan produce annually?" },
      a: { ar: "يُعدّ السودان من أكبر منتجي الذهب في إفريقيا، وبلغ إنتاجه نحو 70 طنا خلال الفترة بين 2023 و2025، ويأتي نحو 80% منه من التعدين الأهلي التقليدي وليس من الشركات الكبرى.",
            en: "Sudan is among Africa's largest gold producers, with output of around 70 tons between 2023 and 2025. Roughly 80% comes from traditional artisanal mining rather than large companies." },
    },
    {
      q: { ar: "لماذا يختلف سعر الذهب بين محلات الخرطوم؟", en: "Why do gold prices differ between Khartoum shops?" },
      a: { ar: "السبب الرئيسي هو اختلاف سعر الصرف المعتمد في كل محل، إذ يوجد فارق بين السعر الرسمي وسعر السوق الموازية. يُضاف إلى ذلك اختلاف أجرة الصياغة وهوامش الربح بين المحلات.",
            en: "The main reason is the different exchange rate each shop uses, given the gap between the official and parallel market rates. Differences in craftsmanship charges and shop margins add to this." },
    },
    {
      q: { ar: "ما هو التعدين الأهلي في السودان؟", en: "What is artisanal mining in Sudan?" },
      a: { ar: "التعدين الأهلي هو التعدين التقليدي الذي يمارسه أفراد ومجموعات صغيرة بوسائل بسيطة، ويشكّل نحو 80% من إنتاج الذهب في السودان. ويعاني هذا القطاع من ظروف عمل خطرة أدّت إلى حوادث انهيار في المناجم.",
            en: "Artisanal mining is traditional mining carried out by individuals and small groups using basic methods, accounting for about 80% of Sudan's gold output. The sector suffers dangerous conditions that have led to mine collapse incidents." },
    },
    {
      q: { ar: "لماذا يُهرَّب جزء كبير من ذهب السودان؟", en: "Why is much of Sudan's gold smuggled?" },
      a: { ar: "من أصل نحو 70 طنا أُنتجت، لم يُصدَّر رسميا سوى نحو 20 طنا، بينما خرج الباقي عبر قنوات غير رسمية إلى دول الجوار ثم إلى الأسواق العالمية. ويعود ذلك إلى الفارق في أسعار الصرف وضعف الرقابة وظروف النزاع.",
            en: "Of roughly 70 tons produced, only about 20 tons were exported officially, with the rest leaving through informal channels to neighbouring countries and on to world markets. Exchange rate gaps, weak oversight and conflict conditions all contribute." },
    },
    {
      q: { ar: "ما العيار الأكثر شيوعا في السودان؟", en: "Which karat is most common in Sudan?" },
      a: { ar: "يشيع عيار 21 في المجوهرات والمناسبات في السودان، ويتوفر عيار 22 و18 أيضا في المحلات. وتُستخدم السبائك والعيارات المرتفعة لأغراض الادخار والاستثمار.",
            en: "21K is common in Sudanese jewellery and occasions, with 22K and 18K also available in shops. Bars and higher karats are used for saving and investment." },
    },
    {
      q: { ar: "هل الذهب وسيلة ادخار جيدة في السودان؟", en: "Is gold a good way to save in Sudan?" },
      a: { ar: "يعتمد كثير من السودانيين على الذهب لحفظ قيمة مدخراتهم أمام تقلبات العملة، لأنه سهل التخزين وسريع البيع. وللحصول على أفضل عائد عند البيع يُفضّل شراء السبائك أو القطع البسيطة بدل المجوهرات المزخرفة التي تُخصم أجرة صياغتها.",
            en: "Many Sudanese rely on gold to preserve savings against currency volatility, as it is easy to store and quick to sell. For the best return on resale, prefer bars or simple pieces over ornate jewellery, whose craftsmanship charge is deducted." },
    },
  ],
};
