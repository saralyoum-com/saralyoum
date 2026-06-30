import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/ai";
import { getGoldPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { notifyPostPublished, sendTelegramToOwner } from "@/lib/telegram";
import { postToInstagram, buildSocialCardUrl } from "@/lib/social";

export const dynamic = "force-dynamic";

// Runs Mon + Thu 12:30 PM KSA (09:30 UTC) — educational card posted to Instagram
// Schedule in vercel.json: "30 9 * * 1,4"

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

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [gold, bitcoin] = await Promise.all([getGoldPrice(), getCryptoPrice("bitcoin")]);

    const now     = new Date();
    const weekNum = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
    const topic   = TOPICS[weekNum % TOPICS.length];

    const today = now.toLocaleDateString("ar-SA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: "Asia/Riyadh",
    });

    const goldFmt   = formatPrice(gold.price);
    const btcFmt    = formatPrice(bitcoin.price);
    const changePct = gold.changePercent.toFixed(2);
    const dir       = gold.changePercent >= 0 ? "up" : "down";

    const cardUrl = buildSocialCardUrl({
      type: "educational",
      gold: goldFmt, change: changePct, dir,
      topic,
    });

    const caption = await chat(
      "أنت محرر محتوى مالي تعليمي عربي. اكتب بأسلوب بسيط وواضح. لا توصيات استثمارية.",
      `اليوم: ${today} | الذهب: $${goldFmt} | بيتكوين: $${btcFmt}
موضوع اليوم: ${topic}

اكتب كابشن إنستغرام تعليمي من 80-120 كلمة:
- ابدأ بسؤال يثير الفضول
- اشرح المفهوم بمثال واقعي مختصر
- اربطه بالسوق الحالي
- CTA: رابط sardhahab.com في البايو
- 8-12 هاشتاقاً تعليمياً ومالياً
بدون ترقيم. بدون عناوين.`, 500);
    const igId = await postToInstagram(caption, cardUrl);
    await notifyPostPublished("Instagram", igId, `educational: ${topic}`);

    // Also send content to owner Telegram for awareness
    await sendTelegramToOwner(
      `📚 <b>كارت تعليمي — ${today}</b>\n📌 <b>${topic}</b>\n\n${caption}`,
    ).catch(() => null);

    return NextResponse.json({ ok: true, igId, cardUrl, topic });
  } catch (err) {
    console.error("instagram/carousel error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
