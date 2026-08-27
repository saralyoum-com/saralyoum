import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Node runtime so the Tajawal .ttf files and the static fallback can be read
// off disk — the Edge runtime cannot, which is part of why the earlier dynamic
// attempt failed.
export const runtime = "nodejs";

// The card carries no price any more, so nothing in it can go stale and it is
// cheap to cache hard. This is also why the price fetch, its 4s timeout and the
// whole fallback-on-slow-API path are gone: the render no longer depends on a
// network call, so a crawler can never catch a half-built card.
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
  "Content-Type": "image/png",
};

const GOLD = "#C9A84C";
const BG   = "#09090F";
const W = 1200;
const H = 630;

type FontWeight = 700 | 900;
type CachedFont = { name: string; data: ArrayBuffer; weight: FontWeight; style: "normal" };

let _fonts: CachedFont[] | null = null;
function loadFonts(): CachedFont[] {
  if (_fonts) return _fonts;
  try {
    const bold  = readFileSync(join(process.cwd(), "public", "fonts", "Tajawal-Bold.ttf"));
    const xbold = readFileSync(join(process.cwd(), "public", "fonts", "Tajawal-ExtraBold.ttf"));
    _fonts = [
      { name: "Tajawal", data: bold.buffer  as ArrayBuffer, weight: 700, style: "normal" },
      { name: "Tajawal", data: xbold.buffer as ArrayBuffer, weight: 900, style: "normal" },
    ];
  } catch { _fonts = []; }
  return _fonts;
}

let _logo: string | null | undefined;
function loadLogo(): string {
  if (_logo !== undefined) return _logo || "";
  try {
    const buf = readFileSync(join(process.cwd(), "public", "share-coin.png"));
    _logo = `data:image/png;base64,${buf.toString("base64")}`;
  } catch { _logo = null; }
  return _logo || "";
}

// Satori implements no Unicode bidi algorithm at the layout level, and the
// Arabic here hit two separate consequences of that. Both were measured off the
// rendered PNG rather than reasoned about:
//
//  1. Word order and spacing. With a plain U+0020 Satori breaks the string into
//     one run per word, lays those runs out left to right in logical order, and
//     over-measures each run's advance. "سعر الذهب" therefore rendered as
//     "الذهب سعر" with the words 122px apart where a space is ~11px — and the
//     gap varied per label (gold 0, silver 54, ethereum 90, bitcoin 122).
//     Joining the words with a no-break space keeps the whole line as ONE run,
//     and the shaper then orders it right-to-left correctly at natural spacing.
//
//     Do NOT also reverse the word order to "fix" the order: that was tried, and
//     because the single run is already shaped right-to-left it double-flips
//     straight back to "الذهب سعر". Verified by measuring cluster widths —
//     "سعر" is narrower than "الذهب", so whichever is rightmost tells you the
//     true order regardless of how the image reads at a glance. The share-card
//     route's per-word row-reverse split was also tried here and measured no
//     better than a plain space.
//
//  2. Centring. The single run is still measured wider than its ink and all the
//     slack lands on one side, so a centred line sits left of centre by an
//     amount specific to the string (measured: gold 12, silver 40, ethereum 68,
//     bitcoin 80, tagline 57). AR_NUDGE corrects that. A centred flex item
//     shifts right by half its margin-left, so each value is twice the measured
//     offset. Keyed by the string itself because the offset is a property of the
//     glyph run: a new or edited line needs its own measured entry, and 0 — no
//     correction — is the safe default until it has one.
const AR_NBSP = " ";

function arLine(text: string): string {
  return text.trim().split(/\s+/).join(AR_NBSP);
}

const TAGLINE = "أسعار لحظية للذهب والفضة والعملات الرقمية";

const AR_NUDGE: Record<string, number> = {
  "سعر الذهب": 24,
  "سعر الفضة": 80,
  "سعر البيتكوين": 160,
  "سعر الإيثيريوم": 136,
  [TAGLINE]: 114,
};

function staticCard(): NextResponse {
  const buf = readFileSync(join(process.cwd(), "public", "og-image.png"));
  return new NextResponse(buf as unknown as BodyInit, { headers: CACHE_HEADERS });
}

const LABELS: Record<string, string> = {
  gold:     "سعر الذهب",
  silver:   "سعر الفضة",
  bitcoin:  "سعر البيتكوين",
  ethereum: "سعر الإيثيريوم",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = (searchParams.get("asset") || "gold").toLowerCase();
  const label = LABELS[key] ?? LABELS.gold;

  const fonts = loadFonts();
  // Without the Arabic face every label renders as blank boxes, which is worse
  // than the static card. Bail out rather than ship a broken image.
  if (fonts.length === 0) {
    try { return staticCard(); } catch { /* fall through to render */ }
  }

  const logo = loadLogo();

  try {
    const img = new ImageResponse(
      (
        <div
          style={{
            width: W, height: H, background: BG, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            fontFamily: "Tajawal", position: "relative",
          }}
        >
          {/* No radial glow here: Satori does not implement radial-gradient, so
              a translucent circle renders as a hard-edged disc that reads as a
              rendering fault rather than a design. A thin gold rule gives the
              card structure without anything Satori has to approximate. */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: W, height: 6,
            background: GOLD, display: "flex",
          }} />

          {/* eslint-disable-next-line @next/next/no-img-element -- Satori, not next/image */}
          {logo ? <img src={logo} width={188} height={188} alt="" /> : null}

          <div style={{
            display: "flex", fontSize: 60, fontWeight: 900, color: "#FFFFFF",
            marginTop: 26, marginLeft: AR_NUDGE[label] ?? 0,
          }}>
            {arLine(label)}
          </div>

          <div style={{
            display: "flex", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.50)",
            marginTop: 16, marginLeft: AR_NUDGE[TAGLINE] ?? 0,
          }}>
            {arLine(TAGLINE)}
          </div>

          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: GOLD, position: "absolute", bottom: 44 }}>
            sardhahab.com
          </div>
        </div>
      ),
      { width: W, height: H, fonts: fonts.length ? fonts : undefined },
    );
    // ImageResponse stamps its own `Cache-Control: public, immutable,
    // no-transform, max-age=31536000` on the way out, and the `headers` option
    // APPENDS to that instead of replacing it. The response therefore shipped
    // two directives — a one-year immutable one followed by our one-hour one —
    // and caches and social crawlers honour the first they parse. That is why
    // the card froze on whatever price it happened to be rendered with, and why
    // Content-Type came back as "image/png, image/png".
    //
    // Rebuilding the response from the rendered body is the only way to get
    // exactly one of each header: a Response constructed here carries only what
    // we put on it.
    return new NextResponse(img.body, { headers: CACHE_HEADERS });
  } catch {
    // Anything at all goes wrong in rendering — still hand the crawler an image.
    return staticCard();
  }
}
