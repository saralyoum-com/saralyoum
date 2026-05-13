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

  const goldPriceUSD = gold?.price ?? 4787;
  const silverPriceUSD = silver?.price ?? 76.48;
  const changePercent = gold?.changePercent ?? 0;
  const OZ = 31.1035;
  const goldPerGram24 = (goldPriceUSD / OZ) * rate;
  const goldPerGram21 = goldPerGram24 * (21 / 24);
  const goldPerGram18 = goldPerGram24 * (18 / 24);
  const decimals = rate > 1000 ? 0 : rate > 100 ? 1 : rate < 1 ? 4 : rate < 5 ? 3 : 2;
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: decimals });

  const priceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `سعر الذهب في ${country.nameAr} اليوم`,
    description: `أسعار الذهب بالـ${country.currencyAr} — عيار 24 و21 و18 بالجرام، محدّث لحظياً`,
    url: `https://sardhahab.com/${country.slug}`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: `سعر الذهب عيار 24 في ${country.nameAr}`,
        description: `${fmt(goldPerGram24)} ${country.currency} للجرام`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `سعر الذهب عيار 21 في ${country.nameAr}`,
        description: `${fmt(goldPerGram21)} ${country.currency} للجرام`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `سعر الذهب عيار 18 في ${country.nameAr}`,
        description: `${fmt(goldPerGram18)} ${country.currency} للجرام`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `سعر الأوقية في ${country.nameAr}`,
        description: `${fmt(goldPriceUSD * rate)} ${country.currency} للأوقية — التغيير: ${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(priceJsonLd) }}
      />
      <CountryGoldPage
        flag={country.flag}
        nameAr={country.nameAr}
        nameEn={country.nameEn}
        city={country.city}
        currency={country.currency}
        currencyAr={country.currencyAr}
        currencyEn={country.currencyEn}
        currencySymbol={country.currencySymbol}
        goldPriceUSD={goldPriceUSD}
        silverPriceUSD={silverPriceUSD}
        rate={rate}
        changePercent={changePercent}
        canonicalSlug={country.slug}
      />
    </>
  );
}
