"use client"

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoanStatus, MortgageApplication, User } from "@prisma/client";
import Section from "@/components/shared/section";

interface Props {
  params: Promise<{
    applicationId: string;
  }>;
}

type ApplicationWithUser = MortgageApplication & {
  user: User;
  documentKey?: string;
  estimatedPropertyValue?: number;
  intendedPropertyAddress?: string;
}

export default function ApplicationPage({ params }: Props) {
  const applicationId = use(params);
  const [application, setApplication] = useState<ApplicationWithUser | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/applications/${applicationId.applicationId}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch application');
        }
        
        const app = await response.json();
        setApplication(app);

        if (app.documentKey) {
          const docResponse = await fetch(`/api/documents/${app.documentKey}`);
          if (docResponse.ok) {
            const { url } = await docResponse.json();
            setDocumentUrl(url);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [applicationId]);

  if (!application) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-lg text-muted-foreground">
          Loading application details...
        </div>
      </div>
    );
  }

  const getStatusColor = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.VERIFIED:
        return "bg-green-500 hover:bg-green-600 text-white";
      case LoanStatus.REJECTED:
        return "bg-destructive hover:bg-destructive/90 text-white";
      default:
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
    }
  };

  const handleStatusUpdate = async (newStatus: LoanStatus) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      });
      if (response.ok) {
        setApplication(prev => prev ? {...prev, status: newStatus} : null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Application Details</CardTitle>
            <Badge variant="secondary" className={`${getStatusColor(application.status)} text-sm px-4 py-1`}>
              {application.status.toLowerCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <p className="text-sm flex justify-between">
                    <span className="text-muted-foreground">Full Name:</span>
                    <span className="font-medium">{application.firstName} {application.lastName}</span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-muted-foreground">Current Address:</span>
                    <span className="font-medium">{application.currentAddress}</span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-muted-foreground">Employment:</span>
                    <span className="font-medium">{application.workplaceName}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Loan Details</h3>
                <div className="space-y-3">
                  <p className="text-sm flex justify-between">
                    <span className="text-muted-foreground">Loan Amount:</span>
                    <span className="font-medium">${application.loanAmount?.toLocaleString() || 'Not specified'}</span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-muted-foreground">Down Payment:</span>
                    <span className="font-medium">${application.downPayment?.toLocaleString() || 'Not specified'}</span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-muted-foreground">Loan Purpose:</span>
                    <span className="font-medium capitalize">{application.loanPurpose?.toLowerCase() || 'Not specified'}</span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-muted-foreground">Mortgage Type:</span>
                    <span className="font-medium capitalize">{application.mortgageType?.toLowerCase() || 'Not specified'}</span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-muted-foreground">Housing Type:</span>
                    <span className="font-medium capitalize">{application.housingType?.toLowerCase() || 'Not specified'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {documentUrl && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Documents</h3>
              <Button variant="outline" asChild className="hover:bg-gray-100">
                <a 
                  href={documentUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  View Uploaded Document
                </a>
              </Button>
            </div>
          )}

          <div className="mt-8 flex gap-4 justify-end">
            <Button 
              variant="default"
              onClick={() => handleStatusUpdate(LoanStatus.VERIFIED)}
              disabled={isLoading || application.status === LoanStatus.VERIFIED}
              className="min-w-[150px]"
            >
              {isLoading ? 'Processing...' : 'Approve Application'}
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleStatusUpdate(LoanStatus.REJECTED)}
              disabled={isLoading || application.status === LoanStatus.REJECTED}
              className="min-w-[150px]"
            >
              {isLoading ? 'Processing...' : 'Reject Application'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
