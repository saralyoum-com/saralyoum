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
              { label: "Instagram", href: "https://www.instagram.com/sardhahab", path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" },
              { label: "TikTok", href: "https://www.tiktok.com/@sardhahab", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
            ].map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="social-glow w-11 h-11 rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold hover:text-background flex items-center justify-center transition-all"
                style={{ animationDelay: `${i * 0.4}s` }}
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

        {/* Design credit — AY DESIGN */}
        <div dir="ltr" className="pt-4 flex items-center justify-center gap-2">
          <span className="text-text-secondary text-xs">Powered &amp; Designed by</span>
          <a
            href="https://aydesignweb.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AY DESIGN"
            className="inline-flex text-gold hover:text-gold-light transition-colors"
          >
            <svg
              height="32"
              viewBox="12 67 271 169"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="AY DESIGN"
              className="w-auto"
            >
              <path d="M58.29,71l-40.79,100.2h2.26l12.38-30.5h42.53l18.01,45.04,6.39-14.55-40.79-100.2ZM53.42,88.5l20.47,50.17h-40.86l20.39-50.17Z" />
              <path d="M123.89,150.2v-20.9h5.58c1.59,0,3.1.26,4.53.78,1.44.52,2.68,1.24,3.73,2.15,1.05.91,1.88,2.02,2.5,3.33.62,1.31.93,2.71.93,4.2,0,1.99-.53,3.79-1.58,5.39-1.06,1.6-2.47,2.85-4.25,3.73-1.78.88-3.73,1.32-5.86,1.32h-5.58ZM126.32,149.76h3.08c1.24,0,2.41-.24,3.52-.71,1.11-.48,2.08-1.14,2.92-1.99.84-.85,1.5-1.91,1.99-3.17.49-1.26.73-2.64.73-4.13s-.24-2.87-.73-4.14c-.49-1.26-1.15-2.33-1.99-3.18-.84-.85-1.81-1.52-2.92-1.99-1.11-.48-2.28-.71-3.52-.71h-3.08v20.03Z" />
              <polygon points="155.48 150.2 155.48 129.3 167.4 129.3 167.4 129.73 157.92 129.73 157.92 139.32 165.86 139.32 165.86 139.75 157.92 139.75 157.92 149.76 167.4 149.76 167.4 150.2 155.48 150.2" />
              <path d="M181.59,148.56v-1.02c.06.07.16.16.28.27.12.11.39.31.79.59.4.29.82.54,1.25.75.43.22.98.42,1.64.6.67.18,1.33.27,2,.27,1.45,0,2.63-.38,3.52-1.13.89-.75,1.34-1.73,1.34-2.94,0-.99-.33-1.9-1-2.72-.67-.82-1.84-1.8-3.5-2.93-.64-.44-1.11-.77-1.41-.98-.3-.21-.7-.5-1.2-.88-.5-.38-.88-.68-1.11-.9-.24-.23-.52-.51-.84-.87-.32-.35-.56-.67-.69-.95-.14-.29-.27-.6-.37-.96-.11-.35-.16-.72-.16-1.09,0-.76.18-1.44.54-2.05.36-.6.84-1.09,1.43-1.47.6-.37,1.25-.65,1.97-.85.72-.2,1.46-.29,2.23-.29.67,0,1.34.07,2.02.21.68.14,1.2.28,1.54.42l.53.23v.95c-.05-.04-.12-.09-.21-.15-.09-.06-.28-.17-.56-.32-.29-.15-.58-.29-.89-.41-.31-.12-.69-.23-1.15-.33-.46-.1-.91-.15-1.36-.15-1.2,0-2.2.31-3.02.92-.81.61-1.22,1.42-1.22,2.42,0,.61.18,1.18.54,1.71.37.53.78.97,1.25,1.33.46.35,1.28.92,2.44,1.7.02.01.04.02.05.03.01,0,.03.02.05.04.02.01.04.02.06.04.65.42,1.12.74,1.43.95.31.21.73.51,1.25.9.53.39.93.71,1.19.96s.57.57.93.96c.35.39.61.75.78,1.09.16.34.31.72.43,1.15.13.43.19.87.19,1.32,0,.77-.15,1.48-.45,2.11-.29.64-.68,1.16-1.16,1.56-.48.41-1.03.75-1.66,1.02-.63.27-1.26.47-1.91.59-.64.12-1.29.18-1.94.18s-1.32-.06-1.97-.2c-.64-.13-1.19-.28-1.64-.46-.45-.18-.86-.36-1.21-.55-.36-.18-.62-.34-.79-.47l-.27-.2Z" />
              <rect x="209.2" y="129.3" width="2.43" height="20.9" />
              <path d="M227.22,144.04c-.6-1.34-.9-2.78-.9-4.29s.3-2.94.9-4.28c.6-1.34,1.41-2.49,2.44-3.45,1.03-.96,2.24-1.72,3.65-2.28,1.41-.56,2.9-.84,4.47-.84,2.74,0,5.13.57,7.14,1.71v1.1c-.89-.76-1.96-1.35-3.22-1.77-1.26-.42-2.57-.62-3.92-.62-1.63,0-3.11.44-4.45,1.31-1.33.88-2.39,2.12-3.17,3.71-.78,1.6-1.17,3.4-1.17,5.4s.39,3.8,1.17,5.4c.78,1.59,1.84,2.83,3.17,3.7,1.34.87,2.82,1.31,4.45,1.31,2.35,0,4.32-.46,5.92-1.37v-9.27h2.43v8.77c-2.22,1.53-5.01,2.3-8.35,2.3-1.57,0-3.06-.28-4.47-.83-1.41-.56-2.63-1.31-3.65-2.27-1.02-.96-1.83-2.11-2.44-3.46" />
              <polygon points="261.28 150.2 261.73 150.2 261.73 133.01 277.72 150.56 277.72 129.3 277.27 129.3 277.27 146.47 261.28 128.95 261.28 150.2" />
              <polygon points="115.78 129.45 91.59 182.41 85.92 195 69.56 230.79 72.09 230.79 118.24 129.45 115.78 129.45" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
