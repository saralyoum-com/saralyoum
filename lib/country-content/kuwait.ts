import type { ContentSection, CountryFAQ } from "@/components/CountryContent";

export const kuwaitContent: {
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
      heading: "الذهب في دولة الكويت",
      body: "الكويت من أعرق دول الخليج في تجارة الذهب، ويتميز سوقها بالاستقرار النسبي بفضل قوة الدينار الكويتي الذي يُعدّ من أغلى عملات العالم. الذهب في الكويت ليس مجرد سلعة استثمارية بل عنصر أصيل في الموروث الكويتي، حاضر في كل بيت كويتي تقريباً. سوق الذهب في المباركية القديم يحمل تاريخاً طويلاً من التجارة، ويُمثّل عمق العلاقة بين الكويتيين والذهب. كما يتميز السوق الكويتي بأسعار تنافسية وضريبة قيمة مضافة منخفضة (يُتوقّع تطبيق 5% قريباً ولا تُطبق حالياً)، مما يجعله من أرخص أسواق الذهب في الخليج.",
    },
    en: {
      heading: "Gold in Kuwait",
      body: "Kuwait is one of the most established Gulf countries in gold trade, characterized by relative market stability thanks to the strong Kuwaiti Dinar — one of the world's most expensive currencies. Gold in Kuwait isn't just an investment commodity but an authentic part of Kuwaiti heritage, present in almost every Kuwaiti home. The old Mubarakiya Gold Souk holds long trade history representing the depth of Kuwait's relationship with gold. The market features competitive prices and low VAT (5% expected soon, not yet applied), making it one of the cheapest gold markets in the Gulf.",
    },
  },

  market: {
    ar: {
      heading: "أسواق الذهب الرئيسية في الكويت",
      body: [
        "سوق الذهب في المباركية (مدينة الكويت) — أعرق وأكبر أسواق الذهب في الكويت، يحتضن أكثر من 100 محل.",
        "سوق الذهب في جمعية الفروانية التعاونية — سوق محلي يتميز بأسعار تنافسية لأهل المنطقة.",
        "أسواق الذهب في حولي والسالمية — تخدم الجاليات المقيمة في الكويت بتصاميم متنوعة.",
        "مجمع الذهب الخاص في الأفنيوز — تجربة شراء فاخرة بأسعار أعلى لكن بضمانات أكبر.",
        "محلات الذهب في الجهراء والأحمدي — تخدم سكان المحافظات بأسعار جيدة.",
        "أسواق الذهب الإلكترونية الكويتية — منصات حديثة لشراء الذهب والسبائك أونلاين بضمانات بنكية.",
      ],
    },
    en: {
      heading: "Main Gold Markets in Kuwait",
      body: [
        "Mubarakiya Gold Souk (Kuwait City) — oldest and largest gold market in Kuwait, hosting 100+ shops.",
        "Farwaniya Co-op Gold Market — local market with competitive prices for area residents.",
        "Hawalli and Salmiya gold markets — serve resident communities with diverse designs.",
        "Avenues Mall Gold Section — luxury shopping experience at higher prices with greater guarantees.",
        "Jahra and Ahmadi gold shops — serve governorate residents with good prices.",
        "Kuwaiti online gold markets — modern platforms for buying gold and bars online with bank guarantees.",
      ],
    },
  },

  culture: {
    ar: {
      heading: "الذهب في التقاليد الكويتية",
      body: "للذهب مكانة عريقة في التراث الكويتي، فقد كان أساس تجارة الكويت قبل النفط مع الهند وشرق أفريقيا. في الزواج الكويتي، يحرص الأهل على تقديم 'الدزة' و'الزهبة' وهي مجموعة الذهب الكاملة التي تشمل أسوار وقلائد ودبل وحلقان، وقد تتجاوز قيمتها 100 جرام من الذهب عيار 21 في الأعراس المتوسطة، وتصل إلى 500 جرام في الأعراس الفاخرة. ومن العادات الكويتية المميزة 'الكرعة' وهي أن تأخذ الزوجة من ذهب أهل الزوج، إضافة إلى ذهب أهلها. كما يُعدّ الذهب جزءاً أصيلاً من القرنقعوه في رمضان، حيث يحصل الأطفال على هدايا ذهبية صغيرة. ولا ننسى دور الذهب في الأعياد الوطنية والمناسبات الاجتماعية.",
    },
    en: {
      heading: "Gold in Kuwaiti Traditions",
      body: "Gold has deep heritage in Kuwait, having been foundation of pre-oil Kuwaiti trade with India and East Africa. In Kuwaiti weddings, families ensure presenting 'al-dezza' and 'al-zahba' — complete gold sets including bracelets, necklaces, rings, and earrings. Average wedding gold exceeds 100 grams of 21K, reaching 500 grams in luxury weddings. A unique Kuwaiti custom is 'al-kar'a' — where the bride receives gold from groom's family plus her own family. Gold is also essential in Garangaoh (Ramadan celebration) where children receive small gold gifts. Gold plays role in national holidays and social occasions.",
    },
  },

  dealers: {
    ar: {
      heading: "أبرز محلات الذهب في الكويت",
      body: [
        "بيت الذهب الكويتي — أكبر سلسلة محلية بفروع في كل المحافظات.",
        "العصيمي للمجوهرات — اسم عريق ومتخصص في الذهب الكويتي الكلاسيكي.",
        "مجوهرات الزبير — متخصصة في الذهب الفاخر والألماس.",
        "ذهب المرشد — معروفة بالتصاميم العربية التراثية.",
        "جويا لكاس (Joyalukkas) — سلسلة عالمية ذات حضور قوي في الكويت.",
        "مالا بار جولد (Malabar Gold) — تقدّم خيارات واسعة للذهب الاستثماري.",
        "بيت التمويل الكويتي (KFH) — لشراء سبائك الذهب الإسلامية الموافقة للشريعة.",
      ],
    },
    en: {
      heading: "Top Gold Retailers in Kuwait",
      body: [
        "Kuwaiti Gold House — largest local chain with branches across all governorates.",
        "Al-Osaimi Jewelry — venerable name specialized in classic Kuwaiti gold.",
        "Al-Zubair Jewelry — specialized in luxury gold and diamonds.",
        "Al-Murshid Gold — known for traditional Arabic designs.",
        "Joyalukkas — international chain with strong Kuwait presence.",
        "Malabar Gold — offers wide range of investment gold.",
        "Kuwait Finance House (KFH) — for Sharia-compliant Islamic gold bars.",
      ],
    },
  },

  history: {
    ar: {
      heading: "تطور سعر الذهب في الكويت",
      body: "سعر الذهب في الكويت من أكثر الأسعار استقراراً في المنطقة بفضل قوة الدينار الكويتي. في 2018، كان جرام عيار 21 يتراوح حول 8 دنانير، وارتفع تدريجياً إلى 11 ديناراً في 2022، ثم وصل إلى 14 ديناراً في 2026. هذا الارتفاع يعكس الاتجاه العالمي لأسعار الذهب أكثر من تأثير العوامل المحلية. الدينار الكويتي يحافظ على قوته أمام الدولار (يتراوح حول 0.3075 دينار للدولار)، مما يجعل الذهب في الكويت من بين الأرخص نسبياً في المنطقة عند الحساب بالدولار. كما أن الكويت لا تطبق ضريبة قيمة مضافة حالياً على الذهب، وهذا يمنح المشترين ميزة إضافية في الأسعار. تُعدّ الكويت من أكثر دول الخليج التي تشهد طلباً مستقراً على الذهب طوال السنة وليس موسمياً فقط.",
    },
    en: {
      heading: "Gold Price Evolution in Kuwait",
      body: "Kuwait gold prices are among the most stable in the region thanks to the strong Kuwaiti Dinar. In 2018, 21K gram averaged 8 KWD; rose gradually to 11 KWD in 2022; reached 14 KWD in 2026. This rise reflects global gold trends more than local factors. KWD maintains strength against USD (around 0.3075 KWD/USD), making Kuwait gold relatively cheapest in region when calculated in USD. Kuwait currently doesn't apply VAT on gold, giving buyers additional price advantage. Kuwait is among Gulf countries with most stable year-round gold demand, not just seasonal.",
    },
  },

  buyingGuide: {
    ar: {
      heading: "نصائح شراء الذهب في الكويت",
      body: [
        "اشترِ من محلات مسجّلة لدى هيئة الصناعة الكويتية، وابتعد عن البائعين غير المرخّصين.",
        "تحقّق من الدمغة الرسمية الكويتية وشهادة الجودة من المختبر الحكومي.",
        "متوسط المصنعية في الكويت: 3-8% للذهب العادي، وقد تصل إلى 25% للقطع المصممة بعلامات عالمية.",
        "لا توجد ضريبة قيمة مضافة حالياً على الذهب في الكويت — هذه ميزة كبيرة مقارنة بالسعودية والإمارات.",
        "للاستثمار، اختر السبائك المختومة من PAMP أو Valcambi أو سبائك بيت التمويل الكويتي.",
        "أفضل أسعار الذهب تكون في سوق المباركية، خاصة في فترة الصباح من السبت إلى الخميس.",
        "احذر من بيع الذهب القديم في غير أوقات المعارض المنظمة — قد تخسر حتى 15% من القيمة.",
        "للنساء، شبكة الذهب الكويتية ميزة استثمارية لأن المصنعية أقل والذهب من عيار عالٍ (21).",
      ],
    },
    en: {
      heading: "Tips for Buying Gold in Kuwait",
      body: [
        "Buy from shops registered with Public Authority for Industry; avoid unlicensed sellers.",
        "Verify official Kuwaiti hallmark and quality certificate from government lab.",
        "Average craftsmanship in Kuwait: 3-8% for standard gold, up to 25% for designer international brand pieces.",
        "No VAT currently on gold in Kuwait — major advantage vs Saudi Arabia and UAE.",
        "For investment, choose PAMP, Valcambi sealed bars, or Kuwait Finance House bars.",
        "Best gold prices are at Mubarakiya souk, especially mornings Saturday-Thursday.",
        "Avoid selling old gold outside organized exhibitions — may lose up to 15% of value.",
        "For women, Kuwaiti gold shabka is investment advantage due to lower craftsmanship and high karat (21K).",
      ],
    },
  },

  faq: [
    {
      q: { ar: "هل سعر الذهب في الكويت أرخص من السعودية؟", en: "Is gold in Kuwait cheaper than Saudi Arabia?" },
      a: { ar: "نعم بشكل واضح، الذهب في الكويت يُعدّ من بين الأرخص في الخليج لسببين: عدم تطبيق ضريبة القيمة المضافة على الذهب حالياً، وانخفاض هامش المصنعية في سوق المباركية. الفارق قد يصل إلى 10-15% أقل من الذهب في السعودية.",
            en: "Yes, significantly. Kuwait gold is among the cheapest in the Gulf for two reasons: no VAT currently on gold, and lower craftsmanship margins in Mubarakiya souk. Difference can reach 10-15% less than Saudi gold." },
    },
    {
      q: { ar: "ما العيار الأكثر طلباً في الكويت؟", en: "What's the most demanded karat in Kuwait?" },
      a: { ar: "عيار 21 هو الأكثر طلباً للاستثمار والادّخار، وعيار 18 شائع للمجوهرات اليومية والساعات الفاخرة. عيار 22 له شعبية لدى الجاليات الآسيوية المقيمة. عيار 24 يُشترى أساساً كسبائك استثمار.",
            en: "21K is most demanded for investment and savings. 18K is common for daily jewelry and luxury watches. 22K is popular among resident Asian communities. 24K is mainly bought as investment bars." },
    },
    {
      q: { ar: "كم متوسط شبكة الزواج في الكويت؟", en: "What's the average wedding gold in Kuwait?" },
      a: { ar: "تتراوح شبكة الزواج في الكويت بين 50-150 جراماً من عيار 21 في الأعراس المتوسطة، وقد تصل إلى 300-500 جرام في الأعراس الفاخرة. القيمة بالدنانير حالياً تتراوح بين 700-2,000 دينار كويتي، وقد تتجاوز 5,000 دينار في الأعراس الفاخرة.",
            en: "Wedding gold in Kuwait averages 50-150 grams of 21K in average weddings, reaching 300-500 grams in luxury weddings. Current KWD value ranges 700-2,000 KWD, exceeding 5,000 KWD in luxury weddings." },
    },
    {
      q: { ar: "هل يمكنني شراء الذهب من البنوك في الكويت؟", en: "Can I buy gold from banks in Kuwait?" },
      a: { ar: "نعم، بيت التمويل الكويتي (KFH) من أوائل البنوك التي تبيع سبائك ذهب موافقة للشريعة الإسلامية. كما تقدّم بنوك أخرى مثل بنك الكويت الوطني (NBK) وبنك بوبيان منتجات استثمارية مدعومة بالذهب. هذه الخيارات الأكثر أماناً للاستثمار طويل الأمد.",
            en: "Yes, Kuwait Finance House (KFH) is among the first banks to sell Sharia-compliant gold bars. Other banks like National Bank of Kuwait (NBK) and Boubyan Bank offer gold-backed investment products. These are the safest options for long-term investment." },
    },
    {
      q: { ar: "ما الفرق بين الذهب الكويتي والإماراتي؟", en: "What's the difference between Kuwaiti and Emirati gold?" },
      a: { ar: "الفرق ليس في الجودة بل في التصاميم وأسلوب البيع. الذهب الكويتي يميل للتصاميم التراثية والكلاسيكية، بينما الإماراتي أكثر تنوعاً بسبب التأثير العالمي على دبي. أسعار المصنعية في الكويت قد تكون أقل، لكن تنوع التصاميم في الإمارات أكبر.",
            en: "Difference isn't in quality but in designs and selling style. Kuwaiti gold leans toward traditional and classic designs; Emirati is more diverse due to global influence on Dubai. Craftsmanship prices may be lower in Kuwait, but Emirates has wider design variety." },
    },
    {
      q: { ar: "هل تطبق ضريبة على الذهب في الكويت؟", en: "Is there tax on gold in Kuwait?" },
      a: { ar: "حتى الآن لم يتم تطبيق ضريبة القيمة المضافة على الذهب في الكويت. هناك خطط لتطبيق ضريبة 5% خلال السنوات القادمة لكنها لم تُنفّذ بعد. هذا يجعل الكويت من أرخص دول الخليج للذهب في الوقت الحالي.",
            en: "VAT hasn't been applied on gold in Kuwait yet. There are plans for 5% VAT in coming years but not yet implemented. This makes Kuwait among the cheapest Gulf countries for gold currently." },
    },
  ],
};
