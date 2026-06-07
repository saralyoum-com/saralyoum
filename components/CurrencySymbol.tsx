/**
 * Renders a small currency symbol next to a price number.
 *
 * Priority order:
 *   1. Official SVG icon (SAR, AED) — uses CSS mask + currentColor for dark mode
 *   2. Unicode symbol ($, ₪)
 *   3. 3-letter ISO code (KWD, QAR, BHD, etc.)
 */

interface Props {
  currency: string;          // ISO code: "SAR", "AED", "USD", "ILS", etc.
  size?: "sm" | "md" | "lg"; // size variants
  className?: string;
}

/* Currencies with official SVG icons */
const SVG_CURRENCIES: Record<string, string> = {
  SAR: "/currencies/sar.svg",
  AED: "/currencies/aed.svg",
};

/* Currencies with Unicode symbols */
const UNICODE_SYMBOLS: Record<string, string> = {
  USD: "$",
  ILS: "₪",
  EUR: "€",
  GBP: "£",
};

const SIZES = {
  sm: { px: 12, text: "text-[10px]" },
  md: { px: 16, text: "text-xs" },
  lg: { px: 20, text: "text-sm" },
} as const;

export default function CurrencySymbol({ currency, size = "md", className = "" }: Props) {
  const sz = SIZES[size];
  const code = currency.toUpperCase();

  /* 1. Official SVG icon — using CSS mask so it adapts to text color */
  if (SVG_CURRENCIES[code]) {
    return (
      <span
        role="img"
        aria-label={code}
        className={`inline-block align-middle ${className}`}
        style={{
          width: `${sz.px}px`,
          height: `${sz.px}px`,
          backgroundColor: "currentColor",
          maskImage: `url(${SVG_CURRENCIES[code]})`,
          WebkitMaskImage: `url(${SVG_CURRENCIES[code]})`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    );
  }

  /* 2. Unicode single-char symbol */
  if (UNICODE_SYMBOLS[code]) {
    return (
      <span className={`inline-block font-bold align-middle ${sz.text} ${className}`}>
        {UNICODE_SYMBOLS[code]}
      </span>
    );
  }

  /* 3. Fallback: 3-letter ISO code */
  return (
    <span className={`inline-block font-medium opacity-80 align-middle ${sz.text} ${className}`}>
      {code}
    </span>
  );
}
