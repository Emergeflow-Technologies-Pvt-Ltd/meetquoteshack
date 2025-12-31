"use-client"
import prisma from "@/lib/db";
import BillingSuccessChecker from "@/components/BillingSuccessChecker";
import PaywallClient from "../../../../components/shared/PaywallClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { LoanStatus, UserRole } from "@prisma/client";
import Section from "@/components/shared/section";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getBackgroundColorLoanStatus,
  getTextColorLoanStatus,
} from "@/components/shared/chips";
import {
  employmentTypeLabels,
  loanTypeLabels,
} from "@/components/shared/general.const";
import { getAccessStatus } from "@/lib/subscription-access";
import LenderPlans from "@/components/lender/LenderPlans";
import SubscriptionStartBanner from "@/components/shared/SubscriptionStartBanner";

export default async function LenderPoolPage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string | string[]; showPlans?: string | string[] }>;
}) {
  const query = await searchParams;

  const billingParam = query.billing;
  const billingValue = Array.isArray(billingParam)
    ? billingParam[0]
    : billingParam;
  const billingSuccess = billingValue === "success";

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      createdAt: true,
      freeTierEndsAt: true,
    },
  });

  if (!user) {
    return (
      <Section>
        <p className="text-center mt-16 text-gray-600">User not found.</p>
      </Section>
    );
  }

  if (user.role !== ("LENDER" as UserRole)) {
    return (
      <Section>
        <p className="text-center mt-16 text-gray-600">
          You are not registered as a lender.
        </p>
      </Section>
    );
  }

  const access = await getAccessStatus(user.id, user.role, user.createdAt, user.freeTierEndsAt);




  const freeTierDaysLeft = access.freeTierDaysLeft ?? 0;

  const freeTierActive = access.freeTierActive === true;
  const freeTierEndsAtIso = access.freeTierEndsAt ? access.freeTierEndsAt.toISOString() : null;


  if (billingSuccess) {
    return (
      <Section className="py-20">
        <BillingSuccessChecker />
      </Section>
    );
  }

  if (user.role === UserRole.LENDER && !access.hasAccess) {
    return <PaywallClient fullscreen />;
  }

  if (!access.hasAccess) {
    return (
      <Section className="py-20">
        <LenderPlans />
      </Section>
    );
  }

  const lender = await prisma.lender.findUnique({
    where: { userId: session.user.id },
  });

  if (!lender) {
    return (
      <Section>
        <p className="text-center mt-16 text-gray-600">
          No lender profile found for this user.
        </p>
      </Section>
    );
  }

  const availableApplications = await prisma.application.findMany({
    where: {
      status: LoanStatus.ASSIGNED_TO_LENDER,
      lenderId: lender.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const acceptedApplications = await prisma.application.findMany({
    where: {
      status: {
        in: [LoanStatus.IN_PROGRESS, LoanStatus.IN_CHAT],
      },
      lenderId: lender.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const approvedApplications = await prisma.application.findMany({
    where: {
      status: LoanStatus.APPROVED,
      lenderId: lender.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const potentialApplications = await prisma.application.findMany({
    where: {
      status: LoanStatus.ASSIGNED_TO_POTENTIAL_LENDER,
      potentialLender: {
        some: {
          lenderId: lender.id,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const lenderStatusLabelMap: Partial<Record<LoanStatus, string>> = {
    ASSIGNED_TO_POTENTIAL_LENDER: "Potential Assignment",
    ASSIGNED_TO_LENDER: "Assigned",
    IN_PROGRESS: "In Progress",
    IN_CHAT: "In Chat",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };

  return (
    <Section className="py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
          Lender Dashboard
        </h1>

        <SubscriptionStartBanner
          freeTierActive={access.freeTierActive}
          freeTierEndsAt={access.freeTierEndsAt?.toISOString()}
        />

        {freeTierActive && (
          <div className="max-w-4xl mx-auto my-6">
            <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800">Free tier</Badge>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      60-day free access — {freeTierDaysLeft} day{freeTierDaysLeft !== 1 ? "s" : ""} left
                    </div>
                    {freeTierEndsAtIso && (
                      <div className="text-xs text-gray-600">Free access ends on {new Date(freeTierEndsAtIso).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <a
                  href="/lender/plans"
                  className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-1 text-sm font-medium text-green-800 shadow-sm hover:bg-green-100"
                >
                  View plans
                </a>
              </div>
            </div>
          </div>
        )}
        {access.subscription && (
          <div className="max-w-4xl mx-auto my-4">
            <div className="rounded-md border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-violet-50">
                    <Zap className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Subscription
                      </h3>

                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${access.subscription.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : access.subscription.status === "TRIALING"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {access.subscription.status.toLowerCase()}
                      </span>
                    </div>

                    <div className="mt-1 text-sm text-gray-600">
                      {(() => {
                        const planLabelMap: Record<string, string> = {
                          LOANEE_FREE: "Loanee — Free",
                          LOANEE_STAY_SMART: "Loanee — Stay Smart",
                          LENDER_TRIAL: "Lender — Trial",
                          LENDER_SIMPLE: "Lender — Simple",
                          LENDER_STANDARD: "Lender — Standard",
                        };
                        const planLabel = planLabelMap[access.subscription.plan] ?? access.subscription.plan;
                        const interval = (() => {
                          if (!access.subscription.currentPeriodEnd) {
                            return access.subscription.billingInterval === "YEARLY"
                              ? "per year"
                              : "per month";
                          }

                          const now = Date.now();
                          const end = new Date(access.subscription.currentPeriodEnd).getTime();
                          const days = Math.round((end - now) / (1000 * 60 * 60 * 24));

                          if (access.subscription.billingInterval === "YEARLY") {
                            if (days > 500) return "per 2 years";
                            return "per year";
                          }

                          return "per month";
                        })();
                        return `${planLabel} • ${interval}`;
                      })()}
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm">
                  <Link
                    href="/lender/plans"
                    className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Manage billing
                  </Link>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded px-3 py-2 bg-slate-50">
                  <div className="text-xs text-gray-500">Current period ends</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {access.subscription.currentPeriodEnd
                      ? new Date(access.subscription.currentPeriodEnd).toLocaleString()
                      : "—"}
                  </div>
                </div>

                <div className="rounded px-3 py-2 bg-slate-50">
                  <div className="text-xs text-gray-500">Days left in subscription</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {access.subscription.currentPeriodEnd
                      ? Math.max(
                        0,
                        Math.ceil(
                          (new Date(access.subscription.currentPeriodEnd).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24)
                        )
                      )
                      : "—"}
                  </div>
                </div>

                <div className="rounded px-3 py-2 bg-slate-50">
                  <div className="text-xs text-gray-500">Auto-renew</div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {access.subscription.cancelAtPeriodEnd ? "Disabled" : "Enabled"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="mb-6 mt-8 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-start">
          <TabsTrigger value="assigned" className="w-full sm:w-auto">
            Available Applications
            <Badge variant="secondary" className="ml-2">
              {availableApplications.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger value="accepted" className="w-full sm:w-auto">
            My Applications
            <Badge variant="secondary" className="ml-2">
              {acceptedApplications.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger value="approved" className="w-full sm:w-auto">
            Approved Applications
            <Badge variant="secondary" className="ml-2">
              {approvedApplications.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger value="potential" className="w-full sm:w-auto">
            Potential Applications
            <Badge variant="secondary" className="ml-2">
              {potentialApplications.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
          {availableApplications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-16 sm:mt-0 gap-4">
              {availableApplications.map((app) => (
                <Link key={app.id} href={`/lender/dashboard/${app.id}`} className="block">
                  <Card className="transition-shadow hover:shadow-lg rounded-xl border border-gray-200">
                    <CardHeader className="pb-4 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {app.firstName} {app.lastName}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500">
                            Submitted on {new Date(app.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            color: getTextColorLoanStatus(app.status),
                            backgroundColor: getBackgroundColorLoanStatus(app.status),
                          }}
                        >
                          {app.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm text-gray-700">
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div>
                          <span className="text-gray-500">Loan Amount</span>
                          <p className="font-medium">${app.loanAmount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Loan Type</span>
                          <p className="font-medium">{loanTypeLabels[app.loanType]}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Employment</span>
                          <p className="font-medium">{employmentTypeLabels[app.employmentStatus]}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Gross Income</span>
                          <p className="font-medium">${app.grossIncome.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Housing</span>
                          <p className="font-medium">{app.housingStatus}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Monthly Debts</span>
                          <p className="font-medium">${app.monthlyDebts.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Savings</span>
                          <p className="font-medium">${app.savings.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone no.</span>
                          <p className="font-medium">{app.personalPhone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-16 py-8 bg-gray-50 rounded-lg">No available applications</p>
          )}
        </TabsContent>

        <TabsContent value="accepted">
          {acceptedApplications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-16 sm:mt-0 gap-4">
              {acceptedApplications.map((app) => (
                <Link key={app.id} href={`/lender/dashboard/${app.id}`} className="block">
                  <Card className="transition-shadow hover:shadow-lg rounded-xl border border-gray-200">
                    <CardHeader className="pb-4 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {app.firstName} {app.lastName}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500">
                            Submitted on {new Date(app.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            color: getTextColorLoanStatus(app.status),
                            backgroundColor: getBackgroundColorLoanStatus(app.status),
                          }}
                        >
                          {app.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm text-gray-700">
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div>
                          <span className="text-gray-500">Loan Amount</span>
                          <p className="font-medium">${app.loanAmount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Loan Type</span>
                          <p className="font-medium">{loanTypeLabels[app.loanType]}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Employment</span>
                          <p className="font-medium">{employmentTypeLabels[app.employmentStatus]}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Gross Income</span>
                          <p className="font-medium">${app.grossIncome.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Housing</span>
                          <p className="font-medium">{app.housingStatus}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Monthly Debts</span>
                          <p className="font-medium">${app.monthlyDebts.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Savings</span>
                          <p className="font-medium">${app.savings.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone no.</span>
                          <p className="font-medium">{app.personalPhone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-16 py-8 bg-gray-50 rounded-lg">No accepted applications</p>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedApplications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 sm:mt-0">
              {approvedApplications.map((app) => (
                <Link key={app.id} href={`/lender/dashboard/${app.id}`} className="block">
                  <Card className="transition-shadow hover:shadow-lg rounded-xl border border-gray-200">
                    <CardHeader className="pb-4 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {app.firstName} {app.lastName}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500">
                            Submitted on {new Date(app.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            color: getTextColorLoanStatus(app.status),
                            backgroundColor: getBackgroundColorLoanStatus(app.status),
                          }}
                        >
                          {app.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm text-gray-700">
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div>
                          <span className="text-gray-500">Loan Amount</span>
                          <p className="font-medium">${app.loanAmount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Loan Type</span>
                          <p className="font-medium">{loanTypeLabels[app.loanType]}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Employment</span>
                          <p className="font-medium">{employmentTypeLabels[app.employmentStatus]}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Gross Income</span>
                          <p className="font-medium">${app.grossIncome.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Housing</span>
                          <p className="font-medium">{app.housingStatus}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Monthly Debts</span>
                          <p className="font-medium">${app.monthlyDebts.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Savings</span>
                          <p className="font-medium">${app.savings.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone no.</span>
                          <p className="font-medium">{app.personalPhone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-16 py-8 bg-gray-50 rounded-lg">No approved applications</p>
          )}
        </TabsContent>

        <TabsContent value="potential">
          {potentialApplications.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 sm:mt-0">
              {potentialApplications.map((app) => (
                <Link key={app.id} href={`/lender/dashboard/${app.id}`} className="block">
                  <Card className="transition-shadow hover:shadow-lg rounded-xl border border-gray-200">
                    <CardHeader className="pb-4 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {app.firstName} {app.lastName}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500">
                            Submitted on {new Date(app.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            color: getTextColorLoanStatus(app.status),
                            backgroundColor: getBackgroundColorLoanStatus(app.status),
                          }}
                        >
                          {lenderStatusLabelMap[app.status] ?? app.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-sm text-gray-700">
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div>
                          <span className="text-gray-500">Loan Amount</span>
                          <p className="font-medium">${app.loanAmount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Loan Type</span>
                          <p className="font-medium">{loanTypeLabels[app.loanType]}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Employment</span>
                          <p className="font-medium">{employmentTypeLabels[app.employmentStatus]}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Gross Income</span>
                          <p className="font-medium">${app.grossIncome.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Housing</span>
                          <p className="font-medium">{app.housingStatus}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Monthly Debts</span>
                          <p className="font-medium">${app.monthlyDebts.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Savings</span>
                          <p className="font-medium">${app.savings.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone no.</span>
                          <p className="font-medium">{app.personalPhone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-16 py-8 bg-gray-50 rounded-lg">
              No potential applications            
            </p>
          )}
        </TabsContent>
      </Tabs>
    </Section>
  );
}
