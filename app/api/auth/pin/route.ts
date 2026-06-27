import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const pin     = req.nextUrl.searchParams.get("pin") ?? "";
  const correct = process.env.CONNECT_PIN;
  if (!correct) return NextResponse.json({ error: "not configured" }, { status: 500 });
  if (pin === correct) return NextResponse.json({ ok: true });
  return NextResponse.json({ error: "wrong pin" }, { status: 401 });
}
