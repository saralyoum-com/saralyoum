import type { ContentSection, CountryFAQ } from "@/components/CountryContent";

export const tunisiaContent: {
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
      heading: "الذهب في الجمهورية التونسية",
      body: "تشتهر تونس بحرفة صياغة عريقة، وسوق البركة في مدينة تونس العتيقة هو قلب تجارة الذهب والمجوهرات منذ قرون. سعر الذهب اليوم في تونس يُحسب من سعر الأونصة العالمي بالدولار مضروبا في سعر صرف الدينار التونسي، ثم تُضاف أجرة الصياغة. ويعتمد السوق التونسي نظام دمغة يحدّد درجة النقاء بأرقام معيارية، وأشهرها 750 لعيار 18 الذي يغلب على السوق، إلى جانب 875 لعيار 21 و916 لعيار 22 و999 للذهب الخالص. وتقلبات الدينار التونسي تنعكس مباشرة على سعر الجرام محليا.",
    },
    en: {
      heading: "Gold in Tunisia",
      body: "Tunisia is known for a long-established goldsmithing craft, and Souk El Berka in the Medina of Tunis has been the heart of gold and jewellery trade for centuries. Today's gold price in Tunisia is calculated from the global ounce price in USD multiplied by the Tunisian Dinar exchange rate, then craftsmanship is added. The Tunisian market uses a hallmark system marking purity with standard numbers — most commonly 750 for 18K which dominates the market, alongside 875 for 21K, 916 for 22K and 999 for pure gold. Swings in the Tunisian Dinar feed directly into the local gram price.",
    },
  },

  market: {
    ar: {
      heading: "أسواق الذهب في تونس",
      body: [
        "سوق البركة في المدينة العتيقة بتونس — السوق المغطى التاريخي المتخصّص في تجارة المجوهرات والذهب.",
        "بُني سوق البركة سنة 1612 على يد يوسف داي، وتحوّل إلى سوق للصاغة بعد إلغاء الرق في تونس سنة 1846.",
        "محلات الصاغة في شارع الحبيب بورقيبة وأحياء تونس الحديثة — للتصاميم العصرية والماركات.",
        "أسواق صفاقس وسوسة والقيروان — مراكز نشطة لتجارة الذهب في الوسط والساحل.",
        "ورش الصياغة التقليدية — تشتهر بالقطع اليدوية ذات النقوش التونسية المميزة.",
      ],
    },
    en: {
      heading: "Gold Markets in Tunisia",
      body: [
        "Souk El Berka in the Medina of Tunis — the historic covered market specialising in jewellery and gold trade.",
        "Souk El Berka was built in 1612 by Yusuf Dey and became a jewellers' souk after the abolition of slavery in Tunisia in 1846.",
        "Jewellers on Habib Bourguiba Avenue and in modern Tunis districts — for contemporary designs and brands.",
        "The markets of Sfax, Sousse and Kairouan — active gold trading centres in the centre and coastal regions.",
        "Traditional workshops — known for handmade pieces with distinctive Tunisian engraving.",
      ],
    },
  },

  culture: {
    ar: {
      heading: "الذهب في الأعراس والتقاليد التونسية",
      body: "يحتل الذهب مكانة أساسية في الأعراس التونسية، وتُعدّ المجوهرات جزءا من مراسم الزفاف التي تمتد على عدة أيام وتتضمن طقوسا خاصة ترتدي فيها العروس أطقما ذهبية تقليدية. وتشتهر الصياغة التونسية بالنقوش الدقيقة والتصاميم التي تجمع بين التأثيرات الأندلسية والعثمانية والمحلية. ومن العادات المتوارثة تقديم الذهب للعروس من أهل العريس، إضافة إلى قطع تُهدى في المناسبات العائلية والأعياد. كما يُنظر إلى الذهب باعتباره مدخرات عائلية تُورّث وتُحفظ للأوقات الصعبة.",
    },
    en: {
      heading: "Gold in Tunisian Weddings & Tradition",
      body: "Gold is central to Tunisian weddings, with jewellery forming part of multi-day ceremonies that include rituals where the bride wears traditional gold sets. Tunisian goldsmithing is known for fine engraving and designs blending Andalusian, Ottoman and local influences. Custom holds that the groom's family presents gold to the bride, alongside pieces given at family occasions and Eid. Gold is also seen as family savings — inherited and kept for difficult times.",
    },
  },

  dealers: {
    ar: {
      heading: "أين تشتري الذهب في تونس",
      body: [
        "سوق البركة في المدينة العتيقة — الوجهة الأشهر وأفضل مكان للمقارنة بين محلات الصاغة والتفاوض.",
        "محلات الصاغة المرخّصة في المدن الكبرى — اشترِ منها لضمان الدمغة والفاتورة وإمكانية إعادة البيع.",
        "ورش الصياغة التقليدية — للقطع اليدوية ذات الطابع التونسي المميز.",
        "للادخار: اسأل عن السبائك والقطع البسيطة بدل التصاميم المعقّدة مرتفعة الصياغة.",
        "التفاوض متعارف عليه في أسواق المدينة العتيقة، لكنه يخصّ أجرة الصياغة لا سعر المعدن.",
      ],
    },
    en: {
      heading: "Where to Buy Gold in Tunisia",
      body: [
        "Souk El Berka in the Medina — the best-known destination and the best place to compare jewellers and negotiate.",
        "Licensed jewellers in major cities — buy from them to ensure hallmarking, an invoice and future resale.",
        "Traditional workshops — for handmade pieces with distinctive Tunisian character.",
        "For savings: ask about bars and simple pieces rather than intricate, high-craftsmanship designs.",
        "Bargaining is customary in the Medina's souks, but it applies to craftsmanship, not the metal price.",
      ],
    },
  },

  history: {
    ar: {
      heading: "سعر الذهب في تونس وأثر الدينار",
      body: "يتحدّد سعر الذهب في تونس بعاملين معا: السعر العالمي للأونصة بالدولار، وسعر صرف الدينار التونسي. وبما أن الدينار التونسي عملة متغيّرة وليست مربوطة بالدولار بسعر ثابت، فإن أي تراجع في قيمته يرفع سعر الجرام محليا حتى لو بقي السعر العالمي ثابتا. ومع الصعود القوي للذهب عالميا في السنوات الأخيرة، سجّل سعر الجرام بالدينار ارتفاعات متتالية نتيجة تضافر العاملين. ولهذا يزداد إقبال التونسيين على شراء الذهب باعتباره وسيلة للحفاظ على قيمة المدخرات، خاصة في القطع ذات الصياغة البسيطة التي تحتفظ بقيمتها عند إعادة البيع.",
    },
    en: {
      heading: "Tunisia Gold Prices and the Dinar Effect",
      body: "Gold prices in Tunisia are set by two factors together: the global ounce price in dollars and the Tunisian Dinar's exchange rate. Because the Dinar floats rather than being pegged to the dollar, any decline in its value raises the local gram price even if the global price is unchanged. With gold's strong global rally in recent years, the gram price in Dinars has posted successive increases as both factors combined. This is why Tunisians increasingly buy gold to preserve savings — particularly simply crafted pieces that hold value on resale.",
    },
  },

  buyingGuide: {
    ar: {
      heading: "دليل شراء الذهب في تونس",
      body: [
        "تحقّق من الدمغة المطبوعة على القطعة: 750 لعيار 18، و875 لعيار 21، و916 لعيار 22، و999 للذهب الخالص.",
        "اعلم أن عيار 18 هو الأكثر انتشارا في السوق التونسي، فقارن الأسعار بين قطع من العيار نفسه.",
        "اشترِ من محل صاغة مرخّص واطلب فاتورة رسمية تذكر الوزن والعيار وسعر الجرام وأجرة الصياغة.",
        "زن القطعة أمامك على ميزان معايَر ولا تعتمد على وزن مذكور شفهيا.",
        "التفاوض متعارف عليه في المدينة العتيقة، لكن تفاوض على أجرة الصياغة لا على سعر الذهب الخام.",
        "راجع سعر الجرام لحظة الشراء لأن تحرّك الدينار قد يغيّر السعر.",
        "احتفظ بالفاتورة، فهي تثبت الوزن والعيار وتفيدك عند إعادة البيع أو الاستبدال.",
      ],
    },
    en: {
      heading: "Guide to Buying Gold in Tunisia",
      body: [
        "Check the hallmark stamped on the piece: 750 for 18K, 875 for 21K, 916 for 22K, 999 for pure gold.",
        "Note that 18K dominates the Tunisian market — compare prices between pieces of the same karat.",
        "Buy from a licensed jeweller and request an official invoice stating weight, karat, gram price and craftsmanship.",
        "Have the piece weighed in front of you on a calibrated scale; do not rely on a verbal weight.",
        "Bargaining is customary in the Medina, but negotiate on craftsmanship, not the raw gold price.",
        "Check the gram price at the moment of purchase, as Dinar moves can change it.",
        "Keep the invoice — it proves weight and karat and helps when reselling or exchanging.",
      ],
    },
  },

  faq: [
    {
      q: { ar: "ما هو سوق البركة ولماذا يشتهر بالذهب؟", en: "What is Souk El Berka and why is it known for gold?" },
      a: { ar: "سوق البركة سوق مغطى في المدينة العتيقة بتونس، بُني سنة 1612 على يد يوسف داي. وقد تحوّل إلى سوق متخصّص في الصاغة والمجوهرات بعد إلغاء الرق في تونس سنة 1846، وأصبح منذ ذلك الحين قلب تجارة الذهب في العاصمة.",
            en: "Souk El Berka is a covered market in the Medina of Tunis, built in 1612 by Yusuf Dey. It became a jewellers' and goldsmiths' souk after the abolition of slavery in Tunisia in 1846, and has been the capital's gold trading heart ever since." },
    },
    {
      q: { ar: "ما معنى أرقام الدمغة على الذهب في تونس؟", en: "What do the hallmark numbers on Tunisian gold mean?" },
      a: { ar: "الأرقام تدل على درجة النقاء من ألف: 750 تعني عيار 18 (75% ذهب)، و875 تعني عيار 21، و916 تعني عيار 22، و999 تعني الذهب الخالص عيار 24. وتوجد أيضا دمغات أدنى مثل 585 لعيار 14 و375 لعيار 9.",
            en: "The numbers show purity per thousand: 750 means 18K (75% gold), 875 means 21K, 916 means 22K, and 999 means pure 24K gold. Lower hallmarks also exist, such as 585 for 14K and 375 for 9K." },
    },
    {
      q: { ar: "ما هو العيار الأكثر شيوعا في تونس؟", en: "Which karat is most common in Tunisia?" },
      a: { ar: "عيار 18 (دمغة 750) هو الأكثر شيوعا في السوق التونسي كما هو الحال في معظم بلدان المغرب العربي، وتتوفر عيارات أعلى مثل 21 و22 في بعض المحلات وبأسعار أعلى للجرام.",
            en: "18K (hallmark 750) is the most common in the Tunisian market, as across most of the Maghreb, with higher karats such as 21K and 22K available in some shops at a higher gram price." },
    },
    {
      q: { ar: "هل التفاوض على السعر مقبول في أسواق تونس؟", en: "Is bargaining acceptable in Tunisian markets?" },
      a: { ar: "نعم، التفاوض جزء أصيل من تجربة الشراء في أسواق المدينة العتيقة ويتوقّعه الباعة. لكن انتبه إلى أن التفاوض يخصّ أجرة الصياغة وهامش المحل، أما سعر الذهب الخام فيتحدّد يوميا وفق السوق العالمي ولا يتغيّر بالتفاوض.",
            en: "Yes — bargaining is an integral part of shopping in the Medina's souks and sellers expect it. Note, however, that it applies to craftsmanship and shop margin; the raw gold price is set daily by the global market and does not change through negotiation." },
    },
    {
      q: { ar: "لماذا يرتفع سعر الذهب في تونس أكثر من الارتفاع العالمي؟", en: "Why does gold rise more in Tunisia than globally?" },
      a: { ar: "لأن السعر المحلي يتأثر بعاملين: ارتفاع السعر العالمي للأونصة، وتراجع قيمة الدينار التونسي مقابل الدولار. فإذا تزامن الأمران تضاعف أثر الارتفاع على سعر الجرام بالدينار.",
            en: "Because the local price is affected by two factors: the rise in the global ounce price and any decline in the Tunisian Dinar against the dollar. When both occur together, the effect on the gram price in Dinars is compounded." },
    },
    {
      q: { ar: "كيف أحصل على أفضل سعر عند بيع الذهب في تونس؟", en: "How do I get the best price when selling gold in Tunisia?" },
      a: { ar: "قارن العروض بين أكثر من محل صاغة، وأحضر الفاتورة الأصلية إن توفرت لأنها تثبت العيار والوزن. ويُحتسب سعر البيع على أساس سعر الجرام اليومي مطروحا منه أجرة الصياغة، لذلك تحقّق القطع البسيطة والسبائك عائدا أفضل من التصاميم المعقّدة.",
            en: "Compare offers across several jewellers and bring the original invoice if available, as it proves karat and weight. Sale prices are based on the daily gram rate minus craftsmanship, so simple pieces and bars return more than intricate designs." },
    },
  ],
};
