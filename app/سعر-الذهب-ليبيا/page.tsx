import CountryGoldPage from "@/components/CountryGoldPage";
import CountryContent from "@/components/CountryContent";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { libyaContent } from "@/lib/country-content/libya";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(),
  ]);
  const lydRate = rates.find((r) => r.code === "LYD")?.rate ?? 4.85;
  return (
    <>
      <CountryGoldPage
        flag="🇱🇾" nameAr="ليبيا" nameEn="Libya"
        city="طرابلس" currency="LYD" currencyAr="دينار ليبي" currencyEn="Libyan Dinar"
        goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
        rate={lydRate} changePercent={gold?.changePercent ?? 0}
      />
      <CountryContent
        countryAr="ليبيا" countryEn="Libya"
        {...libyaContent}
      />
    </>
  );
}
