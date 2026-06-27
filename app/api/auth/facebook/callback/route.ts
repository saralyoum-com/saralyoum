import { NextRequest, NextResponse } from "next/server";

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
  const code  = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error_description");

  if (!code) {
    const msg = error ?? "cancelled";
    return NextResponse.redirect(`https://sardhahab.com/connect?error=${encodeURIComponent(msg)}`);
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

    // 3 — get never-expiring page token
    const pagesRes = await graphGet(
      `/me/accounts?access_token=${longToken}&fields=id,access_token`
    );
    const page = (pagesRes.data ?? []).find((p: { id: string }) => p.id === PAGE_ID);
    const pageToken: string = page?.access_token ?? longToken;

    // 4 — save to Vercel env vars (persists across deploys)
    await upsertVercelEnv("FB_PAGE_TOKEN", pageToken, API_TOKEN);

    return NextResponse.redirect("https://sardhahab.com/connect?success=facebook");

  } catch (e) {
    console.error("fb-callback error", e);
    return NextResponse.redirect(
      `https://sardhahab.com/connect?error=${encodeURIComponent(String(e))}`
    );
  }
}
