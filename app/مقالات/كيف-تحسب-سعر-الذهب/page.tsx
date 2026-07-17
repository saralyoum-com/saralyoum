import ArticlePage from "@/components/ArticlePage";

export default function Page() {
  return (
    <ArticlePage
      slug="كيف-تحسب-سعر-الذهب"
      icon="🧮"
      category="تعليم"
      date="2026-07-16"
      readMins={6}
      titleAr="كيف تحسب سعر الذهب بنفسك؟ طريقة الحساب بالجرام والعيار خطوة بخطوة"
      titleEn="How to Calculate the Gold Price Yourself — Step by Step by Gram and Karat"
      descAr="طريقة حساب سعر الذهب بالجرام لأي عيار: المعادلة الأساسية، تحويل سعر الأونصة إلى جرام، حساب سعر الشراء من المحل مع المصنعية والضريبة، وقيمة ذهبك عند البيع."
      descEn="How to calculate gold prices per gram for any karat: the core formula, converting the ounce price to grams, shop price with making charge and VAT, and your gold's resale value."
      sectionsAr={[
        {
          heading: "المعادلة الأساسية لحساب سعر الذهب",
          body: "حساب قيمة أي قطعة ذهب يقوم على معادلة واحدة بسيطة:\n\nقيمة الذهب = الوزن بالجرام × سعر جرام العيار\n\nمثال سريع: سلسلة عيار 21 وزنها 10 جرام، وسعر جرام عيار 21 اليوم 430 ريال:\n10 × 430 = 4,300 ريال قيمة الذهب الخام.\n\nكل ما تحتاجه رقمان فقط: وزن القطعة (مكتوب على الفاتورة أو تزنه عند أي صائغ) وسعر الجرام لعيارها اليوم — وهو ما يعرضه موقع سرد الذهب محدثا على مدار الساعة لكل عيار وبعملات الدول العربية.",
        },
        {
          heading: "كيف يُحسب سعر الجرام من سعر الأونصة العالمي؟",
          body: "السعر العالمي للذهب يُعلن بالدولار للأونصة (الأوقية)، والأونصة الواحدة = 31.1035 جرام من الذهب النقي عيار 24.\n\nالخطوة 1 — سعر جرام عيار 24 بالدولار:\nسعر الأونصة ÷ 31.1035\nمثال: أونصة بـ 4,100 دولار → 4,100 ÷ 31.1035 = 131.8 دولار للجرام.\n\nالخطوة 2 — التحويل لعملتك:\n131.8 × سعر صرف الدولار (مثلا 3.75 ريال) = 494 ريال لجرام عيار 24.\n\nالخطوة 3 — تعديل العيار (النقاء):\n• عيار 24 = نقاء 100%\n• عيار 22 = 22 ÷ 24 = 91.7%\n• عيار 21 = 21 ÷ 24 = 87.5%\n• عيار 18 = 18 ÷ 24 = 75%\n\nجرام عيار 21 = سعر جرام 24 × 0.875. في مثالنا: 494 × 0.875 = 432 ريال تقريبا.\n\nهذه هي الأسعار 'الخام' التي تراها في جداول الموقع — قبل إضافة المصنعية والضريبة.",
        },
        {
          heading: "حساب سعر الشراء الفعلي من المحل",
          body: "عند الشراء من محل المجوهرات تدفع فوق سعر الذهب الخام:\n\n1. المصنعية: أجرة الصياغة لكل جرام، وتختلف حسب التصميم والمحل (راجع مقال مصنعية الذهب للتفاصيل).\n2. ضريبة القيمة المضافة: حسب الدولة (15% في السعودية، 5% في الإمارات، وهكذا).\n\nالمعادلة الكاملة:\nالسعر النهائي = [الوزن × (سعر الجرام + المصنعية للجرام)] × (1 + نسبة الضريبة)\n\nمثال كامل — خاتم عيار 21 وزنه 5 جرام في السعودية:\n• سعر الجرام: 430 ريال، المصنعية: 60 ريال/جرام\n• (5 × (430 + 60)) = 2,450 ريال\n• مع الضريبة 15%: 2,450 × 1.15 = 2,817.5 ريال\n\nهكذا تعرف قبل دخول المحل ما السعر العادل تقريبا، وتكتشف فورا أي مبالغة.",
        },
        {
          heading: "حساب قيمة ذهبك عند البيع",
          body: "عند بيع ذهب مستعمل، المحل يشتري منك الذهب الخام فقط — بدون المصنعية التي دفعتها، وغالبا بخصم بسيط عن سعر السوق:\n\nقيمة البيع التقريبية = الوزن × سعر جرام العيار × (0.95 إلى 1.0)\n\nمثال: سوار عيار 21 وزنه 20 جرام وسعر الجرام اليوم 430 ريال:\n• الحد الأعلى: 20 × 430 = 8,600 ريال\n• الواقعي: بين 8,200 و8,600 حسب المحل\n\nنصيحتان قبل البيع:\n• اعرف الوزن والعيار بدقة (مختومان على القطعة غالبا) واحسب القيمة بنفسك قبل زيارة أي محل.\n• قارن عروض أكثر من محل في نفس اليوم — الفروقات قد تتجاوز 5%.",
        },
        {
          heading: "أدوات تحسب لك كل ذلك تلقائيا",
          body: "بدل الحساب اليدوي في كل مرة:\n\n• حاسبة الذهب في سرد الذهب: أدخل الوزن والعيار والمصنعية، وتحصل على السعر النهائي فورا بأي عملة عربية — محدثة بسعر السوق لحظة بلحظة.\n• جدول الأسعار: أسعار كل العيارات (24، 22، 21، 18، 14) بالدولار وعملتك المحلية.\n• صفحات الدول: سعر الجرام في السعودية والإمارات ومصر وبقية الدول العربية بعملتها، مع أسعار البيع والشراء في المحلات وأسعار السبائك.\n\nومع تفعيل التنبيهات، يصلك إشعار عند أي حركة قوية في السعر — فتشتري أو تبيع في التوقيت الأنسب.",
        },
      ]}
      sectionsEn={[
        {
          heading: "The Core Formula",
          body: "Valuing any gold piece comes down to one simple formula:\n\nGold value = weight in grams × per-gram price for its karat\n\nQuick example: a 21K chain weighing 10g with today's 21K gram price at 430 SAR:\n10 × 430 = 4,300 SAR of raw gold value.\n\nYou only need two numbers: the piece's weight (on the invoice, or weigh it at any jeweler) and today's gram price for its karat — which sardhahab.com shows live for every karat in Arab currencies.",
        },
        {
          heading: "From the Global Ounce Price to a Gram Price",
          body: "The global gold price is quoted in USD per ounce, and one ounce = 31.1035 grams of pure 24K gold.\n\nStep 1 — 24K gram price in USD:\nOunce price ÷ 31.1035\nExample: $4,100 ÷ 31.1035 = $131.8 per gram.\n\nStep 2 — convert to your currency:\n131.8 × exchange rate (e.g. 3.75 SAR) = 494 SAR per 24K gram.\n\nStep 3 — adjust for karat purity:\n• 24K = 100%\n• 22K = 91.7%\n• 21K = 87.5%\n• 18K = 75%\n\nA 21K gram = 24K gram price × 0.875. In our example: 494 × 0.875 ≈ 432 SAR.\n\nThese are the 'raw' prices you see in the site's tables — before making charges and VAT.",
        },
        {
          heading: "Calculating the Real Shop Price",
          body: "At a jewelry shop you pay, on top of raw gold:\n\n1. Making charge: fabrication fee per gram, varying by design and shop.\n2. VAT: by country (15% in Saudi Arabia, 5% in the UAE, etc.).\n\nFull formula:\nFinal price = [weight × (gram price + making charge per gram)] × (1 + VAT rate)\n\nFull example — a 5g 21K ring in Saudi Arabia:\n• Gram price 430 SAR, making charge 60 SAR/g\n• (5 × (430 + 60)) = 2,450 SAR\n• With 15% VAT: 2,450 × 1.15 = 2,817.5 SAR\n\nKnowing this before entering the shop tells you the fair price — and flags any overcharging instantly.",
        },
        {
          heading: "Valuing Your Gold When Selling",
          body: "When selling used gold, the shop buys only the raw gold — without the making charge you paid, and usually at a small discount to market:\n\nApproximate sale value = weight × karat gram price × (0.95 to 1.0)\n\nExample: a 20g 21K bracelet with today's gram at 430 SAR:\n• Upper bound: 20 × 430 = 8,600 SAR\n• Realistic: 8,200-8,600 depending on the shop\n\nTwo tips before selling:\n• Know the exact weight and karat (usually stamped on the piece) and compute the value yourself first.\n• Compare offers from several shops on the same day — differences can exceed 5%.",
        },
        {
          heading: "Tools That Do It For You",
          body: "Instead of manual math every time:\n\n• The sardhahab.com gold calculator: enter weight, karat, and making charge — get the final price instantly in any Arab currency, live.\n• The prices table: every karat (24, 22, 21, 18, 14) in USD and your local currency.\n• Country pages: gram prices in Saudi Arabia, UAE, Egypt and the rest of the Arab world in local currency, with shop buy/sell and bullion prices.\n\nEnable alerts and you'll get notified on any strong price move — so you buy or sell at the right moment.",
        },
      ]}
    />
  );
}
