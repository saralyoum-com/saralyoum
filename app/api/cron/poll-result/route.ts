import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Resolves yesterday's daily gold-prediction poll votes (tagged client-side in
// GoldPredictionPoll.tsx on vote) and pushes "your prediction was right/wrong"
// to each voter. Runs once/day; only processes votes 20-30h old (the daily
// poll's natural ~24h resolution window), then clears the tags so a vote is
// never resolved twice. Best-effort throughout — a subscriber with no valid
// push token just doesn't receive anything; nothing here can fail loudly.
const MIN_AGE_HOURS = 20;
const MAX_AGE_HOURS = 30;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { getGoldPrice } = await import("@/lib/goldapi");
    const { listPlayers, sendPushToPlayers, setPlayerTags } = await import("@/lib/onesignal");

    const gold = await getGoldPrice();
    const currentPrice = gold.price;
    if (!currentPrice || currentPrice <= 0) {
      return NextResponse.json({ error: "no price" }, { status: 503 });
    }

    const players = await listPlayers();
    const nowSec = Date.now() / 1000;

    const correctIds: string[] = [];
    const wrongIds: string[] = [];
    const toClear: string[] = [];

    for (const p of players) {
      const votedAt = Number(p.tags?.poll_voted_at);
      const direction = p.tags?.poll_direction;
      const votePrice = Number(p.tags?.poll_price);
      if (!votedAt || !direction || !votePrice) continue;

      const ageHours = (nowSec - votedAt) / 3600;
      if (ageHours < MIN_AGE_HOURS || ageHours > MAX_AGE_HOURS) continue;

      const actualDirection = currentPrice >= votePrice ? "up" : "down";
      const correct = direction === actualDirection;
      (correct ? correctIds : wrongIds).push(p.id);
      toClear.push(p.id);
    }

    const results: Record<string, unknown> = {};

    if (correctIds.length > 0) {
      results.correctPush = await sendPushToPlayers(correctIds, {
        headingAr: "✅ توقعك كان صحيح",
        contentAr: "الذهب فعلاً تحرك كما توقعت — استمر في التصويت اليومي",
        url: "https://sardhahab.com/تحليل-تقني-الذهب",
      });
    }

    if (wrongIds.length > 0) {
      results.wrongPush = await sendPushToPlayers(wrongIds, {
        headingAr: "توقعك لم يتحقق هذه المرة",
        contentAr: "السوق تحرك بعكس توقعك — جرّب تصويت اليوم",
        url: "https://sardhahab.com/تحليل-تقني-الذهب",
      });
    }

    // Clear tags for everyone processed so they're never resolved twice.
    await Promise.all(
      toClear.map((id) => setPlayerTags(id, { poll_direction: "", poll_price: "", poll_voted_at: "" }))
    );

    return NextResponse.json({
      ok: true,
      correct: correctIds.length,
      wrong: wrongIds.length,
      ...results,
    });
  } catch (err) {
    console.error("poll-result error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
