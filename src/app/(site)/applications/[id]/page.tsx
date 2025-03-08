"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Section from "@/components/shared/section";
import { Home, FileText, Upload, AlertCircle, CheckCircle, Clock, Link } from "lucide-react";
import axios from 'axios';
import { Application, Document } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { availableDocumentTypes } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { uploadFile, getPresignedUrl } from "@/lib/upload";
import { getStatusColors } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const { id } = use(params);
  const [application, setApplication] = useState<Application & { documents: Document[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchApplication = async () => {
      if (session?.user?.email) {
        try {
          const { data } = await axios.get(`/api/applications/${id}`);
          setApplication(data);
        } catch (error) {
          console.error("Error fetching application:", error);
        }
      }
      setLoading(false);
    };

    fetchApplication();
  }, [session, id]);

  const handleFileUpload = async (docId: string, file: File) => {
    if (!session?.user?.email) return;

    try {
      setUploadingDocId(docId);
      setUploadProgress(0);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      const key = await uploadFile(session.user.email, file);
      
      if (typeof key === 'string') {
        const signedUrl = await getPresignedUrl(key);
        
        await axios.patch(`/api/applications/${id}`, {
          fileName: file.name,
          fileKey: key,
          fileUrl: signedUrl,
          docId: docId
        });

        // Set progress to 100% when complete
        setUploadProgress(100);
        clearInterval(progressInterval);
        
        // Refresh application data
        const { data } = await axios.get(`/api/applications/${id}`);
        setApplication(data);
        
        // Reset upload state after a short delay
        setTimeout(() => {
          setUploadingDocId(null);
          setUploadProgress(0);
        }, 1000);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadingDocId(null);
      setUploadProgress(0);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "APPROVED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "REJECTED":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "UPLOADED":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Section className="py-24">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    );
  }

  return (
    <Section className="py-12 md:py-24">
      <Card className="shadow-md">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Mortgage Application</CardTitle>
              <CardDescription className="mt-2">
                Track your application progress and upload required documents
              </CardDescription>
            </div>
            {application && (
              <Badge className={`mt-2 md:mt-0 ${getStatusColors(application.status)}`}>
                {application.status}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {application ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Application Details</h3>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        Application ID: <span className="font-mono">{application.id}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Submitted on: {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                <div className="space-y-4">
                  {application.documents.map((doc) => (
                    <div 
                      key={doc.id} 
                      className={`flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg transition-all ${
                        doc.status === "APPROVED" ? "bg-green-50 border-green-200" : 
                        doc.status === "UPLOADED" ? "bg-blue-50 border-blue-200" : 
                        "hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3 md:mb-0">
                        <FileText className={`w-5 h-5 ${
                          doc.status === "APPROVED" ? "text-green-500" : 
                          doc.status === "UPLOADED" ? "text-blue-500" : 
                          "text-muted-foreground"
                        }`} />
                        <div>
                          <p className="font-medium">
                            {availableDocumentTypes.find(type => type.type === doc.documentType)?.label}
                          </p>
                          {doc.fileName && (
                            <p className="text-sm text-blue-600">{doc.fileName}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className={`${getStatusColors(doc.status)} flex items-center gap-1`}>
                                {getStatusIcon(doc.status)}
                                {doc.status}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              {doc.status === "PENDING" && "Document needs to be uploaded"}
                              {doc.status === "UPLOADED" && "Document is under review"}
                              {doc.status === "APPROVED" && "Document has been approved"}
                              {doc.status === "REJECTED" && "Document was rejected and needs to be re-uploaded"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        {doc.status !== "UPLOADED" && doc.status !== "APPROVED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={uploadingDocId === doc.id}
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  handleFileUpload(doc.id, file);
                                }
                              };
                              input.click();
                            }}
                          >
                            {uploadingDocId === doc.id ? (
                              <>
                                <span className="mr-2">Uploading...</span>
                                <Progress value={uploadProgress} className="h-1 w-12" />
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-medium text-muted-foreground">
                No application found
              </p>
              <p className="text-muted-foreground mt-2">
                The application you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/applications">View All Applications</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
