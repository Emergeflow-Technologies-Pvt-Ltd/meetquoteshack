"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, DollarSign, FileText, Home, Plus } from "lucide-react";
import Section from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoanStatus } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import {
  documentTypeLabels,
  loanTypeLabels,
} from "@/components/shared/general.const";
import LenderChat from "./components/LenderChat";

type Document = {
  id: string;
  documentType: string;
  status: string;
  fileUrl: string | null;
};

type Application = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;

  // Address and residency
  currentAddress: string;
  previousAddress?: string;
  yearsAtCurrentAddress: number;
  residencyStatus: string;

  // Personal info
  dateOfBirth: string;
  maritalStatus: string;
  personalPhone: string;
  personalEmail: string;
  hasBankruptcy: boolean;

  // Housing info
  housingStatus: string;
  housingPayment: number;

  // Employment info
  employmentStatus: string;
  workplaceName: string;
  workplaceAddress: string;
  workplacePhone: string;
  workplaceEmail: string;
  workplaceDuration: number;

  // Financials
  grossIncome: number;
  monthlyDebts: number;
  savings: number;
  otherIncome: boolean;
  childCareBenefit: boolean;
  sin?: number;

  // Co-applicant
  hasCoApplicant: boolean;
  coApplicantFullName?: string;
  coApplicantDateOfBirth?: string;
  coApplicantAddress?: string;
  coApplicantPhone?: number;
  coApplicantEmail?: string;

  // Loan details
  loanType: string;
  loanAmount: number;
  loanPurpose?: string | null;
  mortgageType?: string | null;
  estimatedPropertyValue?: number;
  houseType?: string | null;
  downPayment?: string | null;
  tradeInCurrentVehicle?: boolean;

  // General loans
  generalEducationLevel?: string | null;
  generalFieldOfStudy?: string | null;

  // Status
  status: string;
  createdAt: string;
  updatedAt: string;

  // Relations
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
  const { data: session } = useSession();
  const [messages, setMessages] = useState<
    { id: string; content: string; senderRole: string; createdAt: string }[]
  >([]);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`/api/applications/${applicationId}`);
        setApplication(response.data.application);
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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `/api/messages?applicationId=${applicationId}`
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [applicationId]);

  const handleAcceptApplication = async () => {
    setLoading(true);
    try {
      await axios.patch(`/api/applications/${applicationId}/accept`, {
        status: LoanStatus.IN_PROGRESS,
        lenderId: session?.user?.id,
      });
      toast({
        title: "Success",
        description: "Application has been accepted",
      });
      router.push("/lender/dashboard");
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

  const submittedTypes = new Set(
    application.documents.map((doc) => doc.documentType)
  );
  const missingDocumentTypes = Object.keys(documentTypeLabels).filter(
    (type) => !submittedTypes.has(type)
  );

  return (
    <Section className="py-12">
      <div
        className={`flex flex-col lg:flex-row lg:gap-6 md:mb-6 ${
          application.status === LoanStatus.IN_PROGRESS ||
          application.status === LoanStatus.IN_CHAT
            ? "h-auto lg:h-[88vh]"
            : ""
        }`}
      >
        {/* LEFT SIDE: Scrollable cards */}
        <div
          className={`flex-1 space-y-8 ${
            application.status === LoanStatus.IN_PROGRESS ||
            application.status === LoanStatus.IN_CHAT
              ? "overflow-y-auto lg:pr-4 mb-6"
              : ""
          }`}
        >
          {/* Header + Accept Button */}
          <div className="flex justify-between gap-4 sticky top-0 bg-white z-10 pb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Application Details
              </h1>
              <p className="mt-1 text-sm text-gray-500">ID: {application.id}</p>
            </div>

            {/* Hide Accept button if IN_PROGRESS */}
            {application.status !== LoanStatus.IN_PROGRESS &&
              application.status !== LoanStatus.IN_CHAT && (
                <Button
                  variant="default"
                  onClick={handleAcceptApplication}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Accept Application"}
                </Button>
              )}
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-700">
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                      <span className="text-gray-500">Name</span>
                      <p className="font-medium">
                        {application.firstName} {application.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date of Birth</span>
                      <p className="font-medium">
                        {new Date(application.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Address</span>
                      <p className="font-medium">
                        {application.currentAddress}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Previous Address</span>
                      <p className="font-medium">
                        {application.previousAddress || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        Years at Current Address
                      </span>
                      <p className="font-medium">
                        {application.yearsAtCurrentAddress}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Housing Status</span>
                      <p className="font-medium">{application.housingStatus}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Housing Payment</span>
                      <p className="font-medium">
                        ${Number(application.housingPayment).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Canadian Status</span>
                      <p className="font-medium">
                        {application.residencyStatus}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Marital Status</span>
                      <p className="font-medium">{application.maritalStatus}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone</span>
                      <p className="font-medium">{application.personalPhone}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email</span>
                      <p className="font-medium">{application.personalEmail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-700">
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                      <span className="text-gray-500">Gross Income</span>
                      <p className="font-medium">
                        ${Number(application.grossIncome).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Monthly Debts</span>
                      <p className="font-medium">
                        ${Number(application.monthlyDebts).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Savings</span>
                      <p className="font-medium">
                        ${Number(application.savings).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Other Income</span>
                      <p className="font-medium">
                        {application.otherIncome ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Child Care Benefit</span>
                      <p className="font-medium">
                        {application.childCareBenefit ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">SIN</span>
                      <p className="font-medium">{application.sin || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Has Bankruptcy?</span>
                      <p className="font-medium">
                        {application.hasBankruptcy ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Loan Amount</span>
                      <p className="font-medium">
                        ${Number(application.loanAmount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Loan Type</span>
                      <p className="font-medium">
                        {loanTypeLabels[application.loanType]}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Loan Purpose</span>
                      <p className="font-medium">
                        {application.loanPurpose || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property & Mortgage Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    Property & Mortgage Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-700">
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                      <span className="text-gray-500">Mortgage Type</span>
                      <p className="font-medium">
                        {application.mortgageType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Property Type</span>
                      <p className="font-medium">
                        {application.houseType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        Estimated Property Value
                      </span>
                      <p className="font-medium">
                        {application.estimatedPropertyValue
                          ? `$${Number(
                              application.estimatedPropertyValue
                            ).toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Down Payment</span>
                      <p className="font-medium">
                        {application.downPayment || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        Trade-in Current Vehicle
                      </span>
                      <p className="font-medium">
                        {application.tradeInCurrentVehicle ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Co-applicant Details */}
              {application.hasCoApplicant && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Co-applicant Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-700">
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <div>
                        <span className="text-gray-500">Name</span>
                        <p className="font-medium">
                          {application.coApplicantFullName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Date of Birth</span>
                        <p className="font-medium">
                          {application.coApplicantDateOfBirth
                            ? new Date(
                                application.coApplicantDateOfBirth
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Address</span>
                        <p className="font-medium">
                          {application.coApplicantAddress || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone</span>
                        <p className="font-medium">
                          {application.coApplicantPhone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email</span>
                        <p className="font-medium">
                          {application.coApplicantEmail || "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Submitted Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {application.documents.length > 0 ? (
                    application.documents.map((doc) => (
                      <div key={doc.id} className="p-4 border rounded-lg">
                        <p className="font-medium">
                          {documentTypeLabels[doc.documentType]}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {doc.status}
                        </p>
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
                    ))
                  ) : (
                    <p className="text-gray-500">No documents submitted</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT SIDE: Chat Box */}
        <LenderChat
          application={application}
          setApplication={setApplication}
          applicationId={applicationId}
          messages={messages}
          setMessages={setMessages}
          missingDocumentTypes={missingDocumentTypes}
          documentTypeLabels={documentTypeLabels}
          LoanStatus={LoanStatus}
        />
      </div>
    </Section>
  );
}
