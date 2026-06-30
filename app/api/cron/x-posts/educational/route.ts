import { NextRequest, NextResponse } from "next/server";
import { chat, parseSocialPosts } from "@/lib/ai";
import { getGoldPrice } from "@/lib/goldapi";
import { sendTelegramMessage, notifyPostPublished } from "@/lib/telegram";
import { postToFacebook, postToInstagram, buildSocialCardUrl } from "@/lib/social";
import { postToX } from "@/lib/twitter";

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

    const raw = await chat(SYSTEM_PROMPT, `اليوم: ${today} | الذهب حالياً: $${goldFmt}
الموضوع التعليمي: "${topic}"

اكتب محتوى تعليمياً لخمس منصات بصيغة JSON صارمة — لا نص خارج الـ JSON:
{
  "instagram": "كابشن إنستغرام 60-90 كلمة: سؤال يوقف التمرير + 3 نقاط مختصرة + أسعار لحظية + هاشتاقات. لا رابط.",
  "facebook": "منشور فيسبوك تعليمي 200-280 كلمة: هوك + شرح مبسط للموضوع + نقطة عملية + رابط sardhahab.com + هاشتاقات",
  "telegram": "منشور تيليجرام تعليمي 100-150 كلمة: استخدم <b>للمصطلحات المهمة</b>",
  "x": "تغريدة X تعليمية بحد أقصى 260 حرفاً: حقيقة مفاجئة أو سؤال ذكي عن الموضوع + هاشتاق واحد فقط.",
  "linkedin": "منشور LinkedIn تعليمي احترافي 150-200 كلمة: مقدمة تستحق القراءة + شرح الموضوع بعمق + تطبيق عملي + رابط sardhahab.com."
}`, 1000);
    const posts = parseSocialPosts(raw, topic);

    const cardUrl = buildSocialCardUrl({
      type: "educational", gold: goldFmt, change: changePct, dir, topic,
    });

    const telegramMsg =
      `💡 <b>منشور تعليمي — ${today}</b>\n\n` +
      posts.telegram +
      `\n\n─────────────────\n🐦 <b>X / Twitter</b> (انسخ وانشر يدوياً)\n\n` +
      posts.x +
      `\n\n─────────────────\n💼 <b>LinkedIn</b> (انسخ وانشر يدوياً)\n\n` +
      posts.linkedin;

    const [, fbRes, igRes, xRes] = await Promise.allSettled([
      sendTelegramMessage(telegramMsg),
      postToFacebook(posts.facebook, cardUrl),
      postToInstagram(posts.instagram, cardUrl),
      postToX(posts.x, cardUrl),
    ]);

    if (fbRes.status === "fulfilled") await notifyPostPublished("Facebook", String(fbRes.value), "educational");
    if (igRes.status === "fulfilled") await notifyPostPublished("Instagram", String(igRes.value), "educational");
    if (xRes.status  === "fulfilled") await notifyPostPublished("X", (xRes.value as { id: string }).id, "educational");

    return NextResponse.json({
      ok: true, topic, cardUrl,
      fb: fbRes.status === "fulfilled" ? fbRes.value : String((fbRes as PromiseRejectedResult).reason),
      ig: igRes.status === "fulfilled" ? igRes.value : String((igRes as PromiseRejectedResult).reason),
      x:  xRes.status  === "fulfilled" ? xRes.value  : String((xRes  as PromiseRejectedResult).reason),
    });
  } catch (err) {
    console.error("x-posts/educational error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
