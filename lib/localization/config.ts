export const countries = [
  {
    code: "MX",
    name: "México",
    currency: "MXN",
    currencySymbol: "$",
    locale: "es-MX",
    phonePrefix: "+52",
  },
  {
    code: "CO",
    name: "Colombia",
    currency: "COP",
    currencySymbol: "$",
    locale: "es-CO",
    phonePrefix: "+57",
  },
  {
    code: "AR",
    name: "Argentina",
    currency: "ARS",
    currencySymbol: "$",
    locale: "es-AR",
    phonePrefix: "+54",
  },
  {
    code: "CL",
    name: "Chile",
    currency: "CLP",
    currencySymbol: "$",
    locale: "es-CL",
    phonePrefix: "+56",
  },
  {
    code: "PE",
    name: "Perú",
    currency: "PEN",
    currencySymbol: "S/",
    locale: "es-PE",
    phonePrefix: "+51",
  },
];

export const plans = {
  FREE: {
    MX: { price: 0, currency: "MXN" },
    CO: { price: 0, currency: "COP" },
    AR: { price: 0, currency: "ARS" },
    CL: { price: 0, currency: "CLP" },
    PE: { price: 0, currency: "PEN" },
  },
  BASIC: {
    MX: { price: 119, currency: "MXN" },
    CO: { price: 29000, currency: "COP" },
    AR: { price: 15000, currency: "ARS" },
    CL: { price: 9900, currency: "CLP" },
    PE: { price: 49, currency: "PEN" },
  },
  PRO: {
    MX: { price: 299, currency: "MXN" },
    CO: { price: 73000, currency: "COP" },
    AR: { price: 38000, currency: "ARS" },
    CL: { price: 24900, currency: "CLP" },
    PE: { price: 119, currency: "PEN" },
  },
};

export function getCountryConfig(countryCode: string) {
  return countries.find((c) => c.code === countryCode) || countries[0];
}

export function formatPrice(price: number, currency: string, countryCode: string) {
  const country = getCountryConfig(countryCode);
  return new Intl.NumberFormat(country.locale, {
    style: "currency",
    currency: currency,
  }).format(price);
}

export function getPlanPrice(plan: "FREE" | "BASIC" | "PRO", countryCode: string) {
  const planConfig = plans[plan] as any;
  const priceConfig = planConfig[countryCode] || planConfig["MX"];
  return {
    price: priceConfig.price,
    currency: priceConfig.currency,
    formatted: formatPrice(priceConfig.price, priceConfig.currency, countryCode),
  };
}
