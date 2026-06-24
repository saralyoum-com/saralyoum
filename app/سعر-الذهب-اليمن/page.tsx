import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { getGoldHistory7d } from "@/lib/goldHistory";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates, history] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(), getGoldHistory7d(),
  ]);
  const yerRate = rates.find((r) => r.code === "YER")?.rate ?? 250;
  return (
    <CountryGoldPage
      flag="🇾🇪" nameAr="اليمن" nameEn="Yemen"
      city="صنعاء" currency="YER" currencyAr="ريال يمني" currencyEn="Yemeni Rial"
      goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
      rate={yerRate} changePercent={gold?.changePercent ?? 0} code="ye" history={history}
    />
  );
}
