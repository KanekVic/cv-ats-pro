// MercadoPago integration temporarily disabled for Vercel deployment
// import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

// const client = new MercadoPagoConfig({
//   accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
// });

// const preferenceClient = new Preference(client);
// const paymentClient = new Payment(client);

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export const prices = {
  basic: {
    title: "Plan Básico - CV ATS Pro",
    unit_price: 119, // $119 MXN
    currency_id: "MXN",
  },
  pro: {
    title: "Plan Pro - CV ATS Pro",
    unit_price: 299, // $299 MXN
    currency_id: "MXN",
  },
};

export async function createPreference(
  plan: "basic" | "pro",
  userId: string,
  successUrl: string,
  failureUrl: string,
  pendingUrl: string
): Promise<MercadoPagoPreference> {
  // MercadoPago integration temporarily disabled
  throw new Error("MercadoPago integration temporarily disabled");
}

export async function createPixPayment(
  amount: number,
  description: string
) {
  // MercadoPago integration temporarily disabled
  throw new Error("MercadoPago integration temporarily disabled");
}
