"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Section from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Shield, User } from "lucide-react";

const ProfilePage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Section className="py-24">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </Section>
    );
  }

  if (!session) {
    return (
      <Section className="py-24">
        <Card className="text-center p-12">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl mb-2">Please sign in to view your profile</h2>
        </Card>
      </Section>
    );
  }

  return (
    <Section className="py-24">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session.user?.image ?? ""} alt={session.user?.name ?? ""} />
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{session.user?.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{session.user?.email}</span>
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
                  <p className="text-sm text-muted-foreground">Email: {session.user?.email}</p>
                  <p className="text-sm text-muted-foreground">Type: Standard User</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">No recent activity</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
};

export default ProfilePage;
