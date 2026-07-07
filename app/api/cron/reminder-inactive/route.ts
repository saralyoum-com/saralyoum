import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Weekly re-engagement push to subscribers who haven't opened the site in 7+
// days. Targets specific OneSignal player IDs (not a broadcast segment) using
// each player's own last_active timestamp, so it doesn't nudge active users.
const INACTIVE_DAYS = 7;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { getGoldPrice } = await import("@/lib/goldapi");
    const { listPlayers, sendPushToPlayers } = await import("@/lib/onesignal");

    const cutoff = Date.now() / 1000 - INACTIVE_DAYS * 24 * 60 * 60;
    const players = await listPlayers();
    const inactiveIds = players
      .filter((p) => !p.invalid_identifier && p.last_active < cutoff)
      .map((p) => p.id);

    if (inactiveIds.length === 0) {
      return NextResponse.json({ ok: true, sent: false, reason: "no inactive subscribers" });
    }

    const gold = await getGoldPrice();
    const priceStr = Math.round(gold.price).toLocaleString("en-US");

    const push = await sendPushToPlayers(inactiveIds, {
      headingAr: "لم نرك منذ فترة 👋",
      contentAr: `الذهب الآن $${priceStr} — اضغط لمتابعة آخر الأسعار`,
      url: "https://sardhahab.com",
    });

    return NextResponse.json({ ok: true, sent: true, count: inactiveIds.length, push });
  } catch (err) {
    console.error("reminder-inactive error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
