import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
export const revalidate = 300;
export default async function Page() {
  const [gold, silver, rates] = await Promise.all([getGoldPrice(), getSilverPrice(), getExchangeRates()]);
  const rate = rates.find((r) => r.code === "KWD")?.rate ?? 0.3075;
  return (<CountryGoldPage flag="🇰🇼" nameAr="الكويت" nameEn="Kuwait" city="الكويت" currency="KWD" currencyAr="دينار كويتي" currencyEn="Kuwaiti Dinar" goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48} rate={rate} changePercent={gold?.changePercent ?? 0} />);
}
