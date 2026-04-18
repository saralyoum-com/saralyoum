import { NextResponse } from "next/server";
import { getGoldPrice, getSilverPrice } from "@/lib/goldapi";
import { getCryptoPrice } from "@/lib/coingecko";
import { getExchangeRates } from "@/lib/exchangerate";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  try {
    if (type === "metals") {
      const [gold, silver] = await Promise.all([
        getGoldPrice(),
        getSilverPrice(),
      ]);
      return NextResponse.json({ gold, silver });
    }

    if (type === "crypto") {
      const { getAllCryptoPrices } = await import("@/lib/coingecko");
      const coins = await getAllCryptoPrices();
      const byId: Record<string, unknown> = {};
      for (const c of coins) {
        const sym = c.symbol.toLowerCase();
        if (sym === "btc") byId.bitcoin = c;
        else if (sym === "eth") byId.ethereum = c;
        else if (sym === "bnb") byId.binancecoin = c;
        else if (sym === "sol") byId.solana = c;
        else if (sym === "xrp") byId.ripple = c;
      }
      // Fallback for any missing coins
      if (!byId.bitcoin) byId.bitcoin = await getCryptoPrice("bitcoin");
      if (!byId.ethereum) byId.ethereum = await getCryptoPrice("ethereum");
      return NextResponse.json(byId);
    }

    if (type === "currencies") {
      const rates = await getExchangeRates();
      return NextResponse.json({ rates });
    }

    // الكل
    const [gold, silver, bitcoin, ethereum] = await Promise.all([
      getGoldPrice(),
      getSilverPrice(),
      getCryptoPrice("bitcoin"),
      getCryptoPrice("ethereum"),
    ]);

    return NextResponse.json({ gold, silver, bitcoin, ethereum });
  } catch {
    return NextResponse.json(
      { error: "فشل في جلب الأسعار" },
      { status: 500 }
    );
  }
}
