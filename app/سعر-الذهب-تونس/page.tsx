import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(),
  ]);
  const tndRate = rates.find((r) => r.code === "TND")?.rate ?? 3.12;
  return (
    <CountryGoldPage
      flag="🇹🇳" nameAr="تونس" nameEn="Tunisia"
      city="تونس" currency="TND" currencyAr="دينار تونسي" currencyEn="Tunisian Dinar"
      goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
      rate={tndRate} changePercent={gold?.changePercent ?? 0}
    />
  );
}
