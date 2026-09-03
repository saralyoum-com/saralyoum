/**
 * Unified analytics dispatcher (Move 1)
 * One call → three destinations: GA4, Amplitude, and our own Supabase events
 * table (via /api/collect). Call sites are unchanged — every existing track.*
 * method now triple-writes automatically because trackEvent() fans out.
 *
 * Usage: import { track } from "@/lib/analytics"
 *        track.navClick("Home")
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    amplitude?: { track?: (event: string, props?: Record<string, unknown>) => void };
    __gaClientId?: string;
    __sardConsent?: boolean;
  }
}

const GA_ID = "G-2EFBVGR83R";

type GaParams = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
};

/**
 * Consent gate. Defaults to allowed (first-party, PII-free collection). When a
 * Consent Mode v2 banner is added for EEA/UK visitors, set window.__sardConsent
 * = false before consent is granted to suppress the owned + Amplitude sinks.
 * GA4 itself is governed separately by Google Consent Mode.
 */
function consentGranted(): boolean {
  return typeof window === "undefined" ? false : window.__sardConsent !== false;
}

/** Cache the GA client_id so owned events reconcile with GA4 / Amplitude. */
function getClientId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  if (window.__gaClientId) return window.__gaClientId;
  if (typeof window.gtag === "function") {
    try {
      window.gtag("get", GA_ID, "client_id", (id: string) => {
        if (id) window.__gaClientId = id;
      });
    } catch {
      /* gtag not ready yet — next call picks it up */
    }
  }
  return window.__gaClientId;
}

/** Stable per-tab session id, used to stitch a visit's events together. */
function getSessionId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    let sid = sessionStorage.getItem("sard_sid");
    if (!sid) {
      sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("sard_sid", sid);
    }
    return sid;
  } catch {
    return undefined;
  }
}

/** Sink 3: our own Supabase events table. Fire-and-forget, never throws. */
function sendToOwned(event: string, params?: GaParams) {
  if (typeof window === "undefined" || !consentGranted()) return;
  try {
    const payload = JSON.stringify({
      event,
      props: params ?? {},
      client_id: getClientId() ?? null,
      session_id: getSessionId() ?? null,
      page_path: window.location?.pathname ?? null, // pathname only, no query string
      lang: document?.documentElement?.lang || null,
    });
    // sendBeacon survives page unloads and dodges ad-blockers (first-party URL).
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/collect", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/collect", { method: "POST", body: payload, keepalive: true }).catch(() => {});
    }
  } catch {
    /* analytics must never break UX */
  }
}

/** Sink 2: Amplitude. No-op until the SDK is loaded (free-tier, added later). */
function sendToAmplitude(event: string, params?: GaParams) {
  if (typeof window === "undefined" || !consentGranted()) return;
  try {
    window.amplitude?.track?.(event, params as Record<string, unknown>);
  } catch {
    /* no-op */
  }
}

export function trackEvent(action: string, params?: GaParams) {
  // Sink 1: GA4 (unchanged behaviour).
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
  // Sinks 2 + 3: fan out. Guarded + swallowed so they can never break sink 1.
  sendToAmplitude(action, params);
  sendToOwned(action, params);
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

  /* ── Phase-1 taxonomy: the funnel + retention events ───────────────────────
     Named object_action, snake_case, typed. These are the events the Amplitude
     funnels and cohorts in the growth plan are built on. All flow to GA4 +
     Amplitude + Supabase automatically via trackEvent(). */

  // Fire from the OneSignal permission-granted callback, NOT the button click,
  // so it only counts real subscribers. The single most valuable site event.
  pushSubscribeCompleted: (p: {
    prompt_location: "pre_permission_card" | "price_card_bell" | "navbar" | "inline";
    page_type: string;
    country_code?: string;
    sessions_before_subscribe?: number;
  }) => trackEvent("push_subscribe_completed", { event_category: "Retention", ...p }),

  // Fire when the pre-permission value card (Move 2) is shown / accepted / dismissed.
  subscribePromptShown: (p: { prompt_location: string; page_type: string }) =>
    trackEvent("subscribe_prompt_shown", { event_category: "Retention", ...p }),
  subscribePromptResult: (p: { prompt_location: string; result: "accepted" | "dismissed" | "denied" }) =>
    trackEvent("subscribe_prompt_result", { event_category: "Retention", ...p }),

  // Debounce ~2s after the last calculator input change before firing.
  calculatorUsed: (p: {
    karat: number;
    weight_grams: number;
    currency: string;
    result_value_band?: string;
  }) => trackEvent("calculator_used", { event_category: "Engagement", ...p }),

  // Crypto ↔ fiat converter. Kept separate from calculatorUsed on purpose:
  // mixing them would corrupt the gold calculator's karat/weight analysis.
  cryptoConverterUsed: (p: { symbol: string; currency: string }) =>
    trackEvent("crypto_converter_used", { event_category: "Engagement", ...p }),

  // Fire on the 200 response from /api/alerts (also mirrored server-side).
  priceAlertCreated: (p: {
    asset: "gold" | "silver" | "bitcoin" | "ethereum";
    alert_type: "daily" | "price";
    target_delta_pct?: number;
    user_currency?: string;
  }) => trackEvent("price_alert_created", { event_category: "Activation", ...p }),

  // Portfolio — the deepest retention hook.
  portfolioAssetAdded: (p: {
    asset: string;
    portfolio_size_after: number;
    is_first_asset: boolean;
  }) => trackEvent("portfolio_asset_added", { event_category: "Retention", ...p }),

  // Price table entering the viewport ≥5s — funnel step 2.
  priceTableViewed: (p: { page_type: string; country_code?: string }) =>
    trackEvent("price_table_viewed", { event_category: "Funnel", ...p }),

  // Fire on the 200 response from /api/contact — the revenue pipeline.
  partnershipLeadSubmitted: (p: { inquiry_type?: string; referrer_page?: string; lang: string }) =>
    trackEvent("partnership_lead_submitted", { event_category: "Revenue", ...p }),
};
