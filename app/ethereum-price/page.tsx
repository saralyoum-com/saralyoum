import CryptoPricePage from "@/components/CryptoPricePage";
import { getAllCryptoPrices } from "@/lib/coingecko";
import { getExchangeRates } from "@/lib/exchangerate";

export const revalidate = 300;

export default async function Page() {
  const [cryptos, rates] = await Promise.all([
    getAllCryptoPrices(),
    getExchangeRates(),
  ]);

  const eth = cryptos.find((c) => c.symbol === "ETH");

  const currencies = rates.map((r) => ({
    code: r.code,
    nameAr: r.nameAr ?? r.code,
    nameEn: r.code,
    flag: r.flag ?? "🌍",
    rate: r.rate,
  }));

  return (
    <CryptoPricePage
      coin="ethereum"
      symbol="ETH"
      nameAr="الإيثيريوم"
      nameEn="Ethereum"
      icon="⟠"
      priceUSD={eth?.price ?? 1800}
      changePercent={eth?.changePercent ?? 0}
      high24h={eth?.high24h ?? 1850}
      low24h={eth?.low24h ?? 1750}
      marketCapUSD={eth?.marketCap ?? 220000000000}
      volume24hUSD={eth?.volume24h ?? 12000000000}
      currencies={currencies}
    />
  );
}
