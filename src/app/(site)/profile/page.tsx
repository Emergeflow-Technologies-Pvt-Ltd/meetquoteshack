import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Shield,
} from "lucide-react";
import { UserRole } from "@prisma/client";

// import ManageSubscriptionButton from "@/components/shared/ManageSubscriptionButton";
import ManageSubscriptionOpener from "@/components/ManageSubscriptionOpener";
import PlanSelectorClientLoanee from "@/components/PlanSelectorClientLoanee";
import AgentReviewsPanel from "@/components/agent/AgentReviewsPanel";
import { getAccessStatus } from "@/lib/subscription-access";

type SubscriptionInfo = {
  subscription: {
    plan: string | null;
    status: string;
    billingInterval: "MONTHLY" | "YEARLY" | null;
    currentPeriodEnd: string | null;
  } | null;
  freeTier: {
    endsAt: string | null;
    daysLeft: number | null;
  } | null;
};

type AgentReviewWithRelations = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  loanee: {
    name: string | null;
  };
  application: {
    loanType: string | null;
  };
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !session.user.id) {
    return (
      <Section className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-center text-sm text-gray-500">
          You must be logged in to view your profile.
        </p>
      </Section>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      applications: {
        include: { agent: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return null;

  const isLoanee = user.role === UserRole.LOANEE;
  const isLender = user.role === UserRole.LENDER;
  const isAgent = user.role === UserRole.AGENT;

  // let subData: any = null;
  let subData: SubscriptionInfo | null = null;


  if (isLoanee) {
    try {
      const hdrs = await headers();
      const host = hdrs.get("host");
      const protocol =
        process.env.NODE_ENV === "development" ? "http" : "https";

      if (host) {
        const res = await fetch(
          `${protocol}://${host}/api/subscription/subinfo`,
          {
            headers: { cookie: hdrs.get("cookie") ?? "" },
            cache: "no-store",
          }
        );

        if (res.ok) subData = await res.json();
      }
    } catch (err) {
      console.error("[PROFILE_SUB_FETCH_FAILED]", err);
    }
  }

  let lenderAccess = null;

  if (isLender) {
    lenderAccess = await getAccessStatus(
      user.id,
      user.role,
      user.createdAt,
      user.freeTierEndsAt
    );
  }

  // let agentReviews: any[] = [];
  let agentReviews: AgentReviewWithRelations[] = [];
  if (isAgent) {
    const agent = await prisma.agent.findUnique({
      where: { userId: user.id },
    });

    if (agent) {
      agentReviews = await prisma.agentReview.findMany({
        where: { agentId: agent.id },
        include: {
          loanee: { select: { name: true } },
          application: { select: { loanType: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  const latestApplicationWithAgentCode =
    user.applications.find((app) => app.agentCode) ?? null;

function normalizeStatus(
  status: string | null | undefined
): "ACTIVE" | "TRIAL" | "INACTIVE" {
  if (status === "ACTIVE" || status === "TRIAL") return status;
  return "INACTIVE";
}

function normalizeBillingInterval(
  interval: string | null | undefined
): "MONTHLY" | "YEARLY" | null {
  if (interval === "MONTHLY" || interval === "YEARLY") return interval;
  return null;
}


const loaneeData =
  subData
    ? {
        subscription: subData.subscription
          ? {
              plan: subData.subscription.plan,
              billingInterval: subData.subscription.billingInterval,
              currentPeriodEnd: subData.subscription.currentPeriodEnd,
              status: normalizeStatus(subData.subscription.status),
            }
          : null,
        freeTier: subData.freeTier,
      }
    : null;

  const lenderData =
  lenderAccess
    ? {
        freeTierActive: lenderAccess.freeTierActive,
        freeTierDaysLeft: lenderAccess.freeTierDaysLeft,
        freeTierEndsAt: lenderAccess.freeTierEndsAt,

        subscription: lenderAccess.subscription
          ? {
              plan: lenderAccess.subscription.plan ?? null, // enum → string
              billingInterval: normalizeBillingInterval(
                lenderAccess.subscription.billingInterval
              ),
              currentPeriodEnd: lenderAccess.subscription.currentPeriodEnd
                ? lenderAccess.subscription.currentPeriodEnd.toISOString()
                : null,
              status: normalizeStatus(lenderAccess.subscription.status),
            }
          : null,
      }
    : null;




  return (
    <Section className="mx-auto max-w-7xl space-y-8 px-4 py-12">
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:flex-row md:items-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-5 w-5" />
                  {user.email}
                </div>

                <Badge className="bg-green-100 px-3 py-1 text-green-800">
                  <Shield className="mr-1 h-4 w-4" />
                  Verified Account
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Account Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Account Type:</span>{" "}
              {(() => {
                switch (user.role) {
                  case UserRole.ADMIN:
                    return "Admin";
                  case UserRole.AGENT:
                    return "Agent";
                  case UserRole.LENDER:
                    return "Lender";
                  case UserRole.LOANEE:
                    return "Loanee";
                  default:
                    return user.role;
                }
              })()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Status:</span> Active
            </p>
          </div>
        </CardContent>
      </Card>

      {isLoanee && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Agent Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Agent Code Used:</span>{" "}
                {latestApplicationWithAgentCode?.agentCode ? (
                  <Badge className="ml-2 bg-indigo-600 text-white">
                    {latestApplicationWithAgentCode.agentCode}
                  </Badge>
                ) : (
                  <span className="ml-1 text-gray-500">
                    No agent code used yet
                  </span>
                )}
              </div>

              {latestApplicationWithAgentCode?.agent && (
                <p className="text-sm font-medium text-gray-600">
                  Your Agent:{" "}
                  <span className="font-medium">
                    {latestApplicationWithAgentCode.agent.name}
                  </span>{" "}
                  ({latestApplicationWithAgentCode.agent.email})
                </p>
              )}

              <PlanSelectorClientLoanee />
            </CardContent>
          </Card>

          {/* <ManageSubscriptionOpener
                plan={subData?.subscription?.plan ?? null}
                status={subData?.subscription?.status ?? "TRIAL"}
                billingInterval={subData?.subscription?.billingInterval ?? null}
                currentPeriodEnd={subData?.subscription?.currentPeriodEnd ?? null}
                trialEndsAt={subData?.freeTier?.endsAt ?? null}
                freeTierDaysLeft={subData?.freeTier?.daysLeft ?? null}
              /> */}
{isLoanee && loaneeData && (
  <ManageSubscriptionOpener role="LOANEE" data={loaneeData} />
)}

        </>
      )}

      {/* {isLender && lenderAccess && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
           <CardTitle className="flex items-center gap-2">
             <Image
               src="/subscripstatus.svg"
               alt="Subscription status"
               width={20}
               height={20}
             />
             Subscription Status
           </CardTitle>
<Badge className="bg-green-100 text-green-800 flex items-center gap-1 px-3 py-1 hover:bg-green-100 cursor-default">
      <CircleCheckBig height={13} width={13} /> Active
</Badge>

          </CardHeader>


          <CardContent className="space-y-4">
            {lenderAccess.freeTierActive && !lenderAccess.subscription && (
  <>
    <div className="w-full rounded-lg bg-[#FFF6CC] border border-[#FFE59A] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F59E0B] text-white">
            <Sparkles height={16} width={16} />          
          </div>
          <h3 className="text-lg font-semibold text-[#92400E]">
            Free Trial
          </h3>
        </div>

        <span className="rounded-md bg-[#F59E0B] px-3 py-1 text-sm font-semibold text-white">
          {lenderAccess.freeTierDaysLeft ?? 0} days left
        </span>
      </div>
    </div>

    <div className="mt-8 grid max-w-4xl gap-6">
      <div className="flex gap-12">
        <span className="w-40 text-md text-[#64748B]">Trial Plan:</span>
        <span className="font-semibold">Free Trial</span>
      </div>

      <div className="flex gap-12">
        <span className="w-40 text-md text-[#64748B]">Access Info:</span>
        <span className="font-medium text-gray-800">
          You currently have full access to lender tools during your trial.
        </span>
      </div>

      <div className="flex gap-12 items-center">
        <span className="w-40 text- text-[#64748B]">Trial End Date:</span>
        <span className="flex items-center gap-2 font-medium">
          <span className="text-[#64748B]"> <Calendar height={16} width={16} /></span>
          {lenderAccess.freeTierEndsAt
            ? new Date(lenderAccess.freeTierEndsAt).toLocaleDateString("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
})
            : "—"}
        </span>
      </div>
    </div>

    <Link
      href="/lender/plans"
      className="inline-flex mt-8 items-center gap-2 rounded-md bg-[#7C3AED] px-2.5 py-6.5 text-sm font-semibold text-white hover:bg-violet-700"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full  text-white">
            <Sparkles height={16} width={16} />          
          </div>
     Upgrade Plan
    </Link>
  </>
)}


{lenderAccess.subscription && (() => {
  const sub = lenderAccess.subscription;

  const planLabelMap: Record<string, string> = {
    LENDER_SIMPLE: "Simple",
    LENDER_STANDARD: "Standard",
  };

  const planBaseName =
    planLabelMap[sub.plan] ?? sub.plan;

  const now = Date.now();
  const end = sub.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).getTime()
    : null;

  const daysLeft =
    end !== null
      ? Math.round((end - now) / (1000 * 60 * 60 * 24))
      : null;

  let billingCycle = "Monthly";
  let planName = "Monthly";
  let price = "—";

  if (sub.billingInterval === "YEARLY") {
    if (daysLeft && daysLeft > 500) {
      billingCycle = "2 Years";
      planName = "2-Year Subscription";
      price =
        sub.plan === "LENDER_SIMPLE"
          ? "$360 / 2 years"
          : "$588 / 2 years";
    } else {
      billingCycle = "Yearly";
      planName = "1-Year Subscription";
      price =
        sub.plan === "LENDER_SIMPLE"
          ? "$210 / year"
          : "$411 / year";
    }
  } else {
    billingCycle = "Monthly";
    planName = "Monthly";
    price =
      sub.plan === "LENDER_SIMPLE"
        ? "$25 / month"
        : "$49 / month";
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid gap-6">
        <div className="flex gap-12">
          <span className="w-48 text-md text-[#64748B]">Plan Name:</span>
          <span className="font-semibold text-md text-[#0F172A]">
            {planBaseName} : {planName}
          </span>
        </div>

        <div className="flex gap-12">
          <span className="w-48 text-md text-[#64748B]">Price:</span>
          <span className="font-semibold text-md text-[#0F172A]">
            {price}
          </span>
        </div>

        <div className="flex gap-12">
          <span className="w-48 text-md text-[#64748B]">Billing Cycle:</span>
          <span className="font-medium text-md text-[#0F172A]">
            {billingCycle}
          </span>
        </div>

        <div className="flex gap-12 items-center">
          <span className="w-48 text-md text-[#64748B]">
            Next Billing Date:
          </span>
          <span className="flex items-center gap-2 font-medium text-md">
            <Calendar height={18} width={18} className="text-[#64748B]" />
            Renews on{" "}
            {sub.currentPeriodEnd
              ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "—"}
          </span>
        </div>
      </div>

      <ManageSubscriptionButton />
    </div>
  );
})()}






          </CardContent>
        </Card>

      )} */}
{isLender && lenderData && (
  <ManageSubscriptionOpener role="LENDER" data={lenderData} />
)}

      {isAgent && <AgentReviewsPanel reviews={agentReviews} />}
    </Section>
  );
}
