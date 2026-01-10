// src/app/api/checkout/paypermatch/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { LoanStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as {
      applicationId?: string;
    };

    if (!body?.applicationId) {
      return NextResponse.json(
        { error: "applicationId is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Ensure current user is a lender
    const lender = await prisma.lender.findUnique({
      where: { userId: session.user.id },
    });

    if (!lender) {
      return NextResponse.json(
        { error: "Lender profile not found" },
        { status: 403 }
      );
    }

    // 2️⃣ Fetch application + user + potentialLender info
    const application = await prisma.application.findUnique({
      where: { id: body.applicationId },
      include: {
        user: true,
        potentialLender: true, // <-- relation from your schema
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // 2.5️⃣ If this application is already unlocked for THIS lender, don't charge again
    const alreadyUnlocked =
      application.status === LoanStatus.IN_PROGRESS &&
      application.lenderId === lender.id;

    if (alreadyUnlocked) {
      return NextResponse.json(
        { error: "You have already unlocked this application." },
        { status: 400 }
      );
    }

    // 3️⃣ Ensure this is actually a potential application (for lenders who haven't unlocked yet)
    if (application.status !== LoanStatus.ASSIGNED_TO_POTENTIAL_LENDER) {
      return NextResponse.json(
        {
          error: "Pay Per Match is only available for potential applications.",
        },
        { status: 400 }
      );
    }

    // 4️⃣ Ensure THIS lender is in the potentialLender list
    const isPotentialForThisLender = application.potentialLender.some(
      (p) => p.lenderId === lender.id
    );

    if (!isPotentialForThisLender) {
      return NextResponse.json(
        {
          error: "You are not a potential lender for this application.",
        },
        { status: 403 }
      );
    }

    const priceId = process.env.STRIPE_PRICE_LENDER_PAYPERMATCH;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    if (!priceId) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_LENDER_PAYPERMATCH is not configured" },
        { status: 500 }
      );
    }

    // 5️⃣ Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: session.user.email ?? undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/lender/dashboard/${application.id}?match=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/lender/dashboard/${application.id}?match=cancelled`,
      metadata: {
        applicationId: application.id,
        lenderUserId: session.user.id,
        lenderId: lender.id,
      },

      // ---------- Branding / appearance for Stripe Checkout ----------
      branding_settings: {
        button_color: "#7C3AED", // primary CTA color (purple)
        background_color: "#F9F5FF", // checkout background
        border_style: "rounded",
        font_family: "inter",
        display_name: "QuoteShack",
        logo: { type: "url", url: "https://example.com/your-logo.png" },
        icon: { type: "url", url: "https://example.com/your-icon.png" },
      },

      locale: "en",
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[PAY_PER_MATCH_CHECKOUT_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
