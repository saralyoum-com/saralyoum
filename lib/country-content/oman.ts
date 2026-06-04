import type { ContentSection, CountryFAQ } from "@/components/CountryContent";

export const omanContent: {
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
      heading: "الذهب في سلطنة عُمان",
      body: "تتمتّع سلطنة عُمان بتقاليد عريقة في صناعة الذهب يعود تاريخها لمئات السنين، حيث اشتُهرت بإتقان صياغة الخناجر والمجوهرات الذهبية التراثية. أسواق الذهب في عُمان تنبض بالحياة في مسقط وصلالة ونزوى، ويُعدّ سوق مطرح من أعرق الأسواق في الخليج وأكثرها أصالة. سعر الذهب في عُمان اليوم يُحسب من السعر العالمي بالأوقية مضروباً بسعر صرف الريال العُماني، الذي يحتفظ بقوته كأحد أقوى عملات العالم (الدولار = 0.385 ريال عُماني)، مما يجعل أسعار الذهب في السلطنة من أكثرها استقراراً في المنطقة. ويُقبل العمانيون على الذهب كاستثمار تقليدي وكموروث ثقافي يُتوارث بين الأجيال.",
    },
    en: {
      heading: "Gold in the Sultanate of Oman",
      body: "Oman has centuries-old traditions in goldsmithing, famed for craftsmanship of traditional khanjar daggers and heritage gold jewelry. Gold markets in Oman thrive in Muscat, Salalah, and Nizwa, with Mutrah Souq among the oldest and most authentic in the Gulf. Today's gold price in Oman is calculated from global ounce price multiplied by the Omani Rial exchange rate — one of the world's strongest currencies (1 USD = 0.385 OMR), making Omani gold prices among the most stable in the region. Omanis embrace gold as traditional investment and cultural heritage passed between generations.",
    },
  },

  market: {
    ar: {
      heading: "أسواق الذهب الرئيسية في عُمان",
      body: [
        "سوق مطرح (مسقط) — أعرق وأشهر أسواق الذهب في عُمان، يقع على كورنيش مطرح ويعود تاريخه لأكثر من 200 سنة.",
        "سوق نزوى التقليدي — يشتهر بصياغة الذهب التراثي العُماني والخناجر الذهبية.",
        "سوق صلالة (السوق المركزي) — وجهة مهمة في الجنوب خاصة خلال موسم الخريف السياحي.",
        "أسواق الذهب في صحار وصور — تخدم المحافظات الشمالية والشرقية بأسعار تنافسية.",
        "مجمعات الذهب الحديثة في مسقط جراند مول ومول عُمان — تقدّم تجربة فاخرة بعلامات عالمية.",
        "سوق الذهب في عبري والبريمي — قريب من حدود الإمارات ويستفيد من حركة التسوق العابرة للحدود.",
      ],
    },
    en: {
      heading: "Main Gold Markets in Oman",
      body: [
        "Mutrah Souq (Muscat) — most famous and oldest gold market in Oman, located on Mutrah Corniche with 200+ years of history.",
        "Nizwa Traditional Souq — famous for heritage Omani gold craftsmanship and gold khanjars.",
        "Salalah Central Market — key destination in the south especially during Khareef tourist season.",
        "Sohar and Sur gold markets — serve northern and eastern governorates with competitive prices.",
        "Modern gold complexes at Muscat Grand Mall and Oman Avenues Mall — luxury experience with international brands.",
        "Ibri and Buraimi gold markets — close to UAE border, benefiting from cross-border shopping flow.",
      ],
    },
  },

  culture: {
    ar: {
      heading: "الذهب في الثقافة العُمانية",
      body: "يحتل الذهب مكانة فريدة في التراث العُماني، فهو حاضر في كل تفاصيل الحياة من الزواج إلى الأعياد. في حفلات الزواج العُمانية التقليدية، تُقدَّم 'الزهبة' وهي مجموعة كاملة من الذهب تشمل المسلّة والشخر والقلائد والخواتم. وتبدأ قيمة الزهبة من 30 جراماً وقد تتجاوز 200 جرام من عيار 21 في الأعراس الفاخرة. ومن أبرز التقاليد العُمانية المميزة المرجاحة الذهبية والحلقان التراثية التي تُعدّ رمزاً للهوية العُمانية. كما اشتُهرت عُمان عبر التاريخ بصياغة خناجر الزينة المرصّعة بالذهب التي يلبسها الرجال في المناسبات الرسمية والوطنية. وفي عيد الفطر ومناسبات العيد الوطني، يُعدّ تقديم الذهب للأطفال من العادات المتوارثة بين الأسر العُمانية.",
    },
    en: {
      heading: "Gold in Omani Culture",
      body: "Gold occupies a unique place in Omani heritage, present in every aspect of life from weddings to celebrations. In traditional Omani weddings, the 'Zahaba' is presented — a complete gold collection including masallah, shukhar, necklaces, and rings. Zahaba value starts at 30 grams and may exceed 200 grams of 21K gold in luxury weddings. Among prominent Omani traditions are the gold marjaha and heritage earrings — symbols of Omani identity. Oman has historically been famous for crafting ceremonial khanjars inlaid with gold, worn by men at formal and national occasions. During Eid Al-Fitr and National Day, gifting gold to children is a deep-rooted tradition among Omani families.",
    },
  },

  dealers: {
    ar: {
      heading: "أكبر محلات الذهب في عُمان",
      body: [
        "مجوهرات الواحة — أكبر سلسلة مجوهرات محلية بفروع في كل المحافظات.",
        "ذهب آسيا (Asia Gold) — متخصصة في الذهب الاستثماري والسبائك.",
        "ملاباري للمجوهرات (Malabar Gold & Diamonds) — حضور قوي في مولات مسقط.",
        "جويا لكاس (Joyalukkas) — تقدّم تصاميم عصرية بأسعار تنافسية.",
        "مجوهرات الأنوار وبيت المرجان — معروفة بالتصاميم العُمانية التراثية الفاخرة.",
        "محلات سوق مطرح التقليدية — أفضل أماكن المساومة والحصول على أسعار جيدة للذهب الخام.",
        "بنك مسقط — يقدّم سبائك ذهب استثمارية معتمدة من مصنّعين عالميين (PAMP).",
      ],
    },
    en: {
      heading: "Top Gold Retailers in Oman",
      body: [
        "Al Waha Jewelry — largest local chain with branches across all governorates.",
        "Asia Gold — specialized in investment gold and bullion.",
        "Malabar Gold & Diamonds — strong presence in Muscat malls.",
        "Joyalukkas — offers contemporary designs at competitive prices.",
        "Al Anwar Jewelry and Bait Al Marjan — known for luxury heritage Omani designs.",
        "Traditional Mutrah Souq shops — best for negotiation and competitive raw gold prices.",
        "Bank Muscat — offers certified investment gold bars from international manufacturers (PAMP).",
      ],
    },
  },

  history: {
    ar: {
      heading: "تطوّر سعر الذهب في عُمان",
      body: "يتميّز سعر الذهب في عُمان بالاستقرار النسبي بفضل ربط الريال العُماني بالدولار الأمريكي بسعر ثابت منذ عقود. في 2018، كان سعر جرام عيار 21 يتراوح حول 11 ريالاً عُمانياً، وارتفع تدريجياً ليصل إلى 15 ريالاً في 2022، ثم تجاوز 19 ريالاً في 2026. هذا الارتفاع يعكس التغيرات العالمية في أسعار الذهب أكثر من تأثير العوامل المحلية. ومن مزايا السوق العُمانية أن الفارق بين سعر البيع والشراء (السبريد) محدود، ويتراوح بين 3-7% بحسب نوع الذهب. كما تُعدّ عُمان من الدول التي تشهد طلباً مستقراً على الذهب طوال السنة، مع زيادة ملحوظة في موسم الأعراس (شتاءً) وموسم الخريف السياحي في صلالة.",
    },
    en: {
      heading: "Oman Gold Price Evolution",
      body: "Omani gold prices are characterized by relative stability thanks to OMR being pegged to USD at fixed rate for decades. In 2018, 21K gram averaged 11 OMR; rose gradually to 15 OMR in 2022; exceeded 19 OMR in 2026. This rise reflects global gold trends more than local factors. A key advantage of Oman's market is limited bid-ask spread (3-7% depending on gold type). Oman is among countries with steady year-round gold demand, with notable increases during wedding season (winter) and Khareef tourist season in Salalah.",
    },
  },

  buyingGuide: {
    ar: {
      heading: "نصائح شراء الذهب في عُمان",
      body: [
        "ابحث عن الدمغة العُمانية الرسمية (875 لعيار 21، و750 لعيار 18) من غرفة تجارة وصناعة عُمان.",
        "اشترِ من محلات معتمدة من وزارة التجارة والصناعة لضمان الجودة والحقوق.",
        "اطلب فاتورة مفصّلة تشمل الوزن والعيار وسعر الجرام والمصنعية بشكل واضح.",
        "متوسط المصنعية في عُمان: 8-12% للذهب التقليدي، وتصل إلى 30% للقطع التراثية الدقيقة.",
        "في سوق مطرح، المساومة على المصنعية متوقعة ومقبولة، خاصةً عند الشراء النقدي.",
        "للاستثمار طويل الأمد، اختر سبائك بنك مسقط أو الذهب السويسري المختوم بنقاء 99.99%.",
        "تطبيق ضريبة القيمة المضافة 5% منذ 2021 على المصنعية فقط، وليس على قيمة الذهب الخام.",
        "أفضل أوقات الشراء: شهور يوليو وأغسطس (انخفاض الطلب) وفترة الخريف في صلالة.",
      ],
    },
    en: {
      heading: "Tips for Buying Gold in Oman",
      body: [
        "Look for the official Omani hallmark (875 for 21K, 750 for 18K) from Oman Chamber of Commerce.",
        "Buy from shops certified by Ministry of Commerce and Industry for quality assurance.",
        "Request a detailed invoice listing weight, karat, gram price, and craftsmanship clearly.",
        "Average craftsmanship in Oman: 8-12% for traditional gold, up to 30% for fine heritage pieces.",
        "In Mutrah Souq, negotiating craftsmanship is expected — especially with cash payment.",
        "For long-term investment, choose Bank Muscat bars or Swiss-stamped gold at 99.99% purity.",
        "5% VAT applied since 2021 on craftsmanship only, not raw gold value.",
        "Best buying times: July-August (lower demand) and Khareef season in Salalah.",
      ],
    },
  },

  faq: [
    {
      q: { ar: "كم سعر جرام الذهب اليوم في عمان؟", en: "What's today's gold gram price in Oman?" },
      a: { ar: "يتغيّر سعر الذهب لحظياً بحسب السعر العالمي وسعر صرف الريال العماني. يمكنك مشاهدة السعر الحالي بالأعلى — السعر معروض للعيارات 24 و21 و18 بالجرام، ويُحدّث كل 5 دقائق من المصادر العالمية الرسمية.",
            en: "Gold price changes by the moment based on global price and OMR exchange rate. You can see current prices above — displayed for 24K, 21K, and 18K per gram, updated every 5 minutes from official global sources." },
    },
    {
      q: { ar: "ما العيار الأكثر شيوعاً في سلطنة عمان؟", en: "What's the most popular karat in Oman?" },
      a: { ar: "عيار 21 هو الأكثر شيوعاً في عُمان للمجوهرات الذهبية والاستثمار التقليدي، يليه عيار 18 للمجوهرات الفاخرة والتصاميم العصرية. عيار 24 يُشترى أساساً للسبائك والاستثمار الطويل الأمد، أما عيار 22 فشائع لدى الجاليات الآسيوية.",
            en: "21K is most common in Oman for jewelry and traditional investment, followed by 18K for luxury jewelry and modern designs. 24K is mainly for bars and long-term investment. 22K is popular among Asian communities." },
    },
    {
      q: { ar: "أين أفضل مكان لشراء الذهب في مسقط؟", en: "Where to buy gold in Muscat?" },
      a: { ar: "سوق مطرح هو الخيار الأول للمشترين الباحثين عن أسعار تنافسية وتجربة تراثية أصيلة. للذهب العصري والماركات العالمية، توجّه إلى مولات مسقط الكبرى مثل مسقط جراند مول وعُمان أفنيوز مول. لشراء سبائك الاستثمار، يُنصح بالتعامل مع بنك مسقط مباشرة.",
            en: "Mutrah Souq is the top choice for buyers seeking competitive prices and authentic heritage experience. For modern gold and international brands, head to major Muscat malls like Muscat Grand Mall and Oman Avenues Mall. For investment bars, dealing directly with Bank Muscat is recommended." },
    },
    {
      q: { ar: "هل توجد ضريبة على الذهب في عمان؟", en: "Is there tax on gold in Oman?" },
      a: { ar: "نعم، بدأت سلطنة عُمان بتطبيق ضريبة القيمة المضافة 5% منذ أبريل 2021، لكنها تُطبّق على المصنعية وليس على قيمة الذهب الخام. السبائك الاستثمارية بنقاء 99% فما فوق معفاة من ضريبة القيمة المضافة بالكامل.",
            en: "Yes, Oman started applying 5% VAT since April 2021, but it applies to craftsmanship only, not raw gold value. Investment bars with 99%+ purity are fully VAT-exempt." },
    },
    {
      q: { ar: "كم متوسط شبكة الزواج في عمان؟", en: "What's the average wedding gold in Oman?" },
      a: { ar: "متوسط زهبة الزواج العُمانية يتراوح بين 30-100 جرام من عيار 21، أي ما يعادل تقريباً 600-2,000 ريال عُماني بحسب الأسعار الحالية. في الأعراس الفاخرة قد تصل القيمة إلى 5,000 ريال عُماني أو أكثر. تشمل الزهبة عادةً المسلّة والشخر والقلائد والخواتم والحلقان.",
            en: "Average Omani wedding zahaba ranges 30-100 grams of 21K, equivalent to OMR 600-2,000 at current prices. Luxury weddings can reach OMR 5,000+. Zahaba typically includes masallah, shukhar, necklaces, rings, and earrings." },
    },
    {
      q: { ar: "هل أسعار الذهب في عمان أرخص من الإمارات؟", en: "Is gold in Oman cheaper than UAE?" },
      a: { ar: "الأسعار في عُمان والإمارات متقاربة جداً بسبب تطبيق ضريبة 5% في كلا البلدين. الفرق الرئيسي يكون في المصنعية، حيث قد تكون أرخص قليلاً في سوق مطرح، لكن سوق ديرة بدبي يقدّم تنوعاً أكبر في التصاميم والماركات العالمية. للاستثمار في الذهب الخام، الفرق غير جوهري.",
            en: "Prices in Oman and UAE are very close due to 5% VAT in both countries. Main difference is craftsmanship — sometimes cheaper in Mutrah Souq, but Dubai's Deira offers wider variety of designs and international brands. For raw gold investment, the difference is insignificant." },
    },
  ],
};
