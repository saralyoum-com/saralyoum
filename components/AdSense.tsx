"use client";

import Script from "next/script";
import { useEffect } from "react";

const PUB_ID = "ca-pub-6286580154921898";

// سكريبت Auto Ads — يُضاف في layout مرة واحدة
// Google تضع الإعلانات تلقائياً في أفضل المواضع
export function AdSenseScript() {
  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

// إعلان يدوي في موضع محدد (اختياري — Auto Ads تغني عنه)
export default function AdSense({
  slot,
  format = "auto",
  className = "",
}: {
  slot: string;
  format?: string;
  className?: string;
}) {
  useEffect(() => {
    try {
      ((window as unknown as Record<string, unknown[]>).adsbygoogle =
        (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
    } catch {}
  }, [slot]);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
