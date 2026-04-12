import ArticlePage from "@/components/ArticlePage";
export default function Page() {
  return (
    <ArticlePage
      icon="☪️" category="إسلامي" date="2026-04-04" readMins={6}
      titleAr="زكاة الذهب — كيف تحسبها بالطريقة الصحيحة؟"
      titleEn="Gold Zakat — How to Calculate It Correctly"
      descAr="شرح تفصيلي لأحكام زكاة الذهب: النصاب، الحول، النسبة، وكيفية الحساب بالأسعار الحالية."
      descEn="Detailed explanation of gold zakat rules: nisab, hawl, rate, and how to calculate with current prices."
      sectionsAr={[
        { heading: "هل تجب الزكاة على الذهب؟", body: "نعم، تجب الزكاة على الذهب المُعدّ للاكتناز أو الاستثمار إذا بلغ النصاب وحال عليه الحول. أما الذهب المُعدّ للاستخدام اليومي كالحلي فاختلف العلماء فيه، والأحوط إخراج زكاته." },
        { heading: "ما هو النصاب؟", body: "نصاب الذهب هو 85 جراماً من الذهب الخالص (عيار 24). إذا كنت تملك هذا المقدار أو أكثر، وجبت عليك الزكاة. للحساب بالعيار 21: النصاب = 85 × (24/21) = حوالي 97 جراماً." },
        { heading: "ما هو الحول؟", body: "الحول هو مرور سنة هجرية كاملة على امتلاك النصاب. إذا نقص الذهب عن النصاب في أي وقت خلال السنة، ينقطع الحول ويبدأ من جديد." },
        { heading: "ما هي نسبة الزكاة؟", body: "نسبة زكاة الذهب هي 2.5% من القيمة السوقية الكاملة للذهب — لا من الربح فقط. مثال: إذا كانت قيمة ذهبك 100,000 ريال، تُخرج 2,500 ريال زكاة." },
        { heading: "طريقة الحساب خطوة بخطوة", body: "1. احسب وزن ذهبك الكلي بالجرام\n2. قيّمه بالسعر الحالي للعيار المناسب\n3. احضر نسبة 2.5% من هذه القيمة\n4. أخرجها نقداً أو ما يعادلها\n\nاستخدم حاسبة الزكاة في موقعنا للحساب التلقائي." },
        { heading: "متى تُخرج الزكاة؟", body: "حدد يوماً ثابتاً في السنة الهجرية لإخراج زكاتك. كثير من العلماء يوصون بإخراجها في رمضان. يمكن تقديمها أو تأخيرها بضعة أيام دون إشكال." },
      ]}
      sectionsEn={[
        { heading: "Is Zakat Due on Gold?", body: "Yes, zakat is due on gold held for saving or investment if it reaches the nisab and a full lunar year passes. Scholars differ on daily-use jewelry — the cautious view is to pay zakat on it too." },
        { heading: "What is the Nisab?", body: "The gold nisab is 85 grams of pure gold (24K). If you own this amount or more, zakat is obligatory. For 21K gold: nisab ≈ 97 grams." },
        { heading: "What is the Hawl?", body: "The hawl is a full lunar year passing while you own the nisab amount. If gold drops below nisab at any point during the year, the hawl resets." },
        { heading: "What is the Zakat Rate?", body: "Gold zakat is 2.5% of the full market value — not just profit. Example: if your gold is worth 100,000 SAR, you pay 2,500 SAR zakat." },
        { heading: "Step-by-Step Calculation", body: "1. Calculate your total gold weight in grams\n2. Value it at the current price for its karat\n3. Calculate 2.5% of that value\n4. Pay it in cash or equivalent\n\nUse our zakat calculator for automatic calculation." },
        { heading: "When to Pay?", body: "Choose a fixed date in the Islamic calendar to pay your annual zakat. Many scholars recommend paying in Ramadan. It can be paid a few days early or late without issue." },
      ]}
    />
  );
}
