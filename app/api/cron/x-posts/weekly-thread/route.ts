import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { sendTelegramMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
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
    const dir       = gold.changePercent >= 0 ? "+" : "";

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: `أنت محرر محتوى مالي عربي احترافي لموقع sardhahab.com.
اكتب بالعربية الفصحى المعاصرة. لا توصيات استثمارية. لا مبالغة. مفيد وموثوق وجذاب.`,
      messages: [{
        role: "user",
        content: `اليوم: ${today} (الجمعة)
الذهب: $${goldFmt} (${dir}${changePct}% هذا الأسبوع)
الفضة: $${silverFmt} | بيتكوين: $${btcFmt}

اكتب خيط X (Thread) أسبوعي من 6 تغريدات متصلة. كل تغريدة بحد أقصى 250 حرفاً.
أعطني JSON صارم فقط:
{
  "tweet1": "🧵 ملخص الذهب هذا الأسبوع... (هوك قوي + رقم بارز)",
  "tweet2": "أداء الذهب: السعر الحالي والتغيير الأسبوعي + تحليل مختصر",
  "tweet3": "مقارنة: الفضة والبيتكوين مقابل الذهب هذا الأسبوع",
  "tweet4": "درس أسبوعي: سبب مختصر لحركة الذهب (اقتصادي أو جيوسياسي)",
  "tweet5": "نظرة الأسبوع القادم: ما يجب متابعته",
  "tweet6": "🔔 تابع أسعار الذهب لحظة بلحظة → sardhahab.com | #سعر_الذهب"
}`,
      }],
    });

    const raw = (msg.content[0] as { text: string }).text.trim();
    let tweets: Record<string, string>;
    try {
      const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0] ?? raw;
      tweets = JSON.parse(jsonStr) as Record<string, string>;
    } catch {
      return NextResponse.json({ error: "JSON parse failed", raw }, { status: 500 });
    }

    const tweetList = [
      tweets.tweet1, tweets.tweet2, tweets.tweet3,
      tweets.tweet4, tweets.tweet5, tweets.tweet6,
    ].filter(Boolean);

    // Post as a thread: each tweet replies to the previous
    const tweetIds: string[] = [];
    for (const text of tweetList) {
      const { TwitterApi } = await import("twitter-api-v2");
      const client = new TwitterApi({
        appKey:      process.env.X_API_KEY!,
        appSecret:   process.env.X_API_SECRET!,
        accessToken: process.env.X_ACCESS_TOKEN!,
        accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
      });

      let result;
      if (tweetIds.length === 0) {
        result = await client.v2.tweet(text);
      } else {
        result = await client.v2.reply(text, tweetIds[tweetIds.length - 1]);
      }
      tweetIds.push(result.data.id);
      // Small delay between tweets to avoid rate limiting
      await new Promise(r => setTimeout(r, 1500));
    }

    // Notify via Telegram
    const telegramMsg =
      `🧵 <b>خيط الأسبوع — ${today}</b>\n\n` +
      tweetList.map((t, i) => `<b>${i + 1}/</b> ${t}`).join("\n\n") +
      `\n\n✅ نُشر على X بنجاح (${tweetIds.length} تغريدة)`;

    await sendTelegramMessage(telegramMsg).catch(() => null);

    return NextResponse.json({ ok: true, threadLength: tweetIds.length, tweetIds });
  } catch (err) {
    console.error("weekly-thread error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
