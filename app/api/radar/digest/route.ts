import { NextRequest, NextResponse } from "next/server";
import { buildRadarReport, type Finding } from "@/lib/radar";
import { sendTelegramToOwner } from "@/lib/telegram";

export const dynamic = "force-dynamic";

/**
 * /api/radar/digest — the daily push half of the radar agent.
 *
 * Driven by cron on EC2, not Vercel: the Hobby plan only ever fires the first
 * two entries in vercel.json, and those are already spoken for.
 *
 *   0 6 * * *  curl -fsS -H "Authorization: Bearer $CRON_SECRET" \
 *                https://sardhahab.com/api/radar/digest >> ~/logs/radar.log 2>&1
 *
 * Cron-only: no PIN fallback here, because this endpoint sends a message rather
 * than returning one. A dashboard visitor reads /api/radar instead.
 *
 * Quiet by default. A digest that arrives every morning saying "all fine" is
 * one the owner learns to swipe away, so nothing is sent unless something is
 * actually wrong — `?force=1` overrides that for testing.
 */

const TELEGRAM_LIMIT = 3800; // leave room under Telegram's 4096 for the footer

const ICON: Record<Finding["severity"], string> = {
  critical: "🔴",
  warning: "🟠",
  opportunity: "🟢",
  info: "⚪",
};

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const force = req.nextUrl.searchParams.get("force") === "1";

  try {
    const report = await buildRadarReport(30);
    const actionable = report.findings.filter(
      (f) => f.severity === "critical" || f.severity === "warning"
    );

    if (!actionable.length && !force) {
      return NextResponse.json({ sent: false, reason: "لا توجد نتائج تستدعي التنبيه" });
    }

    const lines: string[] = [`📡 وكيل الرصد · آخر ${report.windowDays} يوم`, ""];

    // Actionable findings lead; opportunities follow as one-liners.
    for (const f of actionable) {
      lines.push(`${ICON[f.severity]} ${f.title}`);
      lines.push(`   ${f.detail}`);
      lines.push("");
    }

    const wins = report.findings.filter((f) => f.severity === "opportunity");
    if (wins.length) {
      lines.push("— فرص —");
      for (const w of wins) lines.push(`🟢 ${w.title}`);
      lines.push("");
    }

    if (report.site) {
      const owned = report.owned.configured ? ` (${report.owned.sessions} بعد استبعاد الآلي)` : "";
      lines.push(`الموقع: ${report.site.current.sessions} جلسة${owned}`);
    }
    if (report.search) {
      const s = report.search.totals;
      lines.push(`البحث: ${s.clicks} نقرة من ${s.impressions.toLocaleString("en")} ظهور · ترتيب ${s.position.toFixed(1)}`);
    }
    if (report.errors.length) lines.push(`⚠️ مصادر فشلت: ${report.errors.length}`);
    lines.push("", "https://sardhahab.com/radar");

    let text = lines.join("\n");
    if (text.length > TELEGRAM_LIMIT) text = `${text.slice(0, TELEGRAM_LIMIT)}\n…`;

    await sendTelegramToOwner(text, { plain: true });

    return NextResponse.json({
      sent: true,
      findings: report.findings.length,
      actionable: actionable.length,
    });
  } catch (err) {
    console.error("[radar/digest] failed:", err);
    return NextResponse.json(
      { error: "تعذر إرسال الملخص", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
