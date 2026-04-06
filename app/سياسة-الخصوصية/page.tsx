import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية — سعر اليوم",
};

export default function PrivacyPage() {
  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-text-primary mb-2">سياسة الخصوصية</h1>
      <p className="text-text-secondary text-sm mb-8">آخر تحديث: أبريل 2026</p>

      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">1. المعلومات التي نجمعها</h2>
          <p className="mb-2">نجمع المعلومات التالية فقط:</p>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              <strong className="text-text-primary">عند الاشتراك في التنبيهات:</strong> عنوان
              البريد الإلكتروني وتفضيلات التنبيه
            </li>
            <li>
              <strong className="text-text-primary">بيانات الاستخدام:</strong> صفحات مزارة،
              وقت الزيارة، نوع المتصفح (مجمّعة وغير مرتبطة بهوية شخصية)
            </li>
            <li>
              <strong className="text-text-primary">الدولة:</strong> يُستخدم IP للكشف التلقائي
              عن العملة فقط، ولا يُحفظ
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">2. كيف نستخدم معلوماتك</h2>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>إرسال تنبيهات الأسعار التي اشتركت بها</li>
            <li>تحسين تجربة المستخدم في الموقع</li>
            <li>تحليل استخدام الموقع بشكل مجمّع</li>
          </ul>
          <p className="mt-3">
            <strong className="text-text-primary">لا نبيع ولا نؤجر ولا نشارك</strong> بياناتك
            الشخصية مع أي طرف ثالث لأغراض تجارية.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">3. تخزين البيانات</h2>
          <p>
            يُخزَّن بريدك الإلكتروني وتفضيلات التنبيه في قاعدة بيانات Supabase المؤمّنة.
            لا نحتفظ بكلمات مرور (لا يوجد تسجيل دخول). البيانات محمية بتشفير SSL.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">4. ملفات الكوكيز</h2>
          <p>
            يستخدم الموقع ملفات كوكيز تقنية ضرورية لعمله فقط. لا نستخدم كوكيز للتتبع
            التجاري أو الإعلاني في الوقت الحالي.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">5. حقوقك</h2>
          <p className="mb-2">لديك الحق في:</p>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>طلب حذف بياناتك في أي وقت</li>
            <li>إلغاء الاشتراك في التنبيهات</li>
            <li>الاطلاع على البيانات المحفوظة عنك</li>
          </ul>
          <p className="mt-3">
            لممارسة هذه الحقوق، يُرجى التواصل معنا عبر صفحة{" "}
            <a href="/من-نحن" className="text-gold hover:underline">
              من نحن
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">6. خدمات الطرف الثالث</h2>
          <p>يستخدم الموقع الخدمات التالية:</p>
          <ul className="list-disc list-inside space-y-1 mr-4 mt-2">
            <li>Supabase — قاعدة بيانات (سياسة خصوصيتهم تُطبَّق)</li>
            <li>Resend — إرسال البريد الإلكتروني</li>
            <li>Vercel — استضافة الموقع</li>
            <li>GoldAPI.io، CoinGecko، ExchangeRate-API — بيانات الأسعار</li>
          </ul>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">7. الأطفال</h2>
          <p>
            لا يستهدف الموقع الأطفال دون 18 عاماً ولا يجمع بياناتهم عن قصد.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">8. التغييرات على هذه السياسة</h2>
          <p>
            قد نُحدّث هذه السياسة من وقت لآخر. سيُعلَن عن أي تغييرات جوهرية في
            الصفحة الرئيسية. استمرار استخدامك للموقع بعد التحديث يُعدّ قبولاً بالسياسة الجديدة.
          </p>
        </section>
      </div>
    </div>
  );
}
