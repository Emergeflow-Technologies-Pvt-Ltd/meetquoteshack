import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, CheckCircle } from "lucide-react";
import Link from "next/link";
import { LoanStatus } from "@prisma/client";
import Section from "@/components/shared/section";

export default async function LenderPoolPage() {
  const acceptedApplications = await prisma.mortgageApplication.findMany({
    where: {
      status: LoanStatus.ACCEPTED
    },
    select: {
      id: true,
      createdAt: true,
      status: true,
      loanAmount: true,
      firstName: true,
      lastName: true,
      loanPurpose: true,
      mortgageType: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <Section className="py-12">
      <div className="grid grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Available Mortgage Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {acceptedApplications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {acceptedApplications.map((application) => (
                  <Link
                    key={application.id}
                    href={`/lender/applications/${application.id}`}
                    className="block"
                  >
                    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">
                              {application.firstName} {application.lastName}
                            </h3>
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {application.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                            <span>
                              Loan Amount: ${application.loanAmount?.toLocaleString()}
                            </span>
                            <span>Purpose: {application.loanPurpose}</span>
                            <span>Type: {application.mortgageType}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          Posted: {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  No available mortgage applications
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Check back later for new applications
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
