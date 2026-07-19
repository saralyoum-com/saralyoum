import { NextResponse } from "next/server";
import { getTechnicalData } from "@/lib/technical";

export const dynamic = "force-dynamic";

// Real RSI/MA signals for client components (PricesClient). Server pages call
// getTechnicalData() directly; the underlying Yahoo fetches are cached 1h so
// this stays cheap.
export async function GET() {
  const signals = await getTechnicalData();
  return NextResponse.json(
    { signals },
    { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } }
  );
}
