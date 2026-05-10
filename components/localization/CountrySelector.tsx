"use client";

import { useState } from "react";
import { countries, getCountryConfig } from "@/lib/localization/config";

interface CountrySelectorProps {
  selectedCountry?: string;
  onCountryChange: (countryCode: string) => void;
}

export function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = getCountryConfig(selectedCountry || "MX");

  return (
    <div className="country-selector">
      <button
        className="country-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{config.code}</span>
        <span>{config.name}</span>
      </button>

      {isOpen && (
        <div className="country-dropdown">
          {countries.map((country) => (
            <button
              key={country.code}
              className={`country-option ${selectedCountry === country.code ? "selected" : ""}`}
              onClick={() => {
                onCountryChange(country.code);
                setIsOpen(false);
              }}
            >
              <span>{country.code}</span>
              <span>{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
