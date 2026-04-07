"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Lang } from "@/lib/i18n";

type AnyTranslations = typeof translations.ar | typeof translations.en;

interface LangContextValue {
  lang: Lang;
  t: AnyTranslations;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "ar",
  t: translations.ar,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "ar" || stored === "en") {
      setLang(stored);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (lang === "en") {
      html.setAttribute("lang", "en");
      html.setAttribute("dir", "ltr");
    } else {
      html.setAttribute("lang", "ar");
      html.setAttribute("dir", "rtl");
    }
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
