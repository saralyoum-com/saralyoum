"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "";

// مكون إعلان AdSense قابل لإعادة الاستخدام
export default function AdSense({
  slot,
  format = "auto",
  fullWidth = true,
  className = "",
}: {
  slot: string;
  format?: string;
  fullWidth?: boolean;
  className?: string;
}) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!ADSENSE_ID || !slot) return;
    try {
      ((window as unknown as Record<string, unknown[]>).adsbygoogle =
        (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
    } catch {}
  }, [slot]);

  if (!ADSENSE_ID || !slot) return null;

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidth ? "true" : "false"}
      />
    </div>
  );
}

// تحميل سكريبت AdSense مرة واحدة
export function AdSenseScript() {
  if (!ADSENSE_ID) return null;
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}
