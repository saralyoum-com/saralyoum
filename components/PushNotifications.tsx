"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageContext";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OneSignalDeferred?: any[];
  }
}

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";

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

export function PushSubscribeButton() {
  const { lang } = useLang();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!ONESIGNAL_APP_ID) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    // Safety timeout — unstick loading after 8s if OneSignal never responds
    const timeout = setTimeout(() => setLoading(false), 8000);
    try {
      if (window.OneSignalDeferred) {
        window.OneSignalDeferred.push(async (OneSignal: {
          Notifications: { requestPermission: () => Promise<void>; permission: boolean };
          User: { PushSubscription: { optIn: () => Promise<void>; optedIn: boolean } };
        }) => {
          // v16: requestPermission triggers the native browser dialog
          await OneSignal.Notifications.requestPermission();
          if (OneSignal.Notifications.permission) {
            await OneSignal.User.PushSubscription.optIn();
          }
          setSubscribed(OneSignal.User.PushSubscription.optedIn);
          clearTimeout(timeout);
          setLoading(false);
        });
      } else {
        clearTimeout(timeout);
        setLoading(false);
      }
    } catch {
      clearTimeout(timeout);
      setLoading(false);
    }
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
