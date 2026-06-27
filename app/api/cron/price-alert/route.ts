import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Push a "gold moved" alert only when the price crosses a threshold since the
// last alert (default ±1.5%, override with PRICE_ALERT_THRESHOLD). State (last
// alerted price) is kept in a 1-row Supabase table `price_alert_state`.
const THRESHOLD = Number(process.env.PRICE_ALERT_THRESHOLD || "0.015");

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { getGoldPrice } = await import("@/lib/goldapi");
    const { sendPushToAll } = await import("@/lib/onesignal");
    const { createServiceClient } = await import("@/lib/supabase");

    const gold = await getGoldPrice();
    const price = gold.price;
    if (!price || price <= 0) return NextResponse.json({ error: "no price" }, { status: 503 });

    const supabase = createServiceClient();

    let lastPrice: number | null = null;
    try {
      const { data } = await supabase
        .from("price_alert_state")
        .select("last_price")
        .eq("id", 1)
        .single();
      lastPrice = data?.last_price ?? null;
    } catch {
      // table not created yet — treat as no baseline
    }

    const saveState = async () => {
      try {
        await supabase
          .from("price_alert_state")
          .upsert({ id: 1, last_price: price, updated_at: new Date().toISOString() });
      } catch {
        /* table missing — alert still sent, just no dedup */
      }
    };

    // First run (or no baseline): record current price, send nothing.
    if (lastPrice == null) {
      await saveState();
      return NextResponse.json({ ok: true, baseline: price });
    }

    const move = Math.abs(price - lastPrice) / lastPrice;
    if (move < THRESHOLD) {
      return NextResponse.json({ ok: true, sent: false, movePct: +(move * 100).toFixed(2) });
    }

    const up = price >= lastPrice;
    const arrow = up ? "▲" : "▼";
    const pct = (move * 100).toFixed(1);
    const priceStr = Math.round(price).toLocaleString("en-US");

    const push = await sendPushToAll({
      headingAr: `🚨 تنبيه: الذهب تحرّك ${arrow} ${pct}%`,
      contentAr: `الذهب الآن $${priceStr} للأوقية — اضغط للتفاصيل`,
      url: "https://sardhahab.com",
    });

    await saveState();
    return NextResponse.json({ ok: true, sent: true, movePct: +pct, push });
  } catch (err) {
    console.error("price-alert error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
