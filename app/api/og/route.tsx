import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Use Node runtime so we can load local files (font + static image fallback)
export const runtime = "nodejs";

// Cache the OG image at the CDN edge — Twitter, Facebook, Telegram will all hit this URL
// and we don't need to regenerate it every time.
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  "Content-Type": "image/png",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const asset = searchParams.get("asset") || "gold";

  // For any asset = serve the same beautiful static image
  // (The dynamic per-asset image with Arabic text in Edge runtime is unreliable —
  // Twitter scrapers timeout, fonts fail. Static = bulletproof.)
  try {
    const imagePath = join(process.cwd(), "public", "og-image.png");
    const imageBuffer = readFileSync(imagePath);
    return new NextResponse(imageBuffer as unknown as BodyInit, {
      headers: CACHE_HEADERS,
    });
  } catch {
    // Fallback: render a minimal English-only image inline (no fonts needed)
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            background: "linear-gradient(135deg, #0a0a0c 0%, #1a1a1f 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ color: "#C9A84C", fontSize: "32px", fontWeight: "bold", marginBottom: "30px" }}>
            sardhahab.com
          </div>
          <div style={{ color: "#ffffff", fontSize: "72px", fontWeight: "bold", marginBottom: "20px" }}>
            Gold Price Today
          </div>
          <div style={{ color: "#9CA3AF", fontSize: "28px" }}>
            Real-time prices in 19 Arab currencies
          </div>
          <div style={{ color: "#C9A84C", fontSize: "24px", position: "absolute", bottom: "40px" }}>
            {asset.charAt(0).toUpperCase() + asset.slice(1)}
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
