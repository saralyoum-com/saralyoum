import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { getGoldHistory7d } from "@/lib/goldHistory";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates, history] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(), getGoldHistory7d(),
  ]);
  const jodRate = rates.find((r) => r.code === "JOD")?.rate ?? 0.709;
  return (
    <CountryGoldPage
      flag="🇯🇴" nameAr="الأردن" nameEn="Jordan"
      city="عمّان" currency="JOD" currencyAr="دينار أردني" currencyEn="Jordanian Dinar"
      goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
      rate={jodRate} changePercent={gold?.changePercent ?? 0} code="jo" history={history}
    />
  );
}
