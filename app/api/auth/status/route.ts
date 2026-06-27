import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Each platform → the env var that holds its token (set by OAuth callbacks)
const TOKEN_VARS: Record<string, string> = {
  facebook:  "FB_PAGE_TOKEN",
  instagram: "INSTAGRAM_TOKEN",
  linkedin:  "LINKEDIN_TOKEN",
  twitter:   "TWITTER_TOKEN",
};

export async function GET() {
  const out: Record<string, { connected: boolean }> = {};
  for (const [platform, envVar] of Object.entries(TOKEN_VARS)) {
    const val = process.env[envVar] ?? "";
    out[platform] = { connected: val.length > 20 };
  }
  return NextResponse.json(out);
}
