"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { lang, t } = useLang();

  return (
    <footer dir={lang === "ar" ? "rtl" : "ltr"} className="bg-surface border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* إخلاء المسؤولية الدائم */}
        <div className="bg-surface-2 border border-border rounded-2xl p-4 mb-8 text-sm text-text-secondary text-center">
          {t.disclaimerFooter}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* عن الموقع */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🏅</span>
              <span className="text-gold font-bold text-lg">{t.siteName}</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {t.footer.about}
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h4 className="text-text-primary font-bold mb-3">{t.footer.quickLinks}</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/اسعار", labelKey: "prices" },
                { href: "/اخبار", labelKey: "news" },
                { href: "/تنبيهات", labelKey: "alerts" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary hover:text-gold text-sm transition-colors"
                >
                  {t.nav[link.labelKey as keyof typeof t.nav]}
                </Link>
              ))}
              <Link
                href="/من-نحن"
                className="text-text-secondary hover:text-gold text-sm transition-colors"
              >
                {lang === "ar" ? "من نحن" : "About Us"}
              </Link>
            </div>
          </div>

          {/* قانوني */}
          <div>
            <h4 className="text-text-primary font-bold mb-3">{t.footer.legal}</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/إخلاء-مسؤولية", label: t.footer.disclaimer },
                { href: "/شروط-الاستخدام", label: t.footer.terms },
                { href: "/سياسة-الخصوصية", label: t.footer.privacy },
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

        {/* Telegram CTA */}
        <a
          href="https://t.me/sardhahab"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-[#229ED9]/10 border border-[#229ED9]/30 rounded-2xl p-4 mb-6 hover:bg-[#229ED9]/15 transition-all group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#229ED9"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.613c-.149.666-.546.829-1.107.516l-3.07-2.263-1.482 1.425c-.165.165-.303.303-.618.303l.22-3.12 5.674-5.126c.247-.22-.054-.342-.383-.123L6.91 14.42 3.9 13.473c-.657-.207-.67-.657.138-.973l10.88-4.195c.547-.197 1.026.133.844.943z"/></svg>
          <span className="text-[#229ED9] font-bold text-sm group-hover:text-[#1a8bc4] transition-colors">
            {lang === "ar" ? "🔔 انضم لقناة سعر الذهب على تيليجرام — @sardhahab" : "🔔 Join sardhahab on Telegram — @sardhahab"}
          </span>
        </a>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-text-secondary text-xs">
            © {year} {t.siteName}. {t.footer.allRights}
          </p>
          <p className="text-text-secondary text-xs">
            {t.footer.indicative}
          </p>
        </div>
      </div>
    </footer>
  );
}
