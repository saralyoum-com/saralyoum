"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OneSignalDeferred?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OneSignal?: any;
  }
}

const ONESIGNAL_APP_ID = (process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "").trim();

export function OneSignalInit() {
  useEffect(() => {
    if (!ONESIGNAL_APP_ID) return;

    // Load OneSignal SDK
    const script = document.createElement("script");
    script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    script.defer = true;
    document.head.appendChild(script);

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal: { init: (config: object) => Promise<void> }) {
      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        safari_web_id: "",
        notifyButton: { enable: false },
        // No auto slidedown: the PrePermissionCard is the only soft prompt.
        // The old autoPrompt (1 pageview + 5s) fired the native permission
        // dialog on cold visitors and drove instant denials — a denial is
        // permanent per browser profile, so every early prompt burns a
        // potential subscriber forever.
        promptOptions: {
          slidedown: {
            prompts: [
              {
                type: "push",
                autoPrompt: false,
                text: {
                  actionMessage: "اشترك لتلقّي تنبيهات أسعار الذهب فوراً",
                  acceptButton: "اشترك",
                  cancelButton: "لاحقاً",
                },
              },
            ],
          },
        },
      });
    });

    return () => { document.head.removeChild(script); };
  }, []);

  return null;
}

type OneSignalSDK = {
  Notifications: { requestPermission: () => Promise<void>; permission: boolean };
  User: { PushSubscription: { optIn: () => Promise<void>; optedIn: boolean } };
};

// Shared subscribe flow — used by the full alerts-page button and the compact
// bell on the gold price card. Resolves true/false once the flow settles (or
// times out); never throws.
export function subscribeToPush(): Promise<boolean> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 8000);

    const doSubscribe = async (OS: OneSignalSDK) => {
      try {
        await OS.Notifications.requestPermission();
        if (OS.Notifications.permission) {
          await OS.User.PushSubscription.optIn();
        }
        clearTimeout(timeout);
        resolve(OS.User.PushSubscription.optedIn);
      } catch {
        clearTimeout(timeout);
        resolve(false);
      }
    };

    if (window.OneSignal) {
      doSubscribe(window.OneSignal);
    } else if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push(doSubscribe);
    } else {
      clearTimeout(timeout);
      resolve(false);
    }
  });
}

export function isSubscribedToPush(): boolean {
  return !!window.OneSignal?.User?.PushSubscription?.optedIn;
}

// Best-effort OneSignal tag write (queued if the SDK hasn't loaded yet)
function setOneSignalTags(tags: Record<string, string>) {
  try {
    const apply = (OS: { User: { addTags: (t: Record<string, string>) => void } }) => OS.User.addTags(tags);
    if (window.OneSignal) apply(window.OneSignal);
    else if (window.OneSignalDeferred) window.OneSignalDeferred.push(apply);
  } catch { /* noop */ }
}

// Per-user price-threshold alert: "notify me when gold goes above/below X".
// The target is stored as OneSignal tags (alert_price / alert_dir) on the
// subscriber; the price-alert cron reads tags server-side, pushes when the
// condition hits, then clears the tags (one-shot). localStorage mirrors the
// pending alert so the UI shows it across visits.
export function PriceThresholdAlert({ currentPriceUSD }: { currentPriceUSD?: number }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [price, setPrice] = useState("");
  const [dirn, setDirn] = useState<"above" | "below">("above");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [active, setActive] = useState<{ price: string; dir: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("push_threshold");
      if (raw) setActive(JSON.parse(raw));
    } catch { /* noop */ }
  }, []);

  if (!ONESIGNAL_APP_ID) return null;

  async function saveAlert() {
    const p = parseFloat(price);
    if (!p || p <= 0) return;
    setState("saving");
    const ok = await subscribeToPush();
    if (!ok) { setState("idle"); return; }
    setOneSignalTags({ alert_price: String(p), alert_dir: dirn });
    const entry = { price: String(p), dir: dirn };
    try { localStorage.setItem("push_threshold", JSON.stringify(entry)); } catch { /* noop */ }
    setActive(entry);
    setState("saved");
    setPrice("");
    track.quickLinkClick(`push-threshold-${dirn}`);
    setTimeout(() => setState("idle"), 2000);
  }

  function clearAlert() {
    setOneSignalTags({ alert_price: "", alert_dir: "" });
    try { localStorage.removeItem("push_threshold"); } catch { /* noop */ }
    setActive(null);
  }

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="bg-surface border border-border rounded-2xl p-4 sm:p-5">
      <p className="font-bold text-text-primary text-sm mb-1">
        🎯 {isAr ? "نبهني عند سعر محدد" : "Alert me at a target price"}
      </p>
      <p className="text-text-secondary text-xs mb-3">
        {isAr
          ? `إشعار فوري على جهازك عندما يصل الذهب لسعرك${currentPriceUSD ? ` — السعر الآن $${Math.round(currentPriceUSD).toLocaleString("en-US")}` : ""}`
          : `Instant push when gold hits your target${currentPriceUSD ? ` — now $${Math.round(currentPriceUSD).toLocaleString("en-US")}` : ""}`}
      </p>

      {active ? (
        <div className="flex items-center justify-between gap-3 bg-gold/5 border border-gold/20 rounded-xl px-3.5 py-2.5">
          <p className="text-sm text-text-primary">
            {isAr
              ? `⏳ تنبيه نشط: عندما ${active.dir === "above" ? "يتجاوز" : "ينخفض عن"} $${(+active.price).toLocaleString("en-US")}`
              : `⏳ Active: when gold goes ${active.dir === "above" ? "above" : "below"} $${(+active.price).toLocaleString("en-US")}`}
          </p>
          <button onClick={clearAlert} className="text-text-secondary hover:text-fall text-xs shrink-0 transition-colors">
            {isAr ? "إلغاء" : "Cancel"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={dirn}
            onChange={(e) => setDirn(e.target.value as "above" | "below")}
            className="bg-surface-2 border border-border text-text-primary text-sm rounded-xl px-3 py-2.5 focus:border-gold/40 outline-none"
          >
            <option value="above">{isAr ? "عندما يتجاوز" : "Goes above"}</option>
            <option value="below">{isAr ? "عندما ينخفض عن" : "Drops below"}</option>
          </select>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={isAr ? "السعر بالدولار — مثال: 4100" : "USD price — e.g. 4100"}
            dir="ltr"
            min="1"
            className="flex-1 bg-surface-2 border border-border text-text-primary text-sm rounded-xl px-3 py-2.5 focus:border-gold/40 outline-none placeholder:text-text-secondary/50"
          />
          <button
            onClick={saveAlert}
            disabled={state === "saving" || !price}
            className="bg-gold text-background font-bold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-colors text-sm disabled:opacity-40"
          >
            {state === "saving" ? "..." : state === "saved" ? "✅" : isAr ? "فعّل" : "Set"}
          </button>
        </div>
      )}
      <p className="text-[11px] text-text-secondary mt-2">
        {isAr
          ? "يُفحص السعر دورياً — التنبيه يُرسل مرة واحدة ثم يمكنك ضبط هدف جديد"
          : "Price is checked periodically — the alert fires once, then you can set a new target"}
      </p>
    </div>
  );
}

export function PushSubscribeButton() {
  const { lang } = useLang();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!ONESIGNAL_APP_ID) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    const ok = await subscribeToPush();
    setSubscribed(ok);
    setLoading(false);
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 text-rise text-sm font-medium">
        <span>✅</span>
        <span>{lang === "ar" ? "مشترك في التنبيهات الفورية" : "Subscribed to push alerts"}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="flex items-center gap-2 bg-surface border border-border hover:border-gold/50 text-text-secondary hover:text-text-primary px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
    >
      🔔 {loading
        ? (lang === "ar" ? "جاري التفعيل..." : "Subscribing...")
        : (lang === "ar" ? "تنبيهات فورية على المتصفح" : "Browser push alerts")}
    </button>
  );
}

// iOS only allows web push from a home-screen (PWA) install. Show iPhone-Safari
// users how to enable it instead of leaving them with a bell that can't work.
export function IosInstallNotice() {
  const { lang } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isIOS = /iphone|ipad|ipod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setShow(isIOS && !standalone);
  }, []);

  if (!show) return null;

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="bg-surface border border-gold/30 rounded-2xl p-4 sm:p-5 mb-6">
      <div className="flex items-center gap-2 text-gold font-bold text-sm mb-2">
        📲 {lang === "ar" ? "لتفعيل التنبيهات على iPhone" : "Enable notifications on iPhone"}
      </div>
      <ul className="text-text-secondary text-xs sm:text-sm leading-relaxed space-y-1">
        <li>{lang === "ar" ? "1. اضغط زر المشاركة في Safari ⬆️" : "1. Tap the Share button in Safari ⬆️"}</li>
        <li>{lang === "ar" ? "2. اختر «إضافة إلى الشاشة الرئيسية»" : "2. Choose “Add to Home Screen”"}</li>
        <li>{lang === "ar" ? "3. افتح الموقع من الأيقونة الجديدة" : "3. Open the site from the new icon"}</li>
        <li>{lang === "ar" ? "4. اضغط 🔔 ثم اسمح بالتنبيهات" : "4. Tap 🔔 then Allow notifications"}</li>
      </ul>
      <p className="text-text-secondary/60 text-[11px] mt-2 pt-2 border-t border-border">
        {lang === "ar" ? "خطوة يفرضها نظام iPhone لتفعيل تنبيهات الويب — أندرويد يعمل مباشرة." : "Required by iOS for web push — Android works directly."}
      </p>
    </div>
  );
}
