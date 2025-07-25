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
import { FileText, AlertCircle } from "lucide-react";
import {
  getBackgroundColorLoanStatus,
  getTextColorLoanStatus,
} from "@/components/shared/chips";

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
        in: [LoanStatus.ASSIGNED_TO_LENDER],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Section className="mt-12">
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="applications">
            Open Applications
            <Badge variant="secondary" className="ml-2">
              {applications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="assigned">
            Assigned Applications
            <Badge variant="secondary" className="ml-2">
              {assignedApplications.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <h2 className="text-2xl font-bold mb-6">Open Loan Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
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
                            ${app.loanAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Loan Type</span>
                          <p className="font-medium">{app.loanType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Employment</span>
                          <p className="font-medium">{app.employmentStatus}</p>
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

        <TabsContent value="assigned">
          <h2 className="text-2xl font-bold mb-6">
            Assigned Loan Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedApplications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
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
                            ${app.loanAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Loan Type</span>
                          <p className="font-medium">{app.loanType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Employment</span>
                          <p className="font-medium">{app.employmentStatus}</p>
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
