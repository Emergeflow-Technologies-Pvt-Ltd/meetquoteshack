import { getServerSession } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Section from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Mail,
  Shield,
  Home,
  CheckCircle,
  XCircle,
} from "lucide-react";
import prisma from "@/lib/db";
import Link from "next/link";
import { getStatusColors } from "@/lib/utils";
import { LoanStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  const applications = await prisma.application.findMany({
    where: {
      userId: session?.user?.id || "",
    },
    select: {
      id: true,
      createdAt: true,
      status: true,
      mortgageDownPayment: true,
      loanAmount: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Section className="py-12 max-w-7xl mx-auto px-4">
      <div className="space-y-8">
        {/* Profile Header Card */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage
                  src={session?.user?.image ?? ""}
                  alt={session?.user?.name ?? ""}
                />
                <AvatarFallback className="text-2xl">
                  {session?.user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-gray-900">
                  {session?.user?.name}
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-5 h-5" />
                    <span>{session?.user?.email}</span>
                  </div>
                  <div className="flex gap-3">
                    <Badge className="px-3 py-1 bg-green-100 text-green-800 hover:bg-green-200">
                      <Shield className="w-4 h-4 mr-1" />
                      Verified Account
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      Joined{" "}
                      {new Date(
                        session?.user?.id
                          ? session.user.id.split("_")[1]
                          : Date.now()
                      ).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Account Information */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">
                    Personal Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span>{" "}
                      {session?.user?.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Account Type:</span>{" "}
                      Standard User
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Status:</span> Active
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mortgage Applications */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Mortgage Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <Link
                      key={application.id}
                      href={`/applications/${application.id}`}
                      className="block"
                    >
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">
                                Application #{application.id.slice(0, 8)}
                              </h3>
                              <Badge
                                className={getStatusColors(application.status)}
                              >
                                {application.status === LoanStatus.ACCEPTED && (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                )}
                                {application.status === LoanStatus.REJECTED && (
                                  <XCircle className="w-3 h-3 mr-1" />
                                )}
                                {application.status}
                              </Badge>
                            </div>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span>
                                Loan Amount: $
                                {application.loanAmount?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            Submitted:{" "}
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
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
                    No mortgage applications yet
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Start your first mortgage application today
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
