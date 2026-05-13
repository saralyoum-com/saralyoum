import ArticlePage from "@/components/ArticlePage";
export default function Page() {
  return (
    <ArticlePage
      slug="زكاة-الذهب"
      icon="☪️" category="إسلامي" date="2026-04-04" readMins={8}
      titleAr="زكاة الذهب — الأحكام الشاملة وطريقة الحساب الصحيحة 2026"
      titleEn="Gold Zakat — Complete Rules and Correct Calculation Method 2026"
      descAr="دليل تفصيلي لأحكام زكاة الذهب: النصاب والحول والنسبة، الفرق بين الحلي والاستثمار، الخلاف العلمي، وكيفية الحساب بالأسعار الحالية خطوة بخطوة."
      descEn="Detailed guide to gold zakat rules: nisab, hawl, rate, difference between jewelry and investment gold, scholarly disagreements, and step-by-step calculation with current prices."
      sectionsAr={[
        {
          heading: "هل تجب الزكاة على الذهب؟ الحكم الشرعي",
          body: `نعم، تجب الزكاة على الذهب بالإجماع إذا توافرت شروط ثلاثة: بلوغ النصاب، ومرور الحول (سنة هجرية)، وأن يكون الذهب فائضاً عن الحاجة الأصلية.

الدليل: قول النبي صلى الله عليه وسلم: "في الذهب ربع العُشر" أي 2.5%. وقوله تعالى: "والذين يكنزون الذهب والفضة ولا ينفقونها في سبيل الله فبشّرهم بعذاب أليم".

أنواع الذهب وحكمها:
• ذهب الاستثمار والاكتناز (سبائك، مسكوكات): زكاته واجبة بالاتفاق.
• ذهب التجارة (يُعدّ للبيع): زكاته واجبة كعروض التجارة.
• حُلي المرأة المُعدّة للزينة: خلاف مشهور بين العلماء — رأي جمهور الحنفية والحنابلة (في قول) وجوب الزكاة. رأي المالكية والشافعية وكثير من الحنابلة عدم الوجوب في الحلي المستعملة. والأحوط إخراج زكاتها.`,
        },
        {
          heading: "النصاب — الحد الأدنى للزكاة",
          body: `نصاب الذهب هو 20 ديناراً ذهبياً شرعياً، وقدّره العلماء المعاصرون بـ 85 غراماً من الذهب الخالص (عيار 24).

كيف تحسب النصاب بعيارات مختلفة؟
• عيار 24 (ذهب خالص): النصاب = 85 جراماً
• عيار 21: النصاب = 85 × (24÷21) = 97.14 جراماً (تقريباً 97 جراماً)
• عيار 18: النصاب = 85 × (24÷18) = 113.3 جراماً
• عيار 14: النصاب = 85 × (24÷14) = 145.7 جراماً

مثال عملي: إذا كنت تملكين سواراً وزنه 50 جراماً عيار 21، وخاتماً وزنه 20 جراماً عيار 21، وقلادة وزنها 35 جراماً عيار 21 — المجموع 105 جرامات، وهو أعلى من النصاب (97 جراماً)، فتجب الزكاة.

هل تجمع عيارات مختلفة؟ نعم، يُحوَّل كل عيار إلى عيار 24 ثم يُجمع. أو الأيسر: تُضرب كل قطعة في سعر جرامها ويُجمع مجموع القيم.`,
        },
        {
          heading: "الحول — اشتراط مرور السنة",
          body: `الحول شرط أساسي: يجب أن يمرّ على ملكية النصاب سنة هجرية كاملة (354 يوماً). لذلك يُنصح بتحديد يوم ثابت في السنة تُقيّم فيه ذهبك وتُحسب زكاته — أغلب العلماء يُوصون بجعله في رمضان.

قاعدة الحول:
✓ إذا امتلكت النصاب طوال السنة كاملاً: تجب الزكاة.
✓ إذا زاد الذهب خلال السنة: تُزكّى الزيادة مع الأصل في نهاية الحول (تبعية الربح لأصله).
✗ إذا نقص الذهب عن النصاب في أي وقت خلال السنة: ينقطع الحول ويبدأ من جديد عند عودته للنصاب.
✗ إذا اشتريت الذهب هذا العام للمرة الأولى: يبدأ الحول من يوم ملكته، وتجب الزكاة بعد سنة هجرية.

تنبيه: الذهب المتجدد (شراء قطع جديدة بانتظام) يُلحق بأصل الذهب القائم في حوله — هذه مسألة دقيقة، والأيسر استشارة عالم في حالات التردد.`,
        },
        {
          heading: "نسبة الزكاة وطريقة الحساب خطوة بخطوة",
          body: `نسبة الزكاة ثابتة: 2.5% من القيمة السوقية الكاملة للذهب — لا من الربح فقط ولا من سعر الشراء.

لماذا من القيمة الكاملة وليس الربح؟ لأن الزكاة تُطهّر المال ذاته، لا العائد منه. سواء اشتريت الذهب بـ200 ريال وأصبح يُساوي 250، أو بـ300 وأصبح يساوي 250 — الزكاة على الـ250 الحالية.

الحساب خطوة بخطوة:
الخطوة 1: احسب وزن كل قطعة ذهب تملكها بالجرام (اسأل المحل أو زنها بميزان دقيق).
الخطوة 2: تحقق من عيار كل قطعة (الطابع المنقوش عليها).
الخطوة 3: ابحث عن سعر الجرام لكل عيار في sardhahab.com (سعر اليوم).
الخطوة 4: اضرب وزن كل قطعة في سعر جرامها → اجمع كل القيم.
الخطوة 5: اضرب المجموع في 0.025 (أي 2.5%) → هذا مقدار الزكاة.

مثال: تملكين 200 جرام عيار 21 بسعر 280 ريال للجرام
• قيمة الذهب = 200 × 280 = 56,000 ريال
• الزكاة = 56,000 × 2.5% = 1,400 ريال`,
        },
        {
          heading: "الخلاف العلمي في زكاة حُلي المرأة",
          body: `هذه المسألة من أكثر المسائل شيوعاً في الأسئلة الزكوية، وفيها خلاف فقهي معتبر بين المذاهب الأربعة:

رأي وجوب الزكاة (الحنفية والراجح عند الحنابلة):
• حديث امرأة المقدام: "في الذهب والفضة الزكاة"
• كون الحلي مالاً قابلاً للتقييم والبيع
• فتوى مجمع الفقه الإسلامي الدولي بوجوب الزكاة في الحلي

رأي عدم الوجوب (المالكية، الشافعية، وقول عند الحنابلة):
• الحلي للزينة وليست للكنز أو الاستثمار
• لو أوجبنا الزكاة على كل حُلي النساء أثقلنا ذمتهن

الترجيح والاحتياط: مجلس هيئة كبار العلماء بالمملكة العربية السعودية يرى وجوب الزكاة في الحلي. والأحوط دينياً إخراجها، خاصةً في الكميات الكبيرة. للحلي اليسيرة التي لا تبلغ النصاب لا شيء عليها اتفاقاً.`,
        },
        {
          heading: "مصارف الزكاة — أين تُخرجها؟",
          body: `الزكاة تُصرف في ثمانية مصارف حدّدها القرآن الكريم: "إنما الصدقات للفقراء والمساكين والعاملين عليها والمؤلفة قلوبهم وفي الرقاب والغارمين وفي سبيل الله وابن السبيل".

في السياق المعاصر، أفضل مصارف الزكاة:
• الفقراء والمساكين: مباشرة أو عبر جمعيات خيرية موثوقة.
• المديونون (الغارمون): مساعدة من عجز عن سداد ديونه لضائقة.
• ابن السبيل: المسافر المنقطع عن ماله.
• في سبيل الله: دعم التعليم الإسلامي والدعوة والمشاريع الخيرية (خلاف في تفسيرها المعاصر).

تُخرج الزكاة نقداً بقيمة الذهب (وليس ذهباً فيزيائياً في الغالب) إلى أهلها في بلدك أولاً، ثم لمن تشاء من البلدان الأخرى. صندوق الزكاة في المملكة العربية السعودية وهيئات مماثلة في الإمارات والكويت تتولى توزيعها على المستحقين.`,
        },
        {
          heading: "أخطاء شائعة في حساب زكاة الذهب",
          body: `خطأ 1: احتساب الزكاة من سعر الشراء لا سعر اليوم. الصواب: دائماً من القيمة السوقية الحالية يوم الحول.

خطأ 2: إخراج الزكاة من الربح فقط. الصواب: من القيمة الكاملة للذهب، سواء ربحت أم خسرت.

خطأ 3: نسيان بعض القطع. الصواب: احصِ كل ما تملكه من ذهب (سبائك، حلي، مسكوكات، ذهب في حسابات منصات البيع).

خطأ 4: عدم احتساب الذهب الموروث. الصواب: الذهب الموروث تجب زكاته من يوم الملك (وقيل من يوم الوفاة)، والأحوط من يوم القبض.

خطأ 5: الخلط بين الذهب والمصوغات المطلية بالذهب. الصواب: القطع المطلية بطبقة رقيقة من الذهب لا زكاة عليها لأن الذهب فيها لا يبلغ النصاب أصلاً.

استخدم حاسبة الزكاة في sardhahab.com لحساب زكاة ذهبك بدقة بأسعار اليوم.`,
        },
      ]}
      sectionsEn={[
        {
          heading: "Is Zakat Due on Gold? The Islamic Ruling",
          body: `Yes, zakat on gold is obligatory by scholarly consensus when three conditions are met: reaching the nisab (minimum threshold), one full lunar year (hawl) passing, and the gold being surplus to essential needs.

Evidence: The Prophet (PBUH) said: "On gold, one-quarter of one-tenth [2.5%] is due." Types of gold and their rulings: investment/hoarded gold (bars, coins) — zakat is unambiguously obligatory. Trade gold (held for resale) — zakat is obligatory like trade goods. Women's jewelry for personal adornment — there is a well-known scholarly disagreement; the cautious view is to pay zakat on it.`,
        },
        {
          heading: "Nisab — The Minimum Threshold",
          body: `The gold nisab is 20 Islamic gold dinars, which contemporary scholars have quantified as 85 grams of pure gold (24K).

Nisab by karat:
• 24K: 85 grams
• 21K: 85 × (24÷21) = ~97 grams
• 18K: 85 × (24÷18) = ~113 grams

Practical example: if you own a 50g bracelet, 20g ring, and 35g necklace — all 21K — that's 105g total, exceeding the 97g nisab for 21K, so zakat is due.

Can you combine different karats? Yes — convert each to its value in 24K equivalent and sum them, or simply total their monetary values.`,
        },
        {
          heading: "The Hawl — The Annual Cycle Requirement",
          body: `The hawl requires owning the nisab for a complete lunar year (354 days). Most scholars recommend choosing a fixed annual date — many advise Ramadan — to assess and pay gold zakat.

Hawl rules:
✓ If you owned the nisab amount for the full year: zakat is due.
✓ If gold increased during the year: the increase follows the original hawl.
✗ If gold fell below nisab at any point: the hawl resets when it returns to nisab.
✗ If you bought gold for the first time this year: the hawl starts from the purchase date.`,
        },
        {
          heading: "Zakat Rate and Step-by-Step Calculation",
          body: `The zakat rate is fixed at 2.5% of the current market value of all gold owned — not just profit, and not based on purchase price.

Step-by-step calculation:
Step 1: Weigh each gold piece in grams.
Step 2: Note the karat of each piece (from the hallmark stamp).
Step 3: Look up today's per-gram price for each karat at sardhahab.com.
Step 4: Multiply each piece's weight by its gram price, then total all values.
Step 5: Multiply the total by 0.025 (2.5%) — this is your zakat due.

Example: 200 grams of 21K gold at 280 SAR/gram
• Gold value = 200 × 280 = 56,000 SAR
• Zakat = 56,000 × 2.5% = 1,400 SAR`,
        },
        {
          heading: "The Scholarly Disagreement on Women's Jewelry",
          body: `This is among the most frequently asked zakat questions. There is a genuine scholarly disagreement across the four major Islamic legal schools.

View favoring obligation (Hanafi and one Hanbali position):
• Hadith: "On gold and silver, zakat is due."
• Jewelry is assessable wealth that can be sold.
• The International Islamic Fiqh Academy's ruling requiring zakat on jewelry.

View against obligation (Maliki, Shafi'i, and another Hanbali position):
• Jewelry is for adornment, not hoarding or investment.

The cautious position: the Saudi Council of Senior Scholars holds that zakat is obligatory on jewelry. The pious path is to pay it, especially on large quantities. Jewelry below the nisab is universally exempt.`,
        },
        {
          heading: "Where to Pay Zakat",
          body: `The Quran specifies eight categories of zakat recipients: "Zakat is only for the poor, the needy, those employed to collect it, those whose hearts are to be reconciled, freeing captives, those in debt, in the cause of Allah, and the traveler in need."

Practical priorities: direct payment to the poor and needy; debt relief for those unable to repay; support for Islamic education and charitable projects. Pay zakat in cash equivalent to the gold's value — you don't need to give physical gold. Saudi Zakat Authority, UAE Zakat Fund, and similar institutions in Gulf countries distribute it to qualified recipients.`,
        },
        {
          heading: "Common Mistakes in Gold Zakat Calculation",
          body: `Mistake 1: calculating based on purchase price, not today's market value. Correct: always use current market value on the hawl date.

Mistake 2: paying zakat only on profit. Correct: on the full value of gold owned.

Mistake 3: forgetting some pieces. Correct: count all gold you own — bars, jewelry, coins, gold in trading accounts.

Mistake 4: ignoring inherited gold. Correct: inherited gold is subject to zakat from the date of ownership transfer.

Mistake 5: confusing gold-plated items with real gold. Correct: thin gold-plated pieces don't reach the nisab and are not subject to zakat.

Use our zakat calculator at sardhahab.com for accurate calculation at today's prices.`,
        },
      ]}
    />
  );
}
