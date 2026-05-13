import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getAllCryptoPrices } from "@/lib/coingecko";
import { getExchangeRates } from "@/lib/exchangerate";
import PricesPageClient from "@/components/PricesPageClient";
import { PriceData } from "@/types";

export const revalidate = 300;

const MOCK_GOLD: PriceData = {
  symbol: "XAU", nameAr: "الذهب", price: 3300, change: 0, changePercent: 0,
  currency: "USD", unit: "أوقية", lastUpdated: new Date().toISOString(),
};
const MOCK_SILVER: PriceData = {
  symbol: "XAG", nameAr: "الفضة", price: 33, change: 0, changePercent: 0,
  currency: "USD", unit: "أوقية", lastUpdated: new Date().toISOString(),
};

export default async function PricesPage() {
  const [gold, silver, allCrypto, rates] = await Promise.all([
    getGoldPrice(),
    getSilverPrice(),
    getAllCryptoPrices(),
    getExchangeRates(),
  ]);

  const metals = {
    gold: gold ?? MOCK_GOLD,
    silver: silver ?? MOCK_SILVER,
  };

  const crypto = allCrypto.filter((c) => c.symbol === "BTC" || c.symbol === "ETH");

  const goldPerOz = metals.gold.price;
  const silverPerOz = metals.silver.price;
  const btc = crypto.find((c) => c.symbol === "BTC");
  const eth = crypto.find((c) => c.symbol === "ETH");

  const priceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "أسعار الذهب والفضة والعملات الرقمية اليوم",
    url: "https://sardhahab.com/اسعار",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "سعر الذهب",
        description: `سعر الذهب اليوم ${goldPerOz.toFixed(2)} دولار للأوقية — عيار 24: ${(goldPerOz / 31.1035).toFixed(2)} دولار للجرام`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "سعر الفضة",
        description: `سعر الفضة اليوم ${silverPerOz.toFixed(2)} دولار للأوقية`,
      },
      ...(btc ? [{
        "@type": "ListItem",
        position: 3,
        name: "سعر البيتكوين",
        description: `سعر البيتكوين اليوم ${btc.price.toLocaleString("en-US")} دولار`,
      }] : []),
      ...(eth ? [{
        "@type": "ListItem",
        position: 4,
        name: "سعر الإيثيريوم",
        description: `سعر الإيثيريوم اليوم ${eth.price.toLocaleString("en-US")} دولار`,
      }] : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(priceJsonLd) }}
      />
      <PricesPageClient metals={metals} crypto={crypto} currencies={rates} />
    </>
  );
}
