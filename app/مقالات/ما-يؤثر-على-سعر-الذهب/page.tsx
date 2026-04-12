import ArticlePage from "@/components/ArticlePage";
export default function Page() {
  return (
    <ArticlePage
      icon="📊" category="تحليل" date="2026-04-10" readMins={5}
      titleAr="ما الذي يؤثر على سعر الذهب؟ — 7 عوامل رئيسية"
      titleEn="What Affects Gold Price? — 7 Key Factors"
      descAr="تعرّف على أهم العوامل التي تحرّك سعر الذهب عالمياً، من الفائدة الأمريكية إلى الأزمات الجيوسياسية."
      descEn="Discover the main factors that drive gold prices globally, from US interest rates to geopolitical crises."
      sectionsAr={[
        { heading: "1. أسعار الفائدة الأمريكية", body: "للفائدة الأمريكية تأثير عكسي على الذهب. عندما ترفع الفيدرالي الأمريكي الفائدة، تصبح السندات أكثر جاذبية من الذهب، مما يخفض سعره. والعكس صحيح عند تخفيض الفائدة." },
        { heading: "2. قيمة الدولار الأمريكي", body: "الذهب يُسعَّر بالدولار عالمياً. عندما يضعف الدولار، يصبح الذهب أرخص للمشترين الأجانب، فتزيد الطلب ويرتفع السعر. والعكس حين يقوى الدولار." },
        { heading: "3. التضخم والقوة الشرائية", body: "يُعدّ الذهب أهم تحوّط ضد التضخم تاريخياً. عندما ترتفع الأسعار وتتآكل القوة الشرائية للعملات، يلجأ المستثمرون للذهب كملاذ آمن." },
        { heading: "4. الأزمات الجيوسياسية", body: "الحروب والتوترات السياسية والأزمات الاقتصادية تدفع المستثمرين للذهب بحثاً عن الأمان. لذلك يُلقَّب بـ'ملاذ الأزمات'." },
        { heading: "5. الطلب الصناعي والمجوهرات", body: "الهند والصين من أكبر المستهلكين للذهب في المجوهرات. مواسم الأعراس والأعياد تزيد الطلب وتدفع الأسعار للأعلى." },
        { heading: "6. احتياطيات البنوك المركزية", body: "البنوك المركزية حول العالم تشتري الذهب لتنويع احتياطياتها. شراء كميات كبيرة يرفع السعر، وبيعها يخفضه." },
        { heading: "7. العرض من المناجم", body: "إنتاج مناجم الذهب يؤثر على العرض. انخفاض الإنتاج أو إغلاق مناجم كبيرة يقلل العرض ويرفع السعر على المدى البعيد." },
      ]}
      sectionsEn={[
        { heading: "1. US Interest Rates", body: "Interest rates have an inverse effect on gold. When the Fed raises rates, bonds become more attractive than gold, pushing its price down. The reverse happens when rates are cut." },
        { heading: "2. US Dollar Strength", body: "Gold is priced in USD globally. When the dollar weakens, gold becomes cheaper for foreign buyers, increasing demand and pushing prices up. The opposite occurs when the dollar strengthens." },
        { heading: "3. Inflation & Purchasing Power", body: "Gold is historically the best hedge against inflation. When prices rise and currency purchasing power erodes, investors turn to gold as a safe store of value." },
        { heading: "4. Geopolitical Crises", body: "Wars, political tensions, and economic crises push investors toward gold as a safe haven. This is why gold is called the 'crisis asset'." },
        { heading: "5. Industrial & Jewelry Demand", body: "India and China are the world's largest gold jewelry consumers. Wedding seasons and holidays increase demand and push prices higher." },
        { heading: "6. Central Bank Reserves", body: "Central banks worldwide buy gold to diversify reserves. Large purchases raise prices, while large sales lower them." },
        { heading: "7. Mining Supply", body: "Gold mine production affects supply. Reduced production or closure of major mines restricts supply and raises prices over the long term." },
      ]}
    />
  );
}
