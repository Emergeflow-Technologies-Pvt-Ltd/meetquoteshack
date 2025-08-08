import prisma from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { LoanStatus } from "@prisma/client";
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

export default async function LenderPoolPage() {
  const session = await getServerSession(authOptions);

  const availableApplications = await prisma.application.findMany({
    where: {
      status: LoanStatus.ASSIGNED_TO_LENDER,
    },
    orderBy: { createdAt: "desc" },
  });

  const acceptedApplications = await prisma.application.findMany({
    where: {
      status: {
        in: [LoanStatus.IN_PROGRESS, LoanStatus.IN_CHAT],
      },
      lender: {
        userId: session?.user?.id,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Section className="py-12">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
        Lender Dashboard
      </h1>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="assigned">
            Available Applications{" "}
            <Badge variant="secondary" className="ml-2">
              {availableApplications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="accepted">
            My Applications
            <Badge variant="secondary" className="ml-2">
              {acceptedApplications.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
          {availableApplications.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {availableApplications.map((app) => (
                <Link
                  key={app.id}
                  href={`/lender/dashboard/${app.id}`}
                  className="block"
                >
                  <Card className="transition-shadow hover:shadow-lg rounded-xl border border-gray-200">
                    <CardHeader className="pb-4 space-y-1">
                      <div className="flex justify-between items-start">
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
                          className="text-xs px-2 py-1 rounded-md"
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
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
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
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8 bg-gray-50 rounded-lg">
              No available applications
            </p>
          )}
        </TabsContent>

        <TabsContent value="accepted">
          {acceptedApplications.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {acceptedApplications.map((app) => (
                <Link
                  key={app.id}
                  href={`/lender/dashboard/${app.id}`}
                  className="block"
                >
                  <Card className="transition-shadow hover:shadow-lg rounded-xl border border-gray-200">
                    <CardHeader className="pb-4 space-y-1">
                      <div className="flex justify-between items-start">
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
                          className="text-xs px-2 py-1 rounded-md"
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
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
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
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8 bg-gray-50 rounded-lg">
              No accepted applications
            </p>
          )}
        </TabsContent>
      </Tabs>
    </Section>
  );
}
