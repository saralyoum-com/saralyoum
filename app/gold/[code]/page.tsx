import { notFound } from "next/navigation";
import CountryGoldPage from "@/components/CountryGoldPage";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getExchangeRates } from "@/lib/exchangerate";
import { COUNTRIES, getCountryByCode } from "@/lib/countries";

export const revalidate = 300;

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ code: c.code }));
}

export default async function Page({
  params,
}: {
  params: { code: string };
}) {
  const country = getCountryByCode(params.code);
  if (!country) notFound();

  const [gold, silver, rates] = await Promise.all([
    getGoldPrice(),
    getSilverPrice(),
    getExchangeRates(),
  ]);

  const rate =
    rates.find((r) => r.code === country.currency)?.rate ??
    country.currencyFallback;

  return (
    <CountryGoldPage
      flag={country.flag}
      nameAr={country.nameAr}
      nameEn={country.nameEn}
      city={country.city}
      currency={country.currency}
      currencyAr={country.currencyAr}
      currencyEn={country.currencyEn}
      currencySymbol={country.currencySymbol}
      goldPriceUSD={gold?.price ?? 4787}
      silverPriceUSD={silver?.price ?? 76.48}
      rate={rate}
      changePercent={gold?.changePercent ?? 0}
      canonicalSlug={country.slug}
    />
  );
}
