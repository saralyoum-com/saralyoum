import { NextRequest, NextResponse } from "next/server";
import { checkPin, rateLimitOk, setSessionCookie } from "@/lib/connectAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!process.env.CONNECT_PIN) {
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }
  if (!rateLimitOk(req)) {
    return NextResponse.json({ error: "too many attempts" }, { status: 429 });
  }

  let pin = "";
  try {
    const body = await req.json();
    pin = typeof body?.pin === "string" ? body.pin : "";
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (!checkPin(pin)) {
    return NextResponse.json({ error: "wrong pin" }, { status: 401 });
  }

  return setSessionCookie(NextResponse.json({ ok: true }));
}
