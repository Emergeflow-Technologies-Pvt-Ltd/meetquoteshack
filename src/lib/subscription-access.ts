// src/lib/subscription-access.ts

import prisma from "@/lib/db";
import { SubscriptionStatus, UserRole, SubscriptionPlan } from "@prisma/client";

export async function getAccessStatus(
  userId: string,
  role: UserRole,
  userCreatedAt?: Date,
  userFreeTierEndsAt?: Date | null
) {
  const now = new Date();

  /* ---------------------------------
     FREE TIER
  ----------------------------------*/
  let freeTierEndsAt: Date | null = null;
  let freeTierActive = false;

  if (role === UserRole.LENDER) {
  if (userFreeTierEndsAt) {
    freeTierEndsAt = userFreeTierEndsAt;
  } else if (userCreatedAt) {
    freeTierEndsAt = new Date(
      userCreatedAt.getTime() + 60 * 24 * 60 * 60 * 1000
    );
  }

  if (freeTierEndsAt) {
    freeTierActive = now < freeTierEndsAt;
  }
}


  // LOANEE → AUTO 90 DAYS FROM SIGNUP
  if (role === UserRole.LOANEE && userCreatedAt) {
    freeTierEndsAt = new Date(
      userCreatedAt.getTime() + 90 * 24 * 60 * 60 * 1000
    );
    freeTierActive = now < freeTierEndsAt;
  }

  /* ---------------------------------
     LOAD SUBSCRIPTIONS
  ----------------------------------*/
  const subs = await prisma.subscription.findMany({
    where: { userId, role },
    orderBy: { createdAt: "desc" },
  });

  /* ---------------------------------
     ACTIVE SUBSCRIPTION CHECK
  ----------------------------------*/
  const paidSub = subs.find((s) => {
    const status = s.status as SubscriptionStatus;

    if (s.currentPeriodEnd) {
      return (
        s.currentPeriodEnd > now &&
        (status === SubscriptionStatus.ACTIVE ||
          status === SubscriptionStatus.TRIALING ||
          status === SubscriptionStatus.PAST_DUE)
      );
    }

    return status === SubscriptionStatus.ACTIVE;
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
  // ✅ Loanee gets prequalification in:
  // 1) Free tier
  // 2) Active Smart plan
  const canAccessPrequalification =
    role === UserRole.LOANEE && (freeTierActive || isSmartPlan);

  /* ---------------------------------
     FIRST LOGIN (UI MODAL)
  ----------------------------------*/
  const isFirstLogin =
    role === UserRole.LOANEE &&
    !subscriptionActive &&
    freeTierActive;

  /* ---------------------------------
     FINAL ACCESS DECISION (IMPORTANT)
  ----------------------------------*/
  let hasAccess = false;

  if (role === UserRole.LOANEE) {
    // ✅ Always allow basic access
    hasAccess = true;
  } else if (role === UserRole.LENDER) {
    // ❌ LENDER MUST HAVE ACTIVE SUBSCRIPTION
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
            (freeTierEndsAt.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const subscriptionDaysLeft =
    paidSub?.currentPeriodEnd
      ? Math.max(
          0,
          Math.ceil(
            (paidSub.currentPeriodEnd.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  return {
    hasAccess,
    isFirstLogin,
    canAccessPrequalification,

    freeTierActive,
    freeTierEndsAt,
    subscriptionActive,
    subscription: paidSub ?? null,
    freeTierDaysLeft,
    subscriptionDaysLeft,
  };
}





// src/lib/subscription-access.ts

// import prisma from "@/lib/db";
// import { SubscriptionStatus, UserRole } from "@prisma/client";

// export async function getAccessStatus(
//   userId: string,
//   role: UserRole,
//   userCreatedAt?: Date,
//   userFreeTierEndsAt?: Date | null
// ) {
//   const now = new Date();

//   /* ---------------------------------
//      FREE TIER
//   ----------------------------------*/
//   let freeTierEndsAt: Date | null = null;
//   let freeTierActive = false;

//   // LENDER → existing logic (explicit or createdAt-based if you want)
//   if (role === UserRole.LENDER && userFreeTierEndsAt) {
//     freeTierEndsAt = userFreeTierEndsAt;
//     freeTierActive = now < userFreeTierEndsAt;
//   }

//   // LOANEE → AUTO 90 DAYS FROM SIGNUP
//   if (role === UserRole.LOANEE && userCreatedAt) {
//     freeTierEndsAt = new Date(
//       userCreatedAt.getTime() + 90 * 24 * 60 * 60 * 1000
//     );
//     freeTierActive = now < freeTierEndsAt;
//   }


//   /* ---------------------------------
//      LOAD SUBSCRIPTIONS
//   ----------------------------------*/
//   const subs = await prisma.subscription.findMany({
//     where: { userId, role },
//     orderBy: { createdAt: "desc" },
//   });

//   /* ---------------------------------
//      ACTIVE SUBSCRIPTION CHECK
//   ----------------------------------*/
//   const paidSub = subs.find((s) => {
//     const status = s.status as SubscriptionStatus;

//     if (s.currentPeriodEnd) {
//       return (
//         s.currentPeriodEnd > now &&
//         (status === SubscriptionStatus.ACTIVE ||
//           status === SubscriptionStatus.TRIALING ||
//           status === SubscriptionStatus.PAST_DUE)
//       );
//     }

//     return status === SubscriptionStatus.ACTIVE;
//   });

//   const subscriptionActive = !!paidSub;

//   const isSmartPlan =
//     !!paidSub && paidSub.plan === "LOANEE_STAY_SMART";

//   // 👇 PREQUAL ACCESS RULE
//   const canAccessPrequalification =
//     freeTierActive || isSmartPlan;



//   /* ---------------------------------
//      FIRST LOGIN (FOR UI MODALS)
//   ----------------------------------*/
//   const isFirstLogin =
//     role === UserRole.LOANEE &&
//     !subscriptionActive &&
//     freeTierActive;

//   /* ---------------------------------
//      FINAL ACCESS DECISION
//   ----------------------------------*/
//   let hasAccess = false;

//   if (role === UserRole.LOANEE) {
//     // During free tier OR free basic subscription
//     hasAccess = freeTierActive || subscriptionActive;
//   } else if (role === UserRole.LENDER) {
//     hasAccess = freeTierActive || subscriptionActive;
//   } else {
//     hasAccess = subscriptionActive;
//   }

//   /* ---------------------------------
//      UI HELPERS
//   ----------------------------------*/
//   const freeTierDaysLeft =
//     freeTierEndsAt && freeTierActive
//       ? Math.max(
//         0,
//         Math.ceil(
//           (freeTierEndsAt.getTime() - now.getTime()) /
//           (1000 * 60 * 60 * 24)
//         )
//       )
//       : 0;

//   const subscriptionDaysLeft =
//     paidSub?.currentPeriodEnd
//       ? Math.max(
//         0,
//         Math.ceil(
//           (paidSub.currentPeriodEnd.getTime() - now.getTime()) /
//           (1000 * 60 * 60 * 24)
//         )
//       )
//       : 0;

//   return {
//     hasAccess,
//     isFirstLogin,
//       canAccessPrequalification, // ✅ STEP 1 OUTPUT

//     freeTierActive,
//     freeTierEndsAt,
//     subscriptionActive,
//     subscription: paidSub ?? null,
//     freeTierDaysLeft,
//     subscriptionDaysLeft,
//   };
// }
