"use client";

import { useEffect } from "react";

const PUB_ID = "ca-pub-6286580154921898";

export type AdSize = "leaderboard" | "rectangle" | "mobile-banner" | "responsive";

const SIZE_MAP: Record<AdSize, { width: number | string; height: number; label: string; className?: string }> = {
  leaderboard: { width: 728, height: 90, label: "728×90", className: "hidden md:block" },
  rectangle: { width: 300, height: 250, label: "300×250" },
  "mobile-banner": { width: 320, height: 50, label: "320×50", className: "md:hidden" },
  responsive: { width: "100%", height: 90, label: "إعلان" },
};

interface AdSlotProps {
  size: AdSize;
  slot?: string;
  className?: string;
}

const isProduction = process.env.NODE_ENV === "production";

export default function AdSlot({ size, slot = "0000000000", className = "" }: AdSlotProps) {
  const config = SIZE_MAP[size];

  useEffect(() => {
    if (!isProduction) return;
    try {
      ((window as unknown as Record<string, unknown[]>).adsbygoogle =
        (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
    } catch {
      // ignore
    }
  }, [slot]);

  const wrapperStyle: React.CSSProperties =
    size === "responsive"
      ? { width: "100%", minHeight: config.height }
      : { width: config.width, height: config.height, maxWidth: "100%" };

  if (isProduction) {
    return (
      <div className={`flex justify-center ${config.className ?? ""} ${className}`}>
        <div style={wrapperStyle}>
          <ins
            className="adsbygoogle"
            style={
              size === "responsive"
                ? { display: "block", width: "100%", minHeight: config.height }
                : { display: "inline-block", width: config.width, height: config.height }
            }
            data-ad-client={PUB_ID}
            data-ad-slot={slot}
            data-ad-format={size === "responsive" ? "auto" : undefined}
            data-full-width-responsive={size === "responsive" ? "true" : undefined}
          />
        </div>
      </div>
    );
  }

  // Placeholder in dev / non-production
  return (
    <div className={`flex justify-center ${config.className ?? ""} ${className}`}>
      <div
        style={wrapperStyle}
        className="bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center rounded text-gray-400 dark:text-gray-500 text-xs font-medium select-none"
      >
        إعلان — {config.label}
      </div>
    </div>
  );
}
