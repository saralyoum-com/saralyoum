import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { sendTelegramMessage } from "@/lib/telegram";
import { postToFacebook, postToInstagram, buildSocialCardUrl } from "@/lib/social";
import { postToX } from "@/lib/twitter";

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
  x: string;
  linkedin: string;
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

اكتب محتوى الصباح لخمس منصات بصيغة JSON صارمة — لا نص خارج الـ JSON:
{
  "instagram": "كابشن إنستغرام 50-80 كلمة: هوك واحد يوقف التمرير + أسعار لحظية + هاشتاقات عربية ودولية مختلطة. لا رابط. لا URL.",
  "facebook": "منشور فيسبوك 150-220 كلمة: هوك + تحليل السوق اليوم + سبب الحركة + رابط sardhahab.com + هاشتاقات",
  "telegram": "منشور تيليجرام 80-130 كلمة: موجز السوق الصباحي، استخدم <b>للأرقام المهمة</b>",
  "x": "تغريدة X بحد أقصى 260 حرفاً: رقم بارز + سبب + هاشتاق واحد فقط. بدون رابط.",
  "linkedin": "منشور LinkedIn احترافي 120-180 كلمة: افتتاحية قوية + سياق اقتصادي + درس للمستثمر العربي + رابط sardhahab.com. أسلوب هادئ ومحترف."
}`,
      }],
    });

    const raw = (msg.content[0] as { text: string }).text.trim();
    let posts: SocialPosts;
    try {
      const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0] ?? raw;
      posts = JSON.parse(jsonStr) as SocialPosts;
    } catch {
      posts = { instagram: raw, facebook: raw, telegram: raw, x: raw, linkedin: raw };
    }

    const isBreaking = Math.abs(gold.changePercent) >= 1.5;
    const cardUrl = buildSocialCardUrl({
      type: isBreaking ? "breaking" : "morning",
      gold: goldFmt, change: changePct, dir,
      date: today, silver: silverFmt, btc: btcFmt,
    });

    // If breaking, generate a short urgent tweet to post immediately on X
    let breakingXPost: string | null = null;
    if (isBreaking) {
      const breakMsg = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{
          role: "user",
          content: `اليوم: ${today}\nالذهب: $${goldFmt} (${gold.changePercent >= 0 ? "+" : ""}${changePct}%)\n\nاكتب تغريدة عاجلة بحد أقصى 240 حرفاً تُخبر المتابعين بالحركة القوية في الذهب. ابدأ بـ 🚨. هاشتاق واحد فقط. بدون رابط.`,
        }],
      });
      breakingXPost = (breakMsg.content[0] as { text: string }).text.trim();
    }

    const telegramMsg =
      `📅 <b>منشور الصباح — ${today}</b>` +
      (isBreaking ? `\n🚨 <b>تحرك قوي: ${gold.changePercent >= 0 ? "+" : ""}${changePct}%</b>` : "") +
      `\n\n` + posts.telegram +
      `\n\n─────────────────\n🐦 <b>X / Twitter</b>\n\n` + posts.x +
      `\n\n─────────────────\n💼 <b>LinkedIn</b>\n\n` + posts.linkedin;

    const tasks: Promise<unknown>[] = [
      sendTelegramMessage(telegramMsg),
      postToFacebook(posts.facebook, cardUrl),
      postToInstagram(posts.instagram, cardUrl),
      postToX(posts.x),
    ];
    if (breakingXPost) tasks.push(postToX(breakingXPost));

    const [, fbRes, igRes, xRes, breakXRes] = await Promise.allSettled(tasks);

    return NextResponse.json({
      ok: true, breaking: isBreaking,
      cardUrl,
      fb: fbRes.status === "fulfilled" ? fbRes.value : String((fbRes as PromiseRejectedResult).reason),
      ig: igRes.status === "fulfilled" ? igRes.value : String((igRes as PromiseRejectedResult).reason),
      x:  xRes.status  === "fulfilled" ? xRes.value  : String((xRes  as PromiseRejectedResult).reason),
      xBreaking: breakXRes ? (breakXRes.status === "fulfilled" ? breakXRes.value : String((breakXRes as PromiseRejectedResult).reason)) : null,
    });
  } catch (err) {
    console.error("x-posts/morning error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
