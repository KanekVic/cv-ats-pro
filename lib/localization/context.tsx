"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { countries, getCountryConfig, getPlanPrice, formatPrice } from "./config";

interface LocalizationContextType {
  country: string;
  setCountry: (country: string) => void;
  config: ReturnType<typeof getCountryConfig>;
  getPlanPrice: (plan: "FREE" | "BASIC" | "PRO") => {
    price: number;
    currency: string;
    formatted: string;
  };
  formatPrice: (price: number, currency: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState("MX");
  const config = getCountryConfig(country);

  const getLocalizedPlanPrice = (plan: "FREE" | "BASIC" | "PRO") => {
    return getPlanPrice(plan, country);
  };

  const formatLocalizedPrice = (price: number, currency: string) => {
    return formatPrice(price, currency, country);
  };

  return (
    <LocalizationContext.Provider
      value={{
        country,
        setCountry,
        config,
        getPlanPrice: getLocalizedPlanPrice,
        formatPrice: formatLocalizedPrice,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }
  return context;
}
