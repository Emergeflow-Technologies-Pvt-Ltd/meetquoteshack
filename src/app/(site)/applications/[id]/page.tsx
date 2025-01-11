"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/shared/section";
import { Home, FileText, Upload } from "lucide-react";
import axios from 'axios';
import { MortgageApplication, ApplicationDocument } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { availableDocumentTypes } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { uploadFile, getPresignedUrl } from "@/lib/upload";
import { getStatusColors } from "@/lib/utils";

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

  const handleFileUpload = async (docId: string, file: File) => {
    if (!session?.user?.email) return;

    try {
      const key = await uploadFile(session.user.email, file);
      if (typeof key === 'string') {
        const signedUrl = await getPresignedUrl(key);
        
        await axios.patch(`/api/applications/${id}`, {
          fileName: file.name,
          fileKey: key,
          fileUrl: signedUrl,
          docId: docId
        });

        // Refresh application data
        const { data } = await axios.get(`/api/applications/${id}`);
        setApplication(data);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

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
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                <div className="space-y-4">
                  {application.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          {availableDocumentTypes.find(type => type.type === doc.documentType)?.label}
                          {doc.fileName && (
                            <p className="text-sm text-blue-500">{doc.fileName}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColors(doc.status)}`}>
                          {doc.status}
                        </Badge>
                        {doc.status !== "UPLOADED" && doc.status !== "APPROVED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  handleFileUpload(doc.id, file);
                                }
                              };
                              input.click();
                            }}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                        )}
                      </div>
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
