import CountryGoldPage from "@/components/CountryGoldPage";
import CountryContent from "@/components/CountryContent";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { lebanonContent } from "@/lib/country-content/lebanon";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(),
  ]);
  // LBP rate (official ~89,500 per USD)
  const lbpRate = rates.find((r) => r.code === "LBP")?.rate ?? 89500;
  return (
    <>
      <CountryGoldPage
        flag="🇱🇧" nameAr="لبنان" nameEn="Lebanon"
        city="بيروت" currency="LBP" currencyAr="ليرة لبنانية" currencyEn="Lebanese Pound"
        goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
        rate={lbpRate} changePercent={gold?.changePercent ?? 0}
      />
      <CountryContent
        countryAr="لبنان" countryEn="Lebanon"
        {...lebanonContent}
      />
    </>
  );
}
