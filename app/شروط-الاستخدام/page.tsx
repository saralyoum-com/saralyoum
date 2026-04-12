import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شروط الاستخدام — سعر الذهب",
};

export default function TermsPage() {
  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-text-primary mb-2">شروط الاستخدام</h1>
      <p className="text-text-secondary text-sm mb-8">آخر تحديث: أبريل 2026</p>

      <div className="space-y-6 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">1. القبول بالشروط</h2>
          <p>
            باستخدامك لموقع &quot;سعر الذهب&quot;، فإنك توافق على الالتزام بهذه الشروط والأحكام.
            إذا كنت لا توافق على أي من هذه الشروط، يُرجى التوقف عن استخدام الموقع.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">2. وصف الخدمة</h2>
          <p>
            يُقدّم موقع &quot;سعر الذهب&quot; خدمات عرض أسعار الذهب والفضة والعملات الرقمية
            والأخبار الاقتصادية وتنبيهات الأسعار لأغراض إعلامية وتعليمية فقط.
            الخدمة مجانية ومتاحة للعموم.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">3. الاستخدام المقبول</h2>
          <p className="mb-2">يُحظر على المستخدمين:</p>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>استخدام الموقع لأغراض غير قانونية</li>
            <li>محاولة اختراق أو تعطيل الموقع</li>
            <li>جمع البيانات بطرق آلية دون إذن مسبق</li>
            <li>نشر محتوى مضلل أو مضر</li>
            <li>انتهاك حقوق الملكية الفكرية</li>
          </ul>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">4. خدمة التنبيهات</h2>
          <p>
            بالاشتراك في خدمة التنبيهات، توافق على استلام رسائل إلكترونية تحتوي على
            معلومات الأسعار. يمكنك إلغاء الاشتراك في أي وقت. نحتفظ بالحق في إيقاف
            الخدمة أو تعديلها دون إشعار مسبق. الحد الأقصى 3 تنبيهات سعرية لكل بريد إلكتروني.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">5. الملكية الفكرية</h2>
          <p>
            جميع محتويات الموقع من تصميم ونصوص وشعارات محمية بحقوق الملكية الفكرية.
            لا يُسمح بنسخ أو إعادة نشر المحتوى دون إذن كتابي مسبق، باستثناء الاستخدام الشخصي غير التجاري.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">6. إخلاء المسؤولية</h2>
          <p>
            تُقدَّم جميع المعلومات &quot;كما هي&quot; دون أي ضمانات. لا يضمن الموقع استمرارية
            الخدمة أو خلوّها من الأخطاء. للمزيد، راجع{" "}
            <a href="/إخلاء-مسؤولية" className="text-gold hover:underline">
              صفحة إخلاء المسؤولية
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">7. التعديلات</h2>
          <p>
            نحتفظ بالحق في تعديل هذه الشروط في أي وقت. يُعدّ استمرار استخدامك للموقع
            بعد نشر أي تعديلات قبولاً ضمنياً بها.
          </p>
        </section>

        <section>
          <h2 className="text-text-primary font-bold text-xl mb-3">8. القانون المطبّق</h2>
          <p>
            تخضع هذه الشروط للقوانين المعمول بها. أي نزاع ينشأ عن استخدام الموقع
            يُسوَّى وفق الإجراءات القانونية المختصة.
          </p>
        </section>
      </div>
    </div>
  );
}
