"use client";

import { useState, useEffect } from "react";
import PriceCard from "@/components/PriceCard";
import Disclaimer from "@/components/Disclaimer";
import AdSlot from "@/components/AdSlot";
import { getMockTechnicalData } from "@/lib/technical";
import { PriceData } from "@/types";

type Rate = { code: string; nameAr: string; rate: number; flag: string; group?: string };

function CurrenciesTab({ currencies }: { currencies: Rate[] }) {
  const [group, setGroup] = useState<"arab" | "world" | "all">("arab");
  const [usdAmount, setUsdAmount] = useState("1");

  const arabCurrencies = currencies.filter((r) => r.group === "arab");
  const worldCurrencies = currencies.filter((r) => r.group === "world");
  const displayed =
    group === "arab" ? arabCurrencies :
    group === "world" ? worldCurrencies :
    currencies;

  const usd = parseFloat(usdAmount) || 1;

  return (
    <div>
      {/* محوّل العملات السريع */}
      <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-text-primary mb-3">💱 محوّل العملات</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-text-secondary text-xs mb-1 block">المبلغ بالدولار (USD)</label>
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              dir="ltr"
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-gold text-sm"
            />
          </div>
          <div className="text-gold text-2xl mt-5">→</div>
          <div className="flex-1 text-sm text-text-secondary mt-5">
            يُعرض في الجدول أدناه
          </div>
        </div>
      </div>

      {/* تبويبات المجموعات */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "arab", label: "🌍 عربية" },
          { id: "world", label: "🌐 عالمية" },
          { id: "all", label: "الكل" },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => setGroup(g.id as "arab" | "world" | "all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              group === g.id
                ? "bg-gold text-background"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-3 px-5 py-3 border-b border-border bg-surface-2 text-xs text-text-secondary font-medium">
          <span>العملة</span>
          <span className="text-center">مقابل $1</span>
          <span className="text-left">قيمة ${usdAmount || "1"}</span>
        </div>
        {displayed.map((rate, idx) => {
          const converted = usd * rate.rate;
          const decimals = rate.rate < 0.1 ? 0 : rate.rate < 10 ? 3 : 2;
          return (
            <div
              key={rate.code}
              className={`grid grid-cols-3 items-center px-5 py-3.5 hover:bg-surface-2 transition-colors ${
                idx !== displayed.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{rate.flag}</span>
                <div>
                  <div className="font-bold text-text-primary text-sm leading-tight">{rate.nameAr}</div>
                  <div className="text-text-secondary text-xs">{rate.code}</div>
                </div>
              </div>
              <div className="text-center text-text-primary font-mono text-sm">
                {rate.rate.toFixed(decimals)}
              </div>
              <div className="text-left text-gold font-bold text-sm">
                {converted.toLocaleString("en-US", { maximumFractionDigits: decimals })}
                <span className="text-text-secondary font-normal text-xs mr-1">{rate.code}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-text-secondary text-xs text-center mt-3">
        📅 تُحدَّث كل ساعة • المصدر: ExchangeRate-API
      </p>
    </div>
  );
}

const TABS = [
  { id: "metals", label: "🥇 ذهب وفضة" },
  { id: "crypto", label: "₿ العملات الرقمية" },
  { id: "currencies", label: "💱 العملات" },
];

export default function PricesPage() {
  const [activeTab, setActiveTab] = useState("metals");
  const [metals, setMetals] = useState<{ gold: PriceData; silver: PriceData } | null>(null);
  const [crypto, setCrypto] = useState<PriceData[]>([]);
  const [currencies, setCurrencies] = useState<{ code: string; nameAr: string; rate: number; flag: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const signals = getMockTechnicalData();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (activeTab === "metals") {
          const res = await fetch("/api/prices?type=metals");
          const data = await res.json();
          setMetals(data);
        } else if (activeTab === "crypto") {
          const res = await fetch("/api/prices?type=crypto");
          const data = await res.json();
          setCrypto([data.bitcoin, data.ethereum].filter(Boolean));
        } else if (activeTab === "currencies") {
          const res = await fetch("/api/prices?type=currencies");
          const data = await res.json();
          setCurrencies(data.rates || []);
        }
      } catch {
        // mock fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeTab]);

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary mb-2">📊 جدول الأسعار</h1>
        <p className="text-text-secondary">أسعار لحظية محدّثة من مصادر موثوقة</p>
      </div>

      {/* التبويبات */}
      <div className="flex gap-2 mb-8 bg-surface rounded-2xl p-1.5 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-gold text-background"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* إعلان بعد التبويبات وقبل المحتوى */}
      <AdSlot size="leaderboard" slot="2345678901" className="mb-6" />
      <AdSlot size="mobile-banner" slot="2345678902" className="mb-6" />

      <Disclaimer compact />

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-surface-2 rounded mb-3 w-1/2" />
                <div className="h-8 bg-surface-2 rounded mb-2" />
                <div className="h-3 bg-surface-2 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : activeTab === "metals" && metals ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <PriceCard data={metals.gold} signal={signals.gold} index={0} />
              <PriceCard data={metals.silver} signal={signals.silver} index={1} />
            </div>

            {/* جدول تفصيلي */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="text-right px-5 py-3 text-text-secondary font-medium">الأصل</th>
                    <th className="text-right px-5 py-3 text-text-secondary font-medium">السعر (USD)</th>
                    <th className="text-right px-5 py-3 text-text-secondary font-medium">التغيير</th>
                    <th className="text-right px-5 py-3 text-text-secondary font-medium hidden md:table-cell">أعلى 24س</th>
                    <th className="text-right px-5 py-3 text-text-secondary font-medium hidden md:table-cell">أدنى 24س</th>
                  </tr>
                </thead>
                <tbody>
                  {[metals.gold, metals.silver].map((item) => (
                    <tr key={item.symbol} className="border-b border-border hover:bg-surface-2 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span>{item.symbol === "XAU" ? "🥇" : "🥈"}</span>
                          <div>
                            <div className="font-bold text-text-primary">{item.nameAr}</div>
                            <div className="text-text-secondary text-xs">{item.unit}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-text-primary">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={item.changePercent >= 0 ? "text-rise" : "text-fall"}>
                          {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-rise hidden md:table-cell">
                        ${item.high24h?.toFixed(2) || "—"}
                      </td>
                      <td className="px-5 py-4 text-fall hidden md:table-cell">
                        ${item.low24h?.toFixed(2) || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* سعر الذهب بالجرام */}
            <div className="mt-6 bg-surface border border-border rounded-2xl p-5">
              <h3 className="font-bold text-text-primary mb-4">💡 سعر الذهب بالجرام (تقريبي)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "عيار 24", factor: 1 },
                  { label: "عيار 22", factor: 22/24 },
                  { label: "عيار 18", factor: 18/24 },
                  { label: "عيار 14", factor: 14/24 },
                ].map(({ label, factor }) => (
                  <div key={label} className="bg-surface-2 rounded-xl p-3 text-center">
                    <div className="text-text-secondary text-xs mb-1">{label}</div>
                    <div className="text-gold font-bold">
                      ${((metals.gold.price / 31.1035) * factor).toFixed(2)}
                    </div>
                    <div className="text-text-secondary text-xs">للجرام</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === "crypto" && crypto.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {crypto.map((item, idx) => (
                <PriceCard
                  key={item.symbol}
                  data={item}
                  signal={signals[item.symbol === "BTC" ? "bitcoin" : "ethereum"]}
                  index={idx}
                />
              ))}
            </div>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="text-right px-5 py-3 text-text-secondary font-medium">العملة</th>
                    <th className="text-right px-5 py-3 text-text-secondary font-medium">السعر</th>
                    <th className="text-right px-5 py-3 text-text-secondary font-medium">التغيير 24س</th>
                    <th className="text-right px-5 py-3 text-text-secondary font-medium hidden md:table-cell">القيمة السوقية</th>
                    <th className="text-right px-5 py-3 text-text-secondary font-medium hidden md:table-cell">الحجم 24س</th>
                  </tr>
                </thead>
                <tbody>
                  {crypto.map((item) => (
                    <tr key={item.symbol} className="border-b border-border hover:bg-surface-2 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span>{item.symbol === "BTC" ? "₿" : "⟠"}</span>
                          <div>
                            <div className="font-bold text-text-primary">{item.nameAr}</div>
                            <div className="text-text-secondary text-xs">{item.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-text-primary">
                        ${item.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={item.changePercent >= 0 ? "text-rise" : "text-fall"}>
                          {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-text-secondary hidden md:table-cell">
                        {item.marketCap ? `$${(item.marketCap / 1e9).toFixed(1)}B` : "—"}
                      </td>
                      <td className="px-5 py-4 text-text-secondary hidden md:table-cell">
                        {item.volume24h ? `$${(item.volume24h / 1e9).toFixed(1)}B` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "currencies" && currencies.length > 0 ? (
          <CurrenciesTab currencies={currencies} />
        ) : (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-4xl mb-3">📡</p>
            <p>تعذّر تحميل البيانات</p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-text-secondary text-xs">
        المصادر: GoldAPI.io • CoinGecko • ExchangeRate-API — تُحدَّث كل 5 دقائق
      </div>
    </div>
  );
}
