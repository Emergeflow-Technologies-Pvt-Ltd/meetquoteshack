import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { applicationId } = await req.json();

  if (!applicationId) {
    return NextResponse.json(
      { error: "Missing applicationId" },
      { status: 400 }
    );
  }

  const agent = await prisma.agent.findUnique({
    where: { userId: session.user.id },
  });

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // Prevent double payment
  const existingUnlock = await prisma.agentApplicationUnlock.findFirst({
    where: {
      applicationId,
      agentId: agent.id,
    },
  });

  if (existingUnlock) {
    return NextResponse.json({ error: "Already unlocked" }, { status: 400 });
  }

  console.log("🟣 Agent Pay-Per-Match request", {
    userId: session.user.id,
    agentId: agent.id,
    applicationId,
    price: process.env.STRIPE_PRICE_AGENT_PAY_PER_MATCH,
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_AGENT_PAY_PER_MATCH!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/agent/dashboard/${applicationId}?match=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/agent/dashboard/${applicationId}`,
    metadata: {
      role: "AGENT",
      applicationId,
      agentId: agent.id,
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

  console.log("🟢 Stripe checkout session created", {
    checkoutSessionId: checkoutSession.id,
    metadata: checkoutSession.metadata,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
