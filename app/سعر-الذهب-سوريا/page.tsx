import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { getGoldHistory7d } from "@/lib/goldHistory";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates, history] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(), getGoldHistory7d(),
  ]);
  // 132 per USD after Syria's 1 Jan 2026 redenomination (100 old = 1 new); the
  // rate feed returns no SYP, so this fallback is always the one used. Was 13000
  // (pre-redenomination), which overstates every price ~100x.
  // NOTE: this file is currently unreachable — middleware rewrites the Arabic
  // slug to /gold/sy, which reads currencyFallback from lib/countries.ts. Kept
  // in sync so reviving it cannot resurrect the old bug.
  const sypRate = rates.find((r) => r.code === "SYP")?.rate ?? 132;
  return (
    <CountryGoldPage
      flag="/flags/sy.svg" nameAr="سوريا" nameEn="Syria"
      city="دمشق" currency="SYP" currencyAr="ليرة سورية" currencyEn="Syrian Pound"
      goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
      rate={sypRate} changePercent={gold?.changePercent ?? 0} code="sy" history={history}
    />
  );
}
