import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(),
  ]);
  // SYP rate (Syrian Pound, ~13,000 per USD)
  const sypRate = rates.find((r) => r.code === "SYP")?.rate ?? 13000;
  return (
    <CountryGoldPage
      flag="/flags/sy.svg" nameAr="سوريا" nameEn="Syria"
      city="دمشق" currency="SYP" currencyAr="ليرة سورية" currencyEn="Syrian Pound"
      goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
      rate={sypRate} changePercent={gold?.changePercent ?? 0}
    />
  );
}
