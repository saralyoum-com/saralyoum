import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/ai";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { sendTelegramMessage, notifyPostPublished } from "@/lib/telegram";
import { postToFacebook, postToInstagram, buildSocialCardUrl, buildCardCountryRows } from "@/lib/social";
import { getExchangeRates } from "@/lib/exchangerate";
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
    const [gold, silver, bitcoin, rates] = await Promise.all([
      getGoldPrice(),
      getSilverPrice(),
      getCryptoPrice("bitcoin"),
      getExchangeRates(),
    ]);
    const countryRows = buildCardCountryRows(rates, gold.price, gold.changePercent);

    const today = new Date().toLocaleDateString("ar-SA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: "Asia/Riyadh",
    });

    const goldFmt   = formatPrice(gold.price);
    const silverFmt = formatPrice(silver.price);
    const btcFmt    = formatPrice(bitcoin.price);
    const changePct = gold.changePercent.toFixed(2);
    const dir       = gold.changePercent >= 0 ? "up" : "down";

    const isBreaking = Math.abs(gold.changePercent) >= 1;

    const [engRaw, breakingText] = await Promise.all([
      chat(SYSTEM_PROMPT, `اليوم: ${today}
الذهب: $${goldFmt} (${gold.changePercent >= 0 ? "+" : ""}${changePct}%)
الفضة: $${silverFmt} | بيتكوين: $${btcFmt}

اكتب محتوى تفاعلي مسائي لخمس منصات بصيغة JSON صارمة — لا نص خارج الـ JSON:
{
  "instagram": "كابشن إنستغرام 50-80 كلمة: سؤال تفاعلي أو استطلاع أو تحدٍّ مرتبط بالأسعار + هاشتاقات عربية. لا رابط.",
  "facebook": "منشور فيسبوك تفاعلي 120-200 كلمة: سؤال يُشجع على التعليق + سياق السوق + رابط sardhahab.com + هاشتاقات",
  "telegram": "منشور تيليجرام 70-120 كلمة: استفتاء أو سؤال تفاعلي، استخدم <b>للأرقام</b>",
  "x": "تغريدة X تفاعلية بحد أقصى 260 حرفاً: سؤال مباشر يستفز الرأي + هاشتاق واحد فقط.",
  "linkedin": "منشور LinkedIn مسائي 120-180 كلمة: ملاحظة ذكية عن حركة السوق اليوم + سؤال للمتابعين المحترفين + رابط sardhahab.com."
}`, 900),
      isBreaking
        ? chat(SYSTEM_PROMPT, `اليوم: ${today}\nالذهب: $${goldFmt} (${gold.changePercent >= 0 ? "+" : ""}${changePct}%)\nالفضة: $${silverFmt} | بيتكوين: $${btcFmt}\n\nاكتب منشور عاجل 50-120 كلمة يشرح الحركة القوية في الذهب وتأثيرها. ابدأ بـ 🚨`, 500)
        : Promise.resolve(null),
    ]);

    let posts: SocialPosts;
    try {
      const jsonStr = engRaw.match(/\{[\s\S]*\}/)?.[0] ?? engRaw;
      posts = JSON.parse(jsonStr) as SocialPosts;
    } catch {
      posts = { instagram: engRaw, facebook: engRaw, telegram: engRaw, x: engRaw, linkedin: engRaw };
    }

    const cardType  = isBreaking ? "breaking" : "engagement";
    const cardUrl   = buildSocialCardUrl({ type: cardType, gold: goldFmt, change: changePct, dir, rows: countryRows });

    let telegramMsg =
      `📊 <b>منشور المساء — ${today}</b>\n\n` +
      posts.telegram +
      `\n\n─────────────────\n🐦 <b>X / Twitter</b> (انسخ وانشر يدوياً)\n\n` +
      posts.x +
      `\n\n─────────────────\n💼 <b>LinkedIn</b> (انسخ وانشر يدوياً)\n\n` +
      posts.linkedin;
    if (breakingText) {
      telegramMsg += `\n\n─────────────────\n🚨 <b>منشور عاجل</b>\n\n${breakingText}`;
    }

    const [, fbRes, igRes, xRes] = await Promise.allSettled([
      sendTelegramMessage(telegramMsg),
      postToFacebook(posts.facebook, cardUrl),
      postToInstagram(posts.instagram, cardUrl),
      postToX(posts.x),
    ]);

    if (fbRes.status === "fulfilled") await notifyPostPublished("Facebook", String(fbRes.value), cardType);
    if (igRes.status === "fulfilled") await notifyPostPublished("Instagram", String(igRes.value), cardType);
    if (xRes.status  === "fulfilled") await notifyPostPublished("X", (xRes.value as { id: string }).id, cardType);

    return NextResponse.json({
      ok: true, breaking: isBreaking, cardUrl,
      fb: fbRes.status === "fulfilled" ? fbRes.value : String((fbRes as PromiseRejectedResult).reason),
      ig: igRes.status === "fulfilled" ? igRes.value : String((igRes as PromiseRejectedResult).reason),
      x:  xRes.status  === "fulfilled" ? xRes.value  : String((xRes  as PromiseRejectedResult).reason),
    });
  } catch (err) {
    console.error("x-posts/engagement error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
