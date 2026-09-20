"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatDop, formatUsd } from "@/lib/money";

export type DisplayCurrency = "USD" | "DOP";

type CurrencyContextValue = {
  currency: DisplayCurrency;
  setCurrency: (value: DisplayCurrency) => void;
  formatAmount: (usd: number, dop: number) => string;
  formatSecondary: (usd: number, dop: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<DisplayCurrency>("USD");

  const setCurrency = useCallback((value: DisplayCurrency) => {
    setCurrencyState(value);
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      formatAmount: (usd, dop) =>
        currency === "DOP" ? formatDop(dop) : formatUsd(usd),
      formatSecondary: (usd, dop) =>
        currency === "DOP" ? formatUsd(usd) : formatDop(dop),
    }),
    [currency, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useDisplayCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: "USD" as const,
      setCurrency: () => undefined,
      formatAmount: (usd: number) => formatUsd(usd),
      formatSecondary: (_usd: number, dop: number) => formatDop(dop),
    };
  }
  return context;
}

export function CurrencySwitch({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { currency, setCurrency } = useDisplayCurrency();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/12 bg-white/5 p-1 ${
        compact ? "" : "shadow-sm"
      }`}
      role="group"
      aria-label="País y moneda"
    >
      <span className="px-2.5 text-[11px] font-semibold tracking-[0.16em] text-white/78">
        RD
      </span>
      {(["USD", "DOP"] as const).map((option) => {
        const active = currency === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setCurrency(option)}
            className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase transition-all duration-200 ${
              active
                ? "bg-white text-black shadow-sm"
                : "text-white/55 hover:text-white"
            }`}
          >
            {option === "USD" ? "USD" : "DOP"}
          </button>
        );
      })}
    </div>
  );
}
