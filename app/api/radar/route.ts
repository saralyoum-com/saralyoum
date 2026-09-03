import { NextRequest, NextResponse } from "next/server";
import { isAuthed, unauthorized } from "@/lib/connectAuth";
import { buildRadarReport } from "@/lib/radar";

export const dynamic = "force-dynamic";

/**
 * /api/radar — the monitoring agent's report.
 *
 * Two callers, two credentials:
 *  - the cron job on EC2 sends `Authorization: Bearer $CRON_SECRET`
 *  - the owner's dashboard sends the signed PIN session cookie
 *
 * Anything else gets 401. The report contains traffic and revenue-shaped data
 * about the business, so it is never public — unlike /api/prices.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const viaCron = Boolean(cronSecret) && req.headers.get("authorization") === `Bearer ${cronSecret}`;

  if (!viaCron && !isAuthed(req)) return unauthorized();

  const requested = Number(req.nextUrl.searchParams.get("days"));
  // Clamp: GA4 rejects silly ranges and a 400-day pull would time out the lambda.
  const days = Number.isFinite(requested) ? Math.min(Math.max(Math.trunc(requested), 7), 90) : 30;

  try {
    const report = await buildRadarReport(days);
    return NextResponse.json(report, {
      // Short cache: the underlying APIs update daily, and a cron plus a couple
      // of dashboard refreshes must not burn the GA4 quota.
      headers: { "cache-control": "private, max-age=0, s-maxage=900" },
    });
  } catch (err) {
    console.error("[radar] failed:", err);
    return NextResponse.json(
      { error: "تعذر بناء التقرير", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
