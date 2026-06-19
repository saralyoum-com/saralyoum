import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// الحدود التي تستدعي إرسال تنبيه (بالنسبة المئوية)
const THRESHOLDS = [2, 3, 4, 5];

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { getGoldPrice } = await import("@/lib/goldapi");
    const { sendPushToAll } = await import("@/lib/onesignal");
    const { createServiceClient } = await import("@/lib/supabase");

    const gold = await getGoldPrice();
    const change = gold.changePercent ?? 0;
    const absChange = Math.abs(change);
    const direction = change >= 0 ? "above" : "below";
    const today = new Date().toISOString().slice(0, 10);
    const supabase = createServiceClient();

    const sent: number[] = [];

    for (const threshold of THRESHOLDS) {
      if (absChange < threshold) continue;

      // مفتاح فريد لكل تنبيه — مثال: gold_2026-06-19_above_2
      const key = `gold_${today}_${direction}_${threshold}`;

      // محاولة إدراج — تفشل إذا أُرسل مسبقاً (primary key conflict)
      const { error } = await supabase.from("push_log").insert({ key });
      if (error) continue; // مرسل مسبقاً، تخطّ

      const emoji = direction === "above" ? "🔺" : "🔻";
      const verb = direction === "above" ? "ارتفع" : "انخفض";

      await sendPushToAll({
        headingAr: `${emoji} الذهب ${verb} ${absChange.toFixed(1)}% اليوم`,
        contentAr: `سعر الذهب الآن $${gold.price.toLocaleString("en-US", { maximumFractionDigits: 0 })} — اضغط للتفاصيل`,
        url: "https://sardhahab.com",
      });

      sent.push(threshold);
    }

    return NextResponse.json({
      change: change.toFixed(2),
      sent: sent.length > 0 ? sent : "nothing new",
    });
  } catch (error) {
    console.error("price-watch error:", error);
    return NextResponse.json({ error: "فشل الفحص" }, { status: 500 });
  }
}
