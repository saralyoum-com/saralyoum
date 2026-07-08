"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageContext";

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
        promptOptions: {
          slidedown: {
            prompts: [
              {
                type: "push",
                autoPrompt: true,
                text: {
                  actionMessage: "اشترك لتلقّي تنبيهات أسعار الذهب فوراً",
                  acceptButton: "اشترك",
                  cancelButton: "لاحقاً",
                },
                delay: { pageViews: 1, timeDelay: 5 },
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
