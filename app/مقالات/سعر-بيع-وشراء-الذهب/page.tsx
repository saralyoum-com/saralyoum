import ArticlePage from "@/components/ArticlePage";

export default function Page() {
  return (
    <ArticlePage
      slug="سعر-بيع-وشراء-الذهب"
      icon="⚖️"
      category="تعليم"
      date="2026-07-16"
      readMins={6}
      titleAr="الفرق بين سعر بيع وشراء الذهب — ولماذا تخسر عند إعادة البيع؟"
      titleEn="Gold Buy vs Sell Price — Why You Lose When Reselling"
      descAr="لماذا يبيعك المحل الذهب بسعر أعلى مما يشتريه منك؟ شرح الفرق بين سعر البيع والشراء، ومكونات الفجوة من مصنعية وهامش وضريبة، وكيف تقلل خسارتك عند إعادة البيع."
      descEn="Why do shops sell gold higher than they buy it back? The buy-sell spread explained: making charges, dealer margin, VAT, and how to minimize your resale loss."
      sectionsAr={[
        {
          heading: "لماذا يوجد سعران للذهب في المحل؟",
          body: "عند دخول أي محل ذهب ستجد سعرين مختلفين لنفس الجرام:\n\n• سعر البيع (شراء جديد): السعر الذي تدفعه أنت لشراء الذهب من المحل — وهو الأعلى.\n• سعر الشراء (بيع مستعمل): السعر الذي يدفعه المحل ليشتري ذهبك منك — وهو الأقل.\n\nالفرق بينهما ليس غشا — هو نموذج عمل تجارة الذهب في كل العالم. المحل يربح من هذه الفجوة، تماما كما تربح شركات الصرافة من فرق سعري شراء وبيع العملات.\n\nلكن فهم مكونات هذه الفجوة بدقة هو ما يحميك من دفع أكثر من اللازم، ويجعلك تبيع بأفضل سعر ممكن.",
        },
        {
          heading: "مكونات الفجوة: أين تذهب الفلوس؟",
          body: "عند شراء قطعة جديدة ثم بيعها، تخسر عادة ثلاثة أشياء:\n\n1. المصنعية: دفعتها عند الشراء (قد تكون 10-20% من قيمة القطعة) والمحل لا يعيدها عند البيع أبدا — يشتري الذهب الخام فقط.\n\n2. ضريبة القيمة المضافة: في معظم الدول تدفعها عند الشراء ولا تستردها عند البيع للمحل (15% في السعودية على المشغولات، 5% في الإمارات).\n\n3. هامش المحل: حتى على الذهب الخام نفسه، يشتري المحل منك بخصم بسيط عن سعر السوق (عادة 1-5%).\n\nالنتيجة: قطعة اشتريتها اليوم بـ 3,000 ريال قد لا تساوي عند البيع الفوري أكثر من 2,400-2,600 ريال — حتى لو لم يتغير سعر الذهب إطلاقا.",
        },
        {
          heading: "مثال رقمي كامل: كم تخسر فعلا؟",
          body: "لنحسب سلسلة عيار 21 وزنها 10 جرام في السعودية:\n\nعند الشراء:\n• سعر الجرام: 430 ريال → قيمة الذهب: 4,300 ريال\n• المصنعية 50 ريال/جرام → 500 ريال\n• الضريبة 15% على الإجمالي → 720 ريال\n• المجموع المدفوع: 5,520 ريال\n\nعند البيع الفوري (نفس اليوم، نفس سعر السوق):\n• المحل يدفع سعر الذهب الخام بخصم ~2%: 4,300 × 0.98 = 4,214 ريال\n\nالخسارة: 5,520 − 4,214 = 1,306 ريال أي حوالي 24% من المبلغ المدفوع.\n\nلهذا السبب الذهب المشغول ليس أداة مضاربة سريعة — يحتاج ارتفاع السعر نفسه حوالي 25% أو أكثر فقط لتخرج برأس مالك.",
        },
        {
          heading: "كيف تقلل الفجوة إلى أدنى حد؟",
          body: "خمس قواعد عملية:\n\n1. للاستثمار: اشتر سبائك عيار 24 بدل المشغولات — مصنعيتها رمزية، ومعفاة من الضريبة في السعودية والإمارات وعُمان، وتباع قريبا جدا من سعر السوق. الفجوة تنكمش من ~24% إلى ~2-5%.\n\n2. اختر التصاميم البسيطة إن كنت تشتري مشغولات — مصنعية أقل تعني خسارة أقل عند البيع.\n\n3. قارن أسعار الشراء في أكثر من محل قبل البيع — الفروقات حقيقية وقد تتجاوز 5%.\n\n4. اسأل عن ضمان الاستبدال: بعض المحلات تحفظ لك جزءا من المصنعية إذا استبدلت القطعة بأخرى من نفس المحل.\n\n5. تابع السعر وبع في القمم: تابع جدول أسعار البيع والشراء اليومي لدولتك على سرد الذهب، وفعل التنبيهات لتعرف لحظة ارتفاع السعر.",
        },
        {
          heading: "متى يعوض ارتفاع السعر خسارة الفجوة؟",
          body: "السؤال الحقيقي لمن يشتري الذهب كادخار طويل الأجل: كم يحتاج السعر ليرتفع حتى أخرج متعادلا؟\n\nالمعادلة التقريبية للمشغولات: تحتاج ارتفاعا يساوي نسبة المصنعية + الضريبة + هامش المحل.\n\n• مشغولات بمصنعية عادية: تحتاج ارتفاع 20-30% للتعادل — قد يستغرق سنوات أو يتحقق في سنة واحدة قوية.\n• سبائك: تحتاج 2-5% فقط — ولهذا هي الخيار الأول للمدخرين.\n\nتاريخيا، متوسط ارتفاع الذهب السنوي على مدى العقدين الماضيين كان حوالي 8-10% — أي أن المشغولات تصل للتعادل عادة بعد 2-4 سنوات، بينما السبائك خلال أشهر.\n\nالخلاصة: اشتر المشغولات للزينة ومتعة الاقتناء، واشتر السبائك للادخار — ولا تخلط بين الهدفين عند الحساب.",
        },
      ]}
      sectionsEn={[
        {
          heading: "Why Are There Two Prices at the Shop?",
          body: "Walk into any gold shop and you'll find two different prices for the same gram:\n\n• The sell price (buying new): what you pay to buy gold from the shop — the higher one.\n• The buy price (selling used): what the shop pays to buy your gold — the lower one.\n\nThe gap between them isn't cheating — it's how the gold trade works worldwide. The shop earns from this spread, exactly like currency exchanges profit from buy/sell rate differences.\n\nBut understanding precisely what makes up this gap is what protects you from overpaying — and gets you the best possible price when selling.",
        },
        {
          heading: "Anatomy of the Spread: Where Does the Money Go?",
          body: "Buy a new piece then sell it, and you typically lose three things:\n\n1. The making charge: paid at purchase (often 10-20% of the piece's value) and never refunded at resale — the shop buys raw gold only.\n\n2. VAT: in most countries you pay it when buying and don't recover it when selling to a shop (15% in Saudi Arabia on jewelry, 5% in the UAE).\n\n3. The dealer margin: even on raw gold, the shop buys from you at a small discount to market (usually 1-5%).\n\nResult: a piece bought today for 3,000 SAR may fetch only 2,400-2,600 SAR on immediate resale — even if the gold price didn't move at all.",
        },
        {
          heading: "A Full Numeric Example: How Much Do You Really Lose?",
          body: "Let's price a 10g 21K chain in Saudi Arabia:\n\nAt purchase:\n• Gram price 430 SAR → gold value: 4,300 SAR\n• Making charge 50 SAR/g → 500 SAR\n• 15% VAT on the total → 720 SAR\n• Total paid: 5,520 SAR\n\nOn immediate resale (same day, same market price):\n• The shop pays raw gold value at ~2% discount: 4,300 × 0.98 = 4,214 SAR\n\nThe loss: 5,520 − 4,214 = 1,306 SAR — about 24% of what you paid.\n\nThis is why jewelry is not a quick-trading vehicle — the gold price itself needs to rise ~25% just for you to break even.",
        },
        {
          heading: "How to Shrink the Gap",
          body: "Five practical rules:\n\n1. For investment: buy 24K bullion bars instead of jewelry — token making charges, VAT-exempt in Saudi Arabia, the UAE and Oman, and they resell very close to market. The gap shrinks from ~24% to ~2-5%.\n\n2. Choose simple designs if buying jewelry — lower making charge means smaller resale loss.\n\n3. Compare buy-back offers at several shops before selling — real differences, often exceeding 5%.\n\n4. Ask about exchange guarantees: some shops preserve part of the making charge if you swap the piece for another from the same shop.\n\n5. Track the price and sell into strength: follow your country's daily buy/sell table on sardhahab.com and enable alerts to catch price surges.",
        },
        {
          heading: "When Does a Price Rise Offset the Spread?",
          body: "The real question for long-term savers: how much must gold rise before I break even?\n\nApproximate rule for jewelry: you need a rise equal to the making charge % + VAT + dealer margin.\n\n• Typical jewelry: needs a 20-30% rise to break even — could take years, or one strong year.\n• Bullion: needs only 2-5% — which is why it's the saver's first choice.\n\nHistorically, gold's average annual gain over the past two decades has been roughly 8-10% — so jewelry typically breaks even after 2-4 years, while bullion does within months.\n\nBottom line: buy jewelry for beauty and enjoyment, buy bullion for savings — and never mix the two goals when doing the math.",
        },
      ]}
    />
  );
}
