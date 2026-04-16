import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(),
  ]);
  const madRate = rates.find((r) => r.code === "MAD")?.rate ?? 10.05;
  return (
    <CountryGoldPage
      flag="🇲🇦" nameAr="المغرب" nameEn="Morocco"
      city="الرباط" currency="MAD" currencyAr="درهم مغربي" currencyEn="Moroccan Dirham"
      goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
      rate={madRate} changePercent={gold?.changePercent ?? 0}
    />
  );
}
