export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";
import { postToX } from "@/lib/twitter";

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

    // Top 3 countries for X post (SA, AE, EG)
    const top3 = ARAB_COUNTRIES.slice(0, 3).map(c => {
      const rate = rates[c.currencyCode];
      if (!rate) return null;
      const priceLocal = (xauUsd / TROY_OZ) * rate;
      return `${c.flag} ${c.name} ${formatPrice(priceLocal)} ${c.currency}`;
    }).filter(Boolean).join(" | ");

    const xPost = `🥇 الذهب اليوم $${formatPrice(xauUsd)} (${pctStr})\n\n${top3}\n\nأسعار لحظية لـ 19 دولة عربية 👇\nsardhahab.com\n\n#سعر_الذهب`;

    const linkedinPost = `أسعار الذهب اليوم — ${dateStr}\n\nسعر الغرام (عيار 24) في الدول العربية:\n\n${lines.slice(0, 8).join("\n")}\n\nسعر الأوقية العالمي: $${formatPrice(xauUsd)} (${pctStr})\n\nلمتابعة الأسعار اللحظية لجميع الدول العربية:\nsardhahab.com\n\n#الذهب #أسعار_الذهب #الاستثمار #الاقتصاد_العربي`;

    const message = [
      `🥇 <b>أسعار الذهب اليوم</b> — ${arrow} (${pctStr})`,
      `📅 ${dateStr}`,
      ``,
      `💰 <b>سعر الغرام عيار 24:</b>`,
      `<code>${lines.join("\n")}</code>`,
      ``,
      `🔗 sardhahab.com`,
      `#سعر_الذهب #الوطن_العربي #استثمار`,
      ``,
      `─────────────────`,
      `🐦 <b>X / Twitter</b> (انسخ وانشر يدوياً)`,
      ``,
      xPost,
      ``,
      `─────────────────`,
      `💼 <b>LinkedIn</b> (انسخ وانشر يدوياً)`,
      ``,
      linkedinPost,
    ].join("\n");

    const [, xRes] = await Promise.allSettled([
      sendTelegramMessage(message),
      postToX(xPost),
    ]);

    return NextResponse.json({
      ok: true, countries: lines.length,
      x: xRes.status === "fulfilled" ? xRes.value : String((xRes as PromiseRejectedResult).reason),
    });
  } catch (err) {
    console.error("countries cron error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
