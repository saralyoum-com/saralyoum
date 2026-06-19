export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

const TROY_OZ = 31.1035;

// Arab countries ordered by economic importance
const ARAB_COUNTRIES = [
  { flag: "🇸🇦", name: "السعودية",  currencyCode: "SAR",  currency: "ر.س"  },
  { flag: "🇦🇪", name: "الإمارات",  currencyCode: "AED",  currency: "د.إ"  },
  { flag: "🇪🇬", name: "مصر",        currencyCode: "EGP",  currency: "ج.م"  },
  { flag: "🇰🇼", name: "الكويت",     currencyCode: "KWD",  currency: "د.ك"  },
  { flag: "🇶🇦", name: "قطر",        currencyCode: "QAR",  currency: "ر.ق"  },
  { flag: "🇮🇶", name: "العراق",     currencyCode: "IQD",  currency: "د.ع"  },
  { flag: "🇲🇦", name: "المغرب",     currencyCode: "MAD",  currency: "د.م"  },
  { flag: "🇩🇿", name: "الجزائر",    currencyCode: "DZD",  currency: "د.ج"  },
  { flag: "🇧🇭", name: "البحرين",    currencyCode: "BHD",  currency: "د.ب"  },
  { flag: "🇴🇲", name: "عُمان",      currencyCode: "OMR",  currency: "ر.ع"  },
  { flag: "🇯🇴", name: "الأردن",     currencyCode: "JOD",  currency: "د.أ"  },
  { flag: "🇹🇳", name: "تونس",       currencyCode: "TND",  currency: "د.ت"  },
  { flag: "🇱🇾", name: "ليبيا",      currencyCode: "LYD",  currency: "د.ل"  },
  { flag: "🇸🇩", name: "السودان",    currencyCode: "SDG",  currency: "ج.س"  },
  { flag: "🇾🇪", name: "اليمن",      currencyCode: "YER",  currency: "ر.ي"  },
  { flag: "🇱🇧", name: "لبنان",      currencyCode: "LBP",  currency: "ل.ل"  },
];

function formatPrice(val: number): string {
  if (val >= 100000) return val.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (val >= 1000)   return val.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (val >= 100)    return val.toFixed(2);
  return val.toFixed(3);
}

export async function GET(req: Request) {
  // Verify cron secret
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch XAU/USD price
    const pricesRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://sardhahab.com"}/api/prices?type=metals`,
      { cache: "no-store" }
    );
    const pricesData = await pricesRes.json();
    const xauUsd: number = pricesData?.gold?.price ?? 3320;
    const changePct: number = pricesData?.gold?.changePercent ?? 0;
    const isUp = changePct >= 0;

    // Fetch exchange rates (USD-based)
    const ratesRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://sardhahab.com"}/api/prices?type=currencies`,
      { cache: "no-store" }
    );
    const ratesData = await ratesRes.json();
    const rates: Record<string, number> = {};
    (ratesData?.rates ?? ratesData?.currencies ?? []).forEach((r: { code: string; rate: number }) => {
      rates[r.code] = r.rate;
    });

    // Calculate price per gram 24K in each currency
    const xauPerGram = xauUsd / TROY_OZ;
    const lines = ARAB_COUNTRIES.map(c => {
      const rate = rates[c.currencyCode];
      if (!rate) return null;
      const priceLocal = xauPerGram * rate;
      return `${c.flag} ${c.name.padEnd(8)} ${formatPrice(priceLocal)} ${c.currency}`;
    }).filter(Boolean);

    // Format date
    const now = new Date();
    const dateStr = now.toLocaleDateString("ar-SA", {
      weekday: "long", day: "numeric", month: "long",
      timeZone: "Asia/Riyadh",
    });

    const arrow = isUp ? "🟢 ▲" : "🔴 ▼";
    const sign  = isUp ? "+" : "";
    const pctStr = `${sign}${changePct.toFixed(2)}%`;

    const message = [
      `🥇 <b>أسعار الذهب اليوم</b> — ${arrow} (${pctStr})`,
      `📅 ${dateStr}`,
      ``,
      `💰 <b>سعر الغرام عيار 24:</b>`,
      `<code>${lines.join("\n")}</code>`,
      ``,
      `🔗 sardhahab.com`,
      `#سعر_الذهب #الوطن_العربي #استثمار`,
    ].join("\n");

    await sendTelegramMessage(message);

    return NextResponse.json({ ok: true, countries: lines.length });
  } catch (err) {
    console.error("countries cron error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
