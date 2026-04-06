// تنسيق الأرقام والعملات

export function formatPrice(
  price: number,
  currency = "USD",
  decimals = 2
): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
    numberingSystem: "latn", // أرقام غربية 0-9
  }).format(price);
}

export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat("ar-SA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    numberingSystem: "latn",
  }).format(num);
}

export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(2)}%`;
}

export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)} تريليون`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)} مليار`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)} مليون`;
  return formatNumber(value, 0);
}

export function formatTime(isoString: string): string {
  return new Intl.DateTimeFormat("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    numberingSystem: "latn",
  }).format(new Date(isoString));
}

export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    numberingSystem: "latn",
  }).format(new Date(isoString));
}
