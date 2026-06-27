import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const APP_ID       = "1610561553968274";
const REDIRECT_URI = "https://sardhahab.com/api/auth/facebook/callback";
const SCOPE        = [
  "pages_manage_posts",
  "pages_show_list",
  "pages_read_engagement",
  "instagram_basic",
  "instagram_content_publish",
].join(",");

export async function GET() {
  const url =
    `https://www.facebook.com/v25.0/dialog/oauth` +
    `?client_id=${APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${SCOPE}` +
    `&response_type=code`;
  return NextResponse.redirect(url);
}
