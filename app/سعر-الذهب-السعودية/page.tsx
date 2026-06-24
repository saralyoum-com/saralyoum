import CountryGoldPage from "@/components/CountryGoldPage";
import CountryContent from "@/components/CountryContent";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { getGoldHistory7d } from "@/lib/goldHistory";
import { saudiContent } from "@/lib/country-content/saudi";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates, history] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(), getGoldHistory7d(),
  ]);
  const sarRate = rates.find((r) => r.code === "SAR")?.rate ?? 3.75;
  return (
    <>
      <CountryGoldPage
        flag="🇸🇦" nameAr="السعودية" nameEn="Saudi Arabia"
        city="الرياض" currency="SAR" currencyAr="ريال سعودي" currencyEn="Saudi Riyal"
        goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
        rate={sarRate} changePercent={gold?.changePercent ?? 0} code="sa" history={history}
      />
      <CountryContent
        countryAr="السعودية" countryEn="Saudi Arabia"
        {...saudiContent}
      />
    </>
  );
}
