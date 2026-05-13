"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageContext";

const txt = {
  ar: {
    title: "تاريخ سعر الذهب",
    subtitle: "من 35 دولاراً إلى 3000+ دولار — رحلة عبر أهم الأحداث الاقتصادية",
    backToArticles: "← العودة إلى المقالات",
    readTime: "8 دقائق للقراءة",
    category: "تحليل",
    relatedArticles: "مقالات ذات صلة",
  },
  en: {
    title: "Gold Price History",
    subtitle: "From $35 to $3,000+ — A journey through major economic events",
    backToArticles: "← Back to Articles",
    readTime: "8 min read",
    category: "Analysis",
    relatedArticles: "Related Articles",
  },
};

const milestones = [
  {
    year: "1944",
    price: "$35",
    event: "نظام بريتون وودز",
    detail: "اتفاقية بريتون وودز ربطت الدولار الأمريكي بالذهب بسعر ثابت 35 دولاراً للأونصة. هذا النظام جعل الذهب أساس النظام المالي العالمي بعد الحرب العالمية الثانية.",
  },
  {
    year: "1971",
    price: "$35 → $44",
    event: "صدمة نيكسون",
    detail: "في أغسطس 1971، أعلن الرئيس نيكسون إنهاء قابلية تحويل الدولار إلى ذهب — فيما عُرف بـ'Nixon Shock'. انتهى نظام بريتون وودز وبدأ الذهب يتحرك بحرية في السوق.",
  },
  {
    year: "1980",
    price: "$850",
    event: "أعلى مستوى في القرن العشرين",
    detail: "وصل الذهب في يناير 1980 إلى 850 دولاراً — أعلى مستوياته في القرن العشرين. كان ذلك مدفوعاً بالتضخم الهائل في أمريكا، الثورة الإيرانية، والغزو السوفيتي لأفغانستان. بالأسعار الحقيقية المعدلة بالتضخم، هذا يعادل أكثر من 3500 دولار اليوم.",
  },
  {
    year: "1980–2000",
    price: "$300–$400",
    event: "عقران ضائعان للذهب",
    detail: "مع انتهاء التضخم وارتفاع أسعار الفائدة الأمريكية تحت فولكر، تراجع الذهب بشكل حاد. ظل يتذبذب بين 300 و400 دولار طوال ثمانينيات وتسعينيات القرن الماضي. بيعت بعض البنوك المركزية احتياطياتها من الذهب في هذه الفترة.",
  },
  {
    year: "2001–2008",
    price: "$250 → $1,000",
    event: "بداية الثور الذهبي الكبير",
    detail: "بدأ الذهب رحلة صعوده الكبرى مع ضعف الدولار، أزمة الدوت كوم، وأحداث 11 سبتمبر. في 2008، مع بداية الأزمة المالية العالمية، تجاوز الذهب 1000 دولار لأول مرة في تاريخه.",
  },
  {
    year: "2011",
    price: "$1,900",
    event: "ذروة ما بعد الأزمة المالية",
    detail: "وصل الذهب في سبتمبر 2011 إلى 1900 دولار تقريباً. كانت الأسباب: استمرار عدم اليقين الاقتصادي، أزمة الديون الأوروبية، وبرامج التيسير الكمي الأمريكية. بعدها تراجع تدريجياً مع تحسن الاقتصاد.",
  },
  {
    year: "2013",
    price: "$1,200",
    event: "انهيار حاد في يومين",
    detail: "في أبريل 2013 تراجع الذهب بنسبة 15٪ في يومين فقط — أحد أكبر تراجعاته التاريخية. جاء ذلك بعد تصريحات الفيدرالي الأمريكي عن تخفيض التيسير الكمي وتحسن بيانات التوظيف.",
  },
  {
    year: "2018–2019",
    price: "$1,180 → $1,500",
    event: "حرب التجارة والتوترات الجيوسياسية",
    detail: "الحرب التجارية الأمريكية الصينية، التوترات في الخليج، وترقب خفض الفائدة الأمريكية دفعت الذهب للصعود مجدداً من أدنى مستوياته نحو 1500 دولار.",
  },
  {
    year: "2020",
    price: "$2,075",
    event: "رقم قياسي كوفيد-19",
    detail: "في أغسطس 2020 سجّل الذهب رقماً قياسياً جديداً عند 2075 دولاراً. كانت الأسباب: الوباء العالمي، برامج التحفيز الضخمة، أسعار الفائدة الصفرية، وحالة الغموض الاقتصادي العالمي.",
  },
  {
    year: "2022",
    price: "$2,050 → $1,620",
    event: "رفع الفائدة الحاد",
    detail: "مع قيام الفيدرالي الأمريكي برفع الفائدة بوتيرة غير مسبوقة لمحاربة التضخم (من 0.25٪ إلى 4.5٪ في عام واحد)، تراجع الذهب من 2050 إلى 1620 دولاراً. هذا يُوضح العلاقة العكسية بين الفائدة والذهب.",
  },
  {
    year: "2023–2024",
    price: "$1,800 → $2,800",
    event: "صعود قوي مدفوع بشراء البنوك المركزية",
    detail: "مع توقف رفع الفائدة وبدء خفضها، تجاوز الذهب مستوياته القياسية. ما يميز هذه الدورة: شراء ضخم من البنوك المركزية (خاصة الصين والهند وتركيا) لتقليل الاعتماد على الدولار.",
  },
  {
    year: "2025",
    price: "$3,000+",
    event: "عصر جديد للذهب",
    detail: "تجاوز الذهب 3000 دولار للأونصة في عام 2025 — رقم كان يُعدّ بعيد المنال قبل سنوات. الأسباب: استمرار شراء البنوك المركزية، التوترات الجيوسياسية، وتراجع الثقة في النظام المالي التقليدي.",
  },
];

const lessons = [
  {
    title: "الذهب يحمي من التضخم على المدى البعيد",
    detail: "ما كان يُشترى بأونصة ذهب في 1970 يمكن شراء نفسه تقريباً اليوم. القوة الشرائية محفوظة.",
  },
  {
    title: "الفائدة الأمريكية عدو الذهب الأول",
    detail: "كل مرة يرفع فيها الفيدرالي الفائدة، يتراجع الذهب لأن السندات تصبح أكثر جاذبية. والعكس صحيح.",
  },
  {
    title: "الأزمات تدفع الذهب للأعلى",
    detail: "الحروب، الأوبئة، الأزمات المالية — كلها أحداث تزيد الطلب على الذهب كملاذ آمن.",
  },
  {
    title: "البنوك المركزية تحدد الاتجاه الكبير",
    detail: "حين تشتري البنوك المركزية الذهب بكميات ضخمة، فهذا مؤشر قوي على ارتفاع مستدام.",
  },
  {
    title: "الصبر هو المفتاح",
    detail: "من اشترى الذهب عند 1900 دولار في 2011 احتاج إلى 9 سنوات ليحقق ربحاً. لكن من صبر ربح.",
  },
];

export default function GoldPriceHistoryPage() {
  const { lang } = useLang();
  const t = txt[lang] ?? txt.ar;

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
        <h2 className="text-xl font-bold text-text-primary mb-3">لماذا ندرس تاريخ سعر الذهب؟</h2>
        <p className="text-text-secondary leading-relaxed">
          يقول المستثمر الأسطوري وارن بافيت: &quot;إذا أردت أن تعرف المستقبل، ادرس التاريخ.&quot; تاريخ الذهب ليس مجرد أرقام — إنه سجل لكيفية استجابة البشر للأزمات، التضخم، والتغيرات في الثقة بالأنظمة المالية. كل ذروة وكل قاع له قصة تعلّمنا شيئاً عن طبيعة هذا المعدن الثمين وعلاقته بالاقتصاد العالمي.
        </p>
      </section>

      {/* الجدول الزمني */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-6">الجدول الزمني لأسعار الذهب</h2>
        <div className="relative">
          <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gold/20" />
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={i} className="relative pr-10">
                <div className="absolute right-0 top-2 w-8 h-8 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center text-xs font-bold text-gold">
                  {i + 1}
                </div>
                <div className="bg-surface rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-gold font-bold text-sm">{m.year}</span>
                    <span className="bg-gold/10 text-gold text-xs px-2 py-0.5 rounded-full">{m.price}</span>
                    <span className="text-text-primary font-semibold text-sm">{m.event}</span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* دروس التاريخ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">5 دروس من تاريخ الذهب</h2>
        <div className="space-y-4">
          {lessons.map((lesson, i) => (
            <div key={i} className="flex gap-4 bg-surface-2 rounded-xl p-4">
              <span className="text-gold font-bold text-lg flex-shrink-0">{i + 1}.</span>
              <div>
                <p className="text-text-primary font-semibold text-sm">{lesson.title}</p>
                <p className="text-text-secondary text-sm mt-1">{lesson.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* مقارنة تاريخية */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-3">الذهب على المدى الطويل: أرقام تُثير الدهشة</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[360px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface-2 text-text-secondary">
                <th className="p-3 text-right border border-border">السنة</th>
                <th className="p-3 text-right border border-border">سعر الأونصة</th>
                <th className="p-3 text-right border border-border">العائد حتى 2025</th>
              </tr>
            </thead>
            <tbody>
              {[
                { year: "1971", price: "$44", ret: "+6,700٪" },
                { year: "1980", price: "$850", ret: "+250٪" },
                { year: "2000", price: "$280", ret: "+970٪" },
                { year: "2008", price: "$870", ret: "+245٪" },
                { year: "2015", price: "$1,060", ret: "+183٪" },
                { year: "2020", price: "$1,700", ret: "+76٪" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-surface" : "bg-surface-2"}>
                  <td className="p-3 border border-border text-text-primary">{row.year}</td>
                  <td className="p-3 border border-border text-gold font-bold">{row.price}</td>
                  <td className="p-3 border border-border text-rise font-semibold">{row.ret}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-xs mt-2">* الأسعار تقريبية. العائد محسوب على أساس سعر ~3,000 دولار في 2025.</p>
      </section>

      {/* خلاصة */}
      <section className="mb-8 bg-gold/5 border border-gold/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-text-primary mb-3">الخلاصة: ماذا يخبرنا التاريخ؟</h2>
        <p className="text-text-secondary leading-relaxed">
          على مدى أكثر من 50 عاماً من التداول الحر، أثبت الذهب أنه مخزن قيمة موثوق على المدى الطويل، وإن كانت رحلته ليست مستقيمة. من يمتلك الصبر ويفهم العوامل المؤثرة — خاصةً الفائدة الأمريكية وتصرفات البنوك المركزية — يمكنه الاستفادة من هذا المعدن الفريد. أما التوقيت المثالي للشراء والبيع فلا يعرفه أحد، ولهذا يُنصح دائماً بالتدريج والتنويع.
        </p>
      </section>

      {/* مقالات ذات صلة */}
      <section className="border-t border-border pt-8">
        <h2 className="text-lg font-bold text-text-primary mb-4">{t.relatedArticles}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/مقالات/توقعات-سعر-الذهب-2026" className="bg-surface rounded-xl p-4 hover:border-gold border border-border transition-colors">
            <p className="text-text-primary font-semibold text-sm">توقعات سعر الذهب 2026</p>
            <p className="text-text-secondary text-xs mt-1">هل يصل إلى 4000 دولار؟</p>
          </Link>
          <Link href="/مقالات/ما-يؤثر-على-سعر-الذهب" className="bg-surface rounded-xl p-4 hover:border-gold border border-border transition-colors">
            <p className="text-text-primary font-semibold text-sm">ما الذي يؤثر على سعر الذهب؟</p>
            <p className="text-text-secondary text-xs mt-1">العوامل الرئيسية المحركة للسعر</p>
          </Link>
          <Link href="/مقالات/الاستثمار-في-الذهب" className="bg-surface rounded-xl p-4 hover:border-gold border border-border transition-colors">
            <p className="text-text-primary font-semibold text-sm">كيف تستثمر في الذهب؟</p>
            <p className="text-text-secondary text-xs mt-1">دليل المبتدئين الشامل</p>
          </Link>
          <Link href="/مقالات/سعر-الفضة-اليوم" className="bg-surface rounded-xl p-4 hover:border-gold border border-border transition-colors">
            <p className="text-text-primary font-semibold text-sm">سعر الفضة اليوم</p>
            <p className="text-text-secondary text-xs mt-1">مقارنة بالذهب ونصائح الاستثمار</p>
          </Link>
        </div>
      </section>
    </article>
  );
}
