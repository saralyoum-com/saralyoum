import CountryGoldPage from "@/components/CountryGoldPage";
import CountryContent from "@/components/CountryContent";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { getGoldHistory7d } from "@/lib/goldHistory";
import { uaeContent } from "@/lib/country-content/uae";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates, history] = await Promise.all([getGoldPrice(), getSilverPrice(), getExchangeRates(), getGoldHistory7d()]);
  const rate = rates.find((r) => r.code === "AED")?.rate ?? 3.6725;
  return (
    <>
      <CountryGoldPage
        flag="🇦🇪" nameAr="الإمارات" nameEn="UAE"
        city="دبي" currency="AED" currencyAr="درهم إماراتي" currencyEn="UAE Dirham"
        goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
        rate={rate} changePercent={gold?.changePercent ?? 0} code="ae" history={history}
      />
      <CountryContent
        countryAr="الإمارات" countryEn="UAE"
        {...uaeContent}
      />
    </>
  );
}
