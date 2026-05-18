import { NextRequest, NextResponse } from "next/server";
import { createPreference } from "@/lib/payments/mercadopago";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, plan } = body;

    if (!userId || !plan) {
      return NextResponse.json(
        { error: "Missing required fields: userId, plan" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/dashboard?payment=success`;
    const failureUrl = `${baseUrl}/pricing?payment=failed`;
    const pendingUrl = `${baseUrl}/dashboard?payment=pending`;

    const preference = await createPreference(
      plan,
      userId,
      successUrl,
      failureUrl,
      pendingUrl
    );

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error creating MercadoPago preference:", error);
    return NextResponse.json(
      { error: "Failed to create preference" },
      { status: 500 }
    );
  }
}
