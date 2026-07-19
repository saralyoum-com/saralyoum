import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Monthly zakat-nisab push (1st of each month). The nisab is 85g of pure
// (24K) gold, so its money value moves with the gold price — high-value
// recurring info for the religious audience segment. Reuses the same push
// infra as the daily/price-alert crons.
const NISAB_GRAMS = 85;
const OZ = 31.1035;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { getGoldPrice } = await import("@/lib/goldapi");
    const { sendPushToAll } = await import("@/lib/onesignal");

    const gold = await getGoldPrice();
    if (!gold.price || gold.price <= 0) {
      return NextResponse.json({ error: "no price" }, { status: 503 });
    }

    const nisabUSD = NISAB_GRAMS * (gold.price / OZ);

    // SAR figure for the largest audience; fixed-peg fallback if rates fail
    let sarRate = 3.75;
    try {
      const { getExchangeRates } = await import("@/lib/exchangerate");
      const rates = await getExchangeRates();
      const sar = rates.find((r) => r.code === "SAR");
      if (sar?.rate) sarRate = sar.rate;
    } catch {
      /* fixed peg fallback */
    }
    const nisabSAR = nisabUSD * sarRate;

    const usdStr = Math.round(nisabUSD).toLocaleString("en-US");
    const sarStr = Math.round(nisabSAR).toLocaleString("en-US");

    const push = await sendPushToAll({
      headingAr: "☪️ نصاب زكاة الذهب هذا الشهر",
      contentAr: `النصاب (85 جرام ذهب) = $${usdStr} ≈ ${sarStr} ريال — احسب زكاتك من الحاسبة`,
      url: "https://sardhahab.com/حاسبة-الذهب",
    });

    return NextResponse.json({ ok: true, nisabUSD: +nisabUSD.toFixed(2), nisabSAR: +nisabSAR.toFixed(2), push });
  } catch (err) {
    console.error("nisab cron error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
