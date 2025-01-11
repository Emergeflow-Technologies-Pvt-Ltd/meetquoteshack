"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, DollarSign, FileText, Home } from "lucide-react";
import Section from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoanStatus } from "@prisma/client";
import { toast } from "@/hooks/use-toast";

type Document = {
  id: string;
  documentType: string;
  status: string;
  fileUrl: string | null;
};

type Application = {
  id: string;
  firstName: string;
  lastName: string;
  currentAddress: string;
  residencyDuration: number;
  housingStatus: string;
  canadianStatus: string;
  housingPayment: number;
  grossIncome: number;
  loanAmount: number | null;
  downPayment: number | null;
  employmentStatus: string;
  workplaceName: string;
  workplacePhone: string;
  workplaceEmail: string;
  loanPurpose: string | null;
  mortgageType: string | null;
  housingType: string | null;
  status: string;
  documents: Document[];
};

export default function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const { applicationId } = use(params);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`/api/applications/${applicationId}`);
        setApplication(response.data);
      } catch (error) {
        console.error("Error fetching application:", error);
        toast({
          title: "Error",
          description: "Failed to load application details",
          variant: "destructive",
        });
      }
    };

    fetchApplication();
  }, [applicationId]);

  const handleAcceptApplication = async () => {
    setLoading(true);
    try {
      await axios.patch(`/api/applications/${applicationId}`, {
        status: LoanStatus.PROGRESSING,
      });
      toast({
        title: "Success",
        description: "Application has been accepted",
      });
      router.push("/lender/applications");
    } catch (error) {
      console.error("Error accepting application:", error);
      toast({
        title: "Error",
        description: "Failed to accept application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!application) {
    return (
      <Section className="py-12">
        <div className="text-center">Loading...</div>
      </Section>
    );
  }

  return (
    <Section className="py-12">
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex justify-end gap-4">
          <Button
            variant="default"
            onClick={handleAcceptApplication}
            disabled={loading}
          >
            {loading ? "Processing..." : "Accept Application"}
          </Button>
        </div>

        {/* Application Overview */}
        <div className="grid grid-cols-1 gap-8">
          {/* Personal & Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>Name: {application.firstName} {application.lastName}</p>
                  <p>Current Address: {application.currentAddress}</p>
                  <p>Residency Duration: {application.residencyDuration} years</p>
                  <p>Housing Status: {application.housingStatus}</p>
                  <p>Canadian Status: {application.canadianStatus}</p>
                </div>
              </CardContent>
            </Card>

            {/* Financial Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>Housing Payment: ${application.housingPayment.toLocaleString()}</p>
                  <p>Gross Income: ${application.grossIncome.toLocaleString()}</p>
                  <p>Loan Amount Requested: ${application.loanAmount?.toLocaleString()}</p>
                  <p>Down Payment: ${application.downPayment?.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employment & Loan Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>Employment Status: {application.employmentStatus}</p>
                  <p>Workplace: {application.workplaceName}</p>
                  <p>Contact: {application.workplacePhone}</p>
                  <p>Email: {application.workplaceEmail}</p>
                </div>
              </CardContent>
            </Card>

            {/* Loan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  Mortgage Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <p>Purpose: {application.loanPurpose}</p>
                    <p>Type: {application.mortgageType}</p>
                    <p>Housing Type: {application.housingType}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Status</h3>
                    <Badge className="bg-green-100 text-green-800">
                      {application.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Submitted Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {application.documents.map((doc) => (
                  <div key={doc.id} className="p-4 border rounded-lg">
                    <p className="font-medium">{doc.documentType}</p>
                    <p className="text-sm text-gray-600">Status: {doc.status}</p>
                    {doc.fileUrl && (
                      <a 
                        href={doc.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
