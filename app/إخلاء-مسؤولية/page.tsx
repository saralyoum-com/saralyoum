import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إخلاء المسؤولية — سعر الذهب",
};

export default function DisclaimerPage() {
  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-text-primary mb-2">إخلاء المسؤولية</h1>
      <p className="text-text-secondary text-sm mb-8">آخر تحديث: أبريل 2026</p>

      <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6 mb-8">
        <p className="text-gold font-bold text-lg leading-relaxed">
          المحتوى المعروض على هذا الموقع لأغراض تعليمية وإعلامية فقط.
          لا يمثل نصيحة استثمارية أو مالية.
          الاستثمار ينطوي على مخاطر.
          استشر مستشاراً مالياً مرخصاً قبل أي قرار.
        </p>
      </div>

      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">1. طبيعة المعلومات</h2>
          <p>
            تُقدّم المعلومات والبيانات والأسعار الواردة في موقع &quot;سعر الذهب&quot; لأغراض إعلامية وتعليمية
            عامة فحسب. لا تُشكّل هذه المعلومات بأي شكل من الأشكال نصيحةً استثمارية أو مالية أو
            قانونية أو توصيةً بشراء أو بيع أي أصل مالي أو عملة رقمية أو سلعة.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">2. دقة البيانات</h2>
          <p>
            رغم حرصنا على تقديم بيانات دقيقة ومحدّثة، لا يضمن الموقع دقة أو اكتمال أو حداثة
            أي معلومة. الأسعار المعروضة مؤشرية وقد تختلف عن أسعار التداول الفعلية في الأسواق.
            لا يتحمل الموقع أي مسؤولية عن أخطاء أو تأخيرات في البيانات.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">3. مخاطر الاستثمار</h2>
          <p>
            الاستثمار في الأصول المالية بما فيها الذهب والفضة والعملات الرقمية ينطوي على مخاطر
            عالية بما فيها خسارة رأس المال كلياً أو جزئياً. الأداء السابق لا يضمن نتائج مستقبلية.
            أسعار العملات الرقمية شديدة التقلب وقد تتغير بشكل حاد وسريع.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">4. الإشارات التقنية</h2>
          <p>
            الإشارات التقنية المعروضة (RSI، المتوسطات المتحركة) هي أدوات تحليلية إحصائية
            ولا تُعدّ ضماناً لأداء مستقبلي. تُقدَّم هذه الإشارات بصفتها معلومات فقط وليست
            نصائح استثمارية بأي حال من الأحوال.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">5. المصادر الخارجية</h2>
          <p>
            يعتمد الموقع على مصادر بيانات خارجية (GoldAPI، CoinGecko، ExchangeRate-API) ولا
            يتحكم في صحة أو استمرارية هذه الخدمات. الأخبار الواردة مصدرها وكالات خارجية
            والموقع غير مسؤول عن محتواها.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">6. التنبيهات</h2>
          <p>
            خدمة التنبيهات الإلكترونية تُقدَّم لأغراض إعلامية فقط. لا تُعدّ التنبيهات توصيات
            للشراء أو البيع. قد تتأخر التنبيهات أو لا تصل لأسباب تقنية خارجة عن إرادتنا.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">7. حدود المسؤولية</h2>
          <p>
            لا يتحمل موقع &quot;سعر الذهب&quot; وإدارته وكل من يعمل به أي مسؤولية عن أي خسائر أو أضرار
            مباشرة أو غير مباشرة ناجمة عن الاعتماد على المعلومات الواردة في الموقع.
            يتحمل المستخدم وحده مسؤولية قراراته الاستثمارية.
          </p>
        </section>

        <div className="bg-surface border border-border rounded-xl p-5 text-sm">
          <p className="font-bold text-text-primary mb-2">تنبيه مهم</p>
          <p>
            قبل اتخاذ أي قرار استثماري، يُنصح بشدة باستشارة مستشار مالي مرخص ومؤهل يأخذ
            في الاعتبار وضعك المالي الشخصي وأهدافك وقدرتك على تحمل المخاطر.
          </p>
        </div>
      </div>
    </div>
  );
}
