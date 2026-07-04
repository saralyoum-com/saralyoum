"use client";

import { useLang } from "@/components/LanguageContext";

type Section = {
  h: string;
  ps?: string[];
  list?: string[];
  strongLead?: string; // bolded lead inside a trailing paragraph
  afterText?: string;  // paragraph after the list
  linkText?: string;   // optional trailing paragraph with a link to /من-نحن
  linkLabel?: string;
};

const txt = {
  ar: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: أبريل 2026",
    sections: [
      {
        h: "1. المعلومات التي نجمعها",
        ps: ["نجمع المعلومات التالية فقط:"],
        list: [
          "عند الاشتراك في التنبيهات: عنوان البريد الإلكتروني وتفضيلات التنبيه",
          "بيانات الاستخدام: صفحات مزارة، وقت الزيارة، نوع المتصفح (مجمّعة وغير مرتبطة بهوية شخصية)",
          "الدولة: يُستخدم IP للكشف التلقائي عن العملة فقط، ولا يُحفظ",
        ],
      },
      {
        h: "2. كيف نستخدم معلوماتك",
        list: [
          "إرسال تنبيهات الأسعار التي اشتركت بها",
          "تحسين تجربة المستخدم في الموقع",
          "تحليل استخدام الموقع بشكل مجمّع",
        ],
        strongLead: "لا نبيع ولا نؤجر ولا نشارك",
        afterText: "بياناتك الشخصية مع أي طرف ثالث لأغراض تجارية.",
      },
      {
        h: "3. تخزين البيانات",
        ps: [
          "يُخزَّن بريدك الإلكتروني وتفضيلات التنبيه في قاعدة بيانات Supabase المؤمّنة. لا نحتفظ بكلمات مرور (لا يوجد تسجيل دخول). البيانات محمية بتشفير SSL.",
        ],
      },
      {
        h: "4. ملفات الكوكيز",
        ps: [
          "يستخدم الموقع ملفات كوكيز تقنية ضرورية لعمله فقط. لا نستخدم كوكيز للتتبع التجاري أو الإعلاني في الوقت الحالي.",
        ],
      },
      {
        h: "5. حقوقك",
        ps: ["لديك الحق في:"],
        list: [
          "طلب حذف بياناتك في أي وقت",
          "إلغاء الاشتراك في التنبيهات",
          "الاطلاع على البيانات المحفوظة عنك",
        ],
        linkText: "لممارسة هذه الحقوق، يُرجى التواصل معنا عبر صفحة",
        linkLabel: "من نحن",
      },
      {
        h: "6. خدمات الطرف الثالث",
        ps: ["يستخدم الموقع الخدمات التالية:"],
        list: [
          "Supabase — قاعدة بيانات (سياسة خصوصيتهم تُطبَّق)",
          "Resend — إرسال البريد الإلكتروني",
          "Vercel — استضافة الموقع",
          "GoldAPI.io، CoinGecko، ExchangeRate-API — بيانات الأسعار",
        ],
      },
      {
        h: "7. الأطفال",
        ps: ["لا يستهدف الموقع الأطفال دون 18 عاماً ولا يجمع بياناتهم عن قصد."],
      },
      {
        h: "8. التغييرات على هذه السياسة",
        ps: [
          "قد نُحدّث هذه السياسة من وقت لآخر. سيُعلَن عن أي تغييرات جوهرية في الصفحة الرئيسية. استمرار استخدامك للموقع بعد التحديث يُعدّ قبولاً بالسياسة الجديدة.",
        ],
      },
    ] as Section[],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: April 2026",
    sections: [
      {
        h: "1. Information we collect",
        ps: ["We only collect the following information:"],
        list: [
          "When you subscribe to alerts: your email address and alert preferences",
          "Usage data: pages visited, visit time, browser type (aggregated and not linked to personal identity)",
          "Country: your IP is used for automatic currency detection only and is never stored",
        ],
      },
      {
        h: "2. How we use your information",
        list: [
          "To send the price alerts you subscribed to",
          "To improve the user experience on the site",
          "To analyze site usage in aggregate",
        ],
        strongLead: "We never sell, rent, or share",
        afterText: "your personal data with any third party for commercial purposes.",
      },
      {
        h: "3. Data storage",
        ps: [
          "Your email address and alert preferences are stored in a secured Supabase database. We keep no passwords (there is no login). Data is protected with SSL encryption.",
        ],
      },
      {
        h: "4. Cookies",
        ps: [
          "The site uses only technical cookies essential for its operation. We currently use no cookies for commercial or advertising tracking.",
        ],
      },
      {
        h: "5. Your rights",
        ps: ["You have the right to:"],
        list: [
          "Request deletion of your data at any time",
          "Unsubscribe from alerts",
          "Access the data stored about you",
        ],
        linkText: "To exercise these rights, contact us via the",
        linkLabel: "About Us page",
      },
      {
        h: "6. Third-party services",
        ps: ["The site uses the following services:"],
        list: [
          "Supabase — database (their privacy policy applies)",
          "Resend — email delivery",
          "Vercel — site hosting",
          "GoldAPI.io, CoinGecko, ExchangeRate-API — price data",
        ],
      },
      {
        h: "7. Children",
        ps: ["The site is not directed at children under 18 and does not knowingly collect their data."],
      },
      {
        h: "8. Changes to this policy",
        ps: [
          "We may update this policy from time to time. Any material changes will be announced on the home page. Continuing to use the site after an update constitutes acceptance of the new policy.",
        ],
      },
    ] as Section[],
  },
};

export default function PrivacyPage() {
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
              <p key={p} className="mb-2">{p}</p>
            ))}
            {s.list && (
              <ul className={`list-disc list-inside space-y-1 ${listMargin}`}>
                {s.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            )}
            {s.strongLead && s.afterText && (
              <p className="mt-3">
                <strong className="text-text-primary">{s.strongLead}</strong> {s.afterText}
              </p>
            )}
            {s.linkText && (
              <p className="mt-3">
                {s.linkText}{" "}
                <a href="/من-نحن" className="text-gold hover:underline">
                  {s.linkLabel}
                </a>.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
