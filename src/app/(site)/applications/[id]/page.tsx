"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/shared/section";
import { Home, FileText } from "lucide-react";
import axios from 'axios';
import { MortgageApplication, ApplicationDocument } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { documentTypes } from "@/lib/constants";

export default function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const { id } = use(params);
  const [application, setApplication] = useState<MortgageApplication & { documents: ApplicationDocument[] } | null>(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500';
      case 'REJECTED':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

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
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                <div className="space-y-4">
                  {application.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          {documentTypes.find(type => type.value === doc.documentType)?.label}
                          {doc.fileName && (
                            <p className="text-sm text-blue-500">{doc.fileName}</p>
                          )}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
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
