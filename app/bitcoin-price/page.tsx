import CryptoPricePage from "@/components/CryptoPricePage";
import { getAllCryptoPrices } from "@/lib/coingecko";
import { getExchangeRates } from "@/lib/exchangerate";

export const revalidate = 300;

export default async function Page() {
  const [cryptos, rates] = await Promise.all([
    getAllCryptoPrices(),
    getExchangeRates(),
  ]);

  const btc = cryptos.find((c) => c.symbol === "BTC");

  const currencies = rates.map((r) => ({
    code: r.code,
    nameAr: r.nameAr ?? r.code,
    nameEn: r.code,
    flag: r.flag ?? "🌍",
    rate: r.rate,
  }));

  return (
    <CryptoPricePage
      coin="bitcoin"
      symbol="BTC"
      nameAr="البيتكوين"
      nameEn="Bitcoin"
      icon="₿"
      priceUSD={btc?.price ?? 95000}
      changePercent={btc?.changePercent ?? 0}
      high24h={btc?.high24h ?? 96000}
      low24h={btc?.low24h ?? 93000}
      marketCapUSD={btc?.marketCap ?? 1870000000000}
      volume24hUSD={btc?.volume24h ?? 35000000000}
      currencies={currencies}
    />
  );
}
