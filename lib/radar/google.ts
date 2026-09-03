import { createSign } from "node:crypto";

/**
 * Google data sources for the radar agent — GA4 Data API + Search Console.
 *
 * Deliberately dependency-free: the service-account JWT is signed with
 * node:crypto rather than google-auth-library, so this file runs unchanged on
 * Vercel functions and on the EC2 bot without pulling ~40 transitive packages.
 *
 * Auth is a service account (sard-radar@…), NOT the owner's OAuth: it survives
 * password changes, has read-only scopes, and can be revoked on its own.
 *
 * Note on history: GA4 undercounted before the CSP fix on 22 Jul 2026, so any
 * comparison whose baseline window starts before that date is not trustworthy.
 * `comparableSince` below is what callers should check before showing a delta.
 */

export const COMPARABLE_SINCE = "2026-07-22";

const TOKEN_URI = "https://oauth2.googleapis.com/token";
const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
].join(" ");

type ServiceAccount = { client_email: string; private_key: string; token_uri?: string };

let cachedToken: { value: string; expiresAt: number } | null = null;

function serviceAccount(): ServiceAccount | null {
  const b64 = process.env.GOOGLE_SA_KEY_B64;
  if (!b64) return null;
  try {
    const sa = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    return sa.client_email && sa.private_key ? sa : null;
  } catch {
    return null;
  }
}

/** True when the Google half of the report can run at all. */
export function googleConfigured(): boolean {
  return Boolean(serviceAccount() && process.env.GA4_PROPERTY_ID);
}

const b64u = (v: unknown) =>
  Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString("base64url");

async function accessToken(): Promise<string> {
  // Tokens last an hour; reuse within the same warm lambda.
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const sa = serviceAccount();
  if (!sa) throw new Error("GOOGLE_SA_KEY_B64 missing or malformed");

  const aud = sa.token_uri || TOKEN_URI;
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64u({ alg: "RS256", typ: "JWT" })}.${b64u({
    iss: sa.client_email,
    scope: SCOPES,
    aud,
    iat: now,
    exp: now + 3600,
  })}`;
  const sig = createSign("RSA-SHA256").update(unsigned).end().sign(sa.private_key).toString("base64url");

  const res = await fetch(aud, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${sig}`,
    }),
  });
  const json = (await res.json()) as { access_token?: string; error_description?: string };
  if (!json.access_token) throw new Error(`Google token failed: ${json.error_description ?? res.status}`);

  cachedToken = { value: json.access_token, expiresAt: Date.now() + 3500_000 };
  return json.access_token;
}

// ---------------------------------------------------------------- GA4

export type Ga4Totals = {
  sessions: number;
  users: number;
  views: number;
  engagementRate: number;
  bounceRate: number;
  avgDuration: number;
};

export type Ga4Row = { key: string; sessions: number; bounceRate: number; avgDuration: number };

const GA4_METRICS = [
  "sessions",
  "activeUsers",
  "screenPageViews",
  "engagementRate",
  "bounceRate",
  "averageSessionDuration",
] as const;

type GaResponse = {
  rows?: { dimensionValues?: { value: string }[]; metricValues: { value: string }[] }[];
  error?: { message: string };
};

async function runReport(body: Record<string, unknown>): Promise<GaResponse> {
  const token = await accessToken();
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );
  const json = (await res.json()) as GaResponse;
  if (json.error) throw new Error(`GA4: ${json.error.message}`);
  return json;
}

const num = (v: string | undefined) => (v ? Number(v) || 0 : 0);

function toTotals(mv: { value: string }[]): Ga4Totals {
  return {
    sessions: num(mv[0]?.value),
    users: num(mv[1]?.value),
    views: num(mv[2]?.value),
    engagementRate: num(mv[3]?.value),
    bounceRate: num(mv[4]?.value),
    avgDuration: num(mv[5]?.value),
  };
}

/** Current window plus the one before it, so callers can show a delta. */
export async function ga4Totals(days = 30): Promise<{ current: Ga4Totals; previous: Ga4Totals }> {
  const json = await runReport({
    dateRanges: [
      { startDate: `${days}daysAgo`, endDate: "yesterday" },
      { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` },
    ],
    metrics: GA4_METRICS.map((name) => ({ name })),
  });
  const rows = json.rows ?? [];
  const empty: Ga4Totals = {
    sessions: 0,
    users: 0,
    views: 0,
    engagementRate: 0,
    bounceRate: 0,
    avgDuration: 0,
  };
  return {
    current: rows[0] ? toTotals(rows[0].metricValues) : empty,
    previous: rows[1] ? toTotals(rows[1].metricValues) : empty,
  };
}

async function ga4Breakdown(dimension: string, days: number, limit: number): Promise<Ga4Row[]> {
  const json = await runReport({
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "yesterday" }],
    dimensions: [{ name: dimension }],
    metrics: [{ name: "sessions" }, { name: "bounceRate" }, { name: "averageSessionDuration" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit,
  });
  return (json.rows ?? []).map((r) => ({
    key: r.dimensionValues?.[0]?.value ?? "—",
    sessions: num(r.metricValues[0]?.value),
    bounceRate: num(r.metricValues[1]?.value),
    avgDuration: num(r.metricValues[2]?.value),
  }));
}

export const ga4Channels = (days = 30) => ga4Breakdown("sessionDefaultChannelGroup", days, 12);
export const ga4LandingPages = (days = 30) => ga4Breakdown("landingPage", days, 25);

// ------------------------------------------------------ Search Console

export type GscTotals = { clicks: number; impressions: number; ctr: number; position: number };
export type GscRow = GscTotals & { key: string };

type GscResponse = {
  rows?: { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }[];
  error?: { message: string };
};

/** Search Console lags ~2 days; asking for yesterday returns an empty window. */
function gscWindow(days: number): { startDate: string; endDate: string } {
  const iso = (offsetDays: number) =>
    new Date(Date.now() - offsetDays * 86_400_000).toISOString().slice(0, 10);
  return { startDate: iso(days + 3), endDate: iso(3) };
}

async function gscQuery(body: Record<string, unknown>): Promise<GscResponse> {
  const token = await accessToken();
  const site = encodeURIComponent(process.env.GSC_SITE_URL || "https://sardhahab.com/");
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );
  const json = (await res.json()) as GscResponse;
  if (json.error) throw new Error(`GSC: ${json.error.message}`);
  return json;
}

export async function gscTotals(days = 30): Promise<GscTotals> {
  const json = await gscQuery({ ...gscWindow(days), dimensions: [] });
  const r = json.rows?.[0];
  return r
    ? { clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }
    : { clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

async function gscBreakdown(dimension: string, days: number, rowLimit: number): Promise<GscRow[]> {
  const json = await gscQuery({ ...gscWindow(days), dimensions: [dimension], rowLimit });
  return (json.rows ?? []).map((r) => ({
    key: r.keys?.[0] ?? "—",
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));
}

export const gscQueries = (days = 30) => gscBreakdown("query", days, 200);
export const gscPages = (days = 30) => gscBreakdown("page", days, 50);
