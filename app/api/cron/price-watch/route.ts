import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { getGoldPrice } = await import("@/lib/goldapi");
  const gold = await getGoldPrice();

  return NextResponse.json({
    price: gold.price,
    change: gold.changePercent ?? 0,
  });
}
