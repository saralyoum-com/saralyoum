"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";
import PriceFreshnessTimer, { PriceFreshnessTimerMobile } from "@/components/PriceFreshnessTimer";

const navHrefs = [
  { href: "/", key: "home" },
  { href: "/اسعار", key: "prices" },
  { href: "/حاسبة-الذهب", key: "calculator" },
  { href: "/مقالات", key: "articles" },
  { href: "/اخبار", key: "news" },
  { href: "/تنبيهات", key: "alerts" },
] as const;

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { lang, t, toggleLang } = useLang();

  const navLinks = navHrefs.map((n) => ({
    href: n.href,
    label: t.nav[n.key as keyof typeof t.nav],
    key: n.key,
  }));

  function handleMenuToggle() {
    if (!menuOpen) track.mobileMenuOpen();
    else track.mobileMenuClose();
    setMenuOpen(!menuOpen);
  }

  function handleLangToggle() {
    const next = lang === "ar" ? "EN" : "AR";
    track.languageToggle(next);
    toggleLang();
  }

  return (
    <header
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* اللوجو */}
        <Link
          href="/"
          onClick={() => track.logoClick()}
          className="flex items-center gap-1.5 sm:gap-2 group shrink-0"
        >
          <span className="text-xl sm:text-2xl">🏅</span>
          <div className="leading-tight">
            <div className="text-gold font-bold text-base sm:text-lg group-hover:text-gold-light transition-colors">
              {t.siteName}
            </div>
            <div className="text-text-secondary text-xs hidden sm:block">{t.tagline}</div>
          </div>
        </Link>

        {/* روابط ديسكتوب */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => track.navClick(link.key)}
              className={`px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-gold/10 text-gold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* أزرار يمين */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* مؤقت التحديث */}
          <PriceFreshnessTimer />
          <PriceFreshnessTimerMobile />

          {/* زر تبديل اللغة */}
          <button
            onClick={handleLangToggle}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border border-border text-text-secondary hover:text-text-primary hover:border-gold/40 transition-all"
            aria-label="Toggle language"
          >
            🌐 {lang === "ar" ? "EN" : "عر"}
          </button>

          <a
            href="https://t.me/sardhahab"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track.subscribeHeaderClick()}
            className="hidden md:flex items-center gap-1.5 bg-gold text-background px-3 lg:px-4 py-2 rounded-xl text-sm font-bold hover:bg-gold-light transition-colors whitespace-nowrap"
          >
            <span>✈️</span> {t.nav.subscribe}
          </a>

          <button
            onClick={handleMenuToggle}
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            aria-label="القائمة"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="18" y2="18" />
                  <line x1="18" y1="4" x2="4" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="19" y2="6" />
                  <line x1="3" y1="12" x2="19" y2="12" />
                  <line x1="3" y1="18" x2="19" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* موبايل ميني */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-surface"
          >
            <div className="p-3 sm:p-4 flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => { track.navClick(link.key); setMenuOpen(false); }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "bg-gold/10 text-gold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://t.me/sardhahab"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { track.subscribeHeaderClick(); setMenuOpen(false); }}
                className="flex items-center justify-center gap-2 bg-gold text-background px-4 py-3 rounded-xl text-sm font-bold mt-2"
              >
                ✈️ {t.nav.subscribe}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
