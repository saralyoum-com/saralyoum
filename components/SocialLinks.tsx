"use client";

import { useLang } from "@/components/LanguageContext";
import { track } from "@/lib/analytics";

// Single source of truth for SARD's social accounts — used by both the home
// page CTA and the footer so the two rows can never drift apart.
// `brand`/`fg`/`shadow` drive the hover colouring via CSS custom properties
// (see `.social-brand` in globals.css).
export interface Social {
  label: string;
  labelAr: string;
  href: string;
  path: string;
  brand: string;
  fg: string;
  shadow: string;
}

export const SOCIALS: Social[] = [
  {
    label: "Telegram", labelAr: "تيليجرام",
    href: "https://t.me/sardhahab",
    brand: "#229ED9", fg: "#ffffff", shadow: "rgba(34,158,217,0.40)",
    path: "M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.27 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z",
  },
  {
    label: "X", labelAr: "إكس",
    href: "https://x.com/sardhahab",
    brand: "#ffffff", fg: "#000000", shadow: "rgba(255,255,255,0.24)",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Instagram", labelAr: "إنستجرام",
    href: "https://www.instagram.com/sardhahab",
    brand: "#E4405F", fg: "#ffffff", shadow: "rgba(228,64,95,0.40)",
    path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
  },
  {
    label: "TikTok", labelAr: "تيك توك",
    href: "https://www.tiktok.com/@sardhahab",
    brand: "#000000", fg: "#00F2EA", shadow: "rgba(0,242,234,0.30)",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
  {
    label: "Facebook", labelAr: "فيسبوك",
    href: "https://www.facebook.com/profile.php?id=61591348885569",
    brand: "#1877F2", fg: "#ffffff", shadow: "rgba(24,119,242,0.40)",
    path: "M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z",
  },
  {
    label: "LinkedIn", labelAr: "لينكدإن",
    href: "https://www.linkedin.com/company/sardhahab",
    brand: "#0A66C2", fg: "#ffffff", shadow: "rgba(10,102,194,0.40)",
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  },
];

interface Props {
  /** md = home CTA (44px), sm = footer (40px) */
  size?: "md" | "sm";
  className?: string;
}

export default function SocialIconRow({ size = "md", className = "" }: Props) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const dim = size === "md" ? "w-11 h-11" : "w-10 h-10";
  const iconPx = size === "md" ? 19 : 17;

  return (
    <div className={`flex gap-2.5 ${className}`}>
      {SOCIALS.map((s, i) => (
        // Entrance animation lives on the wrapper so the hover rule can cancel
        // the gold glow without also cancelling the fade-in.
        <span
          key={s.label}
          className="social-rise inline-flex"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isAr ? s.labelAr : s.label}
            title={isAr ? s.labelAr : s.label}
            onClick={() => track.quickLinkClick(`social-${s.label}`)}
            className={`social-glow social-brand ${dim} rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center`}
            style={{
              animationDelay: `${i * 0.4}s`,
              ["--brand" as string]: s.brand,
              ["--brand-fg" as string]: s.fg,
              ["--brand-shadow" as string]: s.shadow,
            }}
          >
            <svg width={iconPx} height={iconPx} viewBox="0 0 24 24" fill="currentColor">
              <path d={s.path} />
            </svg>
          </a>
        </span>
      ))}
    </div>
  );
}
