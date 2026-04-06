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
      const [bitcoin, ethereum] = await Promise.all([
        getCryptoPrice("bitcoin"),
        getCryptoPrice("ethereum"),
      ]);
      return NextResponse.json({ bitcoin, ethereum });
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
