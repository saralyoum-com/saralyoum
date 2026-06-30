import { NextRequest, NextResponse } from "next/server";
import { getGoldPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { notifyPostPublished } from "@/lib/telegram";
import { postToInstagram, buildSocialCardUrl, buildCardCountryRows } from "@/lib/social";

export const dynamic = "force-dynamic";

// Runs daily 9:00 PM KSA (18:00 UTC) — evening price recap story card
// Schedule in vercel.json: "0 18 * * *"
// Uses the same 1200×628 card (Instagram story crops it, still legible)

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [gold, rates] = await Promise.all([getGoldPrice(), getExchangeRates()]);

    const goldFmt   = formatPrice(gold.price);
    const changePct = gold.changePercent.toFixed(2);
    const dir       = gold.changePercent >= 0 ? "up" : "down";
    const isUp      = gold.changePercent >= 0;
    const countryRows = buildCardCountryRows(rates, gold.price, gold.changePercent);

    const cardUrl = buildSocialCardUrl({
      type: "engagement",
      gold: goldFmt, change: changePct, dir,
      rows: countryRows,
    });

    // Short story-style caption
    const arrow  = isUp ? "📈" : "📉";
    const change = `${isUp ? "+" : ""}${changePct}%`;
    const caption =
      `${arrow} ملخص الذهب مساءً\n` +
      `الأوقية: $${goldFmt} (${change})\n` +
      `${countryRows.map(r => `${r.flag} ${r.name}: ${r.price} ${r.currency}`).join("\n")}\n\n` +
      `أسعار لحظية → sardhahab.com\n` +
      `#سعر_الذهب #الذهب #GoldPrice`;

    const igId = await postToInstagram(caption, cardUrl);
    await notifyPostPublished("Instagram", igId, "evening-story");

    return NextResponse.json({ ok: true, igId, cardUrl, countryGroup: countryRows.map(r => r.name).join(" · ") });
  } catch (err) {
    console.error("instagram/story error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
