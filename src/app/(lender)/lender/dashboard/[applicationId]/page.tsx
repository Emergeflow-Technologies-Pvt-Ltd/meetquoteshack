"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, FileText } from "lucide-react";
import Section from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DocumentType, LoanStatus, Prisma } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { documentTypeLabels } from "@/components/shared/general.const";
import LenderChat from "./components/LenderChat";
import PersonalDetails from "./components/PersonalDetails";
import FinancialOverview from "./components/FinancialOverview";
import PropertyMortgageDetails from "./components/PropertyMortgageDetails";
import CoApplicantDetails from "./components/CoApplicantDetails";

export default function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const router = useRouter();
  const [application, setApplication] = useState<Prisma.ApplicationGetPayload<{
    include: {
      documents: true;
      messages: true;
    };
  }> | null>(null);
  const [loading, setLoading] = useState(false);
  const { applicationId } = use(params);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Prisma.MessageGetPayload<object>[]>(
    []
  );

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

  const handleRejectApplication = async () => {
    setLoading(true);
    try {
      await axios.patch(`/api/applications/${applicationId}/accept`, {
        status: LoanStatus.OPEN,
        lenderId: session?.user?.id,
      });
      toast({
        title: "Success",
        description: "Application has been rejected",
      });
      router.push("/lender/dashboard");
    } catch (error) {
      console.error("Error accepting application:", error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveApplication = async () => {
    setLoading(true);
    try {
      await axios.patch(`/api/applications/${applicationId}/accept`, {
        status: LoanStatus.APPROVED,
        lenderId: session?.user?.id,
      });
      toast({
        title: "Success",
        description: "Application has been approved",
      });
      router.push("/lender/dashboard");
    } catch (error) {
      console.error("Error accepting application:", error);
      toast({
        title: "Error",
        description: "Failed to approve application",
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
  const missingDocumentTypes = (
    Object.keys(documentTypeLabels) as unknown as DocumentType[]
  ).filter((type) => !submittedTypes.has(type as DocumentType));

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
          <div className="flex justify-between items-center gap-4 sticky top-0 bg-white z-10 pb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ChevronLeft />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Application Details
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  ID: {application.id}
                </p>
              </div>
            </div>

            {(application.status === LoanStatus.IN_PROGRESS ||
              application.status === LoanStatus.IN_CHAT) && (
              <div className="flex space-x-4">
                <Button
                  variant="default"
                  onClick={handleApproveApplication}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Approve Loan"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectApplication}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Reject Loan"}
                </Button>
              </div>
            )}

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
              <PersonalDetails application={application} />

              {/* Financial Overview */}
              <FinancialOverview application={application} />

              {/* Property & Mortgage Details */}
              <PropertyMortgageDetails application={application} />

              {/* Co-applicant Details */}
              {application.hasCoApplicant && (
                <CoApplicantDetails application={application} />
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
