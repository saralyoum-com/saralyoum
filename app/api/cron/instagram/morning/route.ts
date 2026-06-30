import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getGoldPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { notifyPostPublished } from "@/lib/telegram";
import { postToInstagram, buildSocialCardUrl, buildCardCountryRows } from "@/lib/social";

export const dynamic = "force-dynamic";

// Runs daily 7:30 AM KSA (04:30 UTC) — portrait card posted to Instagram
// Schedule in vercel.json: "30 4 * * *" (same as X morning, both fire together)

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

    const today = new Date().toLocaleDateString("ar-SA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: "Asia/Riyadh",
    });

    const goldFmt   = formatPrice(gold.price);
    const changePct = gold.changePercent.toFixed(2);
    const dir       = gold.changePercent >= 0 ? "up" : "down";
    const countryRows = buildCardCountryRows(rates, gold.price, gold.changePercent);

    // Use the 1200×628 morning card (Instagram displays landscape in feed)
    const cardUrl = buildSocialCardUrl({
      type: "morning",
      gold: goldFmt, change: changePct, dir,
      rows: countryRows,
    });

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 350,
      system: "أنت محرر محتوى مالي عربي احترافي. اكتب بالعربية الفصحى. لا توصيات استثمارية.",
      messages: [{
        role: "user",
        content: `اليوم: ${today} | الذهب: $${goldFmt} (${gold.changePercent >= 0 ? "+" : ""}${changePct}%)
الدول: ${countryRows.map(r => `${r.name} ${r.price} ${r.currency}`).join(" · ")}

اكتب كابشن إنستغرام صباحي من 60-90 كلمة:
- هوك قوي يوقف التمرير (السطر الأول)
- أسعار اليوم المميزة
- CTA: تابع sardhahab.com
- هاشتاقات عربية ودولية (7-10 هاشتاقات)
بدون ترقيم. بدون عناوين.`,
      }],
    });

    const caption = (msg.content[0] as { text: string }).text.trim();
    const igId = await postToInstagram(caption, cardUrl);
    await notifyPostPublished("Instagram", igId, "morning-portrait");

    return NextResponse.json({ ok: true, igId, cardUrl, countryGroup: countryRows.map(r => r.name).join(" · ") });
  } catch (err) {
    console.error("instagram/morning error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
