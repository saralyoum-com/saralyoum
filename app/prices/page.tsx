import { getGoldPrice } from "@/lib/goldapi";
import PricesClient from "@/components/PricesClient";

// ASCII route for the Arabic URL /اسعار (mapped in middleware OTHER_SLUGS).
// Arabic directories (app/اسعار) route unreliably on Vercel and 404 across
// deploys, so — per CLAUDE.md — the page lives at an ASCII path and the Arabic
// URL is rewritten to it at the Edge. Rendered per request (force-dynamic) so
// the route always resolves; the gold price is fetched server-side with a short
// timeout + fallback so the bullion (سبائك) table is in the initial HTML (SEO).
export const dynamic = "force-dynamic";

async function getInitialGoldUSD(): Promise<number> {
  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("gold-fetch-timeout")), 3000)
    );
    const gold = await Promise.race([getGoldPrice(), timeout]);
    return gold.price || 0;
  } catch {
    return 0; // client fetches live price on mount
  }
}

export default async function Page() {
  const initialGoldUSD = await getInitialGoldUSD();
  return <PricesClient initialGoldUSD={initialGoldUSD} />;
}
