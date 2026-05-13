"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageContext";

const txt = {
  ar: {
    title: "سعر الفضة اليوم — دليلك الشامل",
    subtitle: "عيار 999 و925 بالجرام والأونصة — مقارنة بالذهب ونصائح الاستثمار",
    backToArticles: "← العودة إلى المقالات",
    readTime: "7 دقائق للقراءة",
    category: "استثمار",
    sections: {
      intro: {
        heading: "الفضة: المعدن الثمين المُهمَل",
        body: `تحتل الفضة مكانةً استثنائيةً في تاريخ البشرية؛ فهي لم تكن فقط عملةً ومعدناً ثميناً لآلاف السنين، بل هي اليوم أحد أهم المواد الصناعية في العصر الحديث. ومع ذلك تبقى الفضة في ظل الذهب حين يتحدث الناس عن الاستثمار في المعادن، رغم أن أداءها الاستثماري قد يفاجئ كثيرين.

سعر الفضة يتغير لحظياً مثل الذهب والأسهم، ويتأثر بعوامل متعددة تجمع بين الطلب الصناعي والطلب الاستثماري والمضاربة. فهم هذه العوامل هو مفتاح اتخاذ قرارات استثمارية صحيحة.`,
      },
      karats: {
        heading: "عيارات الفضة: ما الفرق؟",
        body: `على عكس الذهب الذي يُقاس بالقيراط (Karat)، تُقاس نقاوة الفضة بالأجزاء من الألف (Millesimal Fineness):`,
        table: [
          { karat: "فضة 999 (Fine Silver)", purity: "99.9٪", use: "السبائك الاستثمارية، العملات المعدنية" },
          { karat: "فضة 925 (Sterling Silver)", purity: "92.5٪", use: "المجوهرات، أدوات الفضة" },
          { karat: "فضة 900", purity: "90٪", use: "العملات الفضية القديمة (قبل 1965)" },
          { karat: "فضة 800", purity: "80٪", use: "بعض المجوهرات الأوروبية" },
          { karat: "فضة 835", purity: "83.5٪", use: "شائعة في أوروبا القارية" },
        ],
        note: "في المجوهرات العربية، عيار 925 هو الأكثر انتشاراً لأنه يجمع بين البريق الجميل والصلابة المطلوبة. يمكن التعرف عليه بختم \"925\" المنقوش على القطعة.",
      },
      silverVsGold: {
        heading: "الفضة مقابل الذهب: أيهما أفضل للاستثمار؟",
        body: `سؤال يطرحه كثير من المستثمرين المبتدئين. الإجابة الصادقة: لكل منهما مزاياه وعيوبه.`,
        comparison: [
          { aspect: "السعر الابتدائي", gold: "مرتفع (صعب الوصول للمبتدئين)", silver: "منخفض (يمكن الاستثمار بمبالغ صغيرة)" },
          { aspect: "التذبذب", gold: "أقل تذبذباً — أكثر أماناً", silver: "أكثر تذبذباً — ربح أو خسارة أكبر" },
          { aspect: "الطلب الصناعي", gold: "محدود (مجوهرات + إلكترونيات)", silver: "ضخم (طاقة شمسية + إلكترونيات + طب)" },
          { aspect: "السيولة", gold: "سيولة عالية جداً عالمياً", silver: "سيولة جيدة لكن أقل من الذهب" },
          { aspect: "التخزين", gold: "سهل (حجم صغير لقيمة كبيرة)", silver: "صعب (حجم كبير لقيمة أقل)" },
          { aspect: "نسبة الذهب/الفضة (GSR)", gold: "مرجع السعر", silver: "تتراوح بين 60-90 أونصة فضة للأونصة الواحدة من الذهب" },
        ],
      },
      industrial: {
        heading: "الطلب الصناعي: ما يجعل الفضة فريدةً",
        body: `الفضة ليست مجرد معدن ثمين — إنها مادة صناعية لا غنى عنها في القرن الحادي والعشرين:

**الألواح الشمسية**: كل لوح شمسي يحتوي على 20 غراماً تقريباً من الفضة. مع التوسع العالمي في الطاقة الشمسية، يُستهلك ما يزيد على 100 مليون أونصة سنوياً لهذا الغرض وحده — ما يعادل حوالي 10٪ من الإنتاج العالمي للفضة.

**الإلكترونيات**: الهواتف الذكية واللابتوبات والسيارات الكهربائية — جميعها تحتوي على الفضة في لوحاتها الإلكترونية. تُستهلك نحو 50 مليون أونصة سنوياً في هذا القطاع.

**الطب والصحة**: خصائص الفضة المضادة للبكتيريا تجعلها مكوناً أساسياً في الجروح الطبية، المستشفيات، وأنظمة تنقية المياه.

**صناعة الصور**: رغم تراجعها، لا تزال الصناعة التقليدية تستهلك كميات من الفضة في الأفلام الفوتوغرافية والأشعة السينية.

هذا الطلب الصناعي المتنامي مقابل محدودية الإنتاج قد يدعم أسعار الفضة على المدى الطويل.`,
      },
      gsr: {
        heading: "نسبة الذهب للفضة (Gold-Silver Ratio) — أداة المستثمر الذكي",
        body: `نسبة الذهب للفضة (GSR) هي عدد أونصات الفضة اللازمة لشراء أونصة واحدة من الذهب. إنها أداة يستخدمها المستثمرون المحترفون لتحديد أيهما أرخص نسبياً في وقت معين.

**القراءة التاريخية:**
- الأساس التاريخي: 15-16 أونصة فضة لكل أونصة ذهب (قبل القرن العشرين)
- الأربعينيات–السبعينيات: ارتفعت إلى 40-50
- 2020 (كوفيد): بلغت 120 — أعلى مستوى في التاريخ الحديث
- 2024–2026: تتراوح بين 75 و95

**كيفية الاستخدام:**
- NSR مرتفعة (أكثر من 80): الفضة رخيصة نسبياً → قد تكون فرصة شراء فضة
- NSR منخفضة (أقل من 50): الذهب رخيص نسبياً → قد تكون فرصة تحويل الفضة إلى ذهب

تذكّر: هذه ليست قاعدة مطلقة، بل أداة مساعدة في التحليل.`,
      },
      howToBuy: {
        heading: "كيف تشتري الفضة وأين؟",
        body: `للمستثمر العربي، هناك عدة طرق للاستثمار في الفضة:

**1. السبائك والعملات الفضية**
الأنقى والأكثر سيولةً. يمكن شراؤها من المصارف أو تجار السبائك المعتمدين. عيارها 999. احرص على الشراء من مصادر موثوقة للتحقق من النقاوة.

**2. المجوهرات الفضية**
الأقل ربحاً استثمارياً لأن هامش الصنعة يقلل من العائد. لكنها تجمع بين الجمالية والقيمة الجوهرية.

**3. ETFs الفضة**
صناديق الاستثمار المتداولة مثل iShares Silver Trust (SLV) تتيح الاستثمار في الفضة دون الحاجة للتخزين المادي. متاحة عبر منصات التداول الإلكترونية.

**4. العقود الآجلة (Futures)**
للمستثمرين ذوي الخبرة فقط. توفر رافعة مالية لكنها تحمل مخاطر عالية.

**نصائح مهمة:**
- تحقق دائماً من ختم النقاوة (925 أو 999)
- احتفظ بالفواتير والشهادات
- لا تخزّن كميات كبيرة في المنزل — استخدم خدمات التخزين الآمن
- تجنب شراء الفضة من مصادر غير معتمدة`,
      },
      outlook: {
        heading: "توقعات سعر الفضة",
        body: `يُجمع كثير من المحللين على أن الفضة لديها قضية استثمارية قوية في العقد القادم:

**عوامل دعم الارتفاع:**
- التوسع الهائل في الطاقة الشمسية عالمياً (الصين، الهند، أوروبا، أمريكا)
- الطلب المتزايد على السيارات الكهربائية وبطارياتها
- التأخر في مشاريع مناجم الفضة الجديدة (5-10 سنوات لتطوير منجم جديد)
- خفض الفائدة الأمريكية يضعف الدولار ويدعم المعادن الثمينة

**عوامل خطر:**
- الاستبدال التكنولوجي في بعض الصناعات
- ركود اقتصادي يقلل الطلب الصناعي
- قوة الدولار غير المتوقعة

**الرأي العلمي:** الفضة في عالم الطاقة الشمسية والسيارات الكهربائية لها مستقبل واعد. لكن التذبذب العالي يعني أنها تصلح أكثر للمستثمر الذي يستطيع الانتظار 3-5 سنوات على الأقل.`,
      },
      zakat: {
        heading: "زكاة الفضة: الأحكام الأساسية",
        body: `تجب الزكاة على الفضة إذا توفر شرطان:

**1. النصاب:** أن يبلغ ما تملكه نصاب الفضة، وهو **595 غراماً** من الفضة الخالصة (معادل 200 درهم شرعي). يُحسب بسعر الفضة الحالي.

**2. الحول:** أن يمر عام قمري كامل على امتلاكك لهذه الكمية.

**نسبة الزكاة:** 2.5٪ من إجمالي ما تملكه إذا بلغ النصاب.

**مثال تطبيقي:** إذا كنت تملك 1000 غرام فضة، وسعر الغرام 0.9 دولار:
- إجمالي القيمة: 900 دولار
- النصاب: 595 × 0.9 = 535.5 دولار → النصاب محقق
- الزكاة: 900 × 2.5٪ = 22.5 دولار

يُنصح باستشارة عالم دين لتطبيق الحكم الصحيح في حالتك.`,
      },
    },
    relatedArticles: "مقالات ذات صلة",
  },
  en: {
    title: "Silver Price Today — Complete Guide",
    subtitle: "999 & 925 Grade per Gram & Ounce — vs Gold & Investment Tips",
    backToArticles: "← Back to Articles",
    readTime: "7 min read",
    category: "Investment",
    relatedArticles: "Related Articles",
  },
};

export default function SilverPricePage() {
  const { lang } = useLang();
  const t = txt[lang] ?? txt.ar;
  const s = txt.ar.sections;

  return (
    <article className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
      <div className="mb-6">
        <Link href="/مقالات" className="text-gold hover:text-gold-light text-sm">
          {t.backToArticles}
        </Link>
      </div>

      <header className="mb-8">
        <span className="text-xs bg-gold/10 text-gold px-3 py-1 rounded-full">{t.category}</span>
        <h1 className="text-3xl font-bold text-text-primary mt-3 mb-2">{t.title}</h1>
        <p className="text-text-secondary text-lg">{t.subtitle}</p>
        <p className="text-text-secondary text-sm mt-2">{t.readTime}</p>
      </header>

      {/* مقدمة */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-3">{s.intro.heading}</h2>
        <div className="text-text-secondary leading-relaxed space-y-3">
          {s.intro.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      {/* عيارات الفضة */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-3">{s.karats.heading}</h2>
        <p className="text-text-secondary mb-4">{s.karats.body}</p>
        <div className="overflow-x-auto">
          <table className="min-w-[360px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface-2 text-text-secondary">
                <th className="p-3 text-right border border-border">العيار</th>
                <th className="p-3 text-right border border-border">النقاوة</th>
                <th className="p-3 text-right border border-border">الاستخدام</th>
              </tr>
            </thead>
            <tbody>
              {s.karats.table.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-surface" : "bg-surface-2"}>
                  <td className="p-3 border border-border font-medium text-text-primary">{row.karat}</td>
                  <td className="p-3 border border-border text-gold font-bold">{row.purity}</td>
                  <td className="p-3 border border-border text-text-secondary">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-sm mt-3 bg-gold/5 border border-gold/20 rounded-lg p-3">{s.karats.note}</p>
      </section>

      {/* الفضة مقابل الذهب */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-3">{s.silverVsGold.heading}</h2>
        <p className="text-text-secondary mb-4">{s.silverVsGold.body}</p>
        <div className="overflow-x-auto">
          <table className="min-w-[360px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface-2 text-text-secondary">
                <th className="p-3 text-right border border-border">الجانب</th>
                <th className="p-3 text-right border border-border">الذهب</th>
                <th className="p-3 text-right border border-border">الفضة</th>
              </tr>
            </thead>
            <tbody>
              {s.silverVsGold.comparison.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-surface" : "bg-surface-2"}>
                  <td className="p-3 border border-border font-medium text-text-primary">{row.aspect}</td>
                  <td className="p-3 border border-border text-text-secondary">{row.gold}</td>
                  <td className="p-3 border border-border text-text-secondary">{row.silver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* الطلب الصناعي */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-3">{s.industrial.heading}</h2>
        <div className="text-text-secondary leading-relaxed space-y-3">
          {s.industrial.body.split("\n\n").map((p, i) => (
            <p key={i} className={p.startsWith("**") ? "font-semibold text-text-primary" : ""}>
              {p.replace(/\*\*/g, "")}
            </p>
          ))}
        </div>
      </section>

      {/* نسبة الذهب للفضة */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-3">{s.gsr.heading}</h2>
        <div className="text-text-secondary leading-relaxed space-y-3">
          {s.gsr.body.split("\n\n").map((p, i) => (
            <p key={i}>{p.replace(/\*\*/g, "")}</p>
          ))}
        </div>
      </section>

      {/* كيف تشتري */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-3">{s.howToBuy.heading}</h2>
        <div className="text-text-secondary leading-relaxed space-y-3">
          {s.howToBuy.body.split("\n\n").map((p, i) => (
            <p key={i}>{p.replace(/\*\*/g, "")}</p>
          ))}
        </div>
      </section>

      {/* توقعات */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-3">{s.outlook.heading}</h2>
        <div className="text-text-secondary leading-relaxed space-y-3">
          {s.outlook.body.split("\n\n").map((p, i) => (
            <p key={i}>{p.replace(/\*\*/g, "")}</p>
          ))}
        </div>
      </section>

      {/* زكاة الفضة */}
      <section className="mb-8 bg-surface-2 rounded-xl p-6">
        <h2 className="text-xl font-bold text-text-primary mb-3">{s.zakat.heading}</h2>
        <div className="text-text-secondary leading-relaxed space-y-3">
          {s.zakat.body.split("\n\n").map((p, i) => (
            <p key={i}>{p.replace(/\*\*/g, "")}</p>
          ))}
        </div>
      </section>

      {/* مقالات ذات صلة */}
      <section className="border-t border-border pt-8">
        <h2 className="text-lg font-bold text-text-primary mb-4">{t.relatedArticles}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/مقالات/زكاة-الذهب" className="bg-surface rounded-xl p-4 hover:border-gold border border-border transition-colors">
            <p className="text-text-primary font-semibold text-sm">زكاة الذهب — كيف تحسبها؟</p>
            <p className="text-text-secondary text-xs mt-1">أحكام الزكاة والنصاب والحساب</p>
          </Link>
          <Link href="/مقالات/عيارات-الذهب" className="bg-surface rounded-xl p-4 hover:border-gold border border-border transition-colors">
            <p className="text-text-primary font-semibold text-sm">دليل عيارات الذهب</p>
            <p className="text-text-secondary text-xs mt-1">الفرق بين عيار 24 و21 و18</p>
          </Link>
          <Link href="/مقالات/الاستثمار-في-الذهب" className="bg-surface rounded-xl p-4 hover:border-gold border border-border transition-colors">
            <p className="text-text-primary font-semibold text-sm">الاستثمار في الذهب</p>
            <p className="text-text-secondary text-xs mt-1">دليل المبتدئين الشامل</p>
          </Link>
          <Link href="/مقالات/تاريخ-سعر-الذهب" className="bg-surface rounded-xl p-4 hover:border-gold border border-border transition-colors">
            <p className="text-text-primary font-semibold text-sm">تاريخ سعر الذهب</p>
            <p className="text-text-secondary text-xs mt-1">من 35 دولاراً إلى 3000+</p>
          </Link>
        </div>
      </section>
    </article>
  );
}
