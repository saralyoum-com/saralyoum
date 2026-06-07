"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useSetCurrency, LocationInfo } from "@/components/LocalCurrency";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

interface CurrencyOption {
  code: string;
  symbol: string;
  nameAr: string;
  nameEn: string;
  flag: string;
  country: string;
  fallback: number;
}

const CURRENCIES: CurrencyOption[] = [
  { code: "SAR", symbol: "ر.س",  nameAr: "ريال سعودي",     nameEn: "Saudi Riyal",     flag: "🇸🇦", country: "SA", fallback: 3.75 },
  { code: "AED", symbol: "د.إ",  nameAr: "درهم إماراتي",  nameEn: "UAE Dirham",      flag: "🇦🇪", country: "AE", fallback: 3.6725 },
  { code: "KWD", symbol: "د.ك",  nameAr: "دينار كويتي",   nameEn: "Kuwaiti Dinar",   flag: "🇰🇼", country: "KW", fallback: 0.3075 },
  { code: "QAR", symbol: "ر.ق",  nameAr: "ريال قطري",     nameEn: "Qatari Riyal",    flag: "🇶🇦", country: "QA", fallback: 3.64 },
  { code: "BHD", symbol: "د.ب",  nameAr: "دينار بحريني",  nameEn: "Bahraini Dinar",  flag: "🇧🇭", country: "BH", fallback: 0.377 },
  { code: "OMR", symbol: "ر.ع",  nameAr: "ريال عُماني",   nameEn: "Omani Rial",      flag: "🇴🇲", country: "OM", fallback: 0.385 },
  { code: "EGP", symbol: "ج.م",  nameAr: "جنيه مصري",     nameEn: "Egyptian Pound",  flag: "🇪🇬", country: "EG", fallback: 54.41 },
  { code: "JOD", symbol: "د.أ",  nameAr: "دينار أردني",   nameEn: "Jordanian Dinar", flag: "🇯🇴", country: "JO", fallback: 0.709 },
  { code: "MAD", symbol: "د.م",  nameAr: "درهم مغربي",    nameEn: "Moroccan Dirham", flag: "🇲🇦", country: "MA", fallback: 10.05 },
  { code: "IQD", symbol: "ع.د",  nameAr: "دينار عراقي",   nameEn: "Iraqi Dinar",     flag: "🇮🇶", country: "IQ", fallback: 1310 },
  { code: "TND", symbol: "د.ت",  nameAr: "دينار تونسي",   nameEn: "Tunisian Dinar",  flag: "🇹🇳", country: "TN", fallback: 3.12 },
  { code: "DZD", symbol: "د.ج",  nameAr: "دينار جزائري",  nameEn: "Algerian Dinar",  flag: "🇩🇿", country: "DZ", fallback: 134.5 },
  { code: "LBP", symbol: "ل.ل",  nameAr: "ليرة لبنانية",  nameEn: "Lebanese Pound",  flag: "🇱🇧", country: "LB", fallback: 89500 },
  { code: "LYD", symbol: "د.ل",  nameAr: "دينار ليبي",    nameEn: "Libyan Dinar",    flag: "🇱🇾", country: "LY", fallback: 4.85 },
  { code: "SDG", symbol: "ج.س",  nameAr: "جنيه سوداني",   nameEn: "Sudanese Pound",  flag: "🇸🇩", country: "SD", fallback: 601 },
  { code: "YER", symbol: "ر.ي",  nameAr: "ريال يمني",     nameEn: "Yemeni Rial",     flag: "🇾🇪", country: "YE", fallback: 250 },
  { code: "SYP", symbol: "ل.س",  nameAr: "ليرة سورية",    nameEn: "Syrian Pound",    flag: "🇸🇾", country: "SY", fallback: 13000 },
  { code: "ILS", symbol: "₪",    nameAr: "شيكل",          nameEn: "Israeli Shekel",  flag: "🇵🇸", country: "PS", fallback: 3.6 },
  { code: "USD", symbol: "$",    nameAr: "دولار أمريكي",  nameEn: "US Dollar",       flag: "💵", country: "US", fallback: 1 },
];

export default function CurrencySwitcher({ compact = false }: { compact?: boolean }) {
  const loc = useLocation();
  const setCurrency = useSetCurrency();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rates, setRates] = useState<Record<string, number>>({});
  const ref = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  /* Lock body scroll on mobile when open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Fetch live rates once when opened */
  useEffect(() => {
    if (!open || Object.keys(rates).length > 0) return;
    fetch("/api/prices?type=currencies")
      .then(r => r.json())
      .then(data => {
        const map: Record<string, number> = {};
        (data.rates || data.currencies || []).forEach((r: { code: string; rate: number }) => {
          map[r.code] = r.rate;
        });
        setRates(map);
      })
      .catch(() => { /* fallback to hardcoded rates */ });
  }, [open, rates]);

  function selectCurrency(c: CurrencyOption) {
    const rate = rates[c.code] || c.fallback;
    const info: LocationInfo = {
      country: c.country,
      currency: c.code,
      currencySymbol: c.symbol,
      currencyName: lang === "ar" ? c.nameAr : c.nameEn,
      flag: c.flag,
      rate: c.code === "USD" ? 1 : rate,
    };
    setCurrency(info);
    setOpen(false);
    setSearch("");
    track.quickLinkClick(`currency-${c.code}`);
  }

  /* Filter currencies based on search */
  const filtered = CURRENCIES.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.nameAr.includes(search) ||
      c.nameEn.toLowerCase().includes(q)
    );
  });

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center gap-2 ${
          compact
            ? "text-xs px-3 py-1.5"
            : "text-xs sm:text-sm px-4 py-2"
        } bg-surface border border-border rounded-full hover:border-gold/40 transition-all w-fit mx-auto group`}
        aria-label={lang === "ar" ? "تغيير العملة" : "Change currency"}
      >
        <span className="text-base">{loc.flag}</span>
        <span className="text-text-secondary">
          {lang === "ar" ? "العملة:" : "Currency:"}
        </span>
        <span className="text-gold font-medium">{loc.currencyName}</span>
        {loc.currency !== "USD" && (
          <span className="text-text-secondary text-xs hidden sm:inline">
            ($1 = {loc.rate >= 1 ? loc.rate.toFixed(2) : loc.rate.toFixed(4)} {loc.currencySymbol})
          </span>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`text-text-secondary group-hover:text-gold transition-all ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Backdrop + Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />

            {/* Dropdown panel — desktop: floating, mobile: bottom sheet */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="
                fixed inset-x-0 bottom-0 sm:absolute sm:inset-x-auto sm:bottom-auto
                sm:top-full sm:mt-2 sm:left-1/2 sm:-translate-x-1/2
                bg-surface border border-border rounded-t-3xl sm:rounded-2xl
                shadow-2xl z-50 w-full sm:w-[400px] max-h-[80vh] sm:max-h-[480px]
                flex flex-col overflow-hidden
              "
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-text-primary font-bold text-base">
                    {lang === "ar" ? "اختر العملة" : "Select Currency"}
                  </h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-text-secondary hover:text-text-primary p-1 transition-colors"
                    aria-label="Close"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={lang === "ar" ? "ابحث عن عملة..." : "Search currency..."}
                    className="w-full bg-surface-2 border border-border text-text-primary text-sm rounded-xl px-4 py-2.5 focus:border-gold/40 outline-none placeholder:text-text-secondary/50"
                    autoFocus={false}
                  />
                </div>
              </div>

              {/* Currency list */}
              <div className="overflow-y-auto flex-1 p-2">
                {filtered.length === 0 ? (
                  <p className="text-text-secondary text-center py-8 text-sm">
                    {lang === "ar" ? "لا توجد عملة بهذا الاسم" : "No matching currency"}
                  </p>
                ) : (
                  filtered.map((c) => {
                    const isActive = c.code === loc.currency;
                    const liveRate = rates[c.code] || c.fallback;
                    return (
                      <button
                        key={c.code}
                        onClick={() => selectCurrency(c)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-start ${
                          isActive
                            ? "bg-gold/10 border border-gold/30"
                            : "hover:bg-surface-2 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{c.flag}</span>
                          <div>
                            <p className={`font-bold text-sm ${isActive ? "text-gold" : "text-text-primary"}`}>
                              {lang === "ar" ? c.nameAr : c.nameEn}
                            </p>
                            <p className="text-text-secondary text-xs">
                              {c.code} {c.code !== "USD" && `• $1 = ${liveRate >= 1 ? liveRate.toFixed(2) : liveRate.toFixed(4)} ${c.symbol}`}
                            </p>
                          </div>
                        </div>
                        {isActive && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gold">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer hint */}
              <div className="p-3 border-t border-border bg-surface-2/50">
                <p className="text-text-secondary text-xs text-center">
                  {lang === "ar"
                    ? "اختيارك سيُحفظ في جميع الصفحات"
                    : "Your selection saves across all pages"}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
