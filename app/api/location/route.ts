import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// خريطة العملات
const CURRENCY_MAP: Record<string, { currency: string; symbol: string; name: string; flag: string }> = {
  SA: { currency: "SAR", symbol: "ر.س", name: "ريال سعودي", flag: "🇸🇦" },
  AE: { currency: "AED", symbol: "د.إ", name: "درهم إماراتي", flag: "🇦🇪" },
  KW: { currency: "KWD", symbol: "د.ك", name: "دينار كويتي", flag: "🇰🇼" },
  BH: { currency: "BHD", symbol: "د.ب", name: "دينار بحريني", flag: "🇧🇭" },
  QA: { currency: "QAR", symbol: "ر.ق", name: "ريال قطري", flag: "🇶🇦" },
  OM: { currency: "OMR", symbol: "ر.ع", name: "ريال عماني", flag: "🇴🇲" },
  EG: { currency: "EGP", symbol: "ج.م", name: "جنيه مصري", flag: "🇪🇬" },
  JO: { currency: "JOD", symbol: "د.أ", name: "دينار أردني", flag: "🇯🇴" },
  MA: { currency: "MAD", symbol: "د.م.", name: "درهم مغربي", flag: "🇲🇦" },
  TN: { currency: "TND", symbol: "د.ت", name: "دينار تونسي", flag: "🇹🇳" },
  DZ: { currency: "DZD", symbol: "د.ج", name: "دينار جزائري", flag: "🇩🇿" },
  LY: { currency: "LYD", symbol: "د.ل", name: "دينار ليبي", flag: "🇱🇾" },
  IQ: { currency: "IQD", symbol: "د.ع", name: "دينار عراقي", flag: "🇮🇶" },
  YE: { currency: "YER", symbol: "ر.ي", name: "ريال يمني", flag: "🇾🇪" },
  SY: { currency: "SYP", symbol: "ل.س", name: "ليرة سورية", flag: "🇸🇾" },
  LB: { currency: "LBP", symbol: "ل.ل", name: "ليرة لبنانية", flag: "🇱🇧" },
  SD: { currency: "SDG", symbol: "ج.س", name: "جنيه سوداني", flag: "🇸🇩" },
  PS: { currency: "ILS", symbol: "₪", name: "شيكل إسرائيلي", flag: "🇵🇸" },
  MR: { currency: "MRU", symbol: "أ.م", name: "أوقية موريتانية", flag: "🇲🇷" },
  US: { currency: "USD", symbol: "$", name: "دولار أمريكي", flag: "🇺🇸" },
  GB: { currency: "GBP", symbol: "£", name: "جنيه إسترليني", flag: "🇬🇧" },
  EU: { currency: "EUR", symbol: "€", name: "يورو", flag: "🇪🇺" },
  TR: { currency: "TRY", symbol: "₺", name: "ليرة تركية", flag: "🇹🇷" },
  IN: { currency: "INR", symbol: "₹", name: "روبية هندية", flag: "🇮🇳" },
  PK: { currency: "PKR", symbol: "₨", name: "روبية باكستانية", flag: "🇵🇰" },
  DE: { currency: "EUR", symbol: "€", name: "يورو", flag: "🇩🇪" },
  FR: { currency: "EUR", symbol: "€", name: "يورو", flag: "🇫🇷" },
  IT: { currency: "EUR", symbol: "€", name: "يورو", flag: "🇮🇹" },
  ES: { currency: "EUR", symbol: "€", name: "يورو", flag: "🇪🇸" },
  CN: { currency: "CNY", symbol: "¥", name: "يوان صيني", flag: "🇨🇳" },
  JP: { currency: "JPY", symbol: "¥", name: "ين ياباني", flag: "🇯🇵" },
  CA: { currency: "CAD", symbol: "C$", name: "دولار كندي", flag: "🇨🇦" },
  AU: { currency: "AUD", symbol: "A$", name: "دولار أسترالي", flag: "🇦🇺" },
};

export async function GET(request: Request) {
  try {
    // استخراج IP من الهيدر
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "";

    // جلب البيانات من ipapi.co
    const url = ip && ip !== "127.0.0.1" && ip !== "::1"
      ? `https://ipapi.co/${ip}/json/`
      : "https://ipapi.co/json/";

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 86400 }, // Cache 24 ساعة
    });

    if (!res.ok) throw new Error("ipapi error");
    const data = await res.json();

    const countryCode: string = data.country_code || "US";
    const info = CURRENCY_MAP[countryCode] || CURRENCY_MAP["US"];

    return NextResponse.json(
      {
        country: countryCode,
        countryName: data.country_name || "United States",
        currency: info.currency,
        currencySymbol: info.symbol,
        currencyName: info.name,
        flag: info.flag,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      }
    );
  } catch {
    // Fallback افتراضي
    return NextResponse.json({
      country: "SA",
      countryName: "Saudi Arabia",
      currency: "SAR",
      currencySymbol: "ر.س",
      currencyName: "ريال سعودي",
      flag: "🇸🇦",
    });
  }
}
