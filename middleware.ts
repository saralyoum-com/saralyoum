import { NextRequest, NextResponse } from "next/server";

/**
 * Edge Middleware — Arabic URL routing
 *
 * Problem: next.config.mjs rewrites use Arabic strings compiled on macOS (NFD encoding).
 * Vercel/Linux normalises incoming URLs to NFC, so the rewrite source never matches
 * → Google gets 404 for all Arabic country slugs.
 *
 * Solution: Middleware runs at the Edge, decodes the raw percent-encoded pathname,
 * normalises it to NFC, then looks it up in the slug map and rewrites internally.
 * The browser/crawler URL stays Arabic (pretty), content is served from /gold/[code].
 */

// Arabic slug → ASCII route code
const COUNTRY_SLUGS: Record<string, string> = {
  "سعر-الذهب-السعودية": "sa",
  "سعر-الذهب-الامارات":  "ae",
  "سعر-الذهب-الكويت":   "kw",
  "سعر-الذهب-قطر":      "qa",
  "سعر-الذهب-البحرين":  "bh",
  "سعر-الذهب-عمان":     "om",
  "سعر-الذهب-مصر":      "eg",
  "سعر-الذهب-الاردن":   "jo",
  "سعر-الذهب-المغرب":   "ma",
  "سعر-الذهب-العراق":   "iq",
  "سعر-الذهب-ليبيا":    "ly",
  "سعر-الذهب-تونس":     "tn",
  "سعر-الذهب-الجزائر":  "dz",
  "سعر-الذهب-اليمن":    "ye",
  "سعر-الذهب-السودان":  "sd",
  "سعر-الذهب-لبنان":    "lb",
};

// Arabic slug → ASCII page path (non-country pages)
const OTHER_SLUGS: Record<string, string> = {
  "زكاة-الكريبتو": "/zakat-crypto",
};

export function middleware(request: NextRequest) {
  const raw = request.nextUrl.pathname;

  // Decode percent-encoding then normalise to NFC
  // (handles both NFD from macOS builds and NFC from browsers/crawlers)
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw).normalize("NFC");
  } catch {
    return NextResponse.next();
  }

  // Strip leading slash to get the slug
  const slug = decoded.startsWith("/") ? decoded.slice(1) : decoded;

  // Country pages → /gold/[code]
  const code = COUNTRY_SLUGS[slug];
  if (code) {
    const url = request.nextUrl.clone();
    url.pathname = `/gold/${code}`;
    return NextResponse.rewrite(url);
  }

  // Other Arabic pages → ASCII route
  const target = OTHER_SLUGS[slug];
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|gold/|zakat-crypto|.*\\.(?:png|jpg|svg|ico|webp|css|js)).*)",
  ],
};
