"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/shared/section";
import { Home } from "lucide-react";
import axios from 'axios';
import { MortgageApplication } from "@prisma/client";

export default function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const { id } = use(params);
  const [application, setApplication] = useState<MortgageApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      if (session?.user?.email) {
        const { data } = await axios.get(`/api/applications/${id}`);
        setApplication(data);
      }
      setLoading(false);
    };

    fetchApplication();
  }, [session, id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Section className="py-24">
      <Card>
        <CardHeader>
          <CardTitle>Mortgage Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {application ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Application ID: {application.id}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No application found
            </p>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
