import { NextRequest, NextResponse } from "next/server";
import { isAuthed, unauthorized } from "@/lib/connectAuth";
import { getMonthPlan } from "@/lib/contentPlan";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized();

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // "YYYY-MM"
  const match = month?.match(/^(\d{4})-(\d{2})$/);
  const now = new Date();
  const year = match ? Number(match[1]) : now.getFullYear();
  const mon = match ? Number(match[2]) : now.getMonth() + 1;

  try {
    const rows = await getMonthPlan(year, mon);
    return NextResponse.json({ year, month: mon, rows });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
