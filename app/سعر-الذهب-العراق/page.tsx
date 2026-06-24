import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { getGoldHistory7d } from "@/lib/goldHistory";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates, history] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(), getGoldHistory7d(),
  ]);
  const iqdRate = rates.find((r) => r.code === "IQD")?.rate ?? 1310;
  return (
    <CountryGoldPage
      flag="🇮🇶" nameAr="العراق" nameEn="Iraq"
      city="بغداد" currency="IQD" currencyAr="دينار عراقي" currencyEn="Iraqi Dinar"
      goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
      rate={iqdRate} changePercent={gold?.changePercent ?? 0} code="iq" history={history}
    />
  );
}
