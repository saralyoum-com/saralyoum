import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer dir="rtl" className="bg-surface border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* إخلاء المسؤولية الدائم */}
        <div className="bg-surface-2 border border-border rounded-2xl p-4 mb-8 text-sm text-text-secondary text-center">
          ⚠️ المحتوى لأغراض تعليمية وإعلامية فقط. لا يمثل نصيحة استثمارية أو مالية.
          الاستثمار ينطوي على مخاطر. استشر مستشاراً مالياً مرخصاً قبل أي قرار.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* عن الموقع */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🏅</span>
              <span className="text-gold font-bold text-lg">سعر اليوم</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              موقع عربي متكامل لمتابعة أسعار الذهب والفضة والعملات الرقمية
              مع أخبار اقتصادية يومية وتنبيهات ذكية للأسواق.
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-text-primary font-bold mb-3">روابط سريعة</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/اسعار", label: "الأسعار" },
                { href: "/اخبار", label: "الأخبار" },
                { href: "/تنبيهات", label: "التنبيهات" },
                { href: "/من-نحن", label: "من نحن" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary hover:text-gold text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* قانوني */}
          <div>
            <h4 className="text-text-primary font-bold mb-3">قانوني</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/إخلاء-مسؤولية", label: "إخلاء المسؤولية" },
                { href: "/شروط-الاستخدام", label: "شروط الاستخدام" },
                { href: "/سياسة-الخصوصية", label: "سياسة الخصوصية" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary hover:text-gold text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-text-secondary text-xs">
            © {year} سعر اليوم. جميع الحقوق محفوظة.
          </p>
          <p className="text-text-secondary text-xs">
            الأسعار مؤشرية وليست للتداول المباشر
          </p>
        </div>
      </div>
    </footer>
  );
}
