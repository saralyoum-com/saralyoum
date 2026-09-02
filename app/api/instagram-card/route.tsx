import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GOLD  = "#C9A84C";
const AZURE = "#229ED9";
const W     = 1080;

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
  for (const [filename, mime] of [["logo-coin.svg", "image/svg+xml"], ["logo-coin.png", "image/png"]] as const) {
    try {
      const buf = readFileSync(join(process.cwd(), "public", filename));
      _logo = `data:${mime};base64,${buf.toString("base64")}`;
      return _logo;
    } catch { /* try next */ }
  }
  _logo = null;
  return null;
}

// ─── Arabic text (Satori has no bidi algorithm) ─────────────────────────────
// Ported from /api/social-card, which solved this the hard way. Satori splits an
// Arabic string on whitespace into one run per word and lays the runs out left
// to right, so "أوقية الذهب بالدولار" renders with its words reversed.
//
// Two tools, and picking the wrong one is the whole bug:
//   ar()     — pure-Arabic strings. Joining with a no-break space keeps the
//              words in a single run so nothing gets reordered.
//   ArLine   — any string that also contains a digit or Latin text. A number
//              inside one Arabic run is misplaced and jams against its
//              neighbour ("عيار 24" comes out "24عيار"), so each token becomes
//              its own span inside a row-reverse flex instead.
const AR_NBSP = "\u00A0";

function ar(text: string): string {
  return text.trim().split(/\s+/).join(AR_NBSP);
}

function ArLine({ text, style, gap }: { text: string; style: React.CSSProperties; gap?: number }) {
  const tokens = text.trim().split(/\s+/);
  const fs = typeof style.fontSize === "number" ? style.fontSize : 24;
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", alignItems: "baseline", gap: gap ?? Math.round(fs * 0.28) }}>
      {tokens.map((tok, i) => <span key={i} style={style}>{tok}</span>)}
    </div>
  );
}

// Tajawal carries no ▲ / ▼ (U+25B2 / U+25BC) and no fallback font is loaded, so
// those characters rendered as an empty tofu box on every change chip. Drawing
// the triangle removes the dependency on glyph coverage entirely.
function Tri({ up, size, color }: { up: boolean; size: number; color: string }) {
  const pts = up ? `0,${size} ${size / 2},0 ${size},${size}` : `0,0 ${size},0 ${size / 2},${size}`;
  return (
    <div style={{ display: "flex" }}>
      <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <polygon points={pts} fill={color} />
      </svg>
    </div>
  );
}


// A headline arrives from the caller and can be any length. ArLine corrects one
// line but cannot wrap — a row-reverse flex row just overflows. So break the
// text into lines on a character budget and correct each line separately.
function ArBlock({ text, style, maxChars = 24 }: { text: string; style: React.CSSProperties; maxChars?: number }) {
  const words = text.trim().split(/\s+/);
  const lines: string[][] = [[]];
  let len = 0;
  for (const w of words) {
    if (len > 0 && len + 1 + w.length > maxChars) { lines.push([]); len = 0; }
    lines[lines.length - 1].push(w);
    len += (len ? 1 : 0) + w.length;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {lines.map((line, i) => <ArLine key={i} text={line.join(" ")} style={style} />)}
    </div>
  );
}

// ─── Shared visual elements (canvas-size-aware) ─────────────────────────────

function BgSvg({ H }: { H: number }) {
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

function GradBar({ pos, H }: { pos: "top" | "bottom"; H: number }) {
  const y = pos === "top" ? 0 : H - 60;
  return (
    <div style={{ position: "absolute", top: y, left: 0, display: "flex" }}>
      <svg width={W} height={8} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`bar${pos}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={GOLD} />
            <stop offset="30%"  stopColor="#e8d060" />
            <stop offset="65%"  stopColor={AZURE} />
            <stop offset="100%" stopColor={GOLD} />
          </linearGradient>
        </defs>
        <rect width={W} height={8} fill={`url(#bar${pos})`} />
      </svg>
    </div>
  );
}

function FooterBar({ hashtags }: { hashtags: string }) {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, width: W, height: 52,
      background: "rgba(0,0,0,0.55)", display: "flex",
      alignItems: "center", justifyContent: "space-between", padding: "0 48px",
    }}>
      <div style={{ color: AZURE, fontSize: 21, display: "flex" }}>{hashtags}</div>
      <div style={{ color: GOLD,  fontSize: 23, fontWeight: 700, display: "flex" }}>sardhahab.com</div>
    </div>
  );
}

function CoinLogo({ src, H }: { src: string | null; H: number }) {
  if (!src) return null;
  const LOGO_SIZE = 200;
  const logoTop   = Math.round(H * 0.07);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      style={{ position: "absolute", top: logoTop, left: (W - LOGO_SIZE) / 2 }}
      alt=""
    />
  );
}

// Content block starts below logo: logoTop + 200 logo_h + 16 gap
function contentTop(H: number): number {
  return Math.round(H * 0.07) + 200 + 16;
}

// ─── Route ──────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;

  // Canvas size
  const ratio = sp.get("ratio") || "square";
  const H     = ratio === "portrait" ? 1350 : 1080;

  // Common params
  const type   = sp.get("type")   || "morning";
  const gold   = sp.get("gold")   || "3,320";
  const change = sp.get("change") || "0.42";
  const dir    = sp.get("dir")    || "up";
  const date   = sp.get("date")   || "";
  const silver = sp.get("silver") || "";
  const btc    = sp.get("btc")    || "";
  const topic  = sp.get("topic")  || "";

  const [fonts, logo] = [loadFonts(), loadLogo()];

  const isUp        = dir === "up";
  const changeColor = isUp ? "#4ade80" : "#f87171";
  const absChange   = Math.abs(parseFloat(change)).toFixed(2);

  const fontOpts = fonts.length > 0 ? fonts : undefined;
  const CT = contentTop(H);

  const OUTER: React.CSSProperties = {
    width: W, height: H, background: "#000", display: "flex",
    position: "relative", fontFamily: "Tajawal, sans-serif",
  };

  // ── MORNING ────────────────────────────────────────────────────────────────
  if (type === "morning") {
    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg H={H} />
        <GradBar pos="top" H={H} />
        <CoinLogo src={logo} H={H} />

        <div style={{
          position: "absolute", top: CT, left: 0, width: W,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          {date && (
            <div style={{ color: "#7a6535", fontSize: 24, marginBottom: 14, display: "flex" }}>
              {date}
            </div>
          )}
          <div style={{ color: GOLD, fontSize: 110, fontWeight: 900, display: "flex", lineHeight: 1 }}>
            ${gold}
          </div>
          <div style={{ color: "#9a8a6a", fontSize: 22, marginTop: 6, display: "flex" }}>
            {ar("أوقية الذهب بالدولار")}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginTop: 24,
            padding: "12px 44px",
            background: isUp ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
            border: `2px solid ${isUp ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
            borderRadius: 48, color: changeColor, fontSize: 34, fontWeight: 700,
          }}>
            <Tri up={isUp} size={24} color={changeColor} />
            <span style={{ display: "flex" }}>{isUp ? `+${absChange}%` : `-${absChange}%`}</span>
            <span style={{ display: "flex" }}>اليوم</span>
          </div>

          {/* Extra price row for portrait — silver + BTC if supplied */}
          {ratio === "portrait" && (silver || btc) && (
            <div style={{
              display: "flex", gap: 60, marginTop: 44,
              padding: "22px 60px",
              border: "1px solid rgba(201,168,76,0.18)",
              borderRadius: 20,
            }}>
              {silver && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ color: "#888", fontSize: 20, display: "flex" }}>الفضة</div>
                  <div style={{ color: "#c0c0c0", fontSize: 38, fontWeight: 900, display: "flex" }}>${silver}</div>
                </div>
              )}
              {btc && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ color: "#888", fontSize: 20, display: "flex" }}>بيتكوين</div>
                  <div style={{ color: GOLD, fontSize: 38, fontWeight: 900, display: "flex" }}>${btc}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <GradBar pos="bottom" H={H} />
        <FooterBar hashtags="#سعر_الذهب #الذهب #GoldPrice" />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── EDUCATIONAL ────────────────────────────────────────────────────────────
  if (type === "educational") {
    const displayTopic = topic || "البيتكوين مقابل الذهب";
    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg H={H} />
        <GradBar pos="top" H={H} />
        <CoinLogo src={logo} H={H} />

        <div style={{
          position: "absolute", top: CT, left: 80, right: 80,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{
            padding: "8px 32px", background: "rgba(34,157,217,0.12)",
            border: "1px solid rgba(34,157,217,0.3)", borderRadius: 12,
            color: AZURE, fontSize: 24, display: "flex",
          }}>
            {ar("تعليم مالي")}
          </div>
          <div style={{
            color: "#fff", fontSize: 58, fontWeight: 900, textAlign: "center",
            lineHeight: 1.4, marginTop: 20, display: "flex",
            flexDirection: "column", alignItems: "center", direction: "rtl",
          }}>
            <ArBlock text={displayTopic} style={{ color: "#fff", fontSize: 58, fontWeight: 900 }} />
          </div>
          <div style={{ width: 72, height: 3, background: GOLD, marginTop: 32, display: "flex" }} />
          <div style={{
            color: "#5a4a2a", fontSize: 26, textAlign: "center",
            lineHeight: 1.7, marginTop: 24, direction: "rtl",
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            <ArLine text="اعرف أكثر · sardhahab.com" style={{ color: "#5a4a2a", fontSize: 26 }} />
          </div>
        </div>

        <GradBar pos="bottom" H={H} />
        <FooterBar hashtags="#تعليم_مالي #الذهب" />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── ENGAGEMENT (multi-country prices) ──────────────────────────────────────
  if (type === "engagement") {
    const defaultRows = [
      { name: "السعودية", val: "403",   cur: "ر.س" },
      { name: "الإمارات", val: "458",   cur: "د.إ" },
      { name: "مصر",      val: "5,220", cur: "ج"   },
      { name: "الكويت",  val: "96",    cur: "د.ك" },
    ];

    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg H={H} />
        <GradBar pos="top" H={H} />
        <CoinLogo src={logo} H={H} />

        <div style={{
          position: "absolute", top: CT, left: 0, width: W,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <ArLine text="سعر غرام الذهب عيار 24" style={{ color: "#fff", fontSize: 34, fontWeight: 900 }} />
          <div style={{ color: "#5a4a2a", fontSize: 22, marginTop: 6, display: "flex" }}>
            {date || "اليوم"}
          </div>
          <div style={{
            display: "flex", flexDirection: "column", width: "85%",
            marginTop: 28, border: "1px solid rgba(201,168,76,0.18)",
            borderRadius: 20, overflow: "hidden",
          }}>
            {defaultRows.map((r, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "22px 44px",
                borderBottom: i < defaultRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ color: GOLD, fontSize: 44, fontWeight: 900, display: "flex" }}>{r.val}</span>
                  <span style={{ color: "#666", fontSize: 24, display: "flex" }}>{r.cur}</span>
                </div>
                <div style={{ color: "#999", fontSize: 26, display: "flex" }}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>

        <GradBar pos="bottom" H={H} />
        <FooterBar hashtags="#سعر_الذهب #الوطن_العربي" />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── BREAKING ───────────────────────────────────────────────────────────────
  if (type === "breaking") {
    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg H={H} />
        <GradBar pos="top" H={H} />
        <CoinLogo src={logo} H={H} />

        <div style={{
          position: "absolute", top: CT, left: 0, width: W,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{
            padding: "10px 36px",
            background: "rgba(239,68,68,0.12)",
            border: "2px solid rgba(239,68,68,0.35)",
            borderRadius: 14, color: "#f87171", fontSize: 28, fontWeight: 700,
            display: "flex",
          }}>
            {ar("خبر عاجل")}
          </div>
          <div style={{ color: changeColor, fontSize: 108, fontWeight: 900, lineHeight: 1, marginTop: 20, display: "flex" }}>
            <Tri up={isUp} size={72} color={changeColor} />
            <span style={{ display: "flex", marginLeft: 16 }}>{absChange}%</span>
          </div>
          <div style={{ color: "#fff", fontSize: 84, fontWeight: 900, marginTop: 8, display: "flex" }}>
            ${gold}
          </div>
          {date && (
            <div style={{ color: "#5a4a2a", fontSize: 22, marginTop: 18, display: "flex" }}>
              {date}
            </div>
          )}
        </div>

        <GradBar pos="bottom" H={H} />
        <FooterBar hashtags="#سعر_الذهب #عاجل" />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── COUNTRY ────────────────────────────────────────────────────────────────
  if (type === "country") {
    const cname = sp.get("name") || "";
    const cur   = sp.get("cur")  || "";
    const g21   = sp.get("g21")  || "";
    const g24   = sp.get("g24")  || "";
    const g18   = sp.get("g18")  || "";
    const oz    = sp.get("oz")   || "";

    return new ImageResponse((
      <div style={OUTER}>
        <BgSvg H={H} />
        <GradBar pos="top" H={H} />
        <CoinLogo src={logo} H={H} />

        <div style={{
          position: "absolute", top: CT, left: 0, width: W,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{ color: "#fff", fontSize: 60, fontWeight: 900, display: "flex" }}>{cname}</div>
          {date && (
            <div style={{ color: "#5a4a2a", fontSize: 22, marginTop: 6, display: "flex" }}>{date}</div>
          )}
          <div style={{
            display: "flex", flexDirection: "column", width: "82%",
            marginTop: 28, border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: 20, overflow: "hidden",
          }}>
            {([ ["عيار 24", g24], ["عيار 21", g21], ["عيار 18", g18], ["أوقية", oz] ] as [string, string][])
              .filter(r => r[1])
              .map(([label, val], i, arr) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "24px 44px",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ color: "#fff", fontSize: 48, fontWeight: 900, display: "flex" }}>{val}</span>
                    <span style={{ color: "#555", fontSize: 24, display: "flex" }}>{cur}</span>
                  </div>
                  <ArLine text={label} style={{ color: "#666", fontSize: 26 }} />
                </div>
              ))}
          </div>
        </div>

        <GradBar pos="bottom" H={H} />
        <FooterBar hashtags="#سعر_الذهب" />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── DEFAULT fallback (morning layout) ──────────────────────────────────────
  return new ImageResponse((
    <div style={OUTER}>
      <BgSvg H={H} />
      <GradBar pos="top" H={H} />
      <CoinLogo src={logo} H={H} />
      <div style={{
        position: "absolute", top: CT, left: 0, width: W,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ color: GOLD, fontSize: 110, fontWeight: 900, display: "flex" }}>${gold}</div>
      </div>
      <GradBar pos="bottom" H={H} />
      <FooterBar hashtags="#سعر_الذهب" />
    </div>
  ), { width: W, height: H, fonts: fontOpts });
}
