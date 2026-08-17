/**
 * LinkedIn content — one data-grounded article a week, two follow-ups.
 *
 * Replaces a generator that produced 150-200 words on an evergreen topic
 * ("why does gold rise in a crisis?"). Two things were wrong with it: the text
 * needed no data, so anyone could have written it without the site; and the
 * topic rotated on a week counter while the cron ran Mon/Wed/Fri, so all three
 * posts in a week covered the same subject as three unrelated standalone posts.
 *
 * Now the shared week is deliberate. Monday publishes the article, Wednesday
 * and Friday follow up on the same theme, and the FORMAT rotates weekly.
 *
 * Every figure is computed in lib/linkedinFormats.ts from live spot + live FX
 * and injected verbatim. The model writes connective prose only — it is never
 * asked for a number, which is what keeps the facts right when wording drifts.
 */
import { NextRequest, NextResponse } from "next/server";
import { chat, stripTanwin } from "@/lib/ai";
import { getGoldPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { sendTelegramToOwner } from "@/lib/telegram";
import { OZ } from "@/lib/goldDetails";
import { pickFormat, weekIndex, type FormatCtx } from "@/lib/linkedinFormats";

export const dynamic = "force-dynamic";

const SYSTEM =
  "أنت محرر محتوى مالي عربي لموقع sardhahab.com تكتب على LinkedIn لجمهور مهني. " +
  "أسلوبك هادئ وتحليلي وواقعي. ممنوع تماما: التوصيات الاستثمارية، المبالغة، " +
  "العبارات التحفيزية، الأسئلة الاستدراجية المصطنعة، والتنوين (اكتب ذهب لا ذهبا). " +
  "لا تخترع أي رقم أبدا — الأرقام تصلك جاهزة ولا تضيف غيرها.";

/** Long-form article: computed blocks with model prose between them. */
async function buildArticle(f: ReturnType<typeof pickFormat>) {
  const body = await chat(
    SYSTEM,
    `اكتب فقرتين إلى ثلاث فقرات شرح لمقال LinkedIn عربي.

الزاوية المطلوبة:
${f.angle}

قواعد صارمة:
- لا تكتب عنوانا ولا مقدمة ولا خاتمة — هذه أكتبها أنا.
- لا تذكر أي رقم إطلاقا. الأرقام معروضة في جدول منفصل.
- لا تبدأ بعبارة مثل "في عالم اليوم" أو "مما لا شك فيه".
- 180 إلى 240 كلمة. جمل قصيرة. بدون تنوين.
- اكتب النص مباشرة بدون أي تعليق منك.`,
    900,
  );

  return [
    f.headline,
    "",
    f.opening,
    "",
    "▪️ الأرقام",
    "",
    f.table,
    "",
    "▪️ ما الذي يفسر هذا؟",
    "",
    stripTanwin(body.trim()),
    "",
    "▪️ الخلاصة",
    "",
    f.closing,
    "",
    "▪️ ملاحظة على الأرقام",
    "",
    f.caveat,
    "",
    "هذا المقال تحليل بيانات ولا يتضمن أي توصية استثمارية.",
    "",
    `الأسعار محدثة لحظيا لـ 16 دولة عربية بعملاتها المحلية على:`,
    "https://sardhahab.com",
    "",
    "#الذهب #الاستثمار #الأسواق_الخليجية #التحليل_المالي",
  ].join("\n");
}

/** Short follow-up on the same week's theme. */
async function buildShortPost(
  f: ReturnType<typeof pickFormat>,
  kind: "midweek" | "endweek",
) {
  const brief =
    kind === "midweek"
      ? "اكتب تعليقا قصيرا يوسع الفكرة بزاوية عملية واحدة للمشتري."
      : "اكتب تعليقا قصيرا يربط الفكرة بما ينبغي أن ينتبه له المهني في القطاع.";

  const body = await chat(
    SYSTEM,
    `الفكرة الأساسية لهذا الأسبوع:
${f.snippet}

${brief}

قواعد صارمة:
- 40 إلى 70 كلمة فقط.
- لا تكرر الرقم الوارد أعلاه ولا تذكر أي رقم جديد.
- بدون تنوين. بدون توصية استثمارية. بدون عبارات تحفيزية.
- اكتب النص مباشرة بدون أي تعليق منك.`,
    500,
  );

  return [
    f.snippet,
    "",
    stripTanwin(body.trim()),
    "",
    "الأسعار اللحظية لـ 16 دولة عربية:",
    "https://sardhahab.com",
    "",
    "#الذهب #الأسواق_الخليجية",
  ].join("\n");
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [gold, rates] = await Promise.all([getGoldPrice(), getExchangeRates()]);

    const now = new Date();
    const ksa = new Date(now.getTime() + 3 * 3600_000);
    const todayAr = now.toLocaleDateString("ar-SA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: "Asia/Riyadh",
    });

    const rateMap: Record<string, number> = {};
    for (const r of rates) rateMap[r.code] = r.rate;

    const ctx: FormatCtx = {
      goldOz: gold.price,
      changePct: gold.changePercent,
      gram24: gold.price / OZ,
      rates: rateMap,
      todayAr,
    };

    const f = pickFormat(ksa, ctx);

    // Mon = article, Wed/Fri = follow-ups on the same theme. Any other day the
    // cron should not have fired, so treat it as a mid-week follow-up.
    const dow = ksa.getUTCDay();                 // 1 Mon · 3 Wed · 5 Fri
    // ?kind= overrides the day mapping so a post can be regenerated on demand
    // (and so the article path is testable on a non-Monday). Still behind
    // CRON_SECRET — this is not a public endpoint.
    const forced = req.nextUrl.searchParams.get("kind");
    const kind =
      forced === "article" || forced === "midweek" || forced === "endweek"
        ? forced
        : dow === 1 ? "article" : dow === 5 ? "endweek" : "midweek";

    const text =
      kind === "article"
        ? await buildArticle(f)
        : await buildShortPost(f, kind);

    const label = kind === "article" ? "مقال" : "منشور قصير";
    const words = text.split(/\s+/).length;

    await sendTelegramToOwner(
      `💼 <b>LinkedIn — ${label}</b>\n` +
      `${todayAr}\n` +
      `الصيغة: <code>${f.key}</code> · أسبوع ${weekIndex(ksa)} · ${words} كلمة\n\n` +
      `👇 انسخ النص من الرسالة التالية وانشره`,
    );
    // Sent bare so a long-press copy grabs exactly the post and nothing else.
    await sendTelegramToOwner(text, { plain: true });

    return NextResponse.json({
      ok: true, kind, format: f.key, week: weekIndex(ksa), words,
      // Echoed so a manual run can be inspected without digging through
      // Telegram. Endpoint is CRON_SECRET-gated, so this is not public.
      text,
    });
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    console.error("[linkedin]", detail);
    return NextResponse.json({ error: "Failed", detail }, { status: 500 });
  }
}
