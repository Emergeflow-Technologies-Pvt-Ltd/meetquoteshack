import Link from "next/link";
import prisma from "@/lib/db";
import { LoanStatus, DocumentStatus } from "@prisma/client";
import Section from "@/components/shared/section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, FileCheck, AlertCircle } from "lucide-react";

export default async function AdminPage() {
  // Fetch applications that need review
  const applications = await prisma.application.findMany({
    where: {
      status: {
        in: [LoanStatus.PROCESSING, LoanStatus.PROGRESSING]
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch documents that need review
  const documentsNeedingReview = await prisma.document.findMany({
    where: {
      status: DocumentStatus.UPLOADED,
    },
    include: {
      application: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          type: true,
        },
      },
    },
    orderBy: {
      uploadedAt: 'desc',
    },
    take: 10, // Limit to 10 most recent documents
  });

  return (
    <Section className="mt-12">
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="applications">
            Applications
            <Badge variant="secondary" className="ml-2">
              {applications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="documents">
            Documents
            <Badge variant="secondary" className="ml-2">
              {documentsNeedingReview.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications">
          <h2 className="text-2xl font-bold mb-6">Loan Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-lg font-medium">No applications to review</p>
                    <p className="text-sm text-muted-foreground">
                      All applications have been processed
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Link
                  key={app.id}
                  href={`/admin/${app.id}`}
                  className="block"
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{app.firstName} {app.lastName}</CardTitle>
                        <Badge variant={app.status === "PROCESSING" ? "default" : "secondary"}>
                          {app.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Submitted: {app.createdAt.toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">{app.currentAddress}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>{app.type} Loan</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <h2 className="text-2xl font-bold mb-6">Documents Needing Review</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentsNeedingReview.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <FileCheck className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-lg font-medium">No documents to review</p>
                    <p className="text-sm text-muted-foreground">
                      All documents have been reviewed
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              documentsNeedingReview.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/admin/${doc.application?.id}`}
                  className="block"
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {doc.application?.firstName} {doc.application?.lastName}
                        </CardTitle>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          Needs Review
                        </Badge>
                      </div>
                      <CardDescription>
                        Uploaded: {doc.uploadedAt.toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium mb-2">
                        {doc.documentType.replace(/_/g, " ")}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>{doc.application?.type} Loan</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Section>
  );
}
