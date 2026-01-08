// src/app/api/subscription/subinfo/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      subscriptions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const subscription = user.subscriptions[0] ?? null;

  // ---- FREE TIER LOGIC ----
  let freeTier = null;
  if (user.freeTierEndsAt) {
    const now = new Date();
    const diffMs = user.freeTierEndsAt.getTime() - now.getTime();
    const daysLeft = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0);

    freeTier = {
      endsAt: user.freeTierEndsAt,
      daysLeft,
      active: diffMs > 0,
    };
  }

  return NextResponse.json({
    userRole: user.role,
    subscription: subscription
      ? {
          plan: subscription.plan,
          status: subscription.status,
          billingInterval: subscription.billingInterval,
          currentPeriodEnd: subscription.currentPeriodEnd,
          //   trialEndsAt: subscription.trialEndsAt,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        }
      : null,
    freeTier,
  });
}
