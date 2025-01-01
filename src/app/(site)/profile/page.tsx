import { getServerSession } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Section from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Shield, Home } from "lucide-react";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession();

  const mortgageApplications = session?.user?.email
    ? await prisma.mortgageApplication.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
          createdAt: true,
        },
      })
    : [];
  console.log(mortgageApplications);
  return (
    <Section className="py-24">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={session?.user?.image ?? ""}
                alt={session?.user?.name ?? ""}
              />
              <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{session?.user?.email}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">
                  <Shield className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
                <Badge variant="outline">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  Member
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Email: {session?.user?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Type: Standard User
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Loan Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {mortgageApplications.length > 0 ? (
                  <div className="space-y-4">
                    {mortgageApplications.map((application) => (
                      <div
                        key={application.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              <Link href={`/applications/${application.id}`}>
                                Mortgage Application
                              </Link>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Started: {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No current loan applications
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
