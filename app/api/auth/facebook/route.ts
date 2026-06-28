import { NextRequest, NextResponse } from "next/server";
import { isAuthed, unauthorized } from "@/lib/connectAuth";

export const dynamic = "force-dynamic";

const APP_ID       = "1610561553968274";
const REDIRECT_URI = "https://sardhahab.com/api/auth/facebook/callback";
const SCOPE        = [
  "pages_manage_posts",
  "pages_show_list",
  "pages_read_engagement",
].join(",");

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized();

  const url =
    `https://www.facebook.com/v25.0/dialog/oauth` +
    `?client_id=${APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${SCOPE}` +
    `&response_type=code`;

  return NextResponse.redirect(url);
}
