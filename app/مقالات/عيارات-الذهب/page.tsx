import ArticlePage from "@/components/ArticlePage";
export default function Page() {
  return (
    <ArticlePage
      icon="🥇" category="تعليم" date="2026-04-06" readMins={4}
      titleAr="دليل عيارات الذهب — ما الفرق بين 24 و21 و18؟"
      titleEn="Gold Karats Guide — Difference Between 24K, 21K, 18K"
      descAr="شرح مبسط لعيارات الذهب المختلفة وكيف تؤثر على السعر والجودة والاستخدام."
      descEn="A simple explanation of gold karats and how they affect price, quality, and use."
      sectionsAr={[
        { heading: "ما هو العيار؟", body: "العيار يقيس نقاوة الذهب. العيار 24 يعني ذهباً خالصاً 100%، أما العيار 18 فيعني 75% ذهب و25% معادن أخرى كالنحاس أو الفضة." },
        { heading: "عيار 24 — الذهب الخالص", body: "أنقى أنواع الذهب (99.9%). لونه أصفر ذهبي عميق. يُستخدم في السبائك والمسكوكات الاستثمارية. يُعدّ ليّناً جداً للمجوهرات اليومية." },
        { heading: "عيار 22 — الذهب الممتاز", body: "يحتوي على 91.6% ذهب. أكثر صلابة من 24 مع الحفاظ على لون ذهبي جميل. شائع في المجوهرات الهندية والخليجية." },
        { heading: "عيار 21 — الأكثر شيوعاً خليجياً", body: "يحتوي على 87.5% ذهب. الأكثر شيوعاً في السوق السعودي والخليجي. يوازن بين النقاوة والمتانة ومناسب للمجوهرات اليومية." },
        { heading: "عيار 18 — للمجوهرات المرصعة", body: "يحتوي على 75% ذهب. أكثر صلابة ومناسب لتثبيت الأحجار الكريمة. شائع في الساعات والخواتم الفاخرة والمجوهرات الأوروبية." },
        { heading: "كيف تفرق بين العيارات؟", body: "كل قطعة ذهب أصلية يجب أن تحمل طابع العيار. في السعودية يكون الطابع '21K' أو '875' للعيار 21. تأكد دائماً من وجود الطابع قبل الشراء." },
      ]}
      sectionsEn={[
        { heading: "What is a Karat?", body: "Karat measures gold purity. 24K means 100% pure gold, while 18K means 75% gold and 25% other metals like copper or silver." },
        { heading: "24K — Pure Gold", body: "The purest form (99.9%). Deep golden color. Used in investment bars and coins. Too soft for everyday jewelry." },
        { heading: "22K — Premium Gold", body: "Contains 91.6% gold. Harder than 24K while maintaining a beautiful golden color. Common in Indian and Gulf jewelry." },
        { heading: "21K — Most Popular in Gulf", body: "Contains 87.5% gold. Most common in Saudi and Gulf markets. Balances purity, durability, and suitability for daily wear." },
        { heading: "18K — For Set Jewelry", body: "Contains 75% gold. Harder and suitable for setting gemstones. Common in watches, rings, and European fine jewelry." },
        { heading: "How to Identify Karats?", body: "Every genuine gold piece should bear a hallmark. In Saudi Arabia, the stamp reads '21K' or '875' for 21K gold. Always verify the hallmark before purchasing." },
      ]}
    />
  );
}
