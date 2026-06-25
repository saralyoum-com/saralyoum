import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { sendTelegramMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `أنت كبير استراتيجيي وسائل التواصل الاجتماعي ومحرر المحتوى المالي لموقع Sardhahab.com.
مهمتك إنشاء محتوى عربي احترافي لمنصة X يستهدف الجمهور السعودي والخليجي.
اكتب بالعربية الفصحى المعاصرة. لا توصيات استثمارية. لا مبالغة. لا كليشيهات. المحتوى مفيد وموثوق وجذاب.`;

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

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Engagement post
    const engMsg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `اليوم: ${today}
الذهب: $${formatPrice(gold.price)} | الفضة: $${formatPrice(silver.price)} | بيتكوين: $${formatPrice(bitcoin.price)}

اكتب منشور X تفاعلي (20–80 كلمة): إما استفتاء أو سؤال أو تنبؤ بالسوق.
الهدف: أكبر عدد من التعليقات وإعادة النشر.
لا تضف عنوان أو تسمية. أخرج النص مباشرة جاهزاً للنسخ.`,
      }],
    });

    const engPost = (engMsg.content[0] as { text: string }).text.trim();

    // Trending post — generate only if there's something notable in the market
    const trendMsg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `اليوم: ${today}
الذهب: $${formatPrice(gold.price)} (${gold.changePercent >= 0 ? "+" : ""}${gold.changePercent.toFixed(2)}%)
الفضة: $${formatPrice(silver.price)} (${silver.changePercent >= 0 ? "+" : ""}${silver.changePercent.toFixed(2)}%)
بيتكوين: $${formatPrice(bitcoin.price)} (${bitcoin.changePercent >= 0 ? "+" : ""}${bitcoin.changePercent.toFixed(2)}%)

هل توجد حركة سعرية لافتة أو خبر مهم يستحق منشور عاجل اليوم بناءً على هذه البيانات؟
- إذا نعم: اكتب منشور عاجل (50–150 كلمة) يشرح الحدث وتأثيره على الذهب. أبدأ بـ 🚨
- إذا لا: اكتب فقط الكلمة: SKIP
لا تضف عنوان أو تسمية إضافية.`,
      }],
    });

    const trendPost = (trendMsg.content[0] as { text: string }).text.trim();

    const header = `📊 <b>منشور المساء — ${today}</b>\n\n`;
    let message = header + engPost;

    if (trendPost !== "SKIP" && !trendPost.startsWith("SKIP")) {
      message += `\n\n─────────────────\n🚨 <b>منشور عاجل</b>\n\n${trendPost}`;
    }

    await sendTelegramMessage(message);

    return NextResponse.json({ ok: true, trending: trendPost !== "SKIP" });
  } catch (err) {
    console.error("x-posts/engagement error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
