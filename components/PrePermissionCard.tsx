"use client";

/**
 * Pre-permission push card (Move 2).
 *
 * Replaces OneSignal's auto slidedown as the ONLY soft prompt: explains the
 * value in the user's language BEFORE the native browser permission prompt,
 * which only fires after an explicit "فعّل التنبيهات" tap. Replay data showed
 * most denials happen within a second of the native prompt — users reject the
 * interruption, not the value.
 *
 * Eligibility (all checks synchronous, evaluated before first paint so the
 * card never pops in and never causes CLS):
 *  - Notification API exists and permission is "default" (not granted/denied)
 *  - Not iOS Safari outside a home-screen install (web push impossible there)
 *  - 2nd price-page view or later (localStorage counter)
 *  - Not snoozed ("لاحقا" hides it for 7 days) and never completed
 */

import { useLayoutEffect, useState } from "react";
import { useLang } from "@/components/LanguageContext";
import { subscribeToPush } from "@/components/PushNotifications";
import { track } from "@/lib/analytics";

const VIEWS_KEY = "sard_price_views";
const SNOOZE_KEY = "sard_pp_snooze_until";
const DONE_KEY = "sard_pp_done";
const SNOOZE_DAYS = 7;
const MIN_VIEWS = 2;

// One count per pathname per SPA session — guards against StrictMode's dev
// double-effect and against remounts (e.g. language toggle) inflating views.
const countedPaths = new Set<string>();

interface Props {
  pageType: string;          // e.g. "country_gold"
  countryCode?: string;      // e.g. "sa"
  countryNameAr?: string;    // e.g. "السعودية" — used in the headline
  countryNameEn?: string;
}

function isIosWithoutPwa(): boolean {
  const ua = navigator.userAgent || "";
  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return isIOS && !standalone;
}

export default function PrePermissionCard({ pageType, countryCode, countryNameAr, countryNameEn }: Props) {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "blocked">("idle");
  const [views, setViews] = useState(0);

  useLayoutEffect(() => {
    try {
      // Count every price-page view, even ones where the card won't show —
      // the counter doubles as sessions_before_subscribe in analytics.
      let count = parseInt(localStorage.getItem(VIEWS_KEY) || "0", 10) || 0;
      if (!countedPaths.has(window.location.pathname)) {
        countedPaths.add(window.location.pathname);
        count += 1;
        localStorage.setItem(VIEWS_KEY, String(count));
      }
      setViews(count);

      // Dev-only visual QA hook (?pp_debug=1 skips environment gates).
      // The NODE_ENV comparison is constant-folded in production builds, so
      // this branch is dead-code-eliminated and unreachable on the live site.
      const debug =
        process.env.NODE_ENV !== "production" &&
        window.location.search.includes("pp_debug=1");

      if (!debug) {
        if (!(process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "").trim()) return;
        if (typeof Notification === "undefined") return;
        if (Notification.permission !== "default") return; // already granted or hard-blocked
        if (isIosWithoutPwa()) return;                      // web push impossible → don't burn goodwill
        if (localStorage.getItem(DONE_KEY)) return;
        const snoozedUntil = parseInt(localStorage.getItem(SNOOZE_KEY) || "0", 10);
        if (snoozedUntil > Date.now()) return;
        if (count < MIN_VIEWS) return;
      }

      setVisible(true);
      track.subscribePromptShown({ prompt_location: "pre_permission_card", page_type: pageType });
    } catch {
      /* private mode / storage blocked — just never show */
    }
    // Intentionally mount-only: one increment + one decision per page view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const dir = lang === "ar" ? "rtl" : "ltr";
  const place = lang === "ar" ? (countryNameAr ? ` في ${countryNameAr}` : "") : (countryNameEn ? ` in ${countryNameEn}` : "");

  const handleAccept = async () => {
    setState("loading");
    track.subscribePromptResult({ prompt_location: "pre_permission_card", result: "accepted" });
    const ok = await subscribeToPush();
    if (ok) {
      try { localStorage.setItem(DONE_KEY, "1"); } catch { /* ignore */ }
      setState("done");
      track.pushSubscribeCompleted({
        prompt_location: "pre_permission_card",
        page_type: pageType,
        country_code: countryCode?.toUpperCase(),
        sessions_before_subscribe: views,
      });
      setTimeout(() => setVisible(false), 4000);
    } else if (typeof Notification !== "undefined" && Notification.permission === "denied") {
      setState("blocked");
      track.subscribePromptResult({ prompt_location: "pre_permission_card", result: "denied" });
      setTimeout(() => setVisible(false), 5000);
    } else {
      // SDK timeout / transient failure — reset so the user can retry.
      setState("idle");
    }
  };

  const handleLater = () => {
    try { localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 864e5)); } catch { /* ignore */ }
    track.subscribePromptResult({ prompt_location: "pre_permission_card", result: "dismissed" });
    setVisible(false);
  };

  if (state === "done") {
    return (
      <div dir={dir} className="bg-surface-2 border border-rise/40 rounded-2xl p-4 mb-6 animate-fade-in">
        <p className="text-rise text-sm font-bold">
          ✅ {lang === "ar" ? "تم تفعيل التنبيهات — ستصلك عند تغير السعر" : "Alerts enabled — we'll notify you on price changes"}
        </p>
      </div>
    );
  }

  if (state === "blocked") {
    return (
      <div dir={dir} className="bg-surface-2 border border-border rounded-2xl p-4 mb-6 animate-fade-in">
        <p className="text-text-secondary text-sm">
          {lang === "ar"
            ? "التنبيهات محظورة من إعدادات المتصفح — يمكنك تفعيلها من إعدادات الموقع في متصفحك"
            : "Notifications are blocked in your browser — enable them from your browser's site settings"}
        </p>
      </div>
    );
  }

  return (
    <div dir={dir} className="pp-shimmer mb-6 animate-slide-up">
    <div className="pp-shimmer-inner bg-surface-2 border border-gold/40 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0 animate-glow-gold">
          <span className="text-lg" aria-hidden>🔔</span>
        </div>
        <div>
          <p className="text-text-primary text-sm sm:text-base font-bold leading-snug">
            {lang === "ar" ? `نُنبهك فور تغير سعر الذهب${place}` : `Get notified when the gold price changes${place}`}
          </p>
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mt-0.5">
            {lang === "ar"
              ? "تنبيه واحد يوميا كحد أقصى — مجانا وبدون بريد إلكتروني"
              : "At most one alert per day — free, no email needed"}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleAccept}
          disabled={state === "loading"}
          className="flex-1 bg-gold hover:bg-gold-light text-background font-bold text-sm py-2.5 rounded-xl transition-colors disabled:opacity-60"
        >
          {state === "loading"
            ? (lang === "ar" ? "جاري التفعيل..." : "Enabling...")
            : (lang === "ar" ? "فعّل التنبيهات" : "Enable alerts")}
        </button>
        <button
          onClick={handleLater}
          className="border border-border text-text-secondary hover:text-text-primary text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          {lang === "ar" ? "لاحقا" : "Later"}
        </button>
      </div>
    </div>
    </div>
  );
}
