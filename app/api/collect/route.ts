import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

/**
 * /api/collect — Move 1 owned-analytics sink.
 *
 * Receives events from the client dispatcher in lib/analytics.ts (via
 * navigator.sendBeacon) and writes them to the Supabase `events` table — the
 * one store we own outright and can JOIN user events to agent events in.
 *
 * Design rules:
 *  - Never throw to the client. Analytics failures must be invisible to UX, so
 *    every path returns 204.
 *  - No PII. Any prop that looks like an email is SHA-256 hashed before insert.
 *  - No raw query strings. We only keep page_path (pathname), sent by the client.
 *  - Server-authoritative geo + device — the client can't spoof these.
 *  - Cheap abuse guards: body-size cap, event-name length cap, prop count cap.
 */

const MAX_BODY = 8 * 1024; // 8 KB — an analytics event is tiny; reject anything larger
const MAX_EVENT_LEN = 64;
const MAX_PROPS = 40;

const EMAILISH = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashEmail(v: string): string {
  return "sha256:" + createHash("sha256").update(v.trim().toLowerCase()).digest("hex").slice(0, 32);
}

/** Recursively strip PII: hash any string value that is an email address. */
function sanitize(value: unknown, depth = 0): unknown {
  if (depth > 4) return null;
  if (typeof value === "string") return EMAILISH.test(value) ? hashEmail(value) : value.slice(0, 512);
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => sanitize(v, depth + 1));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    let n = 0;
    for (const [k, v] of Object.entries(value)) {
      if (n++ >= MAX_PROPS) break;
      // Drop keys that commonly carry PII outright rather than storing them.
      if (/^(email|e-?mail|phone|tel)$/i.test(k)) {
        if (typeof v === "string" && EMAILISH.test(v)) out[k] = hashEmail(v);
        continue;
      }
      out[k] = sanitize(v, depth + 1);
    }
    return out;
  }
  return value === undefined ? null : value;
}

function deviceFromUA(ua: string): "mobile" | "desktop" {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? "mobile" : "desktop";
}

/**
 * Non-human traffic filter.
 *
 * GA4 showed a datacentre city (Ashburn) as ~23% of "users", which inflates
 * every rate we compute. Classic crawlers don't run JS and so never reach this
 * route, but headless browsers, uptime monitors, link unfurlers and our own
 * automated checks do — and they all identify themselves in the user agent.
 *
 * Dropping them here keeps the owned event store honest even when GA4 is not.
 * Deliberately conservative: it matches self-declared automation only, never
 * IP ranges or behavioural guesses, so a real visitor is never discarded.
 */
const BOT_UA =
  /bot|crawler|spider|crawling|headless|phantom|puppeteer|playwright|selenium|webdriver|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python-requests|axios|node-fetch|go-http|java\/|okhttp|scrapy|preview|fetcher|validator|facebookexternalhit|slackbot|whatsapp|telegrambot|discordbot|embedly|quora link|vkshare|redditbot|applebot|bingpreview|yandex|baidu|duckduck|semrush|ahrefs|mj12|dotbot|petal|bytespider|gptbot|claudebot|ccbot|perplexity|anthropic/i;

function isAutomatedUA(ua: string): boolean {
  if (!ua) return true; // a real browser always sends one
  return BOT_UA.test(ua);
}

export async function POST(req: NextRequest) {
  try {
    // Body-size guard before parsing.
    const len = Number(req.headers.get("content-length") || 0);
    if (len > MAX_BODY) return new NextResponse(null, { status: 204 });

    const raw = await req.text();
    if (!raw || raw.length > MAX_BODY) return new NextResponse(null, { status: 204 });

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return new NextResponse(null, { status: 204 });
    }

    const event = typeof body.event === "string" ? body.event.slice(0, MAX_EVENT_LEN) : "";
    if (!event || !/^[a-z0-9_]+$/i.test(event)) return new NextResponse(null, { status: 204 });

    // Drop self-declared automation before it reaches the store.
    const ua = req.headers.get("user-agent") || "";
    if (isAutomatedUA(ua)) return new NextResponse(null, { status: 204 });

    // Server-authoritative enrichment — client cannot spoof geo/device.
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      null;
    const device = deviceFromUA(ua);

    const hasSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_") &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your_");

    if (!hasSupabase) {
      // Not configured — accept silently so the client never sees an error.
      return new NextResponse(null, { status: 204 });
    }

    const row = {
      event,
      props: sanitize(body.props ?? {}),
      client_id: typeof body.client_id === "string" ? body.client_id.slice(0, 64) : null,
      session_id: typeof body.session_id === "string" ? body.session_id.slice(0, 64) : null,
      page_path:
        typeof body.page_path === "string" ? body.page_path.split("?")[0].slice(0, 256) : null,
      country_code: country ? country.slice(0, 2).toUpperCase() : null,
      device,
      lang: typeof body.lang === "string" ? body.lang.slice(0, 8) : null,
    };

    const { createServiceClient } = await import("@/lib/supabase");
    const supabase = createServiceClient();
    const { error } = await supabase.from("events").insert(row);
    if (error) console.error("[collect] insert error:", error.message);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[collect] unhandled:", err);
    // Still 204 — the beacon sender ignores the response anyway.
    return new NextResponse(null, { status: 204 });
  }
}
