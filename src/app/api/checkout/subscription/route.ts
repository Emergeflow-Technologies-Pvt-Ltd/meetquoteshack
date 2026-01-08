// for monthly/yearly

// src/app/api/checkout/subscription/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";
import { UserRole, SubscriptionPlan } from "@prisma/client";

/* =======================
   STRIPE PRICE IDS
   ======================= */
const PRICE_IDS = {
  lender_simple: {
    monthly: process.env.STRIPE_PRICE_LENDER_SIMPLE_MONTHLY,
    yearly: process.env.STRIPE_PRICE_LENDER_SIMPLE_1YEAR,
    twoYear: process.env.STRIPE_PRICE_LENDER_SIMPLE_2YEAR,
  },
  lender_standard: {
    monthly: process.env.STRIPE_PRICE_LENDER_STANDARD_MONTHLY,
    yearly: process.env.STRIPE_PRICE_LENDER_STANDARD_1YEAR,
    twoYear: process.env.STRIPE_PRICE_LENDER_STANDARD_2YEAR,
  },
  loanee_stay_smart: {
    monthly: process.env.STRIPE_PRICE_LOANEE_STAY_SMART_MONTHLY,
    yearly: process.env.STRIPE_PRICE_LOANEE_STAY_SMART_1YEAR,
    twoYear: process.env.STRIPE_PRICE_LOANEE_STAY_SMART_2YEAR,
  },
} as const;

/* =======================
   TYPES
   ======================= */
type PlanBody = {
  plan?: "simple" | "standard" | "stay_smart";
  interval?: "monthly" | "yearly" | "twoYear";
};

export async function POST(req: Request) {
  try {
    /* =======================
       AUTH
       ======================= */
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as PlanBody;
    const interval = body.interval ?? "monthly";

    /* =======================
       FETCH USER
       ======================= */
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        email: true,
        stripeCustomerId: true,
        createdAt: true,
        freeTierEndsAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* =======================
       FREE TIER CHECK
       ======================= */
    const FREE_DAYS: Record<UserRole, number> = {
      LENDER: 60,
      LOANEE: 90,
      ADMIN: 0,
      AGENT: 0,
    };

    const now = new Date();
    const freeTierEndsAt =
      user.freeTierEndsAt ??
      new Date(
        user.createdAt.getTime() + FREE_DAYS[user.role] * 24 * 60 * 60 * 1000
      );

    if (freeTierEndsAt && freeTierEndsAt > now) {
      return NextResponse.json(
        {
          error: "Free tier active",
          message: `Your free trial is active until ${freeTierEndsAt.toLocaleDateString(
            "en-US",
            { day: "numeric", month: "long", year: "numeric" }
          )}. You can subscribe after that.`,
          freeTierEndsAt: freeTierEndsAt.toISOString(),
        },
        { status: 400 }
      );
    }

    /* =======================
       RESOLVE PRICE + PLAN
       ======================= */
    let priceId: string | undefined;
    let subscriptionPlan: SubscriptionPlan;

    if (user.role === UserRole.LENDER) {
      const plan = body.plan === "standard" ? "standard" : "simple";

      priceId =
        plan === "standard"
          ? PRICE_IDS.lender_standard[interval]
          : PRICE_IDS.lender_simple[interval];

      subscriptionPlan =
        plan === "standard"
          ? SubscriptionPlan.LENDER_STANDARD
          : SubscriptionPlan.LENDER_SIMPLE;
    } else if (user.role === UserRole.LOANEE) {
      priceId = PRICE_IDS.loanee_stay_smart[interval];
      subscriptionPlan = SubscriptionPlan.LOANEE_STAY_SMART;
    } else {
      return NextResponse.json(
        { error: "Billing not supported for this role" },
        { status: 403 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan or billing interval" },
        { status: 400 }
      );
    }

    /* =======================
       STRIPE SESSION
       ======================= */
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const successPath =
      user.role === UserRole.LENDER ? "/lender/dashboard" : "/applications";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}${successPath}?billing=success`,
      cancel_url: `${baseUrl}${successPath}?billing=cancelled`,
      metadata: {
        userId: user.id,
        role: user.role,
        subscriptionPlan,
        billingInterval: interval,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          role: user.role,
          subscriptionPlan,
          billingInterval: interval,
        },
      },
      ...(user.stripeCustomerId
        ? { customer: user.stripeCustomerId }
        : { customer_email: user.email ?? undefined }),
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (err) {
    console.error("[SUBSCRIPTION_CHECKOUT_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to create subscription checkout" },
      { status: 500 }
    );
  }
}
