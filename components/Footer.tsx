"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/components/LanguageContext";
import ContactForm from "@/components/ContactForm";

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

        {/* Country pages */}
        <div className="mb-6">
          <h4 className="text-text-secondary text-xs font-medium mb-3">
            {lang === "ar" ? "سعر الذهب بالعملات العربية" : "Gold Price by Currency"}
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/سعر-الذهب-السعودية", label: lang === "ar" ? "🇸🇦 السعودية" : "🇸🇦 Saudi Arabia" },
              { href: "/سعر-الذهب-الامارات",  label: lang === "ar" ? "🇦🇪 الإمارات"  : "🇦🇪 UAE" },
              { href: "/سعر-الذهب-الكويت",   label: lang === "ar" ? "🇰🇼 الكويت"    : "🇰🇼 Kuwait" },
              { href: "/سعر-الذهب-مصر",      label: lang === "ar" ? "🇪🇬 مصر"       : "🇪🇬 Egypt" },
              { href: "/سعر-الذهب-قطر",      label: lang === "ar" ? "🇶🇦 قطر"       : "🇶🇦 Qatar" },
              { href: "/سعر-الذهب-البحرين",  label: lang === "ar" ? "🇧🇭 البحرين"   : "🇧🇭 Bahrain" },
              { href: "/سعر-الذهب-الاردن",   label: lang === "ar" ? "🇯🇴 الأردن"    : "🇯🇴 Jordan" },
              { href: "/سعر-الذهب-المغرب",   label: lang === "ar" ? "🇲🇦 المغرب"    : "🇲🇦 Morocco" },
              { href: "/سعر-الذهب-العراق",   label: lang === "ar" ? "🇮🇶 العراق"    : "🇮🇶 Iraq" },
              { href: "/سعر-الذهب-عمان",     label: lang === "ar" ? "🇴🇲 عُمان"     : "🇴🇲 Oman" },
              { href: "/سعر-الذهب-ليبيا",    label: lang === "ar" ? "🇱🇾 ليبيا"     : "🇱🇾 Libya" },
              { href: "/سعر-الذهب-تونس",     label: lang === "ar" ? "🇹🇳 تونس"      : "🇹🇳 Tunisia" },
              { href: "/سعر-الذهب-الجزائر",  label: lang === "ar" ? "🇩🇿 الجزائر"   : "🇩🇿 Algeria" },
              { href: "/سعر-الذهب-اليمن",    label: lang === "ar" ? "🇾🇪 اليمن"      : "🇾🇪 Yemen" },
              { href: "/سعر-الذهب-السودان",  label: lang === "ar" ? "🇸🇩 السودان"    : "🇸🇩 Sudan" },
              { href: "/سعر-الذهب-لبنان",    label: lang === "ar" ? "🇱🇧 لبنان"      : "🇱🇧 Lebanon" },
              { href: "/سعر-الذهب-سوريا",    label: lang === "ar" ? "سوريا"      : "Syria", flagImg: "/flags/sy.svg" },
              { href: "/سعر-الذهب-فلسطين",   label: lang === "ar" ? "🇵🇸 فلسطين"     : "🇵🇸 Palestine" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-text-secondary hover:text-gold text-xs bg-surface-2 border border-border rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1">
                {"flagImg" in l && l.flagImg ? <Image src={l.flagImg} alt="" width={16} height={11} className="inline-block rounded-[2px]" /> : null}
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Crypto pages */}
        <div className="mb-8">
          <h4 className="text-text-secondary text-xs font-medium mb-3">
            {lang === "ar" ? "أسعار العملات الرقمية" : "Crypto Prices"}
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/سعر-البيتكوين",  label: lang === "ar" ? "₿ سعر البيتكوين"   : "₿ Bitcoin Price" },
              { href: "/سعر-الاثيريوم",  label: lang === "ar" ? "Ξ سعر الإثيريوم"   : "Ξ Ethereum Price" },
              { href: "/زكاة-الكريبتو",    label: lang === "ar" ? "⚖️ زكاة الكريبتو"   : "⚖️ Crypto Zakat" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-text-secondary hover:text-gold text-xs bg-surface-2 border border-border rounded-lg px-3 py-1.5 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* عن الموقع */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo-footer.png"
                alt="سعر الذهب — SARD"
                width={140}
                height={140}
                className="rounded-full"
              />
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
                { href: "/حاسبة-الذهب", labelKey: "calculator" },
                { href: "/مقالات", labelKey: "articles" },
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

        {/* Social icons */}
        <div className="mb-8">
          <p className="text-text-secondary text-xs mb-3">
            {lang === "ar" ? "تابعنا على" : "Follow us"}
          </p>
          <div className="flex gap-3">
            {[
              { label: "X", href: "https://x.com/sardhahab", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
              { label: "Telegram", href: "https://t.me/sardhahab", path: "M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.27 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" },
              { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61591348885569", path: "M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z" },
              { label: "LinkedIn", href: "https://www.linkedin.com/company/sardhahab", path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold hover:text-background flex items-center justify-center transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <ContactForm />

        <div className="border-t border-border pt-6 mt-8 flex flex-col md:flex-row justify-between items-center gap-3">
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
