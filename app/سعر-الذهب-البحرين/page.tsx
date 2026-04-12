import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
export const revalidate = 300;
export default async function Page() {
  const [gold, silver, rates] = await Promise.all([getGoldPrice(), getSilverPrice(), getExchangeRates()]);
  const rate = rates.find((r) => r.code === "BHD")?.rate ?? 0.377;
  return (<CountryGoldPage flag="🇧🇭" nameAr="البحرين" nameEn="Bahrain" city="المنامة" currency="BHD" currencyAr="دينار بحريني" currencyEn="Bahraini Dinar" goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48} rate={rate} changePercent={gold?.changePercent ?? 0} />);
}
