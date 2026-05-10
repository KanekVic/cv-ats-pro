import { prisma } from "@/lib/db/prisma";

export async function getUserSubscription(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  return subscription;
}

export async function getUserPlan(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  return user?.plan || "FREE";
}

export async function cancelSubscription(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE" },
  });

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "CANCELLED",
        cancelAt: subscription.currentPeriodEnd,
      },
    });
  }

  return subscription;
}

export async function checkSubscriptionAccess(userId: string, feature: string) {
  const plan = await getUserPlan(userId);

  const features = {
    FREE: ["basic_cv", "basic_ats", "pdf_export"],
    BASIC: [
      "basic_cv",
      "basic_ats",
      "pdf_export",
      "ai_generation",
      "unlimited_ats",
      "version_history",
    ],
    PRO: [
      "basic_cv",
      "basic_ats",
      "pdf_export",
      "ai_generation",
      "unlimited_ats",
      "version_history",
      "linkedin_optimizer",
      "cover_letter",
      "premium_templates",
    ],
  };

  return features[plan as keyof typeof features]?.includes(feature) || false;
}
