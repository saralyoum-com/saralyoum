"use client";

import PriceCard from "@/components/PriceCard";
import { CurrencyBadge, useLocation } from "@/components/LocalCurrency";
import { useLang } from "@/components/LanguageContext";
import { PriceData, TechnicalSignal } from "@/types";

interface Props {
  gold: PriceData;
  silver: PriceData;
  bitcoin: PriceData;
  ethereum: PriceData;
  signals: Record<string, TechnicalSignal>;
}

export default function PriceCardsClient({ gold, silver, bitcoin, ethereum, signals }: Props) {
  const loc = useLocation();
  const { lang } = useLang();

  return (
    <>
      <CurrencyBadge />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <PriceCard data={gold}    signal={signals.gold}    index={0} localRate={loc.rate} localSymbol={loc.currencySymbol} lang={lang} />
        <PriceCard data={silver}  signal={signals.silver}  index={1} localRate={loc.rate} localSymbol={loc.currencySymbol} lang={lang} />
        <PriceCard data={bitcoin} signal={signals.bitcoin} index={2} localRate={loc.rate} localSymbol={loc.currencySymbol} lang={lang} />
        <PriceCard data={ethereum}signal={signals.ethereum}index={3} localRate={loc.rate} localSymbol={loc.currencySymbol} lang={lang} />
      </div>
    </>
  );
}
