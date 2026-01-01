import Link from "next/link";
import prisma from "@/lib/db";
import { LoanStatus } from "@prisma/client";
import Section from "@/components/shared/section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import {
  getBackgroundColorLoanStatus,
  getTextColorLoanStatus,
} from "@/components/shared/chips";
import {
  employmentTypeLabels,
  loanTypeLabels,
} from "@/components/shared/general.const";

export default async function AdminPage() {
  // Fetch applications that need review
  const applications = await prisma.application.findMany({
    where: {
      status: {
        in: [LoanStatus.OPEN],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch documents that need review
  const assignedApplications = await prisma.application.findMany({
    where: {
      status: {
        in: [
          LoanStatus.ASSIGNED_TO_LENDER,
          LoanStatus.IN_PROGRESS,
          LoanStatus.IN_CHAT,
        ],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const approvedOrRejectedApplications = await prisma.application.findMany({
    where: {
      status: {
        in: [LoanStatus.APPROVED, LoanStatus.REJECTED],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const potentialApplications = await prisma.application.findMany({
    where: {
      status: {
        in: [LoanStatus.ASSIGNED_TO_POTENTIAL_LENDER],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Section className="mt-12">
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="mb-6 mt-8 flex flex-col gap-2 sm:flex-row sm:justify-start sm:gap-4">
          <TabsTrigger value="applications" className="w-full sm:w-auto">
            Open Applications
            <Badge variant="secondary" className="ml-2">
              {applications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="assigned" className="w-full sm:w-auto">
            Assigned Applications
            <Badge variant="secondary" className="ml-2">
              {assignedApplications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved-rejected" className="w-full sm:w-auto">
            Approved/Rejected
            <Badge variant="secondary" className="ml-2">
              {approvedOrRejectedApplications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="potential" className="w-full sm:w-auto">
            Potential Lenders
            <Badge variant="secondary" className="ml-2">
              {potentialApplications.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <div className="mt-24 grid grid-cols-1 gap-4 sm:mt-0 md:grid-cols-2 lg:grid-cols-3">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-lg font-medium">
                      No applications to review
                    </p>
                    <p className="text-sm text-muted-foreground">
                      All applications have been processed
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Link key={app.id} href={`/admin/${app.id}`} className="block">
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
                            ${app.loanAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Loan Type</span>
                          <p className="font-medium">
                            {" "}
                            {loanTypeLabels[app.loanType]}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Employment</span>
                          <p className="font-medium">
                            {employmentTypeLabels[app.employmentStatus]}
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
                          <span className="text-gray-500">Monthly Debts</span>
                          <p className="font-medium">
                            ${app.monthlyDebts.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Savings</span>
                          <p className="font-medium">
                            ${app.savings.toLocaleString()}
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
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="assigned">
          <div className="mt-24 grid grid-cols-1 gap-4 sm:mt-0 md:grid-cols-2 lg:grid-cols-3">
            {assignedApplications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-lg font-medium">
                      No applications to review
                    </p>
                    <p className="text-sm text-muted-foreground">
                      All applications have been processed
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              assignedApplications.map((app) => (
                <Link key={app.id} href={`/admin/${app.id}`} className="block">
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
                            ${app.loanAmount.toLocaleString()}
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
                            {employmentTypeLabels[app.employmentStatus]}
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
                            ${app.savings.toLocaleString()}
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
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="approved-rejected">
          <div className="mt-24 grid grid-cols-1 gap-4 sm:mt-0 md:grid-cols-2 lg:grid-cols-3">
            {approvedOrRejectedApplications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-lg font-medium">
                      No applications to review
                    </p>
                    <p className="text-sm text-muted-foreground">
                      All applications have been processed
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              approvedOrRejectedApplications.map((app) => (
                <Link key={app.id} href={`/admin/${app.id}`} className="block">
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
                            ${app.loanAmount.toLocaleString()}
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
                            {employmentTypeLabels[app.employmentStatus]}
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
                            ${app.savings.toLocaleString()}
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
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="potential">
          <div className="mt-24 grid grid-cols-1 gap-4 sm:mt-0 md:grid-cols-2 lg:grid-cols-3">
            {potentialApplications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-lg font-medium">
                      No applications to review
                    </p>
                    <p className="text-sm text-muted-foreground">
                      All applications have been processed
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              potentialApplications.map((app) => (
                <Link key={app.id} href={`/admin/${app.id}`} className="block">
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
                            ${app.loanAmount.toLocaleString()}
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
                            {employmentTypeLabels[app.employmentStatus]}
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
                            ${app.savings.toLocaleString()}
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
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Section>
  );
}
