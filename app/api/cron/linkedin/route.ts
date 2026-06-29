import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { sendTelegramToOwner } from "@/lib/telegram";

export const dynamic = "force-dynamic";

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

const TOPICS = [
  "لماذا يرتفع الذهب في أوقات الأزمات؟",
  "الفرق بين الذهب الاستثماري والمجوهرات",
  "البيتكوين مقابل الذهب: أيهما الملاذ الآمن؟",
  "تأثير أسعار الفائدة الأمريكية على الذهب",
  "التضخم وكيف يحمي الذهب الثروة",
  "أنواع الاستثمار في الذهب: سبائك أم صناديق أم عقود؟",
  "علاقة الدولار بأسعار الذهب العالمية",
  "البنوك المركزية والذهب: لماذا تشتري؟",
  "الفضة مقابل الذهب: أيهما أفضل للمستثمر العربي؟",
  "كيف تقرأ سعر الذهب وتفهم مؤشراته؟",
];

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

    const now = new Date();
    const today = now.toLocaleDateString("ar-SA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: "Asia/Riyadh",
    });

    const goldFmt   = formatPrice(gold.price);
    const silverFmt = formatPrice(silver.price);
    const btcFmt    = formatPrice(bitcoin.price);
    const changePct = gold.changePercent.toFixed(2);

    // Rotate topic by week number so it changes weekly not daily
    const weekNum = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
    const topic = TOPICS[weekNum % TOPICS.length];

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      system: `أنت محرر محتوى مالي احترافي لصفحة LinkedIn باللغة العربية لموقع sardhahab.com.
أسلوبك: هادئ، موثوق، تحليلي. لا توصيات استثمارية. لا مبالغة. موجه للمهنيين والمستثمرين العرب.`,
      messages: [{
        role: "user",
        content: `اليوم: ${today}
الذهب: $${goldFmt} (${gold.changePercent >= 0 ? "+" : ""}${changePct}%)
الفضة: $${silverFmt} | بيتكوين: $${btcFmt}
موضوع اليوم: ${topic}

اكتب منشور LinkedIn احترافي 150-200 كلمة:
- افتتاحية قوية تستوقف القارئ (سطر أو سطران)
- ربط الموضوع بالأسعار الحالية
- درس أو رؤية مفيدة للمستثمر العربي
- خاتمة بسؤال يشجع على التعليق
- رابط: sardhahab.com
- 3-4 هاشتاقات مناسبة

اكتب المنشور مباشرة بدون مقدمات.`,
      }],
    });

    const post = (msg.content[0] as { text: string }).text.trim();

    const telegramMsg =
      `💼 <b>منشور LinkedIn — ${today}</b>\n` +
      `📌 <b>الموضوع:</b> ${topic}\n\n` +
      `─────────────────\n\n` +
      post +
      `\n\n─────────────────\n` +
      `⚠️ انسخ المنشور أعلاه وانشره يدوياً على LinkedIn`;

    await sendTelegramToOwner(telegramMsg);

    return NextResponse.json({ ok: true, topic, charCount: post.length });
  } catch (err) {
    console.error("linkedin cron error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
