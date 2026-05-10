import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
});

export interface StripePrice {
  id: string;
  amount: number;
  currency: string;
}

export const prices: Record<string, StripePrice> = {
  basic: {
    id: process.env.STRIPE_PRICE_BASIC || "",
    amount: 599, // $5.99 USD
    currency: "usd",
  },
  pro: {
    id: process.env.STRIPE_PRICE_PRO || "",
    amount: 1499, // $14.99 USD
    currency: "usd",
  },
};

export async function createCheckoutSession(
  userId: string,
  plan: "basic" | "pro",
  successUrl: string,
  cancelUrl: string
) {
  const price = prices[plan];

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      plan,
    },
  });

  return session;
}

export async function createPaymentIntent(
  amount: number,
  currency: string = "mxn"
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
  });

  return paymentIntent;
}
