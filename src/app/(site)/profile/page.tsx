import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Section from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, Zap } from "lucide-react";
import { UserRole } from "@prisma/client";

import ManageSubscriptionButton from "@/components/shared/ManageSubscriptionButton";
import ManageSubscriptionOpener from "@/components/ManageSubscriptionOpener";
import PlanSelectorClientLoanee from "@/components/PlanSelectorClientLoanee";
import AgentReviewsPanel from "@/components/agent/AgentReviewsPanel";
import { getAccessStatus } from "@/lib/subscription-access";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !session.user.id) {
    return (
      <Section className="py-12 max-w-7xl mx-auto px-4">
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


  let subData: any = null;

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


  let agentReviews: any[] = [];

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

  return (
    <Section className="py-12 max-w-7xl mx-auto px-4 space-y-8">
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-gray-900">
                {user.name}
              </h2>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-5 h-5" />
                  {user.email}
                </div>

                <Badge className="px-3 py-1 bg-green-100 text-green-800">
                  <Shield className="w-4 h-4 mr-1" />
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
            <Shield className="w-5 h-5 text-blue-600" />
            Account Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
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
                  <span className="text-gray-500 ml-1">
                    No agent code used yet
                  </span>
                )}
              </div>

              {latestApplicationWithAgentCode?.agent && (
                <p className="text-sm text-gray-600 font-medium">
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

          <Card>
            <CardContent className="space-y-4">
              <ManageSubscriptionOpener
                plan={subData?.subscription?.plan ?? null}
                status={subData?.subscription?.status ?? "TRIAL"}
                billingInterval={subData?.subscription?.billingInterval ?? null}
                currentPeriodEnd={subData?.subscription?.currentPeriodEnd ?? null}
                trialEndsAt={subData?.freeTier?.endsAt ?? null}
                freeTierDaysLeft={subData?.freeTier?.daysLeft ?? null}
              />

              {subData?.subscription && <ManageSubscriptionButton />}
            </CardContent>
          </Card>
        </>
      )}

      {isLender && lenderAccess && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-violet-600" />
              Subscription Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {lenderAccess.freeTierActive && !lenderAccess.subscription && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        Free Tier
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">
                        Trial Active
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-700">
                      You are currently on a <strong>60-day free trial</strong>.
                    </p>

                    <div className="mt-3 text-sm text-gray-700 space-y-1">
                      <div>
                        <span className="font-medium">Trial ends on:</span>{" "}
                        {lenderAccess.freeTierEndsAt
                          ? new Date(
                            lenderAccess.freeTierEndsAt
                          ).toLocaleDateString()
                          : "—"}
                      </div>
                      <div>
                        <span className="font-medium">Days left:</span>{" "}
                        {lenderAccess.freeTierDaysLeft ?? 0}
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/lender/plans"
                    className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-green-700 border hover:bg-green-100"
                  >
                    View Plans
                  </Link>
                </div>
              </div>
            )}

            {lenderAccess.subscription && (
              <div className="rounded-lg border bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {(() => {
                          const planMap: Record<string, string> = {
                            LENDER_SIMPLE: "Lender — Simple",
                            LENDER_STANDARD: "Lender — Standard",
                          };
                          return (
                            planMap[lenderAccess.subscription.plan] ??
                            lenderAccess.subscription.plan
                          );
                        })()}
                      </h3>

                      <Badge
                        className={
                          lenderAccess.subscription.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {lenderAccess.subscription.status}
                      </Badge>
                    </div>

                    <p className="mt-1 text-sm text-gray-600">
                      Billing:{" "}
                      {lenderAccess.subscription.billingInterval === "YEARLY"
                        ? "Yearly"
                        : "Monthly"}
                    </p>
                  </div>

                  <Link
                    href="/lender/plans"
                    className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50"
                  >
                    Manage Billing
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Subscription Started</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(
                        lenderAccess.subscription.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Current Period Ends</p>
                    <p className="text-sm font-medium text-gray-900">
                      {lenderAccess.subscription.currentPeriodEnd
                        ? new Date(
                          lenderAccess.subscription.currentPeriodEnd
                        ).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Auto-Renew</p>
                    <p className="text-sm font-medium text-gray-900">
                      {lenderAccess.subscription.cancelAtPeriodEnd
                        ? "Disabled"
                        : "Enabled"}
                    </p>
                  </div>
                </div>

                {lenderAccess.subscription.currentPeriodEnd && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Days remaining:</span>{" "}
                    {Math.max(
                      0,
                      Math.ceil(
                        (new Date(
                          lenderAccess.subscription.currentPeriodEnd
                        ).getTime() -
                          Date.now()) /
                        (1000 * 60 * 60 * 24)
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      )}

      {isAgent && <AgentReviewsPanel reviews={agentReviews} />}
    </Section>
  );
}
