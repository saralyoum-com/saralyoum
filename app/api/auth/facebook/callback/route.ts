import { NextRequest, NextResponse } from "next/server";
import { isAuthed, unauthorized, verifyState, clearState } from "@/lib/connectAuth";

export const dynamic = "force-dynamic";

const APP_ID        = "1610561553968274";
const REDIRECT_URI  = "https://sardhahab.com/api/auth/facebook/callback";
const PAGE_ID       = process.env.FB_PAGE_ID ?? "1115554444982087";
const PROJECT_ID    = "prj_5P7Ym3YLQqMmTvyifRzcrttAmHXj";
const TEAM_ID       = "team_uxVeVf8qEY0cFVLyEGbxxUBn";
const VERCEL_ENVS   = ["production", "preview", "development"];

async function graphGet(path: string) {
  const r = await fetch(`https://graph.facebook.com/v25.0${path}`);
  return r.json();
}

async function upsertVercelEnv(key: string, value: string, apiToken: string) {
  const base = `https://api.vercel.com/v9/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`;

  // Check if env exists
  const listRes = await fetch(`${base}&key=${key}`, {
    headers: { Authorization: `Bearer ${apiToken}` },
  });
  const existing = await listRes.json();
  const envId = existing.envs?.[0]?.id;

  if (envId) {
    // PATCH existing
    await fetch(`${base.split("?")[0]}/${envId}?teamId=${TEAM_ID}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ value, target: VERCEL_ENVS }),
    });
  } else {
    // POST new
    await fetch(base, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, type: "encrypted", target: VERCEL_ENVS }),
    });
  }
}

export async function GET(req: NextRequest) {
  // Only an authed operator who started the flow from /connect can land here.
  if (!isAuthed(req)) return unauthorized();

  const code  = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error_description");

  // CSRF: the state param must match the single-use state cookie.
  if (!verifyState(req, state)) {
    const res = NextResponse.redirect("https://sardhahab.com/connect?error=invalid_state");
    clearState(res);
    return res;
  }

  if (!code) {
    const msg = error ?? "cancelled";
    const res = NextResponse.redirect(`https://sardhahab.com/connect?error=${encodeURIComponent(msg)}`);
    clearState(res);
    return res;
  }

  const APP_SECRET  = process.env.FB_APP_SECRET ?? "";
  const API_TOKEN   = process.env.VERCEL_API_TOKEN ?? "";

  try {
    // 1 — exchange code → short-lived user token
    const tokenRes = await graphGet(
      `/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code=${code}`
    );
    if (!tokenRes.access_token) throw new Error(JSON.stringify(tokenRes));

    // 2 — exchange → 60-day long-lived user token
    const longRes = await graphGet(
      `/oauth/access_token?grant_type=fb_exchange_token` +
      `&client_id=${APP_ID}&client_secret=${APP_SECRET}` +
      `&fb_exchange_token=${tokenRes.access_token}`
    );
    const longToken: string = longRes.access_token ?? tokenRes.access_token;

    // 3 — get never-expiring page token (must use PAGE token, not user token)
    const pagesRes = await graphGet(
      `/me/accounts?access_token=${longToken}&fields=id,access_token&limit=25`
    );
    const allPages: Array<{ id: string; access_token: string }> = pagesRes.data ?? [];
    const page = allPages.find(p => p.id === PAGE_ID);
    if (!page) throw new Error(`Page ${PAGE_ID} not found in accounts. Available: ${allPages.map(p=>p.id).join(",")}`);
    const pageToken: string = page.access_token;

    // 4 — get Instagram Business Account ID linked to the page
    const igRes = await graphGet(
      `/${PAGE_ID}?fields=instagram_business_account&access_token=${pageToken}`
    );
    const igId: string = igRes.instagram_business_account?.id ?? "";

    // 5 — save everything to Vercel env vars (persists across deploys)
    await upsertVercelEnv("FB_PAGE_TOKEN", pageToken, API_TOKEN);
    if (igId) await upsertVercelEnv("INSTAGRAM_ACCOUNT_ID", igId, API_TOKEN);

    const success = igId ? "facebook&success=instagram" : "facebook";
    const res = NextResponse.redirect(`https://sardhahab.com/connect?success=${success}`);
    clearState(res);
    return res;

  } catch (e) {
    console.error("fb-callback error", e);
    const res = NextResponse.redirect(
      `https://sardhahab.com/connect?error=${encodeURIComponent(String(e))}`
    );
    clearState(res);
    return res;
  }
}
