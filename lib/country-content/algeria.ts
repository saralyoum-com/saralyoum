import type { ContentSection, CountryFAQ } from "@/components/CountryContent";

export const algeriaContent: {
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
      heading: "الذهب في الجمهورية الجزائرية",
      body: "يرتبط الذهب في الجزائر بتقاليد صياغة عريقة تمتد من القبائل إلى تلمسان وقسنطينة، ويمثّل وسيلة ادخار مهمة للأسر إلى جانب كونه عنصرا أساسيا في الأعراس. سعر الذهب اليوم في الجزائر يُحسب من سعر الأونصة العالمي بالدولار مضروبا في سعر صرف الدينار الجزائري، ثم تُضاف أجرة الصياغة. ويغلب على السوق الجزائري كما هو الحال في بلدان المغرب العربي عيار 18، إلى جانب توفّر عيارات أعلى. ومن المهم الانتباه إلى أن تقلبات سعر صرف الدينار تنعكس مباشرة على سعر الجرام محليا.",
    },
    en: {
      heading: "Gold in Algeria",
      body: "Gold in Algeria is bound to a deep goldsmithing tradition stretching from Kabylie to Tlemcen and Constantine, and serves as an important household savings vehicle as well as a core element of weddings. Today's gold price in Algeria is calculated from the global ounce price in USD multiplied by the Algerian Dinar exchange rate, then craftsmanship is added. As across the Maghreb, 18K dominates the Algerian market, with higher karats also available. Note that swings in the Dinar's exchange rate feed directly into the local gram price.",
    },
  },

  market: {
    ar: {
      heading: "أسواق الذهب والصياغة في الجزائر",
      body: [
        "العاصمة الجزائر — أكبر تجمّع لمحلات الذهب والمجوهرات في البلاد وتنوّع واسع في التصاميم.",
        "تلمسان وقسنطينة — مدينتان لهما تاريخ طويل كمراكز للصياغة والمجوهرات التقليدية.",
        "قرية آث يني (بني يني) في تيزي وزو — أشهر مركز لصناعة المجوهرات القبائلية التقليدية في الجزائر.",
        "محلات الصاغة المرخّصة في المدن الكبرى كوهران وعنابة وسطيف — تخدم أسواقا محلية نشطة.",
        "أسواق الحرف التقليدية والمعارض الموسمية — تعرض القطع اليدوية والمجوهرات ذات الطابع الأمازيغي.",
      ],
    },
    en: {
      heading: "Gold and Jewellery Markets in Algeria",
      body: [
        "Algiers — the country's largest cluster of gold and jewellery shops with wide design variety.",
        "Tlemcen and Constantine — cities with long histories as centres of goldsmithing and traditional jewellery.",
        "The village of Ath Yenni (Beni Yenni) in Tizi Ouzou — Algeria's most famous centre for traditional Kabyle jewellery.",
        "Licensed jewellers in major cities such as Oran, Annaba and Setif — serving active local markets.",
        "Traditional craft markets and seasonal exhibitions — showcasing handmade and Amazigh-style pieces.",
      ],
    },
  },

  culture: {
    ar: {
      heading: "الذهب والمجوهرات في التقاليد الجزائرية",
      body: "للمجوهرات في الجزائر بعد ثقافي عميق، فالمجوهرات القبائلية التقليدية تُصنع تاريخيا من الفضة وتُزيَّن بالمرجان والمينا بألوان الأخضر والأصفر والأحمر والأزرق التي ترمز إلى عناصر الطبيعة، وقد اشتهرت قرية آث يني في تيزي وزو بهذه الصناعة. أما اليوم فيُستخدم الذهب على نطاق واسع في الأعراس، وتُعدّ الشبكة الذهبية جزءا أساسيا من مراسم الزواج في مختلف المناطق الجزائرية، وتختلف قيمتها وتفاصيلها من منطقة إلى أخرى. ويشيع أيضا تقديم الذهب في المناسبات العائلية والأعياد باعتباره هدية تحمل قيمة مادية ورمزية معا.",
    },
    en: {
      heading: "Gold and Jewellery in Algerian Tradition",
      body: "Jewellery in Algeria carries deep cultural meaning. Traditional Kabyle jewellery is historically made of silver and decorated with coral and enamel in green, yellow, red and blue — colours symbolising elements of nature — and the village of Ath Yenni in Tizi Ouzou became famous for this craft. Today gold is widely used in weddings, where the gold shabka is a core part of marriage customs across Algeria's regions, with value and detail varying from area to area. Gold is also commonly given at family occasions and Eid as a gift carrying both material and symbolic value.",
    },
  },

  dealers: {
    ar: {
      heading: "أين تشتري الذهب في الجزائر",
      body: [
        "محلات الصاغة المرخّصة في المدن الكبرى — اشترِ منها لضمان الفاتورة والدمغة وإمكانية إعادة البيع.",
        "الجزائر العاصمة — أوسع خيارات المقارنة بين المحلات والتفاوض على أجرة الصياغة.",
        "ورش الصياغة التقليدية في آث يني وتلمسان — للقطع اليدوية ذات الطابع التراثي.",
        "للادخار: اسأل عن السبائك والقطع ذات المصنعية المنخفضة بدل التصاميم المعقّدة.",
        "قارن سعر الجرام بين أكثر من محل، فالفارق يكون في أجرة الصياغة لا في سعر المعدن.",
      ],
    },
    en: {
      heading: "Where to Buy Gold in Algeria",
      body: [
        "Licensed jewellers in major cities — buy from them to ensure an invoice, hallmark and future resale.",
        "Algiers — the widest scope for comparing shops and negotiating craftsmanship.",
        "Traditional workshops in Ath Yenni and Tlemcen — for handmade, heritage-style pieces.",
        "For savings: ask about bars and low-craftsmanship pieces rather than intricate designs.",
        "Compare the gram price across shops — the gap is in craftsmanship, not the metal price.",
      ],
    },
  },

  history: {
    ar: {
      heading: "سعر الذهب في الجزائر وأثر الدينار",
      body: "يتحدّد سعر الذهب في الجزائر بعاملين: السعر العالمي للأونصة بالدولار، وسعر صرف الدينار الجزائري. وبخلاف دول الخليج التي تربط عملاتها بالدولار بسعر ثابت، فإن الدينار الجزائري متغيّر، ما يعني أن ارتفاع سعر الصرف يرفع سعر الذهب محليا حتى لو استقرّ السعر العالمي. ومع الصعود العالمي القوي للذهب في السنوات الأخيرة، ارتفع سعر الجرام بالدينار ارتفاعا مضاعفا نتيجة اجتماع العاملين معا. وهذا ما يفسّر تزايد إقبال الأسر الجزائرية على الذهب باعتباره وسيلة للحفاظ على القيمة أمام تراجع القوة الشرائية للعملة المحلية.",
    },
    en: {
      heading: "Algeria Gold Prices and the Dinar Effect",
      body: "Gold prices in Algeria are set by two factors: the global ounce price in dollars and the Algerian Dinar's exchange rate. Unlike Gulf states that peg their currencies to the dollar at fixed rates, the Algerian Dinar floats — meaning a rising exchange rate lifts local gold prices even if the global price is flat. With gold's strong global rally in recent years, the gram price in Dinars has risen doubly as both factors combined. This explains growing Algerian household demand for gold as a way to preserve value against the local currency's declining purchasing power.",
    },
  },

  buyingGuide: {
    ar: {
      heading: "دليل شراء الذهب في الجزائر",
      body: [
        "تحقّق من الدمغة على القطعة: 750 لعيار 18، و875 لعيار 21، و916 لعيار 22.",
        "اشترِ من محل مرخّص واطلب فاتورة رسمية تتضمن الوزن والعيار وسعر الجرام وأجرة الصياغة.",
        "زن القطعة أمامك على ميزان معايَر واطلب رؤية القراءة بنفسك قبل الدفع.",
        "انتبه إلى أن عيار 18 هو الأكثر انتشارا في السوق الجزائري، فتأكد من العيار قبل مقارنة الأسعار.",
        "راجع سعر الصرف وسعر الجرام لحظة الشراء، لأن تحرّك الدينار يغيّر السعر المحلي.",
        "للادخار فضّل السبائك أو القطع البسيطة على التصاميم المعقّدة لتقليل ما تخسره من الصياغة عند البيع.",
        "احتفظ بالفاتورة، فهي تثبت الوزن والعيار وتساعدك عند إعادة البيع أو الاستبدال.",
      ],
    },
    en: {
      heading: "Guide to Buying Gold in Algeria",
      body: [
        "Check the hallmark: 750 for 18K, 875 for 21K, 916 for 22K.",
        "Buy from a licensed shop and request an official invoice with weight, karat, gram price and craftsmanship.",
        "Have the piece weighed in front of you on a calibrated scale before paying.",
        "Note that 18K dominates the Algerian market — confirm the karat before comparing prices.",
        "Check the exchange rate and gram price at the moment of purchase, as Dinar moves change the local price.",
        "For savings, prefer bars or simple pieces over intricate designs to reduce craftsmanship lost on resale.",
        "Keep the invoice — it proves weight and karat and helps when reselling or exchanging.",
      ],
    },
  },

  faq: [
    {
      q: { ar: "ما هو العيار الأكثر انتشارا في الجزائر؟", en: "Which karat is most common in Algeria?" },
      a: { ar: "عيار 18 هو الأكثر انتشارا في السوق الجزائري كما هو الحال في معظم دول المغرب العربي، ويتوفر أيضا عيار 21 و22 في بعض المحلات. تأكد دائما من الدمغة قبل المقارنة بين الأسعار لأن اختلاف العيار يعني اختلاف السعر.",
            en: "18K is the most common in the Algerian market, as across most of the Maghreb, with 21K and 22K also available in some shops. Always check the hallmark before comparing prices, since a different karat means a different price." },
    },
    {
      q: { ar: "لماذا يرتفع سعر الذهب في الجزائر أسرع من الأسعار العالمية؟", en: "Why does gold rise faster in Algeria than global prices?" },
      a: { ar: "لأن السعر المحلي يجمع عاملين: ارتفاع السعر العالمي للأونصة، وتغيّر سعر صرف الدينار الجزائري مقابل الدولار. فإذا تراجع الدينار في الوقت الذي يرتفع فيه الذهب عالميا، يتضاعف أثر الارتفاع على سعر الجرام محليا.",
            en: "Because the local price combines two factors: the rise in the global ounce price and changes in the Dinar's exchange rate against the dollar. If the Dinar weakens while gold rises globally, the effect on the local gram price is compounded." },
    },
    {
      q: { ar: "ما هي المجوهرات القبائلية ولماذا تشتهر بالفضة؟", en: "What is Kabyle jewellery and why is it known for silver?" },
      a: { ar: "المجوهرات القبائلية حرفة تقليدية جزائرية تُصنع تاريخيا من الفضة وتُزيَّن بالمرجان والمينا الملوّنة، وتشتهر بها قرية آث يني في تيزي وزو. وقد كانت الفضة هي المعدن الأساسي في المجوهرات الريفية بشمال إفريقيا قديما، ومع الوقت ظهرت تقنيات لتغطية الفضة بالذهب.",
            en: "Kabyle jewellery is a traditional Algerian craft historically made of silver and decorated with coral and coloured enamel, famously produced in the village of Ath Yenni in Tizi Ouzou. Silver was the primary metal in rural North African jewellery historically, and techniques later emerged to gild silver pieces with gold." },
    },
    {
      q: { ar: "كيف أتأكد من عيار الذهب قبل الشراء؟", en: "How do I verify gold purity before buying?" },
      a: { ar: "ابحث عن الدمغة المطبوعة على القطعة (750 لعيار 18 مثلا)، واشترِ من محل صاغة مرخّص، واطلب فاتورة رسمية تذكر العيار والوزن. ويمكنك عند الشك طلب فحص القطعة لدى جهة مختصة.",
            en: "Look for the hallmark stamped on the piece (750 for 18K, for example), buy from a licensed jeweller, and request an official invoice stating karat and weight. If in doubt, you can ask to have the piece tested by a specialist." },
    },
    {
      q: { ar: "هل شراء الذهب وسيلة جيدة للادخار في الجزائر؟", en: "Is buying gold a good way to save in Algeria?" },
      a: { ar: "يلجأ كثير من الأسر الجزائرية إلى الذهب للحفاظ على قيمة مدخراتها أمام تراجع القوة الشرائية للدينار. وللحصول على أفضل نتيجة عند البيع لاحقا، يُفضّل شراء السبائك أو القطع ذات الصياغة البسيطة بدل التصاميم المعقّدة التي تُخصم أجرة صياغتها عند إعادة البيع.",
            en: "Many Algerian households turn to gold to preserve savings against the Dinar's declining purchasing power. For the best outcome on resale, prefer bars or simply crafted pieces over intricate designs, whose craftsmanship charge is deducted when selling back." },
    },
    {
      q: { ar: "أين تقع أشهر مراكز صياغة الذهب في الجزائر؟", en: "Where are Algeria's best-known jewellery centres?" },
      a: { ar: "العاصمة الجزائر تضم أكبر تجمّع لمحلات الذهب، ولتلمسان وقسنطينة تاريخ طويل كمراكز للصياغة والمجوهرات التقليدية، بينما تشتهر قرية آث يني في تيزي وزو بالمجوهرات القبائلية اليدوية.",
            en: "Algiers hosts the largest cluster of gold shops, while Tlemcen and Constantine have long histories as centres of goldsmithing and traditional jewellery, and the village of Ath Yenni in Tizi Ouzou is famous for handmade Kabyle jewellery." },
    },
  ],
};
