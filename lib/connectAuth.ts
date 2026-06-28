import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

/**
 * Auth helpers for the /connect social dashboard and /api/auth/* routes.
 *
 * Threat model: a single operator (the site owner) unlocks the dashboard with a
 * PIN, then drives the OAuth connect flows. Every /api/auth/* route must be
 * gated server-side — the PIN must not be a UI-only check.
 *
 * - Session: HMAC-SHA256 signed cookie (HttpOnly/Secure/SameSite=Lax) so it
 *   survives the top-level OAuth redirect back from facebook.com.
 * - PIN compare: constant-time, never read from the query string.
 * - Rate limit: best-effort per-IP, in-memory. Serverless instances are
 *   ephemeral so this only throttles within a warm lambda — the real defense is
 *   a long, random CONNECT_PIN. Keep both.
 */

export const SESSION_COOKIE = "sard_connect";
export const STATE_COOKIE = "sard_oauth_state";
const SESSION_TTL_SEC = 7 * 24 * 60 * 60; // 7 days

function secret(): string {
  // Dedicated secret preferred; fall back to the PIN so the feature works
  // without an extra env var (rotating either invalidates live sessions).
  return process.env.CONNECT_SESSION_SECRET || process.env.CONNECT_PIN || "";
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

function hmac(data: string): string {
  return b64url(createHmac("sha256", secret()).update(data).digest());
}

/** Constant-time string equality that won't early-return on length. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    // Still run a compare to keep timing flat, then fail.
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

/** True if the supplied PIN matches CONNECT_PIN (constant-time). */
export function checkPin(pin: string): boolean {
  const correct = process.env.CONNECT_PIN;
  if (!correct) return false;
  return safeEqual(pin, correct);
}

// ---- Session token ----------------------------------------------------------

/** Create a signed session token: base64url(payload).signature */
export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SEC;
  const payload = b64url(JSON.stringify({ exp }));
  return `${payload}.${hmac(payload)}`;
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!safeEqual(sig, hmac(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/** True if the request carries a valid session cookie. */
export function isAuthed(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

/** Attach the session cookie to a response. */
export function setSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
  return res;
}

/** Standard 401 for an unauthenticated /api/auth/* call. */
export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

// ---- OAuth state (CSRF) -----------------------------------------------------

/** Generate a random state nonce and set it as a short-lived cookie. */
export function issueState(res: NextResponse): string {
  const nonce = randomBytes(16).toString("hex");
  res.cookies.set(STATE_COOKIE, nonce, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 min — long enough to complete an OAuth round-trip
  });
  return nonce;
}

/** Verify the state param against the state cookie (double-submit, constant-time). */
export function verifyState(req: NextRequest, stateParam: string | null): boolean {
  const cookie = req.cookies.get(STATE_COOKIE)?.value;
  if (!cookie || !stateParam) return false;
  return safeEqual(cookie, stateParam);
}

/** Clear the state cookie on a response (single-use). */
export function clearState(res: NextResponse): void {
  res.cookies.set(STATE_COOKIE, "", { path: "/", maxAge: 0 });
}

// ---- Rate limit -------------------------------------------------------------

const ATTEMPTS = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/** Best-effort per-IP rate limit. Returns true if the request is allowed. */
export function rateLimitOk(req: NextRequest): boolean {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const rec = ATTEMPTS.get(ip);
  if (!rec || now > rec.resetAt) {
    ATTEMPTS.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  rec.count += 1;
  return rec.count <= MAX_ATTEMPTS;
}
