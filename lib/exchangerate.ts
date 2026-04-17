export interface ExchangeRate {
  code: string;
  nameAr: string;
  rate: number;
  change: number;
  changePercent: number;
  flag: string;
  group: "arab" | "world";
}

const currencyNames: Record<string, { nameAr: string; flag: string; group: "arab" | "world" }> = {
  // ── العملات العربية ──
  SAR: { nameAr: "ريال سعودي",      flag: "🇸🇦", group: "arab" },
  AED: { nameAr: "درهم إماراتي",    flag: "🇦🇪", group: "arab" },
  KWD: { nameAr: "دينار كويتي",     flag: "🇰🇼", group: "arab" },
  BHD: { nameAr: "دينار بحريني",    flag: "🇧🇭", group: "arab" },
  QAR: { nameAr: "ريال قطري",       flag: "🇶🇦", group: "arab" },
  OMR: { nameAr: "ريال عُماني",     flag: "🇴🇲", group: "arab" },
  EGP: { nameAr: "جنيه مصري",       flag: "🇪🇬", group: "arab" },
  JOD: { nameAr: "دينار أردني",     flag: "🇯🇴", group: "arab" },
  MAD: { nameAr: "درهم مغربي",      flag: "🇲🇦", group: "arab" },
  TND: { nameAr: "دينار تونسي",     flag: "🇹🇳", group: "arab" },
  DZD: { nameAr: "دينار جزائري",    flag: "🇩🇿", group: "arab" },
  LYD: { nameAr: "دينار ليبي",      flag: "🇱🇾", group: "arab" },
  IQD: { nameAr: "دينار عراقي",     flag: "🇮🇶", group: "arab" },
  YER: { nameAr: "ريال يمني",       flag: "🇾🇪", group: "arab" },
  SDG: { nameAr: "جنيه سوداني",     flag: "🇸🇩", group: "arab" },
  LBP: { nameAr: "ليرة لبنانية",    flag: "🇱🇧", group: "arab" },
  // ── العملات العالمية ──
  EUR: { nameAr: "يورو",            flag: "🇪🇺", group: "world" },
  GBP: { nameAr: "جنيه إسترليني",  flag: "🇬🇧", group: "world" },
  JPY: { nameAr: "ين ياباني",       flag: "🇯🇵", group: "world" },
  CHF: { nameAr: "فرنك سويسري",    flag: "🇨🇭", group: "world" },
  CAD: { nameAr: "دولار كندي",      flag: "🇨🇦", group: "world" },
  AUD: { nameAr: "دولار أسترالي",   flag: "🇦🇺", group: "world" },
  CNY: { nameAr: "يوان صيني",       flag: "🇨🇳", group: "world" },
  INR: { nameAr: "روبية هندية",     flag: "🇮🇳", group: "world" },
  TRY: { nameAr: "ليرة تركية",      flag: "🇹🇷", group: "world" },
  PKR: { nameAr: "روبية باكستانية", flag: "🇵🇰", group: "world" },
  RUB: { nameAr: "روبل روسي",       flag: "🇷🇺", group: "world" },
  KRW: { nameAr: "وون كوري",        flag: "🇰🇷", group: "world" },
};

export async function getExchangeRates(): Promise<ExchangeRate[]> {
  try {
    const key = process.env.EXCHANGE_RATE_API_KEY;
    const url = key
      ? `https://v6.exchangerate-api.com/v6/${key}/latest/USD`
      : `https://open.er-api.com/v6/latest/USD`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("ExchangeRate API error");
    const data = await res.json();
    const rates = data.rates || data.conversion_rates;

    return Object.entries(currencyNames).map(([code, info]) => ({
      code,
      nameAr: info.nameAr,
      flag: info.flag,
      group: info.group,
      rate: rates[code] || 0,
      change: 0,
      changePercent: 0,
    }));
  } catch {
    return getMockRates();
  }
}

function getMockRates(): ExchangeRate[] {
  const mockRates: Record<string, number> = {
    SAR: 3.75,   AED: 3.6725,  KWD: 0.3075,  BHD: 0.3770,
    QAR: 3.64,   OMR: 0.3845,  EGP: 54.41,   JOD: 0.709,
    MAD: 10.05,  TND: 3.12,    DZD: 134.5,   LYD: 4.85,
    IQD: 1310,   YER: 250,     SDG: 601,    LBP: 89500,
    EUR: 0.923,  GBP: 0.788,   JPY: 149.5,   CHF: 0.899,
    CAD: 1.364,  AUD: 1.528,   CNY: 7.24,    INR: 83.1,
    TRY: 32.2,   PKR: 278,     RUB: 91.5,    KRW: 1335,
  };
  return Object.entries(currencyNames).map(([code, info]) => ({
    code,
    nameAr: info.nameAr,
    flag: info.flag,
    group: info.group,
    rate: mockRates[code] || 1,
    change: 0,
    changePercent: 0,
  }));
}
