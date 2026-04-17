import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates] = await Promise.all([
    getGoldPrice(), getSilverPrice(), getExchangeRates(),
  ]);
  const sdgRate = rates.find((r) => r.code === "SDG")?.rate ?? 601;
  return (
    <CountryGoldPage
      flag="🇸🇩" nameAr="السودان" nameEn="Sudan"
      city="الخرطوم" currency="SDG" currencyAr="جنيه سوداني" currencyEn="Sudanese Pound"
      goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
      rate={sdgRate} changePercent={gold?.changePercent ?? 0}
    />
  );
}
