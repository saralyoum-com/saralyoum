"use client";

import { useLang } from "@/components/LanguageContext";

type Section = {
  h: string;
  ps?: string[];
  list?: string[];
  linkText?: string; // trailing paragraph with a link to the disclaimer page
  linkLabel?: string;
  linkAfter?: string;
};

const txt = {
  ar: {
    title: "شروط الاستخدام",
    updated: "آخر تحديث: أبريل 2026",
    sections: [
      {
        h: "1. القبول بالشروط",
        ps: [
          'باستخدامك لموقع "سعر الذهب"، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يُرجى التوقف عن استخدام الموقع.',
        ],
      },
      {
        h: "2. وصف الخدمة",
        ps: [
          'يُقدّم موقع "سعر الذهب" خدمات عرض أسعار الذهب والفضة والعملات الرقمية والأخبار الاقتصادية وتنبيهات الأسعار لأغراض إعلامية وتعليمية فقط. الخدمة مجانية ومتاحة للعموم.',
        ],
      },
      {
        h: "3. الاستخدام المقبول",
        ps: ["يُحظر على المستخدمين:"],
        list: [
          "استخدام الموقع لأغراض غير قانونية",
          "محاولة اختراق أو تعطيل الموقع",
          "جمع البيانات بطرق آلية دون إذن مسبق",
          "نشر محتوى مضلل أو مضر",
          "انتهاك حقوق الملكية الفكرية",
        ],
      },
      {
        h: "4. خدمة التنبيهات",
        ps: [
          "بالاشتراك في خدمة التنبيهات، توافق على استلام رسائل إلكترونية تحتوي على معلومات الأسعار. يمكنك إلغاء الاشتراك في أي وقت. نحتفظ بالحق في إيقاف الخدمة أو تعديلها دون إشعار مسبق. الحد الأقصى 3 تنبيهات سعرية لكل بريد إلكتروني.",
        ],
      },
      {
        h: "5. الملكية الفكرية",
        ps: [
          "جميع محتويات الموقع من تصميم ونصوص وشعارات محمية بحقوق الملكية الفكرية. لا يُسمح بنسخ أو إعادة نشر المحتوى دون إذن كتابي مسبق، باستثناء الاستخدام الشخصي غير التجاري.",
        ],
      },
      {
        h: "6. إخلاء المسؤولية",
        ps: [
          'تُقدَّم جميع المعلومات "كما هي" دون أي ضمانات. لا يضمن الموقع استمرارية الخدمة أو خلوّها من الأخطاء.',
        ],
        linkText: "للمزيد، راجع",
        linkLabel: "صفحة إخلاء المسؤولية",
        linkAfter: ".",
      },
      {
        h: "7. التعديلات",
        ps: [
          "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. يُعدّ استمرار استخدامك للموقع بعد نشر أي تعديلات قبولاً ضمنياً بها.",
        ],
      },
      {
        h: "8. القانون المطبّق",
        ps: [
          "تخضع هذه الشروط للقوانين المعمول بها. أي نزاع ينشأ عن استخدام الموقع يُسوَّى وفق الإجراءات القانونية المختصة.",
        ],
      },
    ] as Section[],
  },
  en: {
    title: "Terms of Use",
    updated: "Last updated: April 2026",
    sections: [
      {
        h: "1. Acceptance of terms",
        ps: [
          'By using the "SARD Gold Price" website, you agree to be bound by these terms and conditions. If you do not agree with any of these terms, please stop using the site.',
        ],
      },
      {
        h: "2. Service description",
        ps: [
          'The "SARD Gold Price" website provides gold, silver, and cryptocurrency prices, economic news, and price alerts for informational and educational purposes only. The service is free and available to the public.',
        ],
      },
      {
        h: "3. Acceptable use",
        ps: ["Users are prohibited from:"],
        list: [
          "Using the site for illegal purposes",
          "Attempting to hack or disrupt the site",
          "Collecting data by automated means without prior permission",
          "Publishing misleading or harmful content",
          "Violating intellectual property rights",
        ],
      },
      {
        h: "4. Alerts service",
        ps: [
          "By subscribing to the alerts service, you agree to receive emails containing price information. You can unsubscribe at any time. We reserve the right to stop or modify the service without prior notice. A maximum of 3 price alerts per email address applies.",
        ],
      },
      {
        h: "5. Intellectual property",
        ps: [
          "All site content — design, text, and logos — is protected by intellectual property rights. Copying or republishing content without prior written permission is not allowed, except for personal, non-commercial use.",
        ],
      },
      {
        h: "6. Disclaimer",
        ps: [
          'All information is provided "as is" without any warranties. The site does not guarantee service continuity or freedom from errors.',
        ],
        linkText: "For more, see the",
        linkLabel: "Disclaimer page",
        linkAfter: ".",
      },
      {
        h: "7. Modifications",
        ps: [
          "We reserve the right to modify these terms at any time. Continuing to use the site after any modifications are published constitutes implicit acceptance of them.",
        ],
      },
      {
        h: "8. Governing law",
        ps: [
          "These terms are subject to applicable laws. Any dispute arising from the use of the site shall be settled through the competent legal procedures.",
        ],
      },
    ] as Section[],
  },
};

export default function TermsPage() {
  const { lang } = useLang();
  const t = txt[lang];
  const listMargin = lang === "ar" ? "mr-4" : "ml-4";

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-text-primary mb-2">{t.title}</h1>
      <p className="text-text-secondary text-sm mb-8">{t.updated}</p>

      <div className="space-y-6 text-text-secondary leading-relaxed">
        {t.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-text-primary font-bold text-xl mb-3">{s.h}</h2>
            {s.ps?.map((p) => (
              <p key={p} className="mb-2">
                {p}
                {s.linkText && (
                  <>
                    {" "}{s.linkText}{" "}
                    <a href="/إخلاء-مسؤولية" className="text-gold hover:underline">
                      {s.linkLabel}
                    </a>
                    {s.linkAfter}
                  </>
                )}
              </p>
            ))}
            {s.list && (
              <ul className={`list-disc list-inside space-y-1 ${listMargin}`}>
                {s.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
