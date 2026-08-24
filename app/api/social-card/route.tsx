import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { decodeCardRows, type CardCountryRow } from "@/lib/social";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GOLD  = "#C9A84C";
const AZURE = "#229ED9";
const BG    = "#09090F";
const W     = 1200;
const H     = 628;

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

// SARD coin logo (carries the "SARD · سعر الذهب" brand), embedded as a data URI
// so the ImageResponse renderer has no network dependency. Cached per lambda.
let _logo: string | null | undefined;
function loadLogo(): string {
  if (_logo !== undefined) return _logo || "";
  try {
    const buf = readFileSync(join(process.cwd(), "public", "share-coin.png"));
    _logo = `data:image/png;base64,${buf.toString("base64")}`;
  } catch { _logo = null; }
  return _logo || "";
}

// Shared header/footer for the square (1080) share cards. The logo replaces the
// old "SARD · سعر الذهب" text + badge (mixed Latin+Arabic can't be laid out by
// Satori). Satori has no bidi algorithm, so: (1) leave plain Arabic text spans
// alone — they self-order RTL; NEVER put `direction: "rtl"` on the element that
// holds the text (it breaks inter-word spacing). Use it only on a flex CONTAINER
// arranging child elements. (2) A number inside an Arabic run gets misplaced, so
// render such strings (dates) token-by-token in a `row-reverse` flex.
function SquareHeader({ logo, dateStr }: { logo: string; dateStr: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 46 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori (ImageResponse), not next/image */}
      {logo ? <img src={logo} width={140} height={140} alt="" /> : null}
      {/* Date rendered token-by-token in a row-reverse flex — Satori bids the
          day-number to the wrong side inside a mixed Arabic+number run, which
          swaps "22 يوليو" → "يوليو 22". Per-token ordering keeps it correct. */}
      {dateStr ? (
        <div style={{ display: "flex", flexDirection: "row-reverse", alignItems: "baseline", gap: 10, marginTop: 12 }}>
          {dateStr.trim().split(/\s+/).map((tok, i) => (
            <span key={i} style={{ color: "#7a7a7a", fontSize: 26 }}>{tok}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SquareFooter({ tagline }: { tagline: string }) {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, width: 1080, height: 72, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <span style={{ color: GOLD, fontSize: 26, fontWeight: 700 }}>sardhahab.com</span>
      <span style={{ color: "#555", fontSize: 20 }}>·</span>
      {/* ArLine, not a plain span: the tagline is 4 Arabic words and was
          shipping reversed ("والعملات للذهب لحظية أسعار") on every card. */}
      <ArLine text={tagline} style={{ color: "#555", fontSize: 20 }} />
    </div>
  );
}

// ── Shared decorative elements ─────────────────────────────────────────────────

// Satori (the ImageResponse renderer) scrambles word order when it auto-wraps
// long RTL text across lines — it wraps as if laying out LTR boxes, which
// breaks Arabic reading order at the wrap point. Splitting into explicit,
// single-line segments ourselves avoids Satori's wrap entirely.
function splitBalanced(text: string): [string, string] {
  const words = text.split(" ");
  if (words.length < 2) return [text, ""];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

// Verified (calibration render, isolated tokens): a plain span with 2+
// pure-Arabic-script tokens gets those tokens laid out in naive left-to-right
// box order — "سعر الأونصة الآن" renders as "الآن الأونصة سعر". A single
// Arabic word combined with a digit token ("عيار 24") is NOT affected — this
// only hits 2-or-more same-direction (Arabic) tokens, at any font size (not
// just large hero text). The fix: split on whitespace and render each token
// as its own <span> inside a `flexDirection: "row-reverse"` row, tokens left
// in natural (un-reversed) array order — same technique already proven
// correct for the header's date. Use this for every Arabic string with 2+
// words instead of a single plain span.
// Satori over-measures the advance width of an Arabic run: the visible ink sits
// flush-left inside an over-wide box, so centring the box leaves the text left
// of true centre (measured: بيتكوين −60px, إيثيريوم −46.5, الفضة −32.5,
// محفظتي −30.5). Container-level fixes do NOT help — justifyContent, textAlign,
// direction:rtl, ArLine and font-weight 700 were each tried and all landed on
// the identical offset; only start-edge alignment is accurate. So the box is
// nudged right by 2× the measured offset (a centred box shifts by half its
// added margin). Re-measure if the font or a name changes.
const AR_CENTER_NUDGE: Record<string, number> = {
  "بيتكوين": 120,
  "إيثيريوم": 93,
  "الفضة": 65,
  "محفظتي": 61,
};

function ArLine({ text, style, gap }: { text: string; style: React.CSSProperties; gap?: number }) {
  const tokens = text.trim().split(/\s+/);
  const fs = typeof style.fontSize === "number" ? style.fontSize : 24;
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", alignItems: "baseline", gap: gap ?? Math.round(fs * 0.28) }}>
      {tokens.map((tok, i) => <span key={i} style={style}>{tok}</span>)}
    </div>
  );
}

function GradBar({ yPos }: { yPos: number }) {
  return (
    <div style={{ position: "absolute", top: yPos, left: 0, display: "flex" }}>
      <svg width={W} height={5} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`g${yPos}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={GOLD} />
            <stop offset="28%"  stopColor="#e8d060" />
            <stop offset="62%"  stopColor={AZURE} />
            <stop offset="100%" stopColor={GOLD} />
          </linearGradient>
        </defs>
        <rect width={W} height={5} fill={`url(#g${yPos})`} />
      </svg>
    </div>
  );
}

function Footer({ hash }: { hash: string }) {
  return (
    <div style={{
      position: "absolute", bottom: 5, left: 0, width: W, height: 38,
      background: "rgba(0,0,0,0.28)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 30px",
    }}>
      <div style={{ color: AZURE,  fontSize: 17, display: "flex" }}>{hash}</div>
      <div style={{ color: GOLD, fontSize: 18, fontWeight: 700, display: "flex" }}>@sardhahab</div>
    </div>
  );
}

// ── Morning / Engagement: XAU hero left + 3 country rows right ─────────────────

const LEFT_W = 420;
const RIGHT_W = W - LEFT_W - 1;

// Usable content area: below top bar (5px), above footer+bottom bar (38+5=43px)
const CONTENT_TOP    = 5;
const CONTENT_HEIGHT = H - 5 - 43;
const HEADER_H       = 40;
const ROW_H          = Math.floor((CONTENT_HEIGHT - HEADER_H) / 3);

function MorningCard({ gold, change, dir, rows }: {
  gold: string; change: string; dir: string; rows: CardCountryRow[];
}) {
  const isUp        = dir !== "down";
  const changeColor = isUp ? "#4ade80" : "#f87171";
  const absChange   = Math.abs(parseFloat(change)).toFixed(2);

  return (
    <div style={{
      width: W, height: H, background: BG, display: "flex",
      position: "relative", fontFamily: "Tajawal, sans-serif",
    }}>
      <GradBar yPos={0} />

      {/* Vertical divider */}
      <div style={{
        position: "absolute", top: CONTENT_TOP, left: LEFT_W, width: 1,
        height: CONTENT_HEIGHT, background: "rgba(201,168,76,0.15)", display: "flex",
      }} />

      {/* ── LEFT: XAU hero ── */}
      <div style={{
        position: "absolute", top: CONTENT_TOP, left: 0,
        width: LEFT_W, height: CONTENT_HEIGHT,
        display: "flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "center",
        padding: "0 0 0 38px",
      }}>

        {/* LIVE badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
          padding: "4px 16px",
          background: "rgba(34,197,94,0.10)",
          border: "1px solid rgba(34,197,94,0.30)",
          borderRadius: 30,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "flex", flexShrink: 0 }} />
          <span style={{ color: "#4ade80", fontSize: 17, fontWeight: 700, display: "flex" }}>LIVE</span>
        </div>

        {/* XAU label */}
        <div style={{ color: "rgba(201,168,76,0.35)", fontSize: 16, fontWeight: 700, letterSpacing: 4, display: "flex", marginBottom: 4 }}>
          X A U · أوقية
        </div>

        {/* Big price */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 2, lineHeight: 1 }}>
          <span style={{ color: "rgba(201,168,76,0.5)", fontSize: 34, fontWeight: 700, marginTop: 14, display: "flex" }}>$</span>
          <span style={{ color: GOLD, fontSize: 100, fontWeight: 900, display: "flex", lineHeight: 1, letterSpacing: -2 }}>{gold}</span>
        </div>

        {/* Change badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 18,
          padding: "8px 22px",
          background: isUp ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
          border: `1px solid ${isUp ? "rgba(34,197,94,0.28)" : "rgba(239,68,68,0.28)"}`,
          borderRadius: 30, color: changeColor, fontSize: 22, fontWeight: 700,
        }}>
          <span style={{ display: "flex" }}>{isUp ? `+${absChange}%` : `-${absChange}%`}</span>
          <span style={{ display: "flex" }}>اليوم</span>
        </div>

        {/* Subtitle */}
        <div style={{ color: "rgba(201,168,76,0.22)", fontSize: 16, marginTop: 10, display: "flex", direction: "rtl" }}>
          سعر الذهب عيار 24 · لحظي
        </div>

        {/* Approx note — pushed to bottom */}
        <div style={{ color: "rgba(255,255,255,0.12)", fontSize: 14, marginTop: "auto", paddingTop: 18, display: "flex", direction: "rtl" }}>
          الأسعار تقريبية
        </div>
      </div>

      {/* ── RIGHT: header + 3 country rows ── */}

      {/* Header row */}
      <div style={{
        position: "absolute", top: CONTENT_TOP, left: LEFT_W + 1,
        width: RIGHT_W, height: HEADER_H,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px",
        borderBottom: "0.5px solid rgba(201,168,76,0.12)",
      }}>
        <div style={{ color: "rgba(201,168,76,0.55)", fontSize: 17, fontWeight: 700, display: "flex", direction: "rtl" }}>
          أسعار الذهب عيار 24 / جرام
        </div>
        <div style={{ color: "rgba(255,255,255,0.18)", fontSize: 14, display: "flex", letterSpacing: 1 }}>
          {rows.map(r => r.currency).join(" · ")}
        </div>
      </div>

      {/* Country rows */}
      {rows.slice(0, 3).map((r, i) => (
        <div key={i} style={{
          position: "absolute",
          top: CONTENT_TOP + HEADER_H + i * ROW_H,
          left: LEFT_W + 1, width: RIGHT_W, height: ROW_H,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px", direction: "rtl",
          borderBottom: i < 2 ? "0.5px solid rgba(255,255,255,0.04)" : "none",
        }}>
          {/* Flag + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 36, display: "flex" }}>{r.flag}</span>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 32, fontWeight: 900, display: "flex" }}>{r.name}</span>
          </div>

          {/* Price + currency + change badge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 5 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
              <span style={{ color: GOLD, fontSize: 52, fontWeight: 900, lineHeight: 1, display: "flex" }}>{r.price}</span>
              <span style={{ color: "rgba(201,168,76,0.50)", fontSize: 20, fontWeight: 700, display: "flex" }}>{r.currency}</span>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "3px 12px",
              background: r.up ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
              border: `1px solid ${r.up ? "rgba(34,197,94,0.28)" : "rgba(239,68,68,0.28)"}`,
              borderRadius: 20,
              color: r.up ? "#4ade80" : "#f87171",
              fontSize: 16, fontWeight: 700,
            }}>
              <span style={{ display: "flex" }}>{r.chg}</span>
            </div>
          </div>
        </div>
      ))}

      <Footer hash="#سعر_الذهب #الذهب #GoldPrice" />
      <GradBar yPos={H - 5} />
    </div>
  );
}

// ── Default rows used when ?rows= param is missing ─────────────────────────────

const DEFAULT_ROWS: CardCountryRow[] = [
  { name: "السعودية", flag: "🇸🇦", price: "403",   currency: "ر.س", chg: "+0.42%", up: true  },
  { name: "الإمارات", flag: "🇦🇪", price: "395",   currency: "د.إ", chg: "+0.38%", up: true  },
  { name: "مصر",      flag: "🇪🇬", price: "5,480", currency: "ج.م", chg: "-0.10%", up: false },
];

// ── Route ──────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;

  const type    = sp.get("type")   || "morning";
  const gold    = sp.get("gold")   || "3,320";
  const change  = sp.get("change") || "0.42";
  const dir     = sp.get("dir")    || "up";
  const rowsRaw = sp.get("rows")   || "";
  const topic   = sp.get("topic")  || "";

  // legacy coin params (coin type unchanged)
  const coinId     = sp.get("coin")       || "";
  const COIN_NAMES: Record<string, string> = { bitcoin: "بيتكوين", ethereum: "إيثيريوم", silver: "الفضة" };
  const COIN_SUBS:  Record<string, string> = { silver: "المعادن الثمينة" };
  const coinNameAr = sp.get("coinNameAr") || COIN_NAMES[coinId] || coinId;
  const coinPrice  = sp.get("coinPrice")  || "";
  const coinPct    = sp.get("coinPct")    || "0";
  const coinDir    = sp.get("coinDir")    || "up";
  const coinSub    = sp.get("coinSub")    || COIN_SUBS[coinId] || "العملات الرقمية";

  // legacy country params
  const cname = sp.get("name") || "";
  const cur   = sp.get("cur")  || "";
  const g21   = sp.get("g21")  || "";
  const g24   = sp.get("g24")  || "";
  const g18   = sp.get("g18")  || "";
  const oz    = sp.get("oz")   || "";

  // square "price" share card (user-triggered from the site)
  const sym     = sp.get("sym")     || "$";        // currency symbol
  const curName = sp.get("curName") || "";         // e.g. "بالريال السعودي"
  const dateStr = sp.get("date")    || "";         // localized date from client

  // square "asset" card (silver / bitcoin / ethereum) + "portfolio" card
  const assetName = sp.get("assetName") || "";     // e.g. "الفضة" / "بيتكوين"
  const price     = sp.get("price")     || "";     // pre-formatted price string
  // Asset badge — Latin ticker (Ag / BTC / ETH) rather than the ₿ and Ξ glyphs,
  // which Tajawal does not contain and Satori would render as tofu boxes.
  const badge     = sp.get("badge")     || "";
  const accent    = sp.get("accent")    || GOLD;   // badge background
  const high      = sp.get("high")      || "";     // 24h high, pre-formatted
  const low       = sp.get("low")       || "";     // 24h low, pre-formatted
  const pv        = sp.get("pv")        || "";     // portfolio total value
  const count     = sp.get("count")     || "";     // holdings count label
  const daily     = sp.get("daily")     || "";     // today's abs change
  const dailyPct  = sp.get("dailyPct")  || "0";
  const dailyDir  = sp.get("dailyDir")  || "up";
  const pnl       = sp.get("pnl")       || "";     // profit/loss abs (optional)
  const pnlPct    = sp.get("pnlPct")    || "0";
  const pnlDir    = sp.get("pnlDir")    || "up";

  const rows: CardCountryRow[] = rowsRaw ? decodeCardRows(rowsRaw) : DEFAULT_ROWS;

  const fonts     = loadFonts();
  const fontOpts  = fonts.length > 0 ? fonts : undefined;
  const logo      = loadLogo();

  const isUp        = dir !== "down";
  const changeColor = isUp ? "#4ade80" : "#f87171";
  const absChange   = Math.abs(parseFloat(change)).toFixed(2);
  const coinUp      = coinDir === "up";

  const OUTER: React.CSSProperties = {
    width: W, height: H, background: BG, display: "flex",
    position: "relative", fontFamily: "Tajawal, sans-serif",
  };

  // ── MORNING / ENGAGEMENT: new 2-column design ─────────────────────────────
  if (type === "morning" || type === "engagement") {
    return new ImageResponse(
      <MorningCard gold={gold} change={change} dir={dir} rows={rows} />,
      { width: W, height: H, fonts: fontOpts },
    );
  }

  // ── BREAKING ──────────────────────────────────────────────────────────────
  if (type === "breaking") {
    return new ImageResponse((
      <div style={OUTER}>
        <GradBar yPos={0} />
        <div style={{ position: "absolute", top: 0, left: 0, width: W, height: H, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{
            padding: "8px 28px", background: "rgba(239,68,68,0.12)",
            border: "1.5px solid rgba(239,68,68,0.35)", borderRadius: 12,
            color: "#f87171", fontSize: 26, fontWeight: 700, display: "flex",
          }}>🚨 خبر عاجل</div>
          <div style={{ color: changeColor, fontSize: 120, fontWeight: 900, lineHeight: 1, marginTop: 14, display: "flex" }}>
            {isUp ? "+" : "-"}{absChange}%
          </div>
          <div style={{ color: GOLD, fontSize: 82, fontWeight: 900, marginTop: 6, display: "flex" }}>
            ${gold}
          </div>
        </div>
        <Footer hash="#سعر_الذهب #عاجل" />
        <GradBar yPos={H - 5} />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── EDUCATIONAL ───────────────────────────────────────────────────────────
  if (type === "educational") {
    const displayTopic = topic || "البيتكوين مقابل الذهب";
    const [topicLine1, topicLine2] = splitBalanced(displayTopic);
    return new ImageResponse((
      <div style={OUTER}>
        <GradBar yPos={0} />
        <div style={{ position: "absolute", top: 0, left: 0, width: W, height: H, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 80px" }}>
          <div style={{ color: AZURE, fontSize: 22, display: "flex" }}>تعليم مالي</div>
          <div style={{ color: "#fff", fontSize: 60, fontWeight: 900, marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", direction: "rtl" }}>{topicLine1}</div>
            {topicLine2 && <div style={{ display: "flex", direction: "rtl" }}>{topicLine2}</div>}
          </div>
          <div style={{ color: "rgba(201,168,76,0.28)", fontSize: 20, marginTop: 22, display: "flex" }}>sardhahab.com</div>
        </div>
        <Footer hash="#تعليم_مالي #الذهب" />
        <GradBar yPos={H - 5} />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── COIN (BTC / ETH / Silver) ─────────────────────────────────────────────
  if (type === "coin") {
    return new ImageResponse((
      <div style={OUTER}>
        <GradBar yPos={0} />
        <div style={{ position: "absolute", top: 0, left: 0, width: W, height: H, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ color: AZURE, fontSize: 20, display: "flex" }}>{coinSub}</div>
          <div style={{ color: GOLD, fontSize: 50, fontWeight: 900, direction: "rtl", display: "flex" }}>{coinNameAr}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 12 }}>
            <span style={{ color: "#fff", fontSize: 52, fontWeight: 900 }}>$</span>
            <span style={{ color: "#fff", fontSize: 88, fontWeight: 900 }}>{coinPrice}</span>
          </div>
          <div style={{
            marginTop: 20, padding: "10px 42px",
            background: coinUp ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
            border: `1.5px solid ${coinUp ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
            borderRadius: 40, color: coinUp ? "#4ade80" : "#f87171",
            fontSize: 26, fontWeight: 700, display: "flex",
          }}>
            {coinUp ? "+" : "-"}{coinPct}%
          </div>
        </div>
        <Footer hash={`#${coinId} #الذهب`} />
        <GradBar yPos={H - 5} />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── COUNTRY single ────────────────────────────────────────────────────────
  if (type === "country") {
    return new ImageResponse((
      <div style={OUTER}>
        <GradBar yPos={0} />
        <div style={{ position: "absolute", top: 0, left: 0, width: W, height: H, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ color: "#fff", fontSize: 50, fontWeight: 900 }}>{cname}</div>
          <div style={{ display: "flex", flexDirection: "column", width: "80%", marginTop: 24, border: "1px solid rgba(201,168,76,0.12)", borderRadius: 16, overflow: "hidden" }}>
            {([["غرام 21", g21], ["غرام 24", g24], ["غرام 18", g18], ["أوقية", oz]] as [string, string][])
              .filter(r => r[1])
              .map(([label, val], i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 36px", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ color: "#fff", fontSize: 38, fontWeight: 900 }}>{val}</span>
                    <span style={{ color: "rgba(201,168,76,0.4)", fontSize: 18 }}>{cur}</span>
                  </div>
                  <div style={{ color: "#666", fontSize: 20 }}>{label}</div>
                </div>
              ))}
          </div>
        </div>
        <Footer hash="#سعر_الذهب" />
        <GradBar yPos={H - 5} />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── PRICE: square 1080×1080 share card with local-currency karat prices ────
  if (type === "price") {
    const S = 1080;
    const rows: [string, string, string, "hi" | "star" | "lo"][] = [
      ["عيار 24", g24, "24", "hi"],
      ["عيار 21", g21, "21", "star"],
      ["عيار 18", g18, "18", "lo"],
    ];
    return new ImageResponse((
      <div style={{ width: S, height: S, background: BG, display: "flex", flexDirection: "column", position: "relative", fontFamily: "Tajawal, sans-serif" }}>
        <div style={{ position: "absolute", top: 0, left: 0, display: "flex" }}>
          <svg width={S} height={7} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pbar" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B6914" /><stop offset="28%" stopColor="#F2D98A" />
                <stop offset="62%" stopColor={GOLD} /><stop offset="100%" stopColor="#8B6914" />
              </linearGradient>
            </defs>
            <rect width={S} height={7} fill="url(#pbar)" />
          </svg>
        </div>

        <SquareHeader logo={logo} dateStr={dateStr} />

        {/* Centered body: hero + karat rows fill the space between header and footer */}
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center", paddingBottom: 40 }}>
          {/* Hero price */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ArLine text="سعر الأونصة الآن" style={{ color: "#7a7a7a", fontSize: 26 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6 }}>
              <span style={{ color: "#F5F5F5", fontSize: 92, fontWeight: 900 }}>${gold}</span>
              <span style={{ background: isUp ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)", border: `1px solid ${isUp ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`, color: changeColor, fontSize: 30, fontWeight: 700, padding: "6px 20px", borderRadius: 30, display: "flex" }}>
                {isUp ? "+" : "−"}{absChange}%
              </span>
            </div>
            <ArLine text={curName ? `${curName} · للجرام` : "للجرام"} style={{ color: "#8a6d1f", fontSize: 24, marginTop: 12 }} />
          </div>

          {/* Karat rows */}
          <div style={{ display: "flex", flexDirection: "column", margin: "48px 56px 0", border: "1px solid rgba(201,168,76,0.16)", borderRadius: 22, overflow: "hidden" }}>
            {rows.filter(r => r[1]).map(([label, val, chip, kind], i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "34px 46px", direction: "rtl", background: kind === "hi" ? "rgba(201,168,76,0.06)" : "transparent", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ color: "#F5F5F5", fontSize: 38, fontWeight: 700 }}>{label}</span>
                  <span style={{ background: kind === "hi" ? GOLD : kind === "star" ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)", color: kind === "hi" ? "#0a0a0a" : kind === "star" ? GOLD : "#9a9a9a", fontSize: 22, fontWeight: 800, padding: "4px 14px", borderRadius: 8, display: "flex" }}>{chip}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ color: kind === "hi" ? GOLD : "#F5F5F5", fontSize: 56, fontWeight: 900 }}>{val}</span>
                  <span style={{ color: "rgba(201,168,76,0.5)", fontSize: 28 }}>{sym}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SquareFooter tagline="أسعار لحظية للذهب والعملات" />
      </div>
    ), { width: S, height: S, fonts: fontOpts });
  }

  // ── ASSET / PORTFOLIO: the "gilded frame" layout ───────────────────────────
  // Built around the SARD coin rather than each asset's brand colour: the bright
  // orange/blue fintech treatment fought the gold logo, so gold leads and the
  // asset tint is only a whisper behind the mark.
  if (type === "asset" || type === "portfolio") {
    const S = 1080;
    const isPortfolio = type === "portfolio";
    const dUp = dailyDir !== "down";
    const pUp = pnlDir !== "down";
    const tint = isPortfolio ? GOLD : accent;

    // Gradient hairline that fades out at both ends, echoing the coin's rim.
    const Rule = ({ w, mt, mb }: { w: number; mt: number; mb: number }) => (
      <div style={{
        display: "flex", width: w, height: 1, marginTop: mt, marginBottom: mb,
        background: "linear-gradient(90deg, rgba(201,168,76,0) 0%, rgba(201,168,76,0.55) 50%, rgba(201,168,76,0) 100%)",
      }} />
    );

    const stat = (label: string, value: string, color: string, sub?: string) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, flexBasis: 0 }}>
        <ArLine text={label} style={{ color: "#8a7448", fontSize: 26 }} />
        <span style={{ color, fontSize: 46, fontWeight: 900, marginTop: 8 }}>{value}</span>
        {sub ? <span style={{ color, fontSize: 24, fontWeight: 700, marginTop: 2 }}>{sub}</span> : null}
      </div>
    );

    return new ImageResponse((
      <div style={{
        width: S, height: S, background: "#0B0906", display: "flex",
        flexDirection: "column", position: "relative", fontFamily: "Tajawal, sans-serif",
      }}>
        {/* warm glow so the black reads gold-adjacent, not cold */}
        <div style={{
          position: "absolute", top: 120, left: 0, width: S, height: 620, display: "flex",
          background: `radial-gradient(ellipse at center, ${tint}1A 0%, rgba(11,9,6,0) 68%)`,
        }} />

        {/* double gilded frame */}
        <div style={{ position: "absolute", top: 22, left: 22, width: S - 44, height: S - 44, border: "4px solid rgba(201,168,76,0.50)", borderRadius: 28, display: "flex" }} />
        <div style={{ position: "absolute", top: 38, left: 38, width: S - 76, height: S - 76, border: "2px solid rgba(201,168,76,0.18)", borderRadius: 18, display: "flex" }} />

        {/* Centred between the frame top and the footer so the card reads balanced instead of top-heavy with a dead lower third. */}
        <div style={{ position: "absolute", top: 38, left: 0, width: S, height: 916, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- Satori, not next/image
            <img src={logo} width={168} height={168} alt="" />
          ) : null}

          {dateStr ? (
            <div style={{ display: "flex", flexDirection: "row-reverse", gap: 10, marginTop: 14 }}>
              {dateStr.trim().split(/\s+/).map((tok, i) => (
                <span key={i} style={{ color: "#8a7448", fontSize: 24 }}>{tok}</span>
              ))}
            </div>
          ) : null}

          <Rule w={420} mt={26} mb={26} />

          {isPortfolio ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ color: GOLD, fontSize: 54, fontWeight: 900, marginLeft: AR_CENTER_NUDGE["محفظتي"] }}>محفظتي</span>
              {count ? <ArLine text={count} style={{ color: "#7d6a3f", fontSize: 26, marginTop: 6 }} /> : null}
              <span style={{ color: GOLD, fontSize: 96, fontWeight: 900, marginTop: 22, textShadow: "0 2px 44px rgba(201,168,76,0.40)" }}>
                {sym} {pv}
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ color: GOLD, fontSize: 56, fontWeight: 900, marginLeft: AR_CENTER_NUDGE[assetName] ?? 0 }}>{assetName}</span>
              {badge ? (
                <span style={{ color: "#7d6a3f", fontSize: 24, letterSpacing: 5, marginTop: 6 }}>{badge}</span>
              ) : null}
              <span style={{ color: "#ffffff", fontSize: 112, fontWeight: 900, marginTop: 18, letterSpacing: -2, textShadow: "0 2px 44px rgba(201,168,76,0.30)" }}>
                {sym}{price}
              </span>
              <div style={{
                display: "flex", marginTop: 20, padding: "10px 32px", borderRadius: 40,
                background: isUp ? "rgba(74,222,128,0.13)" : "rgba(248,113,113,0.13)",
                border: `1px solid ${isUp ? "rgba(74,222,128,0.40)" : "rgba(248,113,113,0.40)"}`,
                color: changeColor, fontSize: 30, fontWeight: 800,
              }}>
                <span>{isUp ? "+" : "−"}{absChange}%</span>
                <span style={{ marginRight: 10 }}>اليوم</span>
              </div>
            </div>
          )}

          <Rule w={620} mt={34} mb={26} />

          {/* bottom stats */}
          {isPortfolio ? (
            <div style={{ display: "flex", flexDirection: "row-reverse", width: 700, alignItems: "center" }}>
              {stat("تغيير اليوم", `${dUp ? "+" : "−"}${daily}`, dUp ? "#4ade80" : "#f87171", `${dUp ? "+" : "−"}${dailyPct}%`)}
              {pnl ? <div style={{ display: "flex", width: 1, height: 74, background: "rgba(201,168,76,0.25)" }} /> : null}
              {pnl ? stat("الربح", `${pUp ? "+" : "−"}${pnl}`, pUp ? "#4ade80" : "#f87171", `${pUp ? "+" : "−"}${pnlPct}%`) : null}
            </div>
          ) : high && low ? (
            <div style={{ display: "flex", flexDirection: "row-reverse", width: 700, alignItems: "center" }}>
              {stat("أعلى اليوم", `${sym}${high}`, "#4ade80")}
              <div style={{ display: "flex", width: 1, height: 74, background: "rgba(201,168,76,0.25)" }} />
              {stat("أدنى اليوم", `${sym}${low}`, "#f87171")}
            </div>
          ) : null}
        </div>

        {/* footer inside the frame */}
        <div style={{ position: "absolute", bottom: 62, left: 0, width: S, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span style={{ color: GOLD, fontSize: 26, fontWeight: 700 }}>sardhahab.com</span>
          <span style={{ color: "#5a4c2e", fontSize: 20 }}>·</span>
          <ArLine text="أسعار لحظية للذهب والعملات" style={{ color: "#5a4c2e", fontSize: 20 }} />
        </div>
      </div>
    ), { width: S, height: S, fonts: fontOpts });
  }

  // ── CTA ───────────────────────────────────────────────────────────────────
  if (type === "cta") {
    return new ImageResponse((
      <div style={OUTER}>
        <GradBar yPos={0} />
        <div style={{ position: "absolute", top: 0, left: 0, width: W, height: H, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 80px" }}>
          <div style={{ color: GOLD, fontSize: 44, fontWeight: 900, textAlign: "center", lineHeight: 1.35, direction: "rtl", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            أسعار لحظية · ١٨ دولة عربية
          </div>
          <div style={{ width: 60, height: 2, background: GOLD, marginTop: 26, marginBottom: 26, display: "flex" }} />
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 22, textAlign: "center", lineHeight: 1.9, direction: "rtl", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            السعودية · الإمارات · مصر · الكويت · قطر · البحرين · عُمان · الأردن
          </div>
          <div style={{ color: AZURE, fontSize: 20, marginTop: 20, display: "flex" }}>sardhahab.com</div>
        </div>
        <Footer hash="#سعر_الذهب #الوطن_العربي" />
        <GradBar yPos={H - 5} />
      </div>
    ), { width: W, height: H, fonts: fontOpts });
  }

  // ── DEFAULT fallback: morning layout ─────────────────────────────────────
  return new ImageResponse(
    <MorningCard gold={gold} change={change} dir={dir} rows={rows} />,
    { width: W, height: H, fonts: fontOpts },
  );
}
