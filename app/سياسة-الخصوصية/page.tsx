"use client";

import { useLang } from "@/components/LanguageContext";

type ExtLink = { label: string; href: string };

type Section = {
  h: string;
  ps?: string[];
  list?: string[];
  strongLead?: string; // bolded lead inside a trailing paragraph
  afterText?: string;  // paragraph after the list
  linkText?: string;   // optional trailing paragraph with a link to /من-نحن
  linkLabel?: string;
  extLinks?: ExtLink[]; // outbound opt-out / vendor links
};

// The cookie section previously stated the site used "no cookies for commercial
// or advertising tracking" while AdSense, GA4 and OneSignal were all live —
// a false statement in a legal document, and AdSense requires accurate
// disclosure of third-party advertising cookies. Rewritten to match reality.
const txt = {
  ar: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: أغسطس 2026",
    sections: [
      {
        h: "1. المعلومات التي نجمعها",
        ps: ["نجمع المعلومات التالية فقط:"],
        list: [
          "عند الاشتراك في التنبيهات: عنوان البريد الإلكتروني وتفضيلات التنبيه",
          "بيانات الاستخدام: صفحات مزارة، وقت الزيارة، نوع المتصفح (مجمّعة وغير مرتبطة بهوية شخصية)",
          "الدولة: يُستخدم عنوان IP للكشف التلقائي عن العملة فقط، ولا يُحفظ لدينا",
          "بيانات محفظتك: تبقى في متصفحك وحده ولا تُرسل إلى خوادمنا إطلاقا",
        ],
      },
      {
        h: "2. كيف نستخدم معلوماتك",
        list: [
          "إرسال تنبيهات الأسعار التي اشتركت بها",
          "تحسين تجربة المستخدم في الموقع",
          "تحليل استخدام الموقع بشكل مجمّع",
          "عرض إعلانات عبر شبكة Google AdSense",
        ],
        strongLead: "لا نبيع ولا نؤجر",
        afterText: "بياناتك الشخصية لأي طرف ثالث لأغراض تجارية.",
      },
      {
        h: "3. تخزين البيانات",
        ps: [
          "يُخزَّن بريدك الإلكتروني وتفضيلات التنبيه في قاعدة بيانات Supabase المؤمّنة. لا نحتفظ بكلمات مرور (لا يوجد تسجيل دخول). البيانات محمية بتشفير SSL.",
          "أما محفظتك الذهبية وإعداداتك المحلية (العملة المفضلة، آخر زيارة) فتُحفظ في ذاكرة متصفحك أنت (localStorage) ولا تصل إلينا. إذا مسحت بيانات المتصفح فقدت هذه المعلومات ولا نملك نسخة منها.",
        ],
      },
      {
        h: "4. ملفات الكوكيز والتقنيات المشابهة",
        ps: ["يستخدم الموقع أنواع الكوكيز التالية:"],
        list: [
          "كوكيز تقنية ضرورية: لتشغيل الموقع وحفظ تفضيلاتك مثل اللغة والعملة",
          "كوكيز تحليلية: عبر Google Analytics (GA4) لفهم كيفية استخدام الموقع بشكل مجمّع",
          "كوكيز إعلانية: تضعها Google وشركاؤها عبر AdSense لعرض الإعلانات وقياس أدائها",
          "كوكيز الإشعارات: عبر OneSignal لإدارة اشتراكك في إشعارات الأسعار",
        ],
        afterText: "يمكنك حظر الكوكيز أو حذفها من إعدادات متصفحك في أي وقت، مع العلم أن حظر الكوكيز التقنية قد يعطّل بعض وظائف الموقع.",
      },
      {
        h: "5. الإعلانات",
        ps: [
          "يعرض هذا الموقع إعلانات عبر شبكة Google AdSense. تستخدم Google — بصفتها مزوّدا خارجيا — ملفات كوكيز لعرض الإعلانات على موقعنا.",
          "تتيح كوكيز الإعلانات لـGoogle وشركائها عرض إعلانات لك بناء على زياراتك لهذا الموقع أو مواقع أخرى على الإنترنت. ويجوز لمزوّدين خارجيين آخرين استخدام كوكيز لقياس أداء الإعلانات.",
          "يمكنك إيقاف الإعلانات المخصّصة في أي وقت عبر الروابط التالية:",
        ],
        extLinks: [
          { label: "إعدادات إعلانات Google", href: "https://adssettings.google.com" },
          { label: "خيارات إلغاء الاشتراك لدى المزوّدين الخارجيين", href: "https://www.aboutads.info/choices/" },
        ],
      },
      {
        h: "6. حقوقك",
        ps: ["لديك الحق في:"],
        list: [
          "طلب حذف بياناتك في أي وقت",
          "إلغاء الاشتراك في التنبيهات",
          "الاطلاع على البيانات المحفوظة عنك",
          "رفض الإعلانات المخصّصة عبر الروابط أعلاه",
        ],
        linkText: "لممارسة هذه الحقوق، يُرجى التواصل معنا عبر صفحة",
        linkLabel: "من نحن",
      },
      {
        h: "7. خدمات الطرف الثالث",
        ps: ["يستخدم الموقع الخدمات التالية، وتُطبَّق سياسات خصوصيتها الخاصة:"],
        list: [
          "Google AdSense — عرض الإعلانات",
          "Google Analytics (GA4) — تحليل الزيارات",
          "OneSignal — إشعارات الأسعار",
          "Supabase — قاعدة البيانات",
          "Resend — إرسال البريد الإلكتروني",
          "Vercel — استضافة الموقع",
          "GoldAPI.io، Yahoo Finance، CoinGecko، ExchangeRate-API، Chainlink — بيانات الأسعار",
        ],
      },
      {
        h: "8. الأطفال",
        ps: ["لا يستهدف الموقع الأطفال دون 18 عاما ولا يجمع بياناتهم عن قصد."],
      },
      {
        h: "9. التغييرات على هذه السياسة",
        ps: [
          "قد نُحدّث هذه السياسة من وقت لآخر. سيُعلَن عن أي تغييرات جوهرية في الصفحة الرئيسية. استمرار استخدامك للموقع بعد التحديث يُعدّ قبولا بالسياسة الجديدة.",
        ],
      },
    ] as Section[],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: August 2026",
    sections: [
      {
        h: "1. Information we collect",
        ps: ["We only collect the following information:"],
        list: [
          "When you subscribe to alerts: your email address and alert preferences",
          "Usage data: pages visited, visit time, browser type (aggregated and not linked to personal identity)",
          "Country: your IP is used for automatic currency detection only and is never stored by us",
          "Your portfolio data: stays in your browser alone and is never sent to our servers",
        ],
      },
      {
        h: "2. How we use your information",
        list: [
          "To send the price alerts you subscribed to",
          "To improve the user experience on the site",
          "To analyse site usage in aggregate",
          "To serve advertising through the Google AdSense network",
        ],
        strongLead: "We never sell or rent",
        afterText: "your personal data to any third party for commercial purposes.",
      },
      {
        h: "3. Data storage",
        ps: [
          "Your email address and alert preferences are stored in a secured Supabase database. We keep no passwords (there is no login). Data is protected with SSL encryption.",
          "Your gold portfolio and local settings (preferred currency, last visit) are saved in your own browser storage (localStorage) and never reach us. If you clear your browser data, that information is lost and we hold no copy of it.",
        ],
      },
      {
        h: "4. Cookies and similar technologies",
        ps: ["This site uses the following types of cookies:"],
        list: [
          "Essential technical cookies: to operate the site and remember preferences such as language and currency",
          "Analytics cookies: via Google Analytics (GA4) to understand site usage in aggregate",
          "Advertising cookies: set by Google and its partners through AdSense to serve and measure ads",
          "Notification cookies: via OneSignal to manage your price-alert subscription",
        ],
        afterText: "You can block or delete cookies from your browser settings at any time, though blocking essential cookies may break parts of the site.",
      },
      {
        h: "5. Advertising",
        ps: [
          "This site displays advertising through the Google AdSense network. Google, as a third-party vendor, uses cookies to serve ads on our site.",
          "Advertising cookies enable Google and its partners to serve ads to you based on your visits to this site and other sites on the internet. Other third-party vendors may also use cookies to measure ad performance.",
          "You can opt out of personalised advertising at any time via the links below:",
        ],
        extLinks: [
          { label: "Google Ads Settings", href: "https://adssettings.google.com" },
          { label: "Third-party vendor opt-out choices", href: "https://www.aboutads.info/choices/" },
        ],
      },
      {
        h: "6. Your rights",
        ps: ["You have the right to:"],
        list: [
          "Request deletion of your data at any time",
          "Unsubscribe from alerts",
          "Access the data stored about you",
          "Opt out of personalised advertising via the links above",
        ],
        linkText: "To exercise these rights, contact us via the",
        linkLabel: "About Us page",
      },
      {
        h: "7. Third-party services",
        ps: ["The site uses the following services, each governed by its own privacy policy:"],
        list: [
          "Google AdSense — advertising",
          "Google Analytics (GA4) — traffic analytics",
          "OneSignal — price notifications",
          "Supabase — database",
          "Resend — email delivery",
          "Vercel — site hosting",
          "GoldAPI.io, Yahoo Finance, CoinGecko, ExchangeRate-API, Chainlink — price data",
        ],
      },
      {
        h: "8. Children",
        ps: ["The site is not directed at children under 18 and does not knowingly collect their data."],
      },
      {
        h: "9. Changes to this policy",
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
            {s.extLinks && (
              <ul className={`list-disc list-inside space-y-1 mt-3 ${listMargin}`}>
                {s.extLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-gold hover:underline"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {s.strongLead && s.afterText && (
              <p className="mt-3">
                <strong className="text-text-primary">{s.strongLead}</strong> {s.afterText}
              </p>
            )}
            {!s.strongLead && s.afterText && <p className="mt-3">{s.afterText}</p>}
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
