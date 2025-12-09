// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { LoanStatus } from "@prisma/client";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: Request) {
  console.log("➡️ /api/stripe/webhook hit");

  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!sig || !webhookSecret) {
    console.error("❌ Missing stripe-signature or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text(); // raw body for webhook
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  console.log("✅ Webhook event type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("SESSION METADATA:", session.metadata);

    const applicationId = session.metadata?.applicationId;
    const lenderId = session.metadata?.lenderId;

    if (!applicationId || !lenderId) {
      console.error("❌ Missing metadata on Stripe session", session.metadata);
      return NextResponse.json({ received: true });
    }

    try {
      const updated = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: LoanStatus.IN_PROGRESS,
          lenderId: lenderId,
        },
      });

      console.log(
        "✅ Application unlocked after payment:",
        updated.id,
        "status:",
        updated.status,
        "lenderId:",
        updated.lenderId
      );
    } catch (e: any) {
      console.error("❌ Failed to update application after payment:", e);
      // Let Stripe know this failed so you see 500 in their logs
      return NextResponse.json({ error: "Prisma update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
