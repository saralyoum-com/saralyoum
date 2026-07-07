import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Runs daily; only actually sends on 3 specific days inside Ramadan (start,
// mid, near the end) — computed live from the Umm al-Qura Hijri calendar via
// Intl, so this needs zero maintenance and is never wrong about the date.
const RAMADAN_MONTH = 9;
const SEND_ON_DAYS = [1, 15, 25];

function hijriMonthDay(d: Date): { month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
    month: "numeric",
    day: "numeric",
  }).formatToParts(d);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  return { month, day };
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { month, day } = hijriMonthDay(new Date());
  if (month !== RAMADAN_MONTH || !SEND_ON_DAYS.includes(day)) {
    return NextResponse.json({ ok: true, sent: false, hijri: `${month}/${day}` });
  }

  try {
    const { sendPushToAll } = await import("@/lib/onesignal");
    const push = await sendPushToAll({
      headingAr: "🌙 موسم الزكاة اقترب",
      contentAr: "احسب زكاة ذهبك وعملاتك الرقمية بسهولة — اضغط للحاسبة",
      url: "https://sardhahab.com/زكاة-الكريبتو",
    });
    return NextResponse.json({ ok: true, sent: true, hijri: `${month}/${day}`, push });
  } catch (err) {
    console.error("reminder-zakat error:", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
