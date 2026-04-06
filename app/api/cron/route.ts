import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // التحقق من المفتاح السري
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { createServiceClient } = await import("@/lib/supabase");
    const { getGoldPrice, getSilverPrice } = await import("@/lib/goldapi");
    const { getCryptoPrice } = await import("@/lib/coingecko");
    const { Resend } = await import("resend");

    const supabase = createServiceClient();
    const resend = new Resend(process.env.RESEND_API_KEY);

    // جلب الأسعار الحالية
    const [gold, silver, bitcoin, ethereum] = await Promise.all([
      getGoldPrice(),
      getSilverPrice(),
      getCryptoPrice("bitcoin"),
      getCryptoPrice("ethereum"),
    ]);

    const prices: Record<string, number> = {
      gold: gold.price,
      silver: silver.price,
      bitcoin: bitcoin.price,
      ethereum: ethereum.price,
    };

    const assetNames: Record<string, string> = {
      gold: "الذهب", silver: "الفضة",
      bitcoin: "بيتكوين", ethereum: "إيثيريوم",
    };

    const assetUnits: Record<string, string> = {
      gold: "USD/أوقية", silver: "USD/أوقية",
      bitcoin: "USD", ethereum: "USD",
    };

    // جلب التنبيهات النشطة
    const { data: alerts } = await supabase
      .from("alerts")
      .select("*")
      .eq("active", true);

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({ sent: 0, message: "لا يوجد تنبيهات" });
    }

    let sentCount = 0;

    for (const alert of alerts) {
      const price = prices[alert.asset];
      const shouldSend =
        alert.type === "daily" ||
        (alert.type === "price" &&
          alert.target_price &&
          ((alert.condition === "above" && price >= alert.target_price) ||
            (alert.condition === "below" && price <= alert.target_price)));

      if (!shouldSend) continue;

      const assetData = { gold, silver, bitcoin, ethereum }[alert.asset as keyof typeof prices];
      const isPositive = (assetData as { changePercent: number })?.changePercent >= 0;

      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: alert.email,
          subject: `🏅 تنبيه سعر ${assetNames[alert.asset]} — سعر اليوم`,
          html: `
            <div dir="rtl" style="font-family: Arial; background: #0D0D0D; color: #F5F5F5; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #C9A84C; margin-bottom: 5px;">🏅 سعر اليوم</h2>
              <p style="color: #A0A0A0; font-size: 13px; margin-top: 0;">تقرير السعر اليومي</p>

              <div style="background: #1A1A1A; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #F5F5F5; margin: 0 0 15px;">${assetNames[alert.asset]}</h3>
                <div style="font-size: 28px; font-weight: bold; color: #C9A84C;">
                  $${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </div>
                <div style="font-size: 14px; color: ${isPositive ? "#22c55e" : "#ef4444"}; margin-top: 5px;">
                  ${isPositive ? "▲" : "▼"} ${Math.abs((assetData as { changePercent: number })?.changePercent || 0).toFixed(2)}% اليوم
                </div>
                <div style="color: #A0A0A0; font-size: 12px; margin-top: 8px;">${assetUnits[alert.asset]}</div>
              </div>

              <div style="background: #242424; border-radius: 8px; padding: 12px; font-size: 12px; color: #A0A0A0;">
                ⚠️ هذا التنبيه لأغراض إعلامية فقط. لا يمثل نصيحة استثمارية أو مالية.
                استشر مستشاراً مالياً مرخصاً قبل أي قرار استثماري.
              </div>

              <p style="font-size: 11px; color: #666; margin-top: 20px; text-align: center;">
                سعر اليوم — saralyoum.com
              </p>
            </div>
          `,
        });

        // تحديث آخر إرسال
        await supabase
          .from("alerts")
          .update({ last_sent_at: new Date().toISOString() })
          .eq("id", alert.id);

        sentCount++;
      } catch (e) {
        console.error(`Failed to send to ${alert.email}:`, e);
      }
    }

    return NextResponse.json({ sent: sentCount, total: alerts.length });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "فشل تنفيذ الكرون" }, { status: 500 });
  }
}
