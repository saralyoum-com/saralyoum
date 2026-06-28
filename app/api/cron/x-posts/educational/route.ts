import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getGoldPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { sendTelegramMessage } from "@/lib/telegram";
import { postToFacebook, postToInstagram } from "@/lib/social";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `أنت كبير استراتيجيي وسائل التواصل الاجتماعي ومحرر المحتوى المالي لموقع Sardhahab.com.
مهمتك إنشاء محتوى عربي احترافي لمنصة X يستهدف الجمهور السعودي والخليجي.
اكتب بالعربية الفصحى المعاصرة. لا توصيات استثمارية. لا مبالغة. لا كليشيهات. المحتوى مفيد وموثوق وجذاب.`;

const TOPICS = [
  "لماذا يرتفع الذهب وينخفض — العوامل الأساسية",
  "الفرق بين الذهب كاستثمار والذهب كمجوهرات",
  "البيتكوين مقابل الذهب — أيهما أفضل ملاذاً آمناً؟",
  "تأثير أسعار الفائدة على الذهب",
  "التضخم وكيف يحمي الذهب ثروتك",
  "أنواع الاستثمار في الذهب: سبائك، عملات، صناديق، عقود",
  "الذهب والدولار — العلاقة العكسية",
  "البنوك المركزية والذهب — لماذا تشتريه الدول؟",
  "الفضة مقابل الذهب — أيهما للمستثمر الصغير؟",
  "كيف تقرأ سعر الذهب وتفهم حركته اليومية",
];

function getTodayTopic() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return TOPICS[dayOfYear % TOPICS.length];
}

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [gold, bitcoin] = await Promise.all([
      getGoldPrice(),
      getCryptoPrice("bitcoin"),
    ]);

    const today = new Date().toLocaleDateString("ar-SA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: "Asia/Riyadh",
    });

    const topic = getTodayTopic();

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `اليوم: ${today}
الذهب حالياً: $${formatPrice(gold.price)} | بيتكوين: $${formatPrice(bitcoin.price)}

موضوع اليوم التعليمي: "${topic}"

اكتب منشور X تعليمي جاهز للنشر (120–250 كلمة).
المطلوب: هوك مثير + شرح مبسط + نقطة عملية يأخذها القارئ + دعوة للتفاعل + رابط sardhahab.com + هاشتاقات.
لا تضف عنوان أو تسمية. أخرج النص مباشرة جاهزاً للنسخ.`,
      }],
    });

    const post = (msg.content[0] as { text: string }).text.trim();
    const imageUrl = "https://sardhahab.com/api/og?asset=gold";

    const [, fbId, igId] = await Promise.allSettled([
      sendTelegramMessage(`💡 <b>منشور تعليمي — ${today}</b>\n\n` + post),
      postToFacebook(post, imageUrl),
      postToInstagram(post, imageUrl),
    ]);

    return NextResponse.json({
      ok: true,
      fb: fbId.status === "fulfilled" ? fbId.value : String((fbId as PromiseRejectedResult).reason),
      ig: igId.status === "fulfilled" ? igId.value : String((igId as PromiseRejectedResult).reason),
    });
  } catch (err) {
    console.error("x-posts/educational error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
