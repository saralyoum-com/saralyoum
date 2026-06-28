import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getGoldPrice } from "@/lib/goldapi";
import { sendTelegramMessage } from "@/lib/telegram";
import { postToFacebook, postToInstagram, buildSocialCardUrl } from "@/lib/social";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `أنت محرر محتوى مالي عربي احترافي لموقع sardhahab.com.
اكتب بالعربية الفصحى المعاصرة. لا توصيات استثمارية. لا مبالغة. لا كليشيهات. مفيد وموثوق وجذاب.`;

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
    const gold = await getGoldPrice();
    const goldFmt  = formatPrice(gold.price);
    const changePct = gold.changePercent.toFixed(2);
    const dir       = gold.changePercent >= 0 ? "up" : "down";
    const topic     = getTodayTopic();

    const today = new Date().toLocaleDateString("ar-SA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: "Asia/Riyadh",
    });

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `اليوم: ${today} | الذهب حالياً: $${goldFmt}
الموضوع التعليمي: "${topic}"

اكتب محتوى تعليمياً لثلاث منصات بصيغة JSON صارمة — لا نص خارج الـ JSON:
{
  "instagram": "كابشن إنستغرام 60-90 كلمة: سؤال يوقف التمرير + 3 نقاط مختصرة + أسعار لحظية + هاشتاقات. لا رابط.",
  "facebook": "منشور فيسبوك تعليمي 200-280 كلمة: هوك + شرح مبسط للموضوع + نقطة عملية + رابط sardhahab.com + هاشتاقات",
  "telegram": "منشور تيليجرام تعليمي 100-150 كلمة: استخدم <b>للمصطلحات المهمة</b>"
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
      type: "educational", gold: goldFmt, change: changePct, dir, topic,
    });

    const [, fbRes, igRes] = await Promise.allSettled([
      sendTelegramMessage(`💡 <b>منشور تعليمي — ${today}</b>\n\n` + posts.telegram),
      postToFacebook(posts.facebook, cardUrl),
      postToInstagram(posts.instagram, cardUrl),
    ]);

    return NextResponse.json({
      ok: true, topic, cardUrl,
      fb: fbRes.status === "fulfilled" ? fbRes.value : String((fbRes as PromiseRejectedResult).reason),
      ig: igRes.status === "fulfilled" ? igRes.value : String((igRes as PromiseRejectedResult).reason),
    });
  } catch (err) {
    console.error("x-posts/educational error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
