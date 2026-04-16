import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(),
  ]);
  const dzdRate = rates.find((r) => r.code === "DZD")?.rate ?? 134.5;
  return (
    <CountryGoldPage
      flag="🇩🇿" nameAr="الجزائر" nameEn="Algeria"
      city="الجزائر" currency="DZD" currencyAr="دينار جزائري" currencyEn="Algerian Dinar"
      goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
      rate={dzdRate} changePercent={gold?.changePercent ?? 0}
    />
  );
}
