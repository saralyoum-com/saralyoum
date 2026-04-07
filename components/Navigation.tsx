"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/اسعار", label: "الأسعار" },
  { href: "/حاسبة-الذهب", label: "🧮 الحاسبة" },
  { href: "/اخبار", label: "الأخبار" },
  { href: "/تنبيهات", label: "التنبيهات" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* اللوجو */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🏅</span>
          <div className="leading-tight">
            <div className="text-gold font-bold text-lg group-hover:text-gold-light transition-colors">
              سعر اليوم
            </div>
            <div className="text-text-secondary text-xs">أسعار لحظية</div>
          </div>
        </Link>

        {/* روابط ديسكتوب */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-gold/10 text-gold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* زر التنبيه + هامبرغر */}
        <div className="flex items-center gap-3">
          <Link
            href="/تنبيهات"
            className="hidden md:flex items-center gap-2 bg-gold text-background px-4 py-2 rounded-xl text-sm font-bold hover:bg-gold-light transition-colors"
          >
            🔔 اشترك مجاناً
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            aria-label="القائمة"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
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
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "bg-gold/10 text-gold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/تنبيهات"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-gold text-background px-4 py-3 rounded-xl text-sm font-bold mt-2"
              >
                🔔 اشترك في التنبيهات مجاناً
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
