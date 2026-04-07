"use client";

import { useLang } from "@/components/LanguageContext";

export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  const { lang, t } = useLang();

  if (compact) {
    return (
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="bg-surface-2 border border-border rounded-xl px-4 py-3 text-xs text-text-secondary"
      >
        ⚠️ {t.disclaimerShort}
      </div>
    );
  }

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="bg-surface border border-gold/20 rounded-2xl p-5 my-6"
    >
      <div className="flex items-start gap-3">
        <span className="text-gold text-xl mt-0.5">⚠️</span>
        <div>
          <h3 className="text-gold font-bold mb-2">{t.disclaimerTitle}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {t.disclaimerFull}
          </p>
        </div>
      </div>
    </div>
  );
}
