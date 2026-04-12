"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLang } from "@/components/LanguageContext";

type HistoryPoint = { t: number; p: number };

type Range = "1d" | "1w" | "1m" | "1y" | "5y";

interface PriceChartProps {
  asset: "gold" | "silver" | "bitcoin" | "ethereum";
  currentPrice: number;
  changePercent: number;
}

const RANGE_LABELS_AR: Record<Range, string> = {
  "1d": "اليوم",
  "1w": "أسبوع",
  "1m": "شهر",
  "1y": "سنة",
  "5y": "5 سنوات",
};
const RANGE_LABELS_EN: Record<Range, string> = {
  "1d": "1D",
  "1w": "1W",
  "1m": "1M",
  "1y": "1Y",
  "5y": "5Y",
};

const ASSET_COLORS: Record<string, string> = {
  gold: "#C9A84C",
  silver: "#9CA3AF",
  bitcoin: "#F7931A",
  ethereum: "#627EEA",
};

function formatDate(ts: number, range: Range): string {
  const d = new Date(ts);
  if (range === "1d") return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (range === "1w") return d.toLocaleDateString("en-US", { weekday: "short", hour: "2-digit" });
  if (range === "1m") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function formatPrice(p: number, asset: string): string {
  if (asset === "bitcoin") return `$${p.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (asset === "ethereum") return `$${p.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `$${p.toFixed(2)}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, asset }: any) {
  if (!active || !payload?.length) return null;
  const pt = payload[0].payload;
  return (
    <div className="bg-surface border border-border rounded-xl px-3 py-2 text-sm shadow-lg">
      <p className="text-text-secondary text-xs">{new Date(pt.t).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
      <p className="font-bold text-text-primary">{formatPrice(pt.p, asset)}</p>
    </div>
  );
}

export default function PriceChart({ asset, currentPrice, changePercent }: PriceChartProps) {
  const { lang } = useLang();
  const [range, setRange] = useState<Range>("1m");
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverPrice, setHoverPrice] = useState<number | null>(null);

  const color = ASSET_COLORS[asset] || "#C9A84C";
  const rangeLabels = lang === "ar" ? RANGE_LABELS_AR : RANGE_LABELS_EN;
  const RANGES: Range[] = ["1d", "1w", "1m", "1y", "5y"];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/history?asset=${asset}&range=${range}`);
      const json = await res.json();
      setData(json.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [asset, range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Calc range change %
  const firstPrice = data[0]?.p;
  const lastPrice = data[data.length - 1]?.p;
  const rangeChange = firstPrice && lastPrice
    ? ((lastPrice - firstPrice) / firstPrice) * 100
    : null;

  const isPositive = (rangeChange ?? changePercent) >= 0;

  const displayPrice = hoverPrice ?? currentPrice;

  // Min/max for Y axis
  const prices = data.map((d) => d.p).filter(Boolean);
  const minP = prices.length ? Math.min(...prices) * 0.999 : 0;
  const maxP = prices.length ? Math.max(...prices) * 1.001 : 0;

  const chartData = data.map((d) => ({ t: d.t, p: d.p }));

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 mt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-text-secondary text-xs mb-0.5">
            {lang === "ar" ? "الرسم البياني" : "Price Chart"}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-text-primary">
              {formatPrice(displayPrice, asset)}
            </span>
            {rangeChange !== null && (
              <span className={`text-sm font-bold ${isPositive ? "text-rise" : "text-fall"}`}>
                {isPositive ? "+" : ""}{rangeChange.toFixed(2)}%
                <span className="text-text-secondary font-normal text-xs ml-1">
                  ({rangeLabels[range]})
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex gap-1 bg-surface-2 rounded-xl p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                range === r
                  ? "text-background"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              style={range === r ? { backgroundColor: color } : {}}
            >
              {rangeLabels[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-48 sm:h-64 flex items-center justify-center">
          <div className="flex gap-1 items-end h-8">
            {[3, 5, 4, 6, 5, 7, 4, 5, 6, 4].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full animate-pulse"
                style={{ height: `${h * 4}px`, backgroundColor: color, opacity: 0.4 + i * 0.06 }}
              />
            ))}
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="h-48 sm:h-64 flex items-center justify-center text-text-secondary text-sm">
          {lang === "ar" ? "لا تتوفر بيانات" : "No data available"}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            onMouseLeave={() => setHoverPrice(null)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onMouseMove={(state: any) => {
              if (state?.activePayload?.[0]) {
                setHoverPrice(state.activePayload[0].payload.p);
              }
            }}
          >
            <defs>
              <linearGradient id={`grad-${asset}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="t"
              tickFormatter={(t) => formatDate(t, range)}
              tick={{ fill: "#6B7280", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              domain={[minP, maxP]}
              tickFormatter={(v) => (asset === "bitcoin" || asset === "ethereum")
                ? `$${(v / 1000).toFixed(0)}k`
                : `$${v.toFixed(0)}`}
              tick={{ fill: "#6B7280", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={55}
              orientation="left"
            />
            <Tooltip content={<CustomTooltip asset={asset} />} />
            <Area
              type="monotone"
              dataKey="p"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${asset})`}
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* Stats row */}
      {!loading && data.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
          <div className="text-center">
            <p className="text-text-secondary text-xs">{lang === "ar" ? "الأعلى" : "High"}</p>
            <p className="font-bold text-rise text-sm">{formatPrice(maxP / 1.001, asset)}</p>
          </div>
          <div className="text-center">
            <p className="text-text-secondary text-xs">{lang === "ar" ? "الأدنى" : "Low"}</p>
            <p className="font-bold text-fall text-sm">{formatPrice(minP / 0.999, asset)}</p>
          </div>
          <div className="text-center">
            <p className="text-text-secondary text-xs">{lang === "ar" ? "التغيير" : "Change"}</p>
            <p className={`font-bold text-sm ${isPositive ? "text-rise" : "text-fall"}`}>
              {rangeChange !== null ? `${isPositive ? "+" : ""}${rangeChange.toFixed(2)}%` : "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
