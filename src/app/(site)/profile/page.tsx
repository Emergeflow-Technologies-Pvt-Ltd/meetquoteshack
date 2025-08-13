import { getServerSession } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield } from "lucide-react";

import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <Section className="py-12 max-w-7xl mx-auto px-4">
      <div className="space-y-8">
        {/* Profile Header Card */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
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
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className=" gap-6">
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
        </div>
      </div>
    </Section>
  );
}
