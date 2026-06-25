import { getGoldPrice } from "@/lib/goldapi";
import PricesClient from "@/components/PricesClient";

// ISR: gold price fetched server-side so the bullion (سبائك) table renders
// in the initial HTML (crawlable). The interactive cards still update client-side.
export const revalidate = 300;

export default async function Page() {
  let initialGoldUSD = 0;
  try {
    const gold = await getGoldPrice();
    initialGoldUSD = gold.price;
  } catch {
    initialGoldUSD = 0;
  }
  return <PricesClient initialGoldUSD={initialGoldUSD} />;
}
