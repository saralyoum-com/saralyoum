import CountryGoldPage from "@/components/CountryGoldPage";
import CountryContent from "@/components/CountryContent";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { getGoldHistory7d } from "@/lib/goldHistory";
import { omanContent } from "@/lib/country-content/oman";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates, history] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(), getGoldHistory7d(),
  ]);
  const omrRate = rates.find((r) => r.code === "OMR")?.rate ?? 0.385;
  return (
    <>
      <CountryGoldPage
        flag="🇴🇲" nameAr="عُمان" nameEn="Oman"
        city="مسقط" currency="OMR" currencyAr="ريال عُماني" currencyEn="Omani Rial"
        goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
        rate={omrRate} changePercent={gold?.changePercent ?? 0} code="om" history={history}
      />
      <CountryContent
        countryAr="عُمان" countryEn="Oman"
        {...omanContent}
      />
    </>
  );
}
