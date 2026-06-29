import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GOLD  = "#C9A84C";
const AZURE = "#229ED9";
const W = 1200;
const H = 628;

type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type CachedFont = { name: string; data: ArrayBuffer; weight: FontWeight; style: "normal" };

let _fonts: CachedFont[] | null = null;
let _logo:  string | null = null;

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

function loadLogo(): string | null {
  if (_logo !== undefined && _logo !== null) return _logo;
  // Prefer SVG → fallback to PNG
  for (const [filename, mime] of [["logo-coin.svg","image/svg+xml"],["logo-coin.png","image/png"]] as const) {
    try {
      const buf = readFileSync(join(process.cwd(), "public", filename));
      _logo = `data:${mime};base64,${buf.toString("base64")}`;
      return _logo;
    } catch { /* try next */ }
  }
  _logo = null;
  return null;
}

// ─── Shared visual elements ────────────────────────────────────────────────────

function BgSvg() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, display: "flex" }}>
      <svg width={W} height={H} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%" r="65%">
            <stop offset="0%"   stopColor="#2a1a00" />
            <stop offset="38%"  stopColor="#180e00" />
            <stop offset="72%"  stopColor="#0a0500" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#bg)" />
      </svg>
    </div>
  );
}

function GradBar({ pos }: { pos: "top" | "bottom" }) {
  const y = pos === "top" ? 0 : H - 57;
  return (
    <div style={{ position: "absolute", top: y, left: 0, display: "flex" }}>
      <svg width={W} height={7} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`bar${pos}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={GOLD} />
            <stop offset="30%"  stopColor="#e8d060" />
            <stop offset="65%"  stopColor={AZURE} />
            <stop offset="100%" stopColor={GOLD} />
          </linearGradient>
        </defs>
        <rect width={W} height={7} fill={`url(#bar${pos})`} />
      </svg>
    </div>
  );
}

function FooterBar({ hashtags }: { hashtags: string }) {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, width: W, height: 50,
      background: "rgba(0,0,0,0.55)", display: "flex",
      alignItems: "center", justifyContent: "space-between", padding: "0 40px",
    }}>
      <div style={{ color: AZURE, fontSize: 19, display: "flex" }}>{hashtags}</div>
      <div style={{ color: GOLD,  fontSize: 21, fontWeight: 700, display: "flex" }}>sardhahab.com</div>
    </div>
  );
}

function CoinLogo({ src }: { src: string | null }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={168} height={168}
      style={{ position: "absolute", top: 92, left: (W - 168) / 2 }}
      alt=""
    />
  );
}

// Content block starts at top=272 (92 logo_top + 168 logo_h + 12 gap)
const CONTENT_TOP = 272;

// ─── Route ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;

  const type    = sp.get("type")    || "morning";
  const gold    = sp.get("gold")    || "3,320";
  const change  = sp.get("change")  || "0.42";
  const dir     = sp.get("dir")     || "up";
  void sp.get("date"); // reserved for future use
  const topic   = sp.get("topic")   || "";
  const rowsRaw = sp.get("rows")    || "";

  const rows = rowsRaw
    ? rowsRaw.split("~").map(r => {
        const p = r.split("|");
        return { name: p[0] || "", val: p[1] || "", cur: p[2] || "" };
      })
    : [];

  // legacy single-country params
  const cname = sp.get("name") || "";
  const cur   = sp.get("cur")  || "";
  const g21   = sp.get("g21")  || "";
  const g24   = sp.get("g24")  || "";
  const g18   = sp.get("g18")  || "";
  const oz    = sp.get("oz")   || "";

  // legacy coin params
  const coinId     = sp.get("coin")       || "";
  const COIN_NAMES: Record<string, string> = { bitcoin: "بيتكوين", ethereum: "إيثيريوم", silver: "الفضة" };
  const COIN_SUBS:  Record<string, string> = { silver:  "المعادن الثمينة" };
  const coinNameAr = sp.get("coinNameAr") || COIN_NAMES[coinId] || coinId;
  const coinPrice  = sp.get("coinPrice")  || "";
  const coinPct    = sp.get("coinPct")    || "0";
  const coinDir    = sp.get("coinDir")    || "up";
  const coinSub    = sp.get("coinSub")    || COIN_SUBS[coinId] || "العملات الرقمية";

  const [fonts, logo] = [loadFonts(), loadLogo()];

  const isUp        = dir === "up";
  const changeColor = isUp ? "#4ade80" : "#f87171";
  const absChange   = Math.abs(parseFloat(change)).toFixed(2);
  const coinUp      = coinDir === "up";

  const fontOpts = fonts.length > 0 ? fonts : undefined;
  const OUTER: React.CSSProperties = {
    width: W, height: H, background: "#000", display: "flex",
    position: "relative", fontFamily: "Tajawal, sans-serif",
  };

  // ── MORNING ──────────────────────────────────────────────────────────────────
  if (type === "morning") {
    // Approximate gram prices from USD spot price
    const ozNum  = parseFloat(gold.replace(/,/g, "")) || 3320;
    const gUSD   = ozNum / 31.1035;
    const saGram = Math.round(gUSD * 3.75).toLocaleString("en");
    const aeGram = Math.round(gUSD * 3.673).toLocaleString("en");
    const egGram = Math.round(gUSD * 51.0).toLocaleString("en");

    const COL_L = 248;   // left (coin)
    const COL_R = 278;   // right (countries)
    const DIV   = 1;     // divider width

    const countryRows = [
      { flag: "🇸🇦", name: "السعودية", val: saGram, cur: "ر.س" },
      { flag: "🇦🇪", name: "الإمارات", val: aeGram, cur: "د.إ" },
      { flag: "🇪🇬", name: "مصر",      val: egGram, cur: "ج"   },
    ];

    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg />
        <GradBar pos="top" />

        {/* ── 3-column horizontal layout ── */}
        <div style={{
          position: "absolute", top: 8, left: 0, right: 0, bottom: 57,
          display: "flex", flexDirection: "row", alignItems: "center",
        }}>

          {/* LEFT: coin logo */}
          <div style={{
            width: COL_L, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} width={158} height={158} alt="" style={{ display: "flex" }} />
            )}
          </div>

          {/* divider */}
          <div style={{ width: DIV, height: 290, background: "#3a2808", display: "flex", flexShrink: 0 }} />

          {/* CENTER: price + badge */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ color: GOLD, fontSize: 98, fontWeight: 900, display: "flex", lineHeight: 1 }}>
              ${gold}
            </div>
            <div style={{ color: "#5a4a2a", fontSize: 20, display: "flex", marginTop: 8 }}>
              سعر الأوقية العالمي · الذهب عيار 24
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginTop: 18,
              padding: "10px 36px",
              background: isUp ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
              border: `2px solid ${isUp ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
              borderRadius: 40, color: changeColor, fontSize: 28, fontWeight: 700,
            }}>
              <span style={{ display: "flex" }}>{isUp ? "▲" : "▼"}</span>
              <span style={{ display: "flex" }}>{isUp ? `+${absChange}%` : `-${absChange}%`}</span>
              <span style={{ display: "flex" }}>اليوم</span>
            </div>
          </div>

          {/* divider */}
          <div style={{ width: DIV, height: 290, background: "#3a2808", display: "flex", flexShrink: 0 }} />

          {/* RIGHT: country prices — right-aligned with safe padding */}
          <div style={{
            width: COL_R, flexShrink: 0,
            display: "flex", flexDirection: "column",
            alignItems: "flex-end", justifyContent: "center",
            paddingRight: 38,
          }}>
            {countryRows.map((c, i) => (
              <div key={i} style={{
                display: "flex", flexDirection: "column", alignItems: "flex-end",
                marginBottom: i < countryRows.length - 1 ? 22 : 0,
              }}>
                <div style={{ color: "#5a4a2a", fontSize: 17, display: "flex" }}>
                  {c.flag} {c.name}
                </div>
                <div style={{ color: GOLD, fontSize: 26, fontWeight: 900, display: "flex" }}>
                  {c.val} {c.cur}
                </div>
              </div>
            ))}
          </div>

        </div>

        <GradBar pos="bottom" />
        <FooterBar hashtags="#سعر_الذهب #الذهب #GoldPrice" />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── EDUCATIONAL ───────────────────────────────────────────────────────────────
  if (type === "educational") {
    const displayTopic = topic || "البيتكوين مقابل الذهب";
    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg />
        <GradBar pos="top" />
        <CoinLogo src={logo} />

        <div style={{ position: "absolute", top: CONTENT_TOP, left: 80, right: 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ color: AZURE, fontSize: 22, display: "flex" }}>
            تعليم مالي · يوليو 2026
          </div>
          <div style={{ color: "#fff", fontSize: 48, fontWeight: 900, textAlign: "center", lineHeight: 1.35, marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", direction: "rtl" }}>
            <span style={{ display: "flex" }}>{displayTopic}</span>
          </div>
        </div>

        <GradBar pos="bottom" />
        <FooterBar hashtags="#تعليم_مالي #الذهب" />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── ENGAGEMENT (country prices) ────────────────────────────────────────────
  if (type === "engagement") {
    const defaultRows = [
      { name: "السعودية", val: "403",   cur: "ر.س" },
      { name: "الإمارات", val: "458",   cur: "د.إ" },
      { name: "مصر",      val: "5,220", cur: "ج"   },
      { name: "الكويت",  val: "96",    cur: "د.ك" },
    ];
    const displayRows = rows.length >= 4 ? rows : defaultRows;

    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg />
        <GradBar pos="top" />
        <CoinLogo src={logo} />

        <div style={{ position: "absolute", top: CONTENT_TOP, left: 0, width: W, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ color: "#fff", fontSize: 28, fontWeight: 900, display: "flex", direction: "rtl" }}>
            سعر غرام الذهب عيار 24 — اليوم
          </div>
          <div style={{ display: "flex", flexDirection: "row-reverse", gap: 48, marginTop: 22 }}>
            {displayRows.slice(0, 4).map((r, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ color: "#5a4a2a", fontSize: 18, display: "flex" }}>{r.name}</div>
                <div style={{ color: GOLD, fontSize: 28, fontWeight: 900, display: "flex" }}>
                  {r.val} {r.cur}
                </div>
              </div>
            ))}
          </div>
        </div>

        <GradBar pos="bottom" />
        <FooterBar hashtags="#سعر_الذهب #الوطن_العربي" />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── BREAKING ─────────────────────────────────────────────────────────────────
  if (type === "breaking") {
    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg />
        <GradBar pos="top" />
        <CoinLogo src={logo} />

        <div style={{ position: "absolute", top: CONTENT_TOP, left: 0, width: W, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ padding: "8px 32px", background: "rgba(239,68,68,0.12)", border: "2px solid rgba(239,68,68,0.35)", borderRadius: 12, color: "#f87171", fontSize: 22, fontWeight: 700, display: "flex" }}>
            خبر عاجل
          </div>
          <div style={{ color: changeColor, fontSize: 96, fontWeight: 900, lineHeight: 1, marginTop: 16, display: "flex" }}>
            {isUp ? "▲" : "▼"} {absChange}%
          </div>
          <div style={{ color: "#fff", fontSize: 72, fontWeight: 900, marginTop: 8, display: "flex" }}>
            ${gold}
          </div>
        </div>

        <GradBar pos="bottom" />
        <FooterBar hashtags="#سعر_الذهب #عاجل" />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── COUNTRY single ────────────────────────────────────────────────────────────
  if (type === "country") {
    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg />
        <GradBar pos="top" />
        <CoinLogo src={logo} />

        <div style={{ position: "absolute", top: CONTENT_TOP, left: 0, width: W, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ color: "#fff", fontSize: 52, fontWeight: 900 }}>{cname}</div>
          <div style={{ display: "flex", flexDirection: "column", width: "80%", marginTop: 24, border: "1px solid #1c1c1c", borderRadius: 16, overflow: "hidden" }}>
            {([["غرام 21", g21], ["غرام 24", g24], ["غرام 18", g18], ["أوقية", oz]] as [string, string][])
              .filter(r => r[1])
              .map(([label, val], i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 36px", borderBottom: i < arr.length - 1 ? "1px solid #111" : "none" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ color: "#fff", fontSize: 40, fontWeight: 900 }}>{val}</span>
                    <span style={{ color: "#555", fontSize: 20 }}>{cur}</span>
                  </div>
                  <div style={{ color: "#666", fontSize: 22 }}>{label}</div>
                </div>
              ))}
          </div>
        </div>

        <GradBar pos="bottom" />
        <FooterBar hashtags="#سعر_الذهب" />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── COIN (BTC / ETH / Silver) ─────────────────────────────────────────────
  if (type === "coin") {
    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg />
        <GradBar pos="top" />
        <CoinLogo src={logo} />

        <div style={{ position: "absolute", top: CONTENT_TOP, left: 0, width: W, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ color: AZURE, fontSize: 20, display: "flex" }}>{coinSub}</div>
          <div style={{ color: GOLD, fontSize: 52, fontWeight: 900, direction: "rtl", display: "flex" }}>{coinNameAr}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 12 }}>
            <span style={{ color: "#fff", fontSize: 56, fontWeight: 900 }}>$</span>
            <span style={{ color: "#fff", fontSize: 80, fontWeight: 900 }}>{coinPrice}</span>
          </div>
          <div style={{
            marginTop: 20, padding: "10px 40px",
            background: coinUp ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
            border: `2px solid ${coinUp ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
            borderRadius: 40, color: coinUp ? "#4ade80" : "#f87171",
            fontSize: 26, fontWeight: 700, display: "flex",
          }}>
            {coinUp ? "+" : "-"}{coinPct}%
          </div>
        </div>

        <GradBar pos="bottom" />
        <FooterBar hashtags={`#${coinId} #الذهب`} />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── CTA ──────────────────────────────────────────────────────────────────────
  if (type === "cta") {
    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg />
        <GradBar pos="top" />
        <CoinLogo src={logo} />

        <div style={{ position: "absolute", top: CONTENT_TOP, left: 80, right: 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ color: GOLD, fontSize: 44, fontWeight: 900, textAlign: "center", lineHeight: 1.35, direction: "rtl", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            أسعار لحظية · ١٩ دولة عربية
          </div>
          <div style={{ width: 60, height: 2, background: GOLD, marginTop: 28, marginBottom: 28, display: "flex" }} />
          <div style={{ color: "#666", fontSize: 22, textAlign: "center", lineHeight: 1.9, direction: "rtl", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            السعودية · الإمارات · مصر · الكويت · قطر · البحرين · عُمان · الأردن
          </div>
        </div>

        <GradBar pos="bottom" />
        <FooterBar hashtags="#سعر_الذهب #الوطن_العربي" />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── DEFAULT fallback: morning ─────────────────────────────────────────────
  return new ImageResponse((
    <div style={OUTER}>
      <BgSvg />
      <GradBar pos="top" />
      <CoinLogo src={logo} />
      <div style={{ position: "absolute", top: CONTENT_TOP, left: 0, width: W, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: GOLD, fontSize: 96, fontWeight: 900, display: "flex" }}>${gold}</div>
      </div>
      <GradBar pos="bottom" />
      <FooterBar hashtags="#سعر_الذهب" />
    </div>
  ), { width: W, height: H, fonts: fontOpts });
}
