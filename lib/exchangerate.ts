export interface ExchangeRate {
  code: string;
  nameAr: string;
  rate: number;
  change: number;
  changePercent: number;
  flag: string;
}

const currencyNames: Record<string, { nameAr: string; flag: string }> = {
  SAR: { nameAr: "ريال سعودي", flag: "🇸🇦" },
  AED: { nameAr: "درهم إماراتي", flag: "🇦🇪" },
  EGP: { nameAr: "جنيه مصري", flag: "🇪🇬" },
  KWD: { nameAr: "دينار كويتي", flag: "🇰🇼" },
  QAR: { nameAr: "ريال قطري", flag: "🇶🇦" },
  BHD: { nameAr: "دينار بحريني", flag: "🇧🇭" },
  OMR: { nameAr: "ريال عُماني", flag: "🇴🇲" },
  JOD: { nameAr: "دينار أردني", flag: "🇯🇴" },
  EUR: { nameAr: "يورو", flag: "🇪🇺" },
  GBP: { nameAr: "جنيه إسترليني", flag: "🇬🇧" },
  TRY: { nameAr: "ليرة تركية", flag: "🇹🇷" },
  MAD: { nameAr: "درهم مغربي", flag: "🇲🇦" },
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
    SAR: 3.75, AED: 3.67, EGP: 48.5, KWD: 0.307,
    QAR: 3.64, BHD: 0.377, OMR: 0.385, JOD: 0.709,
    EUR: 0.92, GBP: 0.79, TRY: 38.5, MAD: 10.1,
  };
  return Object.entries(currencyNames).map(([code, info]) => ({
    code,
    nameAr: info.nameAr,
    flag: info.flag,
    rate: mockRates[code] || 1,
    change: 0,
    changePercent: 0,
  }));
}
