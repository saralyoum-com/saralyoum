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

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `اليوم: ${today}

بيانات السوق الآن:
- الذهب: $${formatPrice(gold.price)} (${gold.changePercent >= 0 ? "+" : ""}${gold.changePercent.toFixed(2)}%)
- الفضة: $${formatPrice(silver.price)} (${silver.changePercent >= 0 ? "+" : ""}${silver.changePercent.toFixed(2)}%)
- بيتكوين: $${formatPrice(bitcoin.price)} (${bitcoin.changePercent >= 0 ? "+" : ""}${bitcoin.changePercent.toFixed(2)}%)

اكتب منشور X صباحي جاهز للنشر (80–180 كلمة).
المطلوب: هوك قوي + تحليل مختصر للسوق اليوم + دعوة للتفاعل + رابط sardhahab.com + هاشتاقات.
لا تضف عنوان أو تسمية. أخرج النص مباشرة جاهزاً للنسخ.`,
      }],
    });

    const post = (msg.content[0] as { text: string }).text.trim();
    const header = `📅 <b>منشور الصباح — ${today}</b>\n\n`;
    await sendTelegramMessage(header + post);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("x-posts/morning error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
