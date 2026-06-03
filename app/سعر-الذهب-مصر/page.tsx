import CountryGoldPage from "@/components/CountryGoldPage";
import CountryContent from "@/components/CountryContent";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { egyptContent } from "@/lib/country-content/egypt";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates] = await Promise.all([getGoldPrice(), getSilverPrice(), getExchangeRates()]);
  const rate = rates.find((r) => r.code === "EGP")?.rate ?? 54.41;
  return (
    <>
      <CountryGoldPage
        flag="🇪🇬" nameAr="مصر" nameEn="Egypt"
        city="القاهرة" currency="EGP" currencyAr="جنيه مصري" currencyEn="Egyptian Pound"
        goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
        rate={rate} changePercent={gold?.changePercent ?? 0}
      />
      <CountryContent
        countryAr="مصر" countryEn="Egypt"
        {...egyptContent}
      />
    </>
  );
}
