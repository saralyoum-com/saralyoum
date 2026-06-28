import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { sendTelegramMessage } from "@/lib/telegram";
import { postToFacebook, postToInstagram, buildSocialCardUrl } from "@/lib/social";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `أنت محرر محتوى مالي عربي احترافي لموقع sardhahab.com.
اكتب بالعربية الفصحى المعاصرة. لا توصيات استثمارية. لا مبالغة. لا كليشيهات. مفيد وموثوق وجذاب.`;

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

interface SocialPosts {
  instagram: string;
  facebook: string;
  telegram: string;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [gold, silver, bitcoin] = await Promise.all([
      getGoldPrice(),
      getSilverPrice(),
      getCryptoPrice("bitcoin"),
    ]);

    const today = new Date().toLocaleDateString("ar-SA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: "Asia/Riyadh",
    });

    const goldFmt   = formatPrice(gold.price);
    const silverFmt = formatPrice(silver.price);
    const btcFmt    = formatPrice(bitcoin.price);
    const changePct = gold.changePercent.toFixed(2);
    const dir       = gold.changePercent >= 0 ? "up" : "down";

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 900,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `اليوم: ${today}
الذهب: $${goldFmt} (${gold.changePercent >= 0 ? "+" : ""}${changePct}%)
الفضة: $${silverFmt} | بيتكوين: $${btcFmt}

اكتب محتوى الصباح لثلاث منصات بصيغة JSON صارمة — لا نص خارج الـ JSON:
{
  "instagram": "كابشن إنستغرام 50-80 كلمة: هوك واحد يوقف التمرير + أسعار لحظية + هاشتاقات عربية ودولية مختلطة. لا رابط. لا URL.",
  "facebook": "منشور فيسبوك 150-220 كلمة: هوك + تحليل السوق اليوم + سبب الحركة + رابط sardhahab.com + هاشتاقات",
  "telegram": "منشور تيليجرام 80-130 كلمة: موجز السوق الصباحي، استخدم <b>للأرقام المهمة</b>"
}`,
      }],
    });

    const raw = (msg.content[0] as { text: string }).text.trim();
    let posts: SocialPosts;
    try {
      const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0] ?? raw;
      posts = JSON.parse(jsonStr) as SocialPosts;
    } catch {
      posts = { instagram: raw, facebook: raw, telegram: raw };
    }

    const cardUrl = buildSocialCardUrl({
      type: "morning", gold: goldFmt, change: changePct, dir,
      date: today, silver: silverFmt, btc: btcFmt,
    });

    const [, fbRes, igRes] = await Promise.allSettled([
      sendTelegramMessage(`📅 <b>منشور الصباح — ${today}</b>\n\n` + posts.telegram),
      postToFacebook(posts.facebook, cardUrl),
      postToInstagram(posts.instagram, cardUrl),
    ]);

    return NextResponse.json({
      ok: true,
      cardUrl,
      fb: fbRes.status === "fulfilled" ? fbRes.value : String((fbRes as PromiseRejectedResult).reason),
      ig: igRes.status === "fulfilled" ? igRes.value : String((igRes as PromiseRejectedResult).reason),
    });
  } catch (err) {
    console.error("x-posts/morning error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
