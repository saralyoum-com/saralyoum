import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await sb
    .from("social_tokens")
    .select("platform, connected, updated_at");

  const out: Record<string, { connected: boolean; updated_at?: string }> = {};
  for (const row of data ?? []) {
    out[row.platform] = { connected: row.connected, updated_at: row.updated_at };
  }
  return NextResponse.json(out);
}
