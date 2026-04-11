import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    supabase_url:         !!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_"),
    supabase_anon_key:    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your_"),
    supabase_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your_"),
    resend_key:           !!process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("your_"),
    goldapi_key:          !!process.env.GOLDAPI_KEY && !process.env.GOLDAPI_KEY.includes("your_"),
    cron_secret:          !!process.env.CRON_SECRET,
  };

  // Test Supabase connection
  let supabase_connected = false;
  let supabase_table = false;
  if (checks.supabase_url && checks.supabase_service_key) {
    try {
      const { createServiceClient } = await import("@/lib/supabase");
      const client = createServiceClient();
      const { error } = await client.from("alerts").select("id").limit(1);
      supabase_connected = true;
      supabase_table = !error;
    } catch { /* */ }
  }

  // Test GoldAPI
  let goldapi_valid = false;
  if (checks.goldapi_key) {
    try {
      const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
        headers: { "x-access-token": process.env.GOLDAPI_KEY! },
        cache: "no-store",
      });
      const d = await res.json();
      goldapi_valid = !!d.price && !d.error;
    } catch { /* */ }
  }

  // Test Resend
  let resend_valid = false;
  if (checks.resend_key) {
    try {
      const { Resend } = await import("resend");
      const r = new Resend(process.env.RESEND_API_KEY);
      const { data } = await r.domains.list();
      resend_valid = !!data;
    } catch { /* */ }
  }

  const allGood = Object.values(checks).every(Boolean) && supabase_connected && supabase_table;

  return NextResponse.json({
    status: allGood ? "✅ All systems operational" : "⚠️ Some services need configuration",
    env_vars: checks,
    connectivity: {
      supabase_connected,
      supabase_table_exists: supabase_table,
      goldapi_valid,
      resend_valid,
    },
    missing: Object.entries(checks)
      .filter(([, v]) => !v)
      .map(([k]) => k),
  });
}
