import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Node runtime so the card can be read off disk.
export const runtime = "nodejs";

// ONE card for every link on the site: the SARD coin on its gold burst, from
// public/og-image.png. It is served as a plain file — there is deliberately no
// Satori render here any more, which removes three separate failure modes that
// each shipped to production:
//
//  1. A frozen price. The card used to carry the live price, but X and the other
//     social crawlers cache a link's card for days, so posts kept showing a
//     price that was hours or days stale. On a price site a quietly wrong number
//     is worse than no number. (It did not help that ImageResponse also stamps
//     its own `Cache-Control: max-age=31536000, immutable` and the route's
//     `headers` option appends to that rather than replacing it, so every
//     response went out asking to be cached for a year.)
//
//  2. Reversed Arabic. Satori has no bidi algorithm: a space splits an Arabic
//     string into one run per word and the runs are laid out left to right, so
//     "سعر الذهب" rendered as "الذهب سعر". Working around that needed a no-break
//     space for pure-Arabic lines, a token-by-token row-reverse flex for any
//     line containing a digit, and a per-string pixel-measured centring nudge.
//     A card with no text needs none of it.
//
//  3. A slow cold start. The render fetched a price behind a 4s timeout and fell
//     back to this same file whenever the API was slow, so crawlers sometimes
//     got the static card anyway — just after waiting for it.
//
// The `asset` query parameter is still accepted and ignored: ~15 pages link to
// /api/og?asset=<name> and those URLs must keep working.
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
  "Content-Type": "image/png",
};

let _card: Buffer | null = null;

export function GET() {
  if (!_card) _card = readFileSync(join(process.cwd(), "public", "og-image.png"));
  return new NextResponse(_card as unknown as BodyInit, { headers: CACHE_HEADERS });
}
