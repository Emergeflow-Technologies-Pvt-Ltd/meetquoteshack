import prisma from "@/lib/db"
import BillingSuccessChecker from "@/components/BillingSuccessChecker"
import PaywallClient from "../../../../components/shared/PaywallClient"
import { redirect } from "next/navigation"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { LoanStatus, UserRole } from "@prisma/client"
import Section from "@/components/shared/section"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getBackgroundColorLoanStatus,
  getTextColorLoanStatus,
} from "@/components/shared/chips"
import {
  employmentTypeLabels,
  loanTypeLabels,
} from "@/components/shared/general.const"
import { getAccessStatus } from "@/lib/subscription-access"
import { Button } from "@/components/ui/button"
// import SubscriptionStartBanner from "@/components/shared/SubscriptionStartBanner";

export default async function LenderPoolPage({
  searchParams,
}: {
  searchParams: Promise<{
    billing?: string | string[]
    showPlans?: string | string[]
  }>
}) {
  const query = await searchParams

  const billingParam = query.billing
  const billingValue = Array.isArray(billingParam)
    ? billingParam[0]
    : billingParam
  const billingSuccess = billingValue === "success"

  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      createdAt: true,
      freeTierEndsAt: true,
      hasSeenFreeTrialModal: true,
    },
  })

  if (!user) {
    return (
      <Section>
        <p className="mt-16 text-center text-gray-600">User not found.</p>
      </Section>
    )
  }

  if (user.role !== ("LENDER" as UserRole)) {
    return (
      <Section>
        <p className="mt-16 text-center text-gray-600">
          You are not registered as a lender.
        </p>
      </Section>
    )
  }

  if (billingSuccess) {
    return (
      <Section className="py-20">
        <BillingSuccessChecker />
      </Section>
    )
  }

  const access = await getAccessStatus(
    user.id,
    user.role,
    user.createdAt,
    user.freeTierEndsAt
  )

  // ✅ Decide onboarding FIRST
  const shouldShowFirstTimeModal =
    user.role === UserRole.LENDER &&
    !user.hasSeenFreeTrialModal &&
    access.freeTierActive === true &&
    !access.subscription

  // 🚫 Redirect ONLY if onboarding already done
  if (
    user.role === UserRole.LENDER &&
    !access.hasAccess &&
    user.hasSeenFreeTrialModal
  ) {
    redirect("/lender/plans")
  }

  // const freeTierDaysLeft = access.freeTierDaysLeft ?? 0;

  // const freeTierActive = access.freeTierActive === true;
  // const freeTierEndsAtIso = access.freeTierEndsAt
  //   ? access.freeTierEndsAt.toISOString()
  //   : null;

  // 🚫 Access blocked → send to plans

  // if (!access.hasAccess) {
  //   return (
  //     <Section className="py-20">
  //       <LenderPlans />
  //     </Section>
  //   );
  // }

  const lender = await prisma.lender.findUnique({
    where: { userId: session.user.id },
  })

  if (!lender) {
    return (
      <Section>
        <p className="mt-16 text-center text-gray-600">
          No lender profile found for this user.
        </p>
      </Section>
    )
  }

  const availableApplications = await prisma.application.findMany({
    where: {
      status: LoanStatus.ASSIGNED_TO_LENDER,
      lenderId: lender.id,
    },
    orderBy: { createdAt: "desc" },
  })

  const acceptedApplications = await prisma.application.findMany({
    where: {
      status: {
        in: [LoanStatus.IN_PROGRESS, LoanStatus.IN_CHAT],
      },
      lenderId: lender.id,
    },
    orderBy: { createdAt: "desc" },
  })

  const approvedApplications = await prisma.application.findMany({
    where: {
      status: LoanStatus.APPROVED,
      lenderId: lender.id,
    },
    orderBy: { createdAt: "desc" },
  })

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
  })

  const customApplications = await prisma.application.findMany({
    where: {
      status: LoanStatus.CUSTOM_APPLICATION,
      lenderId: lender.id,
    },
    orderBy: { createdAt: "desc" },
  })

  const lenderStatusLabelMap: Partial<Record<LoanStatus, string>> = {
    ASSIGNED_TO_POTENTIAL_LENDER: "Potential Assignment",
    ASSIGNED_TO_LENDER: "Assigned",
    CUSTOM_APPLICATION: "Custom",
    IN_PROGRESS: "In Progress",
    IN_CHAT: "In Chat",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  }

  return (
    <>
      {shouldShowFirstTimeModal && <PaywallClient fullscreen={false} />}

      <Section className="py-12">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Lender Dashboard
          </h1>

          {/* <SubscriptionStartBanner
            freeTierActive={access.freeTierActive}
            freeTierEndsAt={access.freeTierEndsAt?.toISOString()}
          /> */}

          {/* {freeTierActive && (
            <div className="mx-auto my-6 max-w-4xl">
              <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-4 py-3">
                <div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-800">
                      Free tier
                    </Badge>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        60-day free access — {freeTierDaysLeft} day
                        {freeTierDaysLeft !== 1 ? "s" : ""} left
                      </div>
                      {freeTierEndsAtIso && (
                        <div className="text-xs text-gray-600">
                          Free access ends on{" "}
                          {new Date(freeTierEndsAtIso).toLocaleDateString()}
                        </div>
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
          )} */}
          {/* {access.subscription && (
            <div className="mx-auto my-4 max-w-4xl">
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
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            access.subscription.status === "ACTIVE"
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
                          const planLabel =
                            planLabelMap[access.subscription.plan] ??
                            access.subscription.plan;
                          const interval = (() => {
                            if (!access.subscription.currentPeriodEnd) {
                              return access.subscription.billingInterval ===
                                "YEARLY"
                                ? "per year"
                                : "per month";
                            }

                            const now = Date.now();
                            const end = new Date(
                              access.subscription.currentPeriodEnd
                            ).getTime();
                            const days = Math.round(
                              (end - now) / (1000 * 60 * 60 * 24)
                            );

                            if (
                              access.subscription.billingInterval === "YEARLY"
                            ) {
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
                  <div className="rounded bg-slate-50 px-3 py-2">
                    <div className="text-xs text-gray-500">
                      Current period ends
                    </div>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {access.subscription.currentPeriodEnd
                        ? new Date(
                            access.subscription.currentPeriodEnd
                          ).toLocaleString()
                        : "—"}
                    </div>
                  </div>

                  <div className="rounded bg-slate-50 px-3 py-2">
                    <div className="text-xs text-gray-500">
                      Days left in subscription
                    </div>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {access.subscription.currentPeriodEnd
                        ? Math.max(
                            0,
                            Math.ceil(
                              (new Date(
                                access.subscription.currentPeriodEnd
                              ).getTime() -
                                Date.now()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )
                        : "—"}
                    </div>
                  </div>

                  <div className="rounded bg-slate-50 px-3 py-2">
                    <div className="text-xs text-gray-500">Auto-renew</div>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {access.subscription.cancelAtPeriodEnd
                        ? "Disabled"
                        : "Enabled"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-[0px_0px_0px_0px_rgba(0,0,0,0),0px_0px_0px_0px_rgba(0,0,0,0),0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600">
                <Image
                  src="/list-details.svg"
                  alt="Success"
                  width={18}
                  height={18}
                  priority
                  sizes="4"
                  color="#ffffff"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-[17px] font-semibold leading-[25.5px] text-slate-900">
                  Create smart form
                </p>
                <p className="text-[11.33px] leading-[17px] text-slate-500">
                  Create a form tailored to your requirements, select steps,
                  fields and share it with applicants
                </p>
              </div>
            </div>
            <Link href="/lender/forms">
              <Button className="flex items-center justify-center gap-[10px] rounded-[4.28px] bg-violet-600 px-[11px] py-[3px] text-[14px] font-medium text-white transition-all duration-300 hover:bg-violet-700">
                Manage Custom Forms
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="assigned" className="w-full">
          <TabsList className="mb-6 mt-8 flex flex-col gap-2 sm:flex-row sm:justify-start sm:gap-4">
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
            <TabsTrigger value="custom" className="w-full sm:w-auto">
              Custom Applications
              <Badge variant="secondary" className="ml-2">
                {customApplications.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assigned">
            {availableApplications.length > 0 ? (
              <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-0 sm:grid-cols-2 lg:grid-cols-3">
                {availableApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/lender/dashboard/${app.id}`}
                    className="block"
                  >
                    <Card className="rounded-xl border border-gray-200 transition-shadow hover:shadow-lg">
                      <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-800">
                              {app.firstName} {app.lastName}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                              Submitted on{" "}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            className="rounded-md px-2 py-1 text-xs"
                            style={{
                              color: getTextColorLoanStatus(app.status),
                              backgroundColor: getBackgroundColorLoanStatus(
                                app.status
                              ),
                            }}
                          >
                            {app.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 text-sm text-gray-700">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <span className="text-gray-500">Loan Amount</span>
                            <p className="font-medium">
                              ${app.loanAmount?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Loan Type</span>
                            <p className="font-medium">
                              {loanTypeLabels[app.loanType]}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Employment</span>
                            <p className="font-medium">
                              {app.employmentStatus
                                ? employmentTypeLabels[app.employmentStatus]
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Gross Income</span>
                            <p className="font-medium">
                              ${app.grossIncome.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Housing</span>
                            <p className="font-medium">{app.housingStatus}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Monthly Debts</span>
                            <p className="font-medium">
                              ${app.monthlyDebts.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Savings</span>
                            <p className="font-medium">
                              ${Number(app.savings ?? 0).toLocaleString()}
                            </p>
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
              <p className="mt-16 rounded-lg bg-gray-50 py-8 text-center text-gray-600">
                No available applications
              </p>
            )}
          </TabsContent>

          <TabsContent value="accepted">
            {acceptedApplications.length > 0 ? (
              <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-0 sm:grid-cols-2 lg:grid-cols-3">
                {acceptedApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/lender/dashboard/${app.id}`}
                    className="block"
                  >
                    <Card className="rounded-xl border border-gray-200 transition-shadow hover:shadow-lg">
                      <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-800">
                              {app.firstName} {app.lastName}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                              Submitted on{" "}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            className="rounded-md px-2 py-1 text-xs"
                            style={{
                              color: getTextColorLoanStatus(app.status),
                              backgroundColor: getBackgroundColorLoanStatus(
                                app.status
                              ),
                            }}
                          >
                            {app.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 text-sm text-gray-700">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <span className="text-gray-500">Loan Amount</span>
                            <p className="font-medium">
                              ${app.loanAmount?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Loan Type</span>
                            <p className="font-medium">
                              {loanTypeLabels[app.loanType]}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Employment</span>
                            <p className="font-medium">
                              {app.employmentStatus
                                ? employmentTypeLabels[app.employmentStatus]
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Gross Income</span>
                            <p className="font-medium">
                              ${app.grossIncome.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Housing</span>
                            <p className="font-medium">{app.housingStatus}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Monthly Debts</span>
                            <p className="font-medium">
                              ${app.monthlyDebts.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Savings</span>
                            <p className="font-medium">
                              ${Number(app.savings ?? 0).toLocaleString()}
                            </p>
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
              <p className="mt-16 rounded-lg bg-gray-50 py-8 text-center text-gray-600">
                No accepted applications
              </p>
            )}
          </TabsContent>

          <TabsContent value="approved">
            {approvedApplications.length > 0 ? (
              <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-0 sm:grid-cols-2 lg:grid-cols-3">
                {approvedApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/lender/dashboard/${app.id}`}
                    className="block"
                  >
                    <Card className="rounded-xl border border-gray-200 transition-shadow hover:shadow-lg">
                      <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-800">
                              {app.firstName} {app.lastName}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                              Submitted on{" "}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            className="rounded-md px-2 py-1 text-xs"
                            style={{
                              color: getTextColorLoanStatus(app.status),
                              backgroundColor: getBackgroundColorLoanStatus(
                                app.status
                              ),
                            }}
                          >
                            {app.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 text-sm text-gray-700">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <span className="text-gray-500">Loan Amount</span>
                            <p className="font-medium">
                              ${app.loanAmount?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Loan Type</span>
                            <p className="font-medium">
                              {loanTypeLabels[app.loanType]}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Employment</span>
                            <p className="font-medium">
                              {app.employmentStatus
                                ? employmentTypeLabels[app.employmentStatus]
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Gross Income</span>
                            <p className="font-medium">
                              ${app.grossIncome.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Housing</span>
                            <p className="font-medium">{app.housingStatus}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Monthly Debts</span>
                            <p className="font-medium">
                              ${app.monthlyDebts.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Savings</span>
                            <p className="font-medium">
                              ${Number(app.savings ?? 0).toLocaleString()}
                            </p>
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
              <p className="mt-16 rounded-lg bg-gray-50 py-8 text-center text-gray-600">
                No approved applications
              </p>
            )}
          </TabsContent>

          <TabsContent value="potential">
            {potentialApplications.length > 0 ? (
              <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-0 sm:grid-cols-2 lg:grid-cols-3">
                {potentialApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/lender/dashboard/${app.id}`}
                    className="block"
                  >
                    <Card className="rounded-xl border border-gray-200 transition-shadow hover:shadow-lg">
                      <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-800">
                              {app.firstName} {app.lastName}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                              Submitted on{" "}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            className="rounded-md px-2 py-1 text-xs"
                            style={{
                              color: getTextColorLoanStatus(app.status),
                              backgroundColor: getBackgroundColorLoanStatus(
                                app.status
                              ),
                            }}
                          >
                            {lenderStatusLabelMap[app.status] ??
                              app.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 text-sm text-gray-700">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <span className="text-gray-500">Loan Amount</span>
                            <p className="font-medium">
                              ${app.loanAmount?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Loan Type</span>
                            <p className="font-medium">
                              {loanTypeLabels[app.loanType]}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Employment</span>
                            <p className="font-medium">
                              {app.employmentStatus
                                ? employmentTypeLabels[app.employmentStatus]
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Gross Income</span>
                            <p className="font-medium">
                              ${app.grossIncome.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Housing</span>
                            <p className="font-medium">{app.housingStatus}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Monthly Debts</span>
                            <p className="font-medium">
                              ${app.monthlyDebts.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Savings</span>
                            <p className="font-medium">
                              ${Number(app.savings ?? 0).toLocaleString()}
                            </p>
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
              <p className="mt-16 rounded-lg bg-gray-50 py-8 text-center text-gray-600">
                No potential applications
              </p>
            )}
          </TabsContent>

          <TabsContent value="custom">
            {customApplications.length > 0 ? (
              <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-0 sm:grid-cols-2 lg:grid-cols-3">
                {customApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/lender/dashboard/${app.id}`}
                    className="block"
                  >
                    <Card className="rounded-xl border border-gray-200 transition-shadow hover:shadow-lg">
                      <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-800">
                              {app.firstName} {app.lastName}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                              Submitted on{" "}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>

                          <Badge
                            className="rounded-md px-2 py-1 text-xs"
                            style={{
                              color: getTextColorLoanStatus(app.status),
                              backgroundColor: getBackgroundColorLoanStatus(
                                app.status
                              ),
                            }}
                          >
                            {app.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 text-sm text-gray-700">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <span className="text-gray-500">Loan Amount</span>
                            <p className="font-medium">
                              ${Number(app.loanAmount || 0).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Loan Type</span>
                            <p className="font-medium">
                              {loanTypeLabels[app.loanType]}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Employment</span>
                            <p className="font-medium">
                              {app.employmentStatus
                                ? employmentTypeLabels[app.employmentStatus]
                                : "-"}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Gross Income</span>
                            <p className="font-medium">
                              ${Number(app.grossIncome || 0).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Housing</span>
                            <p className="font-medium">{app.housingStatus}</p>
                          </div>

                          <div>
                            <span className="text-gray-500">Monthly Debts</span>
                            <p className="font-medium">
                              ${Number(app.monthlyDebts || 0).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Savings</span>
                            <p className="font-medium">
                              ${Number(app.savings || 0).toLocaleString()}
                            </p>
                          </div>

                          <div>
                            <span className="text-gray-500">Phone no.</span>
                            <p className="font-medium">
                              {app.personalPhone || "-"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-16 rounded-lg bg-gray-50 py-8 text-center text-gray-600">
                No custom applications
              </p>
            )}
          </TabsContent>
        </Tabs>
      </Section>
    </>
  )
}
