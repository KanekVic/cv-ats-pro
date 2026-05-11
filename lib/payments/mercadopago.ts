import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

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
  const price = prices[plan];

  const preference = await preferenceClient.create({
    body: {
      items: [
        {
          id: "item-1",
          title: price.title,
          quantity: 1,
          unit_price: price.unit_price,
          currency_id: price.currency_id,
        },
      ],
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      auto_return: "approved",
      metadata: {
        userId,
        plan,
      },
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
        default_installments: 1,
      },
    },
  });

  return {
    id: preference.id || "",
    init_point: preference.init_point || "",
    sandbox_init_point: preference.sandbox_init_point || "",
  };
}

export async function createPixPayment(
  amount: number,
  description: string
) {
  const payment = await paymentClient.create({
    body: {
      transaction_amount: amount,
      description,
      payment_method_id: "pix",
      payer: {
        email: "user@example.com",
      },
    },
  });

  return payment;
}
