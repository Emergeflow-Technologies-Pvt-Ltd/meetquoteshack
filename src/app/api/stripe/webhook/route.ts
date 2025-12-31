// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import {
  SubscriptionStatus,
  BillingInterval,
  SubscriptionPlan,
  UserRole,
} from "@prisma/client";
import { stripe } from "@/lib/stripe";

const PRICE_TO_PLAN_MAP: Record<string, SubscriptionPlan> = {};
if (process.env.STRIPE_PRICE_LENDER_SIMPLE_MONTHLY) {
  PRICE_TO_PLAN_MAP[process.env.STRIPE_PRICE_LENDER_SIMPLE_MONTHLY] = SubscriptionPlan.LENDER_SIMPLE;
}
if (process.env.STRIPE_PRICE_LENDER_SIMPLE_1YEAR) {
  PRICE_TO_PLAN_MAP[process.env.STRIPE_PRICE_LENDER_SIMPLE_1YEAR] = SubscriptionPlan.LENDER_SIMPLE;
}
if (process.env.STRIPE_PRICE_LENDER_SIMPLE_2YEAR) {
  PRICE_TO_PLAN_MAP[process.env.STRIPE_PRICE_LENDER_SIMPLE_2YEAR] = SubscriptionPlan.LENDER_SIMPLE;
}
if (process.env.STRIPE_PRICE_LENDER_STANDARD_MONTHLY) {
  PRICE_TO_PLAN_MAP[process.env.STRIPE_PRICE_LENDER_STANDARD_MONTHLY] = SubscriptionPlan.LENDER_STANDARD;
}
if (process.env.STRIPE_PRICE_LENDER_STANDARD_1YEAR) {
  PRICE_TO_PLAN_MAP[process.env.STRIPE_PRICE_LENDER_STANDARD_1YEAR] = SubscriptionPlan.LENDER_STANDARD;
}
if (process.env.STRIPE_PRICE_LENDER_STANDARD_2YEAR) {
  PRICE_TO_PLAN_MAP[process.env.STRIPE_PRICE_LENDER_STANDARD_2YEAR] = SubscriptionPlan.LENDER_STANDARD;
}
if (process.env.STRIPE_PRICE_LOANEE_STAY_SMART_MONTHLY) {
  PRICE_TO_PLAN_MAP[process.env.STRIPE_PRICE_LOANEE_STAY_SMART_MONTHLY] = SubscriptionPlan.LOANEE_STAY_SMART;
}
if (process.env.STRIPE_PRICE_LOANEE_STAY_SMART_1YEAR) {
  PRICE_TO_PLAN_MAP[process.env.STRIPE_PRICE_LOANEE_STAY_SMART_1YEAR] = SubscriptionPlan.LOANEE_STAY_SMART;
}
if (process.env.STRIPE_PRICE_LOANEE_STAY_SMART_2YEAR) {
  PRICE_TO_PLAN_MAP[process.env.STRIPE_PRICE_LOANEE_STAY_SMART_2YEAR] = SubscriptionPlan.LOANEE_STAY_SMART;
}

function normalizeRole(role?: string): UserRole | undefined {
  if (!role) return undefined;
  const upper = role.toUpperCase();
  if (upper === "LENDER") return UserRole.LENDER;
  if (upper === "LOANEE") return UserRole.LOANEE;
  return undefined;
}

function metadataString(obj: any, key: string): string | undefined {
  try {
    const v = obj?.metadata?.[key];
    return typeof v === "string" ? v : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  console.log("➡️ /api/stripe/webhook hit");

  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    console.error("Missing stripe-signature header or STRIPE_WEBHOOK_SECRET env");
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let bodyText: string;
  try {
    bodyText = await req.text();
  } catch (err) {
    console.error("Failed to read request body:", (err as Error).message);
    return NextResponse.json({ error: "Failed to read body" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(bodyText, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown webhook verification error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  try {
    console.log(`Stripe event received: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("checkout.session.completed id:", session.id);

        if (session.mode === "setup") {
          const customerId =
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id;

          if (!customerId) {
            console.error("Missing customer on setup session");
            break;
          }

          const setupMetadata =
            (session.setup_intent as any)?.metadata ?? session.metadata ?? {};

          const freeTierEndsAt = setupMetadata.freeTierEndsAt;
          const priceId = setupMetadata.priceId;

          if (!priceId) {
            console.error("Missing priceId in checkout session metadata");
            break;
          }

          const startDate = freeTierEndsAt
            ? Math.floor(new Date(freeTierEndsAt).getTime() / 1000)
            : "now";

          const existingSchedules = await stripe.subscriptionSchedules.list({
            customer: customerId,
            limit: 1,
          });

          if (existingSchedules.data.length > 0) {
            console.log("Subscription schedule already exists for customer:", customerId);
            break;
          }

          const scheduleParams: Stripe.SubscriptionScheduleCreateParams = {
            customer: customerId,
            start_date: startDate,
            phases: [
              {
                items: [
                  {
                    price: priceId,
                    quantity: 1,
                  },
                ],
              },
            ],
            metadata: {
              userId: setupMetadata.userId ?? "",
              role: setupMetadata.role ?? "",
              subscriptionPlan: setupMetadata.subscriptionPlan ?? "",
              billingInterval: setupMetadata.billingInterval ?? "",
            },
          };

          await stripe.subscriptionSchedules.create(scheduleParams);
          console.log("Subscription schedule created for customer:", customerId);
        }

        if (session.mode === "subscription" && session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string" ? session.subscription : (session.subscription as any)?.id;
          if (subscriptionId) {
            console.log("💡 Fetching subscription from checkout.session.completed:", subscriptionId);
            try {
              await new Promise(resolve => setTimeout(resolve, 2000));
              await handleSubscriptionUpsertById(subscriptionId, session);
              console.log("✅ Successfully processed subscription from checkout.session.completed");
            } catch (e) {
              console.error("Failed to upsert subscription from checkout.session.completed:", (e as Error).message);
            }
          }
        }

        try {
          const metaAppId = metadataString(session, "applicationId");
          const metaLenderId = metadataString(session, "lenderId");
          if (metaAppId && metaLenderId) {
            await unlockApplicationForLender(metaAppId, metaLenderId);
          } else {
            const paymentIntentId =
              typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent as any)?.id;
            if (paymentIntentId) {
              try {
                const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
                const piAppId = metadataString(pi, "applicationId");
                const piLenderId = metadataString(pi, "lenderId");
                if (piAppId && piLenderId) {
                  await unlockApplicationForLender(piAppId, piLenderId);
                }
              } catch (err) {
                console.warn("Failed to retrieve PaymentIntent:", (err as Error).message);
              }
            }
          }
        } catch (err) {
          console.warn("checkout.session.completed: pay-per-match handling failed:", (err as Error).message);
        }

        try {
          const role =
            metadataString(session, "role") ??
            metadataString(session.payment_intent, "role");

          const applicationId =
            metadataString(session, "applicationId") ??
            metadataString(session.payment_intent, "applicationId");

          const agentId =
            metadataString(session, "agentId") ??
            metadataString(session.payment_intent, "agentId");

          if (role === "AGENT" && applicationId && agentId) {
            await prisma.agentApplicationUnlock.create({
              data: { applicationId, agentId },
            });
          }
        } catch (err) {
          console.warn("Agent unlock failed:", (err as Error).message);
        }

        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log("payment_intent.succeeded id:", pi.id ?? "unknown");

        const applicationId = metadataString(pi, "applicationId");
        const lenderId = metadataString(pi, "lenderId");

        if (applicationId && lenderId) {
          try {
            await unlockApplicationForLender(applicationId, lenderId);
          } catch (err) {
            console.warn("payment_intent.succeeded: unlock failed:", (err as Error).message);
          }
        }
        break;
      }

      case "invoice.paid":
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const invoiceAny = invoice as any;

        console.log("✅ invoice.payment_succeeded fired");
        console.log("🧾 Invoice ID:", invoice.id);
        console.log("🔍 Invoice details:", {
          subscription: invoiceAny.subscription,
          billing_reason: invoiceAny.billing_reason,
          lines_count: invoiceAny.lines?.data?.length,
        });

        let subId: string | undefined;

        if (typeof invoiceAny.subscription === "string") {
          subId = invoiceAny.subscription;
        }

        if (!subId && invoiceAny.lines?.data?.length > 0) {
          const lineItem = invoiceAny.lines.data[0];
          console.log("🔍 First line item:", {
            type: lineItem.type,
            subscription: lineItem.subscription,
          });
          if (typeof lineItem.subscription === "string") {
            subId = lineItem.subscription;
          }
        }

        console.log("🔗 Subscription ID from invoice:", subId ?? "NOT FOUND");

        if (!subId) {
          const customerId = typeof invoiceAny.customer === "string" 
            ? invoiceAny.customer 
            : invoiceAny.customer?.id;
            
          if (customerId && invoiceAny.billing_reason === "subscription_create") {
            console.log("🔍 Attempting to find subscription from customer:", customerId);
            try {
              const subscriptions = await stripe.subscriptions.list({
                customer: customerId,
                status: "active",
                limit: 1,
              });
              
              if (subscriptions.data.length > 0) {
                subId = subscriptions.data[0].id;
                console.log("✅ Found subscription from customer:", subId);
              }
            } catch (err) {
              console.warn("Failed to lookup subscription from customer:", (err as Error).message);
            }
          }
        }

        if (!subId) {
          console.error(
            "❌ invoice.payment_succeeded: subscription ID not found after all attempts",
            { 
              invoiceId: invoice.id,
              billing_reason: invoiceAny.billing_reason,
              customer: invoiceAny.customer,
            }
          );
          break;
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(subId, {
          expand: ["items.data.price"],
        });

        console.log("📅 Retrieved subscription - current_period_end:", (stripeSubscription as any).current_period_end);

        await handleSubscriptionEvent(
          stripeSubscription,
          "invoice.payment_succeeded"
        );

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        const subscription = (invoice as any).subscription;
        const subId = typeof subscription === "string" ? subscription : subscription?.id;

        console.log("invoice.payment_failed → subscription:", subId);

        if (subId) {
          const stripeSubscription = await stripe.subscriptions.retrieve(subId, {
            expand: ["items.data.price"],
          });
          await handleSubscriptionEvent(stripeSubscription, "invoice.payment_failed");
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const subAny = sub as any;
        console.log(`${event.type} subscription id:`, sub.id);
        
        console.log("📅 Subscription object from webhook current_period_end:", subAny.current_period_end);
        
        if (!subAny.current_period_end && sub.id) {
          console.log("⚠️ current_period_end missing in webhook - fetching from Stripe API");
          try {
            const fullSub = await stripe.subscriptions.retrieve(sub.id, {
              expand: ["items.data.price"],
            });
            console.log("✅ Fetched full subscription - current_period_end:", (fullSub as any).current_period_end);
            await handleSubscriptionEvent(fullSub, event.type);
          } catch (err) {
            console.error(`Failed to fetch full subscription from API:`, (err as Error).message);
            await handleSubscriptionEvent(sub, event.type);
          }
        } else {
          await handleSubscriptionEvent(sub, event.type);
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type} — ignoring`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown handler error";
    console.error("Webhook processing failed:", message);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}

async function unlockApplicationForLender(applicationId: string, lenderId: string) {
  try {
    console.log(`Attempting to unlock application ${applicationId} for lender ${lenderId}`);

    const app = await prisma.application.findUnique({ where: { id: applicationId } });
    if (!app) {
      console.warn("unlockApplicationForLender: application not found", applicationId);
      return;
    }

    if (app.lenderId === lenderId && app.status === "IN_PROGRESS") {
      console.log("Application already unlocked for this lender — skipping update", applicationId);
      return;
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status: "IN_PROGRESS", lenderId },
    });

    console.log("Application unlocked/updated:", updated.id, updated.status, updated.lenderId);
  } catch (err) {
    console.error("unlockApplicationForLender error:", (err as Error).message);
    return;
  }
}

async function handleSubscriptionUpsertById(subscriptionId: string, session?: Stripe.Checkout.Session) {
  try {
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, { 
      expand: ["items.data.price"] 
    });
    console.log("📅 Retrieved subscription in upsert - current_period_end:", (stripeSubscription as any).current_period_end);
    await handleSubscriptionEvent(stripeSubscription as any, "customer.subscription.created", session);
  } catch (err) {
    console.error("handleSubscriptionUpsertById error:", (err as Error).message);
    throw err;
  }
}

async function handleSubscriptionEvent(
  sub: Stripe.Subscription | any,
  eventType: string,
  session?: Stripe.Checkout.Session | undefined
) {
  try {
    const subAny = sub as any;

    const userId =
      (subAny.metadata?.userId as string | undefined) ?? (session?.metadata?.userId as string | undefined);
    const roleStr =
      (subAny.metadata?.role as string | undefined) ?? (session?.metadata?.role as string | undefined);
    const subscriptionPlan =
      (subAny.metadata?.subscriptionPlan as string | undefined) ?? (session?.metadata?.subscriptionPlan as string | undefined);
    const intervalMeta =
      (subAny.metadata?.billingInterval as string | undefined) ?? (session?.metadata?.billingInterval as string | undefined);

    const role = normalizeRole(roleStr);

    if (!userId || !role) {
      console.error("Missing subscription metadata; skipping subscription upsert", {
        subscriptionId: subAny.id,
        subMetadata: subAny.metadata,
        sessionMetadata: session?.metadata,
      });
      return;
    }

    const billingInterval =
      intervalMeta === "yearly" || intervalMeta === "YEARLY" || intervalMeta === "twoYear"
        ? BillingInterval.YEARLY
        : BillingInterval.MONTHLY;

    const currentPeriodEndUnix: number | undefined = subAny.current_period_end;
    const trialEndUnix: number | undefined = subAny.trial_end;
    const billingCycleAnchor: number | undefined = subAny.billing_cycle_anchor;
    const created: number | undefined = subAny.created;

    console.log("🔍 Extracting period end:", {
      current_period_end: currentPeriodEndUnix,
      trial_end: trialEndUnix,
      raw_sub_status: subAny.status,
      billing_cycle_anchor: billingCycleAnchor,
      created: created,
    });

    let periodEnd: Date | null = currentPeriodEndUnix
      ? new Date(Number(currentPeriodEndUnix) * 1000)
      : trialEndUnix
        ? new Date(Number(trialEndUnix) * 1000)
        : null;

    if (!periodEnd && subAny.status === "active") {
      console.warn("⚠️ ACTIVE subscription missing period end - calculating from billing cycle");
      
      const baseTimestamp = billingCycleAnchor ?? created;
      
      if (baseTimestamp) {
        const baseDate = new Date(Number(baseTimestamp) * 1000);
        
        const priceInterval = subAny.items?.data?.[0]?.price?.recurring?.interval;
        const priceIntervalCount = subAny.items?.data?.[0]?.price?.recurring?.interval_count ?? 1;
        
        const metadataInterval = intervalMeta === "yearly" || intervalMeta === "YEARLY" || intervalMeta === "twoYear"
          ? "year"
          : "month";
        
        const interval = priceInterval ?? metadataInterval;
        
        console.log("📊 Interval info:", { priceInterval, priceIntervalCount, metadataInterval, interval });
        
        periodEnd = new Date(baseDate);
        if (interval === "year") {
          periodEnd.setFullYear(periodEnd.getFullYear() + (priceIntervalCount ?? 1));
        } else if (interval === "month") {
          periodEnd.setMonth(periodEnd.getMonth() + (priceIntervalCount ?? 1));
        } else {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        }
        
        console.log("📅 Calculated period end:", periodEnd.toISOString(), "from base:", baseDate.toISOString());
      }
    }

    const cancelAtPeriodEnd: boolean = !!(subAny.cancel_at_period_end ?? false);

    const stripePriceId = subAny.items?.data?.[0]?.price?.id as string | undefined;
    const mappedPlan =
      stripePriceId && PRICE_TO_PLAN_MAP[stripePriceId]
        ? PRICE_TO_PLAN_MAP[stripePriceId]
        : (subscriptionPlan as SubscriptionPlan | undefined);

    if (!mappedPlan) {
      console.warn("Could not map stripe price to SubscriptionPlan", {
        stripePriceId,
        subscriptionPlan,
      });
    }

    const statusMap = (st: string | undefined) => {
      switch (st) {
        case "trialing":
          return SubscriptionStatus.TRIALING;
        case "active":
          return SubscriptionStatus.ACTIVE;
        case "past_due":
          return SubscriptionStatus.PAST_DUE;
        case "canceled":
          return SubscriptionStatus.CANCELED;
        case "incomplete":
          return SubscriptionStatus.INCOMPLETE;
        case "incomplete_expired":
          return SubscriptionStatus.INCOMPLETE_EXPIRED;
        case "unpaid":
          return SubscriptionStatus.UNPAID;
        default:
          return SubscriptionStatus.INCOMPLETE;
      }
    };

    const mappedStatus = statusMap(subAny.status as string | undefined);

    if (mappedStatus === SubscriptionStatus.ACTIVE && !periodEnd) {
      console.error(
        "❌ ACTIVE subscription without currentPeriodEnd — invalid state (this should not happen with workaround)",
        { 
          subId: subAny.id,
          current_period_end_raw: subAny.current_period_end,
          trial_end_raw: subAny.trial_end,
          billing_cycle_anchor: subAny.billing_cycle_anchor,
        }
      );
      console.error("⛔ Refusing to save ACTIVE subscription without period end");
      return;
    }

    console.log("💾 Saving subscription to DB", {
      stripeSubId: subAny.id,
      status: mappedStatus,
      periodEnd: periodEnd ? periodEnd.toISOString() : null,
    });

    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subAny.id },

      create: {
        userId,
        role,
        plan: mappedPlan ?? SubscriptionPlan.LENDER_SIMPLE,
        billingInterval,
        status: mappedStatus,
        stripeSubscriptionId: subAny.id,
        stripePriceId: stripePriceId ?? "",
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd,
      },

      update: {
        plan: mappedPlan ?? SubscriptionPlan.LENDER_SIMPLE,
        billingInterval,
        status: mappedStatus,
        stripePriceId: stripePriceId ?? "",
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd,
      },
    });

    try {
      if (subAny.customer) {
        const custId =
          typeof subAny.customer === "string"
            ? subAny.customer
            : subAny.customer?.id;

        if (custId) {
          await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: custId },
          });
        }
      }
    } catch (err) {
      console.warn(
        "Failed to update stripeCustomerId (non-fatal)",
        (err as Error).message
      );
    }

    console.log(
      "✅ Subscription upserted:",
      subAny.id,
      "status:",
      mappedStatus,
      "periodEnd:",
      periodEnd?.toISOString() ?? "null"
    );
  } catch (err) {
    console.error("handleSubscriptionEvent error:", (err as Error).message);
    throw err;
  }
}