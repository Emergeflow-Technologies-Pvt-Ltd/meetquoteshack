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
import AgentInviteCode from "./[applicationId]/components/AgentInviteCode";
import AgentCalendlyLink from "./[applicationId]/components/AgentCalendlyLink";

export default async function AgentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const agent = await prisma.agent.findUnique({
    where: { userId: session.user.id },
  });

  if (!agent) {
    return (
      <Section>
        <p className="text-center mt-16 text-gray-600">
          No agent profile found for this user.
        </p>
      </Section>
    );
  }

  // const agentUnlocks = await prisma.agentApplicationUnlock.findMany({
  //   where: {
  //     agentId: agent.id,
  //   },
  //   select: {
  //     applicationId: true,
  //   },
  // });

  // const unlockedApplicationIds = new Set(
  //   agentUnlocks.map((u) => u.applicationId)
  // );


  const assignedApplications = await prisma.application.findMany({
    where: {
      agentId: agent.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const joinedUsingAgentCode = await prisma.application.findMany({
    where: {
      agentCode: agent.agentCode,
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

  const renderApplicationsGrid = (
    apps: Awaited<typeof assignedApplications>,
    emptyText: string
  ) => {
    if (apps.length === 0) {
      return (
        <p className="text-gray-600 text-center mt-16 py-8 bg-gray-50 rounded-lg">
          {emptyText}
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-16 sm:mt-0 gap-4">
        {apps.map((app) => (
          <Link
            key={app.id}
            href={`/agent/dashboard/${app.id}`}
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
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      className="text-xs px-2 py-1 rounded-md"
                      style={{
                        color: getTextColorLoanStatus(app.status),
                        backgroundColor: getBackgroundColorLoanStatus(app.status),
                      }}
                    >
                      {lenderStatusLabelMap[app.status] ??
                        app.status.replace(/_/g, " ")}
                    </Badge>
                  </div>

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
    );
  };

  return (
    <Section className="py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
          Agent Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <AgentInviteCode inviteCode={agent.agentCode!} />
        <AgentCalendlyLink calendlyUrl={agent.calendlyUrl ?? ""} />
      </div>

      <Tabs defaultValue="joined" className="w-full">
        <TabsList className="mb-6 mt-8 flex justify-start sm:flex-row gap-2 sm:gap-4">

          <TabsTrigger value="joined" className="w-full sm:w-auto">
            Joined with My Agent Code
            <Badge variant="secondary" className="ml-2">
              {joinedUsingAgentCode.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger value="assigned" className="w-full sm:w-auto">
            Applications Assigned to Me
            <Badge variant="secondary" className="ml-2">
              {assignedApplications.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="joined">
          {renderApplicationsGrid(
            joinedUsingAgentCode,
            "No applications have been submitted using your agent code yet."
          )}
        </TabsContent>


        <TabsContent value="assigned">
          {renderApplicationsGrid(
            assignedApplications,
            "No applications have been assigned to you yet."
          )}
        </TabsContent>
      </Tabs>
    </Section>
  );
}
