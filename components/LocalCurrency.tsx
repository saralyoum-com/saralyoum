"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";

export interface LocationInfo {
  country: string;
  currency: string;
  currencySymbol: string;
  currencyName: string;
  flag: string;
  rate: number;
}

interface LocationContextType {
  location: LocationInfo;
  setPreferredCurrency: (info: LocationInfo) => void;
}

const defaultLocation: LocationInfo = {
  country: "SA",
  currency: "SAR",
  currencySymbol: "ر.س",
  currencyName: "ريال سعودي",
  flag: "🇸🇦",
  rate: 3.75,
};

const LocationContext = createContext<LocationContextType>({
  location: defaultLocation,
  setPreferredCurrency: () => {},
});

export function useLocation() {
  return useContext(LocationContext).location;
}

export function useSetCurrency() {
  return useContext(LocationContext).setPreferredCurrency;
}

const STORAGE_KEY = "sardh_preferred_currency";

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationInfo>(defaultLocation);

  const setPreferredCurrency = useCallback((info: LocationInfo) => {
    setLocation(info);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(info)); } catch {}
  }, []);

  useEffect(() => {
    // 1. Check localStorage first
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as LocationInfo;
        if (parsed.currency && parsed.rate) {
          setLocation(parsed);
          return;
        }
      }
    } catch {}

    // 2. Auto-detect from IP
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
    <LocationContext.Provider value={{ location, setPreferredCurrency }}>
      {children}
    </LocationContext.Provider>
  );
}

export function CurrencyBadge() {
  const loc = useLocation();
  if (loc.currency === "USD") return null;
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-text-secondary bg-surface border border-border rounded-full px-3 py-1 w-fit mx-auto mb-4">
      <span>{loc.flag}</span>
      <span>العملة:</span>
      <span className="text-gold font-medium">{loc.currencyName}</span>
      <span className="text-text-secondary">
        ($1 = {loc.rate >= 1 ? loc.rate.toFixed(2) : loc.rate.toFixed(4)} {loc.currencySymbol})
      </span>
    </div>
  );
}
