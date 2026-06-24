import CountryGoldPage from "@/components/CountryGoldPage";
import CountryContent from "@/components/CountryContent";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { getGoldHistory7d } from "@/lib/goldHistory";
import { palestineContent } from "@/lib/country-content/palestine";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates, history] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(), getGoldHistory7d(),
  ]);
  // ILS rate (Israeli Shekel, ~3.6 per USD)
  const ilsRate = rates.find((r) => r.code === "ILS")?.rate ?? 3.6;
  return (
    <>
      <CountryGoldPage
        flag="🇵🇸" nameAr="فلسطين" nameEn="Palestine"
        city="القدس" currency="ILS" currencyAr="شيكل" currencyEn="Israeli Shekel"
        goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
        rate={ilsRate} changePercent={gold?.changePercent ?? 0} code="ps" history={history}
      />
      <CountryContent
        countryAr="فلسطين" countryEn="Palestine"
        {...palestineContent}
      />
    </>
  );
}
