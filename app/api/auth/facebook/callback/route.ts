import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const APP_ID       = "1610561553968274";
const REDIRECT_URI = "https://sardhahab.com/api/auth/facebook/callback";
const PAGE_ID      = process.env.FB_PAGE_ID ?? "1115554444982087";

async function graphGet(path: string) {
  const r = await fetch(`https://graph.facebook.com/v25.0${path}`);
  return r.json();
}

export async function GET(req: NextRequest) {
  const code  = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error_description");

  if (!code) {
    const msg = error ?? "cancelled";
    return NextResponse.redirect(`https://sardhahab.com/connect?error=${encodeURIComponent(msg)}`);
  }

  const APP_SECRET = process.env.FB_APP_SECRET ?? "";
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 1 — exchange code for short-lived user token
    const tokenRes = await graphGet(
      `/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code=${code}`
    );
    if (!tokenRes.access_token) throw new Error(JSON.stringify(tokenRes));
    const userToken: string = tokenRes.access_token;

    // 2 — exchange for long-lived user token (60 days)
    const longRes = await graphGet(
      `/oauth/access_token?grant_type=fb_exchange_token` +
      `&client_id=${APP_ID}&client_secret=${APP_SECRET}` +
      `&fb_exchange_token=${userToken}`
    );
    const longToken: string = longRes.access_token ?? userToken;

    // 3 — get never-expiring page token
    const pagesRes = await graphGet(
      `/me/accounts?access_token=${longToken}&fields=id,access_token`
    );
    const page = (pagesRes.data ?? []).find((p: { id: string }) => p.id === PAGE_ID);
    const pageToken: string = page?.access_token ?? longToken;

    // 4 — save to Supabase (upsert so re-auth just updates)
    await sb.from("social_tokens").upsert({
      platform:   "facebook",
      token:      pageToken,
      meta:       { page_id: PAGE_ID },
      connected:  true,
      updated_at: new Date().toISOString(),
    }, { onConflict: "platform" });

    return NextResponse.redirect("https://sardhahab.com/connect?success=facebook");

  } catch (e) {
    console.error("fb-callback error", e);
    return NextResponse.redirect(
      `https://sardhahab.com/connect?error=${encodeURIComponent(String(e))}`
    );
  }
}
