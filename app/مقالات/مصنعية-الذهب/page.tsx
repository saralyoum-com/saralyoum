import ArticlePage from "@/components/ArticlePage";

export default function Page() {
  return (
    <ArticlePage
      slug="مصنعية-الذهب"
      icon="🏷️"
      category="تعليم"
      date="2026-06-24"
      readMins={7}
      titleAr="مصنعية الذهب — ما هي؟ ولماذا تختلف؟ وهل تُسترد عند البيع؟"
      titleEn="Gold Making Charge — What It Is, Why It Varies, and Is It Refundable?"
      descAr="دليل شامل لمصنعية الذهب: ما هي، لماذا تختلف من محل لآخر، متوسطها في دول الخليج ومصر، هل تُسترد عند البيع، وكيف توفّر فيها."
      descEn="Complete guide to gold making charges: what they are, why they vary, average rates across the Gulf and Egypt, whether they're refundable, and how to save."
      sectionsAr={[
        {
          heading: "ما هي مصنعية الذهب؟",
          body: "مصنعية الذهب (أو أجرة الصياغة) هي المبلغ الذي يضيفه الصائغ على سعر الذهب الخام مقابل تشكيل القطعة وتصميمها. عند شراء مشغولات ذهبية تدفع شيئين:\n\n1. قيمة الذهب نفسه = الوزن × سعر الجرام للعيار.\n2. المصنعية = أجور العمالة والتصميم وربح المصنع والتاجر.\n\nمثال: خاتم عيار 21 وزنه 5 جرام، سعر الجرام 430 ريال، والمصنعية 50 ريال/جرام:\n• قيمة الذهب: 5 × 430 = 2,150 ريال\n• المصنعية: 5 × 50 = 250 ريال\n• الإجمالي قبل الضريبة: 2,400 ريال\n\nالمصنعية تُحسب لكل جرام، وكلما زاد وزن القطعة زادت المصنعية الإجمالية.",
        },
        {
          heading: "لماذا تختلف المصنعية من محل لآخر؟",
          body: "لا يوجد سعر ثابت للمصنعية — تختلف بشكل كبير حسب:\n\n• التصميم: القطع البسيطة (خواتم وأساور سادة) مصنعيتها أقل. التصاميم المعقدة والمرصّعة أعلى بكثير.\n• طريقة الصناعة: الذهب المصنوع آلياً أرخص من الشغل اليدوي.\n• الماركة: الماركات العالمية والإيطالية تفرض مصنعية أعلى، قد تصل لضعف العادية.\n• العيار: عيار 18 غالباً مصنعيته أعلى نسبياً من عيار 21 بسبب زيادة نسبة السبائك والفاقد أثناء التصنيع.\n• المحل والمدينة: تختلف من متجر لآخر وحتى بين المدن.\n\nلهذا لا يمكن نشر 'سعر مصنعية' واحد دقيق — هي نطاق تقديري، والأفضل أن تسأل المحل مباشرة وتطلب تفصيلها في الفاتورة.",
        },
        {
          heading: "متوسط المصنعية في الدول العربية",
          body: "هذه نطاقات تقديرية لمصنعية الجرام، وتختلف حسب التصميم والمحل:\n\n🇸🇦 السعودية: 40 – 100 ريال/جرام\n🇦🇪 الإمارات: 10 – 35 درهم/جرام (قابلة للتفاوض في الأسواق)\n🇪🇬 مصر: 50 – 200 جنيه/جرام للمشغولات المحلية، وأعلى للمستورد\n🇴🇲 عُمان: 4 – 10 ريال عماني/جرام\n\nفي دول الخليج الأخرى (الكويت، قطر، البحرين) تختلف حسب السوق والتصميم. القاعدة العامة: القطع البسيطة في الطرف الأدنى، والتصاميم والماركات في الطرف الأعلى. استخدم حاسبة الذهب في الموقع لإدخال المصنعية ومعرفة التكلفة الإجمالية الفعلية بعملتك.",
        },
        {
          heading: "هل تُسترد المصنعية عند البيع؟",
          body: "هذا أهم سؤال — والإجابة: لا، المصنعية لا تُسترد عند البيع في الغالب.\n\nعندما تبيع ذهبك المستعمل للمحل، يدفع لك سعر الذهب الخام (أو أقل قليلاً) حسب الوزن والعيار — دون احتساب المصنعية التي دفعتها عند الشراء. أي أن المصنعية 'تكلفة مدفوعة' تخسرها عند البيع.\n\nمثال: اشتريت قطعة بـ 2,400 ريال (منها 250 ريال مصنعية). عند البيع لاحقاً بنفس سعر الذهب، ستحصل على ~2,150 ريال فقط — خسرت المصنعية.\n\nلذلك:\n• للاستثمار البحت: السبائك (عيار 24) أفضل لأن مصنعيتها منخفضة جداً وتُباع قريباً من السعر العالمي.\n• للزينة: تقبّل المصنعية كتكلفة مقابل جمال القطعة واستخدامها.\n\nبعض المحلات تقدّم 'ضمان استبدال' يحفظ جزءاً من المصنعية إذا استبدلت بقطعة جديدة من نفس المحل — اسأل عن ذلك قبل الشراء.",
        },
        {
          heading: "المصنعية وضريبة القيمة المضافة",
          body: "تختلف الضريبة على الذهب بين الدول:\n\n• السعودية: 15% — لكن الذهب الاستثماري (سبائك ومسكوكات بنقاء 99% فأعلى) معفى. المجوهرات (عيار 22 و21 و18) تخضع للضريبة على قيمة الذهب والمصنعية.\n• الإمارات وعُمان: 5% مع إعفاء الذهب الاستثماري.\n• البحرين: 10%.\n• الكويت وقطر: لا توجد ضريبة قيمة مضافة حالياً.\n• مصر: تُطبّق ضريبة على المصنعية.\n\nالقاعدة المفيدة: إذا كان هدفك الاستثمار، فالسبائك عيار 24 غالباً معفاة من الضريبة ومصنعيتها أقل — خيار أوفر للادخار.",
        },
        {
          heading: "كيف توفّر في المصنعية؟",
          body: "نصائح عملية لتقليل ما تدفعه:\n\n• قارن بين أكثر من محل — المصنعية تختلف كثيراً.\n• فاوض، خصوصاً في القطع الكبيرة أو عند الدفع نقداً — كثير من المحلات يخفّض المصنعية عند الطلب.\n• اختر التصاميم البسيطة والمصنوعة آلياً إذا كان هدفك الادخار.\n• للاستثمار، اشترِ سبائك عيار 24 بدلاً من المجوهرات.\n• اطلب فاتورة مفصّلة توضح قيمة الذهب والمصنعية والضريبة كلاً على حدة — حقك أن تعرف ما تدفعه بالضبط.\n• تابع سعر الذهب اليومي على sardhahab.com لتشتري عند المستويات المناسبة.\n\nتذكّر: المصنعية ليست غشاً — هي أجر حقيقي مقابل عمل، لكن معرفتها تحميك من المبالغة في السعر.",
        },
      ]}
      sectionsEn={[
        {
          heading: "What Is a Gold Making Charge?",
          body: "The making charge (fabrication fee) is the amount a jeweler adds to the raw gold price for crafting and designing a piece. When buying gold jewelry you pay two things:\n\n1. The gold value = weight × per-gram price for the karat.\n2. The making charge = labour, design, factory and dealer margin.\n\nExample: a 21K ring weighing 5g, gram price 430, making charge 50/g:\n• Gold value: 5 × 430 = 2,150\n• Making: 5 × 50 = 250\n• Total before VAT: 2,400\n\nThe making charge is per gram, so heavier pieces carry a larger total making charge.",
        },
        {
          heading: "Why Does It Vary Between Shops?",
          body: "There is no fixed making charge — it varies widely by:\n\n• Design: plain pieces cost less; intricate, stone-set designs cost much more.\n• Production: machine-made gold is cheaper than handmade.\n• Brand: international and Italian brands charge more, sometimes double.\n• Karat: 18K often carries a relatively higher making charge than 21K due to more alloy and waste during fabrication.\n• Shop and city: it differs store to store and even between cities.\n\nThat's why no single accurate 'making charge price' can be published — it's an estimated range, and it's best to ask the shop directly and request it itemized on the invoice.",
        },
        {
          heading: "Average Making Charge Across Arab Markets",
          body: "These are estimated per-gram ranges that vary by design and shop:\n\n🇸🇦 Saudi: 40 – 100 SAR/g\n🇦🇪 UAE: 10 – 35 AED/g (negotiable in the souks)\n🇪🇬 Egypt: 50 – 200 EGP/g for local pieces, higher for imported\n🇴🇲 Oman: 4 – 10 OMR/g\n\nIn the other Gulf states (Kuwait, Qatar, Bahrain) it varies by market and design. The general rule: plain pieces at the low end, designer and branded at the high end. Use the gold calculator on the site to enter the making charge and see the true total cost in your currency.",
        },
        {
          heading: "Is the Making Charge Refundable When Selling?",
          body: "This is the key question — and the answer is: no, the making charge is generally not refunded when you sell.\n\nWhen you sell used gold to a shop, it pays you the raw gold price (or slightly less) by weight and karat — without the making charge you paid at purchase. The making charge is a 'sunk cost' you lose on resale.\n\nExample: you bought a piece for 2,400 (of which 250 was making). Reselling later at the same gold price, you'd get ~2,150 only — the making charge is lost.\n\nTherefore:\n• For pure investment: bullion (24K) is better — very low making charge, sells near the global price.\n• For adornment: accept the making charge as the cost of the piece's beauty and use.\n\nSome shops offer an 'exchange guarantee' that preserves part of the making charge if you trade up for a new piece at the same shop — ask before buying.",
        },
        {
          heading: "Making Charge and VAT",
          body: "Gold VAT differs by country:\n\n• Saudi: 15% — but investment gold (bullion and coins of 99%+ purity) is exempt. Jewelry (22K, 21K, 18K) is taxed on gold value plus making.\n• UAE and Oman: 5%, with investment gold exempt.\n• Bahrain: 10%.\n• Kuwait and Qatar: no VAT currently.\n• Egypt: VAT applies to the making charge.\n\nUseful rule: if your goal is investment, 24K bullion is often VAT-exempt with a lower making charge — a cheaper option for saving.",
        },
        {
          heading: "How to Save on the Making Charge",
          body: "Practical tips to pay less:\n\n• Compare several shops — making charges vary a lot.\n• Negotiate, especially on large pieces or cash payment — many shops lower the charge on request.\n• Choose simple, machine-made designs if your goal is saving.\n• For investment, buy 24K bullion instead of jewelry.\n• Ask for an itemized invoice showing gold value, making charge and VAT separately — you have the right to know exactly what you pay.\n• Follow the daily gold price on sardhahab.com to buy at the right levels.\n\nRemember: the making charge isn't a scam — it's a real fee for real work, but knowing it protects you from overpaying.",
        },
      ]}
    />
  );
}
