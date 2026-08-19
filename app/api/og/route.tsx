import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";

// Node runtime so the Tajawal .ttf files and the static fallback can be read
// off disk — the Edge runtime cannot, which is part of why the earlier dynamic
// attempt failed.
export const runtime = "nodejs";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  "Content-Type": "image/png",
};

const GOLD = "#C9A84C";
const BG   = "#09090F";
const RISE = "#22C55E";
const FALL = "#EF4444";
const W = 1200;
const H = 630;

// Crawlers (WhatsApp, X, Telegram) give an OG image a short budget and show
// nothing at all if it is missed. A previous version of this route rendered
// nothing dynamic *at all* because of exactly that, so the price fetch is on a
// hard leash and every failure path falls back to the static card rather than
// making the crawler wait.
// Measured: gold is ~0.6s warm but ~2.6s on a cold lambda (GoldAPI, then the
// Yahoo fallback). 2.5s made every cold hit fall back to the static card for no
// reason. 4s still leaves plenty of head-room inside crawler budgets, and the
// CDN (s-maxage 24h) means cold hits are rare anyway.
const PRICE_TIMEOUT_MS = 4000;

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

function staticCard(): NextResponse {
  const buf = readFileSync(join(process.cwd(), "public", "og-image.png"));
  return new NextResponse(buf as unknown as BodyInit, { headers: CACHE_HEADERS });
}

const ASSETS: Record<string, { label: string; unit: string; fetch: () => Promise<{ price: number; changePercent: number }> }> = {
  gold:     { label: "سعر الذهب",      unit: "للأونصة", fetch: getGoldPrice },
  silver:   { label: "سعر الفضة",      unit: "للأونصة", fetch: getSilverPrice },
  bitcoin:  { label: "سعر البيتكوين",  unit: "دولار",   fetch: () => getCryptoPrice("bitcoin") },
  ethereum: { label: "سعر الإيثيريوم", unit: "دولار",   fetch: () => getCryptoPrice("ethereum") },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = (searchParams.get("asset") || "gold").toLowerCase();
  const cfg = ASSETS[key] ?? ASSETS.gold;

  const fonts = loadFonts();
  // Without the Arabic face every label renders as blank boxes, which is worse
  // than the static card. Bail out rather than ship a broken image.
  if (fonts.length === 0) {
    try { return staticCard(); } catch { /* fall through to render */ }
  }

  let price: number | null = null;
  let changePct = 0;
  try {
    const data = await Promise.race([
      cfg.fetch(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("price timeout")), PRICE_TIMEOUT_MS)),
    ]);
    if (data && Number.isFinite(data.price)) {
      price = data.price;
      changePct = Number.isFinite(data.changePercent) ? data.changePercent : 0;
    }
  } catch {
    price = null;
  }

  // A card with no number is just the old generic artwork, so serve the real
  // static file instead of a half-rendered dynamic one.
  if (price === null) {
    try { return staticCard(); } catch { /* fall through */ }
  }

  // Always two decimals. maximumFractionDigits alone drops the trailing zero and
  // renders gold as "$4,410.1", which reads as a truncated number on a card whose
  // entire job is to look like a precise price.
  const priceStr = `$${(price ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })}`;
  // ASCII +/- only: the arrow glyphs (▲ ▼) are not in Tajawal and render as
  // empty boxes in Satori — a real bug we already hit on the share cards.
  const up = changePct >= 0;
  const changeStr = `${up ? "+" : "-"}${Math.abs(changePct).toFixed(2)}%`;
  const logo = loadLogo();

  try {
    return new ImageResponse(
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
          {logo ? <img src={logo} width={104} height={104} alt="" /> : null}

          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#FFFFFF", marginTop: 18 }}>
            {cfg.label}
          </div>

          <div style={{ display: "flex", fontSize: 116, fontWeight: 900, color: GOLD, marginTop: 6 }}>
            {priceStr}
          </div>

          {/* Arabic word + Latin-ish number in one run gets mis-ordered by
              Satori (no bidi), so unit and change are separate flex children
              laid out right-to-left explicitly on the CONTAINER only. */}
          <div style={{ display: "flex", flexDirection: "row-reverse", alignItems: "center", gap: 18, marginTop: 10 }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>
              {cfg.unit}
            </div>
            <div style={{
              display: "flex", fontSize: 30, fontWeight: 900,
              color: up ? RISE : FALL,
              background: up ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
              padding: "6px 20px", borderRadius: 10,
            }}>
              {changeStr}
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: GOLD, position: "absolute", bottom: 44 }}>
            sardhahab.com
          </div>
        </div>
      ),
      { width: W, height: H, fonts: fonts.length ? fonts : undefined, headers: CACHE_HEADERS },
    );
  } catch {
    // Anything at all goes wrong in rendering — still hand the crawler an image.
    return staticCard();
  }
}
