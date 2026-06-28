import { NextRequest, NextResponse } from "next/server";
import { isAuthed, unauthorized } from "@/lib/connectAuth";

export const dynamic = "force-dynamic";

// X/Twitter OAuth — enabled once SARD account is created
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized();
  return NextResponse.redirect(
    "https://sardhahab.com/connect?error=twitter_pending"
  );
}
