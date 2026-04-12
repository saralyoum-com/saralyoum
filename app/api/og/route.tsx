import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const asset = searchParams.get("asset") || "gold";
  const price = searchParams.get("price") || "4,787";
  const change = searchParams.get("change") || "+0.85%";
  const isUp = !change.startsWith("-");

  const assetInfo: Record<string, { nameAr: string; icon: string; color: string }> = {
    gold:     { nameAr: "الذهب",     icon: "🥇", color: "#C9A84C" },
    silver:   { nameAr: "الفضة",     icon: "🥈", color: "#9CA3AF" },
    bitcoin:  { nameAr: "بيتكوين",   icon: "₿",  color: "#F7931A" },
    ethereum: { nameAr: "إيثيريوم",  icon: "⟠",  color: "#627EEA" },
  };

  const info = assetInfo[asset] || assetInfo.gold;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0F0F0F",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background gold glow */}
        <div style={{
          position: "absolute",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${info.color}15 0%, transparent 70%)`,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
        }} />

        {/* Site name */}
        <div style={{ color: info.color, fontSize: "28px", fontWeight: "bold", marginBottom: "20px", letterSpacing: "2px" }}>
          sardhahab.com
        </div>

        {/* Icon */}
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>{info.icon}</div>

        {/* Asset name */}
        <div style={{ color: "#ffffff", fontSize: "48px", fontWeight: "black", marginBottom: "16px" }}>
          سعر {info.nameAr} اليوم
        </div>

        {/* Price */}
        <div style={{ color: info.color, fontSize: "72px", fontWeight: "black", marginBottom: "16px" }}>
          ${price}
        </div>

        {/* Change */}
        <div style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: isUp ? "#22C55E" : "#EF4444",
          background: isUp ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          padding: "8px 24px",
          borderRadius: "12px",
        }}>
          {change}
        </div>

        {/* Bottom tag */}
        <div style={{ position: "absolute", bottom: "30px", color: "#6B7280", fontSize: "20px" }}>
          أسعار لحظية • محدّث كل 5 دقائق
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
