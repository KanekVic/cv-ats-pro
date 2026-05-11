import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signatureHeader = headers().get("webhook-signature") || "";

  if (!signatureHeader) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signatureHeader,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const stripeSubscriptionId = session.subscription as string;

        if (userId && plan) {
          // Find existing subscription for this user
          const existingSubscription = await prisma.subscription.findFirst({
            where: { userId, status: "ACTIVE" },
          });

          if (existingSubscription) {
            // Update existing subscription
            await prisma.subscription.update({
              where: { id: existingSubscription.id },
              data: {
                plan: plan.toUpperCase() as "BASIC" | "PRO",
                status: "ACTIVE",
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ),
              },
            });
          } else {
            // Create new subscription
            await prisma.subscription.create({
              data: {
                userId,
                plan: plan.toUpperCase() as "BASIC" | "PRO",
                status: "ACTIVE",
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ),
              },
            });
          }

          await prisma.user.update({
            where: { id: userId },
            data: { plan: plan.toUpperCase() as "FREE" | "BASIC" | "PRO" },
          });
        }
        break;

      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        // TODO: Find user by customer ID and cancel subscription
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
