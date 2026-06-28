import { NextRequest, NextResponse } from "next/server";
import { isAuthed, unauthorized } from "@/lib/connectAuth";

export const dynamic = "force-dynamic";

// LinkedIn OAuth — enabled once Microsoft API approval arrives
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized();
  return NextResponse.redirect(
    "https://sardhahab.com/connect?error=linkedin_pending"
  );
}
