"use client";

import { useState, useEffect, createContext, useContext } from "react";

interface LocationInfo {
  country: string;
  currency: string;
  currencySymbol: string;
  currencyName: string;
  flag: string;
  rate: number; // سعر الصرف مقابل USD
}

const defaultLocation: LocationInfo = {
  country: "SA",
  currency: "SAR",
  currencySymbol: "ر.س",
  currencyName: "ريال سعودي",
  flag: "🇸🇦",
  rate: 3.75,
};

const LocationContext = createContext<LocationInfo>(defaultLocation);

export function useLocation() {
  return useContext(LocationContext);
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationInfo>(defaultLocation);

  useEffect(() => {
    async function detect() {
      try {
        const [locRes, ratesRes] = await Promise.all([
          fetch("/api/location"),
          fetch("/api/prices?type=currencies"),
        ]);

        if (!locRes.ok) return;
        const loc = await locRes.json();

        let rate = 1;
        if (loc.currency !== "USD" && ratesRes.ok) {
          const ratesData = await ratesRes.json();
          const found = ratesData.rates?.find(
            (r: { code: string; rate: number }) => r.code === loc.currency
          );
          if (found) rate = found.rate;
        }

        setLocation({
          country: loc.country,
          currency: loc.currency,
          currencySymbol: loc.currencySymbol,
          currencyName: loc.currencyName,
          flag: loc.flag,
          rate,
        });
      } catch {}
    }
    detect();
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
}

// شريط صغير يعرض العملة المكتشفة
export function CurrencyBadge() {
  const loc = useLocation();
  if (loc.currency === "USD") return null;

  return (
    <div className="flex items-center justify-center gap-2 text-xs text-text-secondary bg-surface border border-border rounded-full px-3 py-1 w-fit mx-auto mb-4">
      <span>{loc.flag}</span>
      <span>العملة المحلية:</span>
      <span className="text-gold font-medium">{loc.currencyName}</span>
      <span className="text-text-secondary">($1 = {loc.rate.toFixed(2)} {loc.currencySymbol})</span>
    </div>
  );
}
