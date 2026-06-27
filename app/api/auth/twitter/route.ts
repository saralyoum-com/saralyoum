import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// X/Twitter OAuth — enabled once SARD account is created
export async function GET() {
  return NextResponse.redirect(
    "https://sardhahab.com/connect?error=twitter_pending"
  );
}
