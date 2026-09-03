import { createServiceClient } from "@/lib/supabase";
import { safeDecode } from "./decode";

/**
 * Our own event store (Supabase `events`, fed by /api/collect).
 *
 * This is the one source nobody else can throttle or bill us for, and it is
 * already bot-filtered at write time — /api/collect drops self-declared
 * automation. That makes it the honest denominator: comparing its session count
 * against GA4's is how the report estimates the automated share of traffic,
 * which is the whole reason the "Direct" channel looks enormous in GA4.
 */

export type OwnedSnapshot = {
  configured: boolean;
  events: number;
  sessions: number;
  eventsPerSession: number;
  topEvents: { key: string; count: number }[];
  topPages: { key: string; count: number }[];
  devices: { key: string; count: number }[];
  geoCoverage: number; // share of rows carrying a country — 0 means enrichment is broken
};

type EventRow = {
  event: string | null;
  session_id: string | null;
  page_path: string | null;
  country_code: string | null;
  device: string | null;
};

const EMPTY: OwnedSnapshot = {
  configured: false,
  events: 0,
  sessions: 0,
  eventsPerSession: 0,
  topEvents: [],
  topPages: [],
  devices: [],
  geoCoverage: 0,
};

export function ownedConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && !url.includes("your_") && key && !key.includes("your_"));
}

function tally(rows: EventRow[], pick: (r: EventRow) => string | null, limit: number) {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const key = pick(r);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  // Array.from, not spread: the project targets a level where spreading a Map
  // iterator needs --downlevelIteration.
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

/** Paths arrive percent-encoded from the browser; show them readable. */
const decodePath = (path: string | null) => (path ? safeDecode(path) : null);

export async function ownedSnapshot(days = 30): Promise<OwnedSnapshot> {
  if (!ownedConfigured()) return EMPTY;

  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("events")
    .select("event,session_id,page_path,country_code,device")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(10_000);

  if (error || !data) return { ...EMPTY, configured: true };

  const rows = data as EventRow[];
  const sessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;
  const withGeo = rows.filter((r) => r.country_code).length;

  return {
    configured: true,
    events: rows.length,
    sessions,
    eventsPerSession: sessions ? rows.length / sessions : 0,
    topEvents: tally(rows, (r) => r.event, 10),
    topPages: tally(rows, (r) => decodePath(r.page_path), 10),
    devices: tally(rows, (r) => r.device, 4),
    geoCoverage: rows.length ? withGeo / rows.length : 0,
  };
}
