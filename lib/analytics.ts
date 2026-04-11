/**
 * Google Analytics 4 – typed event tracking
 * Usage: import { track } from "@/lib/analytics"
 *        track.navClick("Home")
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type GaParams = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
};

export function trackEvent(action: string, params?: GaParams) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
}

export const track = {
  /* ── Navigation ────────────────────────── */
  navClick: (label: string) =>
    trackEvent("nav_click", { event_category: "Navigation", event_label: label }),
  logoClick: () =>
    trackEvent("logo_click", { event_category: "Navigation", event_label: "Logo" }),
  languageToggle: (to: string) =>
    trackEvent("language_toggle", { event_category: "Settings", event_label: to }),
  mobileMenuOpen: () =>
    trackEvent("mobile_menu_open", { event_category: "Navigation" }),
  mobileMenuClose: () =>
    trackEvent("mobile_menu_close", { event_category: "Navigation" }),
  subscribeHeaderClick: () =>
    trackEvent("subscribe_header_click", { event_category: "Navigation" }),

  /* ── Home Page ─────────────────────────── */
  ctaClick: () =>
    trackEvent("cta_click", { event_category: "Home", event_label: "Subscribe CTA" }),
  quickLinkClick: (label: string) =>
    trackEvent("quick_link_click", { event_category: "Home", event_label: label }),
  homeNewsClick: (source: string, title: string) =>
    trackEvent("home_news_click", { event_category: "Home", event_label: source, article_title: title }),
  homeViewAllNews: () =>
    trackEvent("home_view_all_news", { event_category: "Home" }),

  /* ── Price Cards ───────────────────────── */
  priceCardView: (symbol: string) =>
    trackEvent("price_card_view", { event_category: "Price Card", event_label: symbol }),
  viewKaratsOpen: (symbol: string) =>
    trackEvent("view_karats_open", { event_category: "Price Card", event_label: symbol }),
  viewKaratsClose: (symbol: string) =>
    trackEvent("view_karats_close", { event_category: "Price Card", event_label: symbol }),

  /* ── Prices Page ───────────────────────── */
  pricesTabClick: (tab: string) =>
    trackEvent("prices_tab_click", { event_category: "Prices Page", event_label: tab }),
  currencyGroupFilter: (group: string) =>
    trackEvent("currency_group_filter", { event_category: "Currencies", event_label: group }),
  currencyConverterInput: (amount: number) =>
    trackEvent("currency_converter_input", { event_category: "Currencies", value: amount }),

  /* ── Gold Calculator ───────────────────── */
  calcKaratSelect: (karat: number) =>
    trackEvent("calc_karat_select", { event_category: "Calculator", event_label: String(karat), value: karat }),
  calcWeightInput: (grams: number) =>
    trackEvent("calc_weight_input", { event_category: "Calculator", value: grams }),
  calcResult: (totalUSD: number) =>
    trackEvent("calc_result", { event_category: "Calculator", value: Math.round(totalUSD) }),
  zakatKaratSelect: (karat: number) =>
    trackEvent("zakat_karat_select", { event_category: "Zakat", event_label: String(karat) }),
  zakatResult: (reached: boolean, amountUSD: number) =>
    trackEvent("zakat_result", {
      event_category: "Zakat",
      event_label: reached ? "nisab_reached" : "below_nisab",
      value: Math.round(amountUSD),
    }),

  /* ── News Page ─────────────────────────── */
  newsArticleClick: (source: string, title: string) =>
    trackEvent("news_article_click", { event_category: "News", event_label: source, article_title: title }),
  newsSourceFilter: (source: string) =>
    trackEvent("news_source_filter", { event_category: "News", event_label: source }),
  newsLangSwitch: (lang: string) =>
    trackEvent("news_lang_switch", { event_category: "News", event_label: lang }),

  /* ── Alerts / Subscribe ────────────────── */
  alertAssetToggle: (asset: string, selected: boolean) =>
    trackEvent("alert_asset_toggle", {
      event_category: "Alerts",
      event_label: asset,
      value: selected ? 1 : 0,
    }),
  alertTypeSelect: (type: "daily" | "price") =>
    trackEvent("alert_type_select", { event_category: "Alerts", event_label: type }),
  alertConditionSelect: (condition: "above" | "below") =>
    trackEvent("alert_condition_select", { event_category: "Alerts", event_label: condition }),
  alertFormSubmit: (success: boolean, assets: string[]) =>
    trackEvent("alert_form_submit", {
      event_category: "Alerts",
      event_label: success ? "success" : "error",
      assets_selected: assets.join(","),
    }),
};
