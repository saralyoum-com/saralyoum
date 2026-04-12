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
                autoPrompt: false,
                text: {
                  actionMessage: "اشترك لتلقّي تنبيهات أسعار الذهب فوراً",
                  acceptButton: "اشترك",
                  cancelButton: "لاحقاً",
                },
                delay: { pageViews: 2, timeDelay: 10 },
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
    try {
      if (window.OneSignalDeferred) {
        window.OneSignalDeferred.push(async (OneSignal: { User: { PushSubscription: { optIn: () => Promise<void>; optedIn: boolean } } }) => {
          await OneSignal.User.PushSubscription.optIn();
          setSubscribed(OneSignal.User.PushSubscription.optedIn);
          setLoading(false);
        });
      }
    } catch {
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
