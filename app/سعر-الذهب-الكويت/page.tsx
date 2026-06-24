import CountryGoldPage from "@/components/CountryGoldPage";
import CountryContent from "@/components/CountryContent";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { getGoldHistory7d } from "@/lib/goldHistory";
import { kuwaitContent } from "@/lib/country-content/kuwait";

export const revalidate = 300;

export default async function Page() {
  const [gold, silver, rates, history] = await Promise.all([getGoldPrice(), getSilverPrice(), getExchangeRates(), getGoldHistory7d()]);
  const rate = rates.find((r) => r.code === "KWD")?.rate ?? 0.3075;
  return (
    <>
      <CountryGoldPage
        flag="🇰🇼" nameAr="الكويت" nameEn="Kuwait"
        city="الكويت" currency="KWD" currencyAr="دينار كويتي" currencyEn="Kuwaiti Dinar"
        goldPriceUSD={gold?.price ?? 4787} silverPriceUSD={silver?.price ?? 76.48}
        rate={rate} changePercent={gold?.changePercent ?? 0} code="kw" history={history}
      />
      <CountryContent
        countryAr="الكويت" countryEn="Kuwait"
        {...kuwaitContent}
      />
    </>
  );
}
