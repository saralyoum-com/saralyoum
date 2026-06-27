import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// LinkedIn OAuth — enabled once Microsoft API approval arrives
export async function GET() {
  return NextResponse.redirect(
    "https://sardhahab.com/connect?error=linkedin_pending"
  );
}
