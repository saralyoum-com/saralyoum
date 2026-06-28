import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GOLD = "#C9A84C";
const W = 1080;
const H = 1350;

type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type CachedFont = { name: string; data: ArrayBuffer; weight: FontWeight; style: "normal" };

// Module-level cache — persists across requests in the same serverless instance
let _fonts: CachedFont[] | null = null;
let _logo: string | null = null;

async function loadFonts() {
  if (_fonts) return _fonts;
  try {
    // Old UA → Google Fonts returns TTF (no unicode-range subsetting), which Satori supports
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Tajawal:wght@700;900&display=swap",
      { headers: { "User-Agent": "Mozilla/4.0 (MSIE 6.0; Windows NT 5.1)" } }
    ).then((r) => r.text());
    const urls = (css.match(/url\([^)]+\)/g) ?? []).map((m) => m.slice(4, -1).replace(/['"]/g, ""));
    const unique = Array.from(new Set(urls)).slice(0, 4);
    const buffers = await Promise.all(unique.map((u) => fetch(u).then((r) => r.arrayBuffer())));
    _fonts = buffers.map((data, i) => ({
      name: "Tajawal",
      data,
      weight: (i % 2 === 0 ? 700 : 900) as FontWeight,
      style: "normal" as const,
    }));
  } catch {
    _fonts = [];
  }
  return _fonts;
}

function loadLogo() {
  if (_logo) return _logo;
  try {
    const buf = readFileSync(join(process.cwd(), "public", "logo.png"));
    _logo = `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    _logo = null;
  }
  return _logo;
}

// Candlestick positions for the background (uptrend pattern)
const CANDLES = Array.from({ length: 16 }, (_, i) => {
  const x = 20 + i * 66;
  const h = 80 + i * 16 + Math.abs(Math.sin(i * 1.1) * 50);
  const y = 1060 - i * 16 - Math.abs(Math.sin(i * 1.1) * 50);
  return { x, y, h, x2: x + 16 };
});

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const type    = sp.get("type")   || "morning";
  const gold    = sp.get("gold")   || "3,320";
  const change  = sp.get("change") || "+0.42";
  const dir     = sp.get("dir")    || "up";
  const date    = sp.get("date")   || "";
  const silver  = sp.get("silver") || "32.5";
  const btc     = sp.get("btc")    || "67,000";
  const topic   = sp.get("topic")  || "لماذا يرتفع الذهب؟";

  const [fonts, logo] = await Promise.all([loadFonts(), Promise.resolve(loadLogo())]);

  const isUp        = dir === "up";
  const changeColor = isUp ? "#4ade80" : "#f87171";
  const arrow       = isUp ? "▲" : "▼";
  const absChange   = Math.abs(parseFloat(change)).toFixed(2);

  const LogoEl = logo
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={logo} alt="" width={88} height={88} style={{ borderRadius: "50%" }} />
    : (
      <div style={{
        width: 88, height: 88, borderRadius: "50%", background: GOLD,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#1a1000", fontSize: 22, fontWeight: 900,
      }}>SARD</div>
    );

  return new ImageResponse(
    (
      <div style={{
        width: W, height: H, background: "#000",
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "relative", overflow: "hidden",
        fontFamily: "Tajawal, sans-serif",
      }}>

        {/* Candlestick background */}
        <svg
          width={W} height={H} viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", top: 0, left: 0, opacity: 0.08 }}
        >
          {CANDLES.map((c, i) => (
            <g key={i}>
              <rect x={c.x} y={c.y} width={32} height={c.h} fill={GOLD} />
              <line x1={c.x2} y1={c.y - 36} x2={c.x2} y2={c.y + c.h + 32} stroke={GOLD} strokeWidth="5" />
            </g>
          ))}
          <line x1="0" y1="1120" x2={W} y2="200" stroke={GOLD} strokeWidth="5" strokeDasharray="22,16" opacity="0.45" />
        </svg>

        {/* Concentric glow rings */}
        <svg
          width={W} height={H} viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", top: 0, left: 0, opacity: 0.038 }}
        >
          <circle cx="540" cy="670" r="200" stroke={GOLD} strokeWidth="90" fill="none" />
          <circle cx="540" cy="670" r="360" stroke={GOLD} strokeWidth="55" fill="none" />
          <circle cx="540" cy="670" r="500" stroke={GOLD} strokeWidth="30" fill="none" />
        </svg>

        {/* Subtle grid lines */}
        <svg
          width={W} height={H} viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", top: 0, left: 0, opacity: 0.025 }}
        >
          <line x1="0" y1="337" x2={W} y2="337" stroke={GOLD} strokeWidth="1" />
          <line x1="0" y1="675" x2={W} y2="675" stroke={GOLD} strokeWidth="1" />
          <line x1="0" y1="1012" x2={W} y2="1012" stroke={GOLD} strokeWidth="1" />
          <line x1="360" y1="0" x2="360" y2={H} stroke={GOLD} strokeWidth="1" />
          <line x1="720" y1="0" x2="720" y2={H} stroke={GOLD} strokeWidth="1" />
        </svg>

        {/* SARD Logo + brand */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 80, zIndex: 2 }}>
          {LogoEl}
          <div style={{ color: GOLD, fontSize: 26, fontWeight: 700, marginTop: 18, letterSpacing: 4 }}>
            {type === "breaking" ? "تنبيه فوري · SARD" : "سعر الذهب · SARD"}
          </div>
        </div>

        {/* ── MORNING ── */}
        {type === "morning" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, width: "100%", zIndex: 2 }}>
            {date && (
              <div style={{ color: "#555", fontSize: 28, marginTop: 36, letterSpacing: 2 }}>{date}</div>
            )}
            {/* Hero price */}
            <div style={{ display: "flex", alignItems: "baseline", marginTop: date ? 24 : 60, gap: 6 }}>
              <span style={{ color: GOLD, fontSize: 108, fontWeight: 900, lineHeight: 1 }}>$</span>
              <span style={{ color: "#fff", fontSize: 170, fontWeight: 900, lineHeight: 1 }}>{gold}</span>
            </div>
            <div style={{ color: "#666", fontSize: 30, marginTop: 12 }}>أوقية الذهب · أسعار لحظية</div>
            <div style={{
              marginTop: 30, padding: "14px 48px",
              background: isUp ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              border: `2px solid ${isUp ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
              borderRadius: 60, color: changeColor, fontSize: 42, fontWeight: 700,
              display: "flex",
            }}>
              {arrow} {absChange}%
            </div>
            {/* Divider */}
            <div style={{ width: 130, height: 4, background: GOLD, marginTop: 60 }} />
            {/* Secondary */}
            <div style={{
              display: "flex", width: "80%", marginTop: 50,
              border: "1px solid #1e1e1e", borderRadius: 22, overflow: "hidden",
            }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", borderRight: "1px solid #1e1e1e" }}>
                <span style={{ color: "#555", fontSize: 24 }}>الفضة</span>
                <span style={{ color: "#bbb", fontSize: 50, fontWeight: 700, marginTop: 10 }}>${silver}</span>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px" }}>
                <span style={{ color: "#555", fontSize: 24 }}>بيتكوين</span>
                <span style={{ color: "#bbb", fontSize: 50, fontWeight: 700, marginTop: 10 }}>${btc}</span>
              </div>
            </div>
            <div style={{ color: "#444", fontSize: 28, marginTop: 60, letterSpacing: 3 }}>sardhahab.com</div>
          </div>
        )}

        {/* ── EDUCATIONAL ── */}
        {type === "educational" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, width: "100%", padding: "0 90px", zIndex: 2 }}>
            <div style={{ color: GOLD, fontSize: 26, letterSpacing: 3, marginTop: 50 }}>تعليم مالي</div>
            <div style={{ color: "#fff", fontSize: 60, fontWeight: 900, textAlign: "center", lineHeight: 1.3, marginTop: 24 }}>
              {topic}
            </div>
            <div style={{ width: 130, height: 4, background: GOLD, marginTop: 50, marginBottom: 50 }} />
            {/* Bullet points */}
            {[
              "الدولار ينخفض ← الذهب يرتفع",
              "التضخم يشتعل ← الذهب يحمي",
              "الأزمات تضرب ← الذهب يلمع",
            ].map((pt, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 28, width: "100%",
                marginBottom: 28, background: "#0e0e0e", borderRadius: 20, padding: "28px 36px",
                border: "1px solid #1a1a1a",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", background: GOLD,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#1a1000", fontSize: 28, fontWeight: 900, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ color: "#ddd", fontSize: 34, fontWeight: 500 }}>{pt}</div>
              </div>
            ))}
            <div style={{ color: "#444", fontSize: 28, marginTop: 40, letterSpacing: 3 }}>sardhahab.com</div>
          </div>
        )}

        {/* ── BREAKING ── */}
        {type === "breaking" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, width: "100%", zIndex: 2 }}>
            <div style={{
              marginTop: 60, padding: "14px 48px",
              background: "rgba(239,68,68,0.12)",
              border: "2px solid rgba(239,68,68,0.35)",
              borderRadius: 14, color: "#f87171", fontSize: 32, fontWeight: 700, letterSpacing: 3,
              display: "flex",
            }}>
              🚨 خبر عاجل
            </div>
            <div style={{ color: "#666", fontSize: 30, marginTop: 36 }}>تحرك في سعر الذهب</div>
            <div style={{ color: changeColor, fontSize: 160, fontWeight: 900, lineHeight: 1, marginTop: 20, display: "flex" }}>
              {arrow} {absChange}%
            </div>
            <div style={{ color: "#fff", fontSize: 90, fontWeight: 900, marginTop: 10, display: "flex" }}>${gold}</div>
            <div style={{ width: 130, height: 4, background: changeColor, marginTop: 50 }} />
            <div style={{ color: "#888", fontSize: 34, textAlign: "center", marginTop: 50, padding: "0 90px", lineHeight: 1.5, display: "flex" }}>
              {isUp ? "صعود مفاجئ — ما السبب وإلى أين؟" : "تراجع مفاجئ — ما السبب وإلى أين؟"}
            </div>
            <div style={{ color: "#444", fontSize: 28, marginTop: 60, letterSpacing: 3 }}>sardhahab.com</div>
          </div>
        )}

        {/* Bottom gold bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: GOLD }} />
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}
