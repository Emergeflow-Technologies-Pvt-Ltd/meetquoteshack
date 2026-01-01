import prisma from "@/lib/db";
import { SubscriptionStatus, UserRole, SubscriptionPlan } from "@prisma/client";

export async function getAccessStatus(
  userId: string,
  role: UserRole,
  _userCreatedAt?: Date, // intentionally unused
  userFreeTierEndsAt?: Date | null
) {
  const now = new Date();

  /* ---------------------------------
     FREE TIER (READ ONLY)
  ----------------------------------*/
  const freeTierEndsAt = userFreeTierEndsAt ?? null;
  const freeTierActive = !!freeTierEndsAt && freeTierEndsAt > now;

  /* ---------------------------------
     LOAD SUBSCRIPTIONS
  ----------------------------------*/
  const subs = await prisma.subscription.findMany({
    where: { userId, role },
    orderBy: { createdAt: "desc" },
  });

  /* ---------------------------------
     ACTIVE SUBSCRIPTION CHECK (STRICT)
  ----------------------------------*/
  const ACTIVE_STATUSES: SubscriptionStatus[] = [
    SubscriptionStatus.ACTIVE,
    SubscriptionStatus.TRIALING,
    SubscriptionStatus.PAST_DUE,
  ];

  const paidSub = subs.find((s) => {
    if (s.currentPeriodEnd) {
      return s.currentPeriodEnd > now && ACTIVE_STATUSES.includes(s.status);
    }

    return s.status === SubscriptionStatus.ACTIVE;
  });

  const subscriptionActive = !!paidSub;

  /* ---------------------------------
     PLAN CHECKS
  ----------------------------------*/
  const isSmartPlan =
    !!paidSub && paidSub.plan === SubscriptionPlan.LOANEE_STAY_SMART;

  /* ---------------------------------
     FEATURE ACCESS
  ----------------------------------*/
  const canAccessPrequalification =
    role === UserRole.LOANEE && (freeTierActive || isSmartPlan);

  /* ---------------------------------
     FINAL ACCESS DECISION
  ----------------------------------*/
  let hasAccess = false;

  if (role === UserRole.LOANEE) {
    // Loanees always have base access
    hasAccess = true;
  } else if (role === UserRole.LENDER) {
    // Lenders need free tier OR active subscription
    hasAccess = freeTierActive || subscriptionActive;
  } else {
    hasAccess = subscriptionActive;
  }

  /* ---------------------------------
     UI HELPERS
  ----------------------------------*/
  const freeTierDaysLeft =
    freeTierEndsAt && freeTierActive
      ? Math.max(
          0,
          Math.ceil(
            (freeTierEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const subscriptionDaysLeft =
    paidSub?.currentPeriodEnd && paidSub.currentPeriodEnd > now
      ? Math.max(
          0,
          Math.ceil(
            (paidSub.currentPeriodEnd.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  /* ---------------------------------
     RETURN
  ----------------------------------*/
  return {
    hasAccess,
    canAccessPrequalification,

    freeTierActive,
    freeTierEndsAt,
    freeTierDaysLeft,

    subscriptionActive,
    subscription: paidSub ?? null,
    subscriptionDaysLeft,
  };
}
