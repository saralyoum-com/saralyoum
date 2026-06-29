import { getGoldPrice } from "@/lib/goldapi";
import PricesClient from "@/components/PricesClient";

// Render on every request — do NOT prerender at build. This page used to 404
// intermittently after deploys: its build-time price fetch (no timeout) could
// hang/fail to prerender, and Vercel then cached a 404 for the route. Serving
// it dynamically guarantees the route always resolves. The gold price is still
// fetched server-side (with a short timeout + fallback) so the bullion (سبائك)
// table is in the initial HTML for SEO; the interactive cards update client-side.
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
