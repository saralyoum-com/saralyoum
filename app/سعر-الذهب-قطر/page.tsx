import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { getGoldHistory7d } from "@/lib/goldHistory";
export const revalidate = 300;
export default async function Page() {
  const [gold, silver, rates, history] = await Promise.all([getGoldPrice(), getSilverPrice(), getExchangeRates(), getGoldHistory7d()]);
  const rate = rates.find((r) => r.code === "QAR")?.rate ?? 3.64;
  return (<CountryGoldPage flag="🇶🇦" nameAr="قطر" nameEn="Qatar" city="الدوحة" currency="QAR" currencyAr="ريال قطري" currencyEn="Qatari Riyal" goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48} rate={rate} changePercent={gold?.changePercent ?? 0} code="qa" history={history} />);
}
