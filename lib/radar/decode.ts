/**
 * Its own module on purpose: the dashboard is a client component, and importing
 * this from lib/radar/index.ts would drag google.ts — and `node:crypto` — into
 * the browser bundle. Keep it dependency-free so both sides can share it.
 */

/**
 * Arabic slugs arrive percent-encoded and must be shown readable — but a path
 * carrying a stray "%" makes decodeURIComponent throw, which would take down
 * the whole report over one malformed URL a crawler invented. Never unguarded.
 */
export function safeDecode(path: string): string {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}
