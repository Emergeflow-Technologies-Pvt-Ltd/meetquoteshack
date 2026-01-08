"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, FileText, User } from "lucide-react";
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
import WorkplaceDetails from "./components/WorkplaceDetails";
import { PayPerMatchSuccessModal } from "@/components/ui/paypermatchsucces";
import Image from "next/image";
import { PrequalificationSummary } from "@/components/shared/prequalification-summary";
import { PayPerMatchModal } from "@/components/PayPerMatchModal";

type ApplicationWithRelations = Prisma.ApplicationGetPayload<{
  include: {
    documents: true;
    messages: true;
  };
}>;

export default function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const router = useRouter();
  const [application, setApplication] =
    useState<ApplicationWithRelations | null>(null);
  const [loading, setLoading] = useState(false);
  const { applicationId } = use(params);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Prisma.MessageGetPayload<object>[]>(
    []
  );

  const [prevStatus, setPrevStatus] = useState<LoanStatus | null>(null);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPayPerMatchModal, setShowPayPerMatchModal] = useState(false);

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

  useEffect(() => {
    if (!application) return;

    if (prevStatus === null) {
      setPrevStatus(application.status);
      return;
    }

    if (
      prevStatus === LoanStatus.ASSIGNED_TO_POTENTIAL_LENDER &&
      application.status !== prevStatus
    ) {
      setJustUnlocked(true);
      toast({
        title: "Match unlocked",
        description:
          "Payment confirmed. Full loanee details and documents are now available.",
      });
    }

    if (prevStatus !== application.status) {
      setPrevStatus(application.status);
    }
  }, [application, prevStatus]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const match = url.searchParams.get("match");

    if (match === "success") {
      setShowSuccessModal(true);
    }
  }, []);

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
      await axios.patch(`/api/applications/${applicationId}/lender/reject`, {
        lenderId: session?.user?.id,
      });
      toast({
        title: "Success",
        description: "Application has been rejected",
      });
      router.push("/lender/dashboard");
    } catch (error) {
      console.error("Error rejecting application:", error);
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
      console.error("Error approving application:", error);
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

  const isPotential =
    application.status === LoanStatus.ASSIGNED_TO_POTENTIAL_LENDER;

  const submittedTypes = new Set(
    application.documents.map((doc) => doc.documentType)
  );
  const missingDocumentTypes = (
    Object.keys(documentTypeLabels) as unknown as DocumentType[]
  ).filter((type) => !submittedTypes.has(type as DocumentType));

  return (
    <Section className="py-12">
      <div
        className={`flex flex-col md:mb-6 lg:flex-row lg:gap-6 ${
          application.status === LoanStatus.IN_PROGRESS ||
          application.status === LoanStatus.IN_CHAT
            ? "h-auto lg:h-[88vh]"
            : ""
        }`}
      >
        <div
          className={`flex-1 space-y-4 ${
            application.status === LoanStatus.IN_PROGRESS ||
            application.status === LoanStatus.IN_CHAT
              ? "mb-6 overflow-y-auto lg:pr-4"
              : ""
          }`}
        >
          <div className="sticky top-0 z-20 flex flex-col gap-4 bg-white pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2 self-start sm:self-auto"
              >
                <ChevronLeft />
              </Button>
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Application Details
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  ID: {application.id}
                </p>
              </div>
            </div>

            <div className="space-x-4 sm:flex">
              {isPotential ? (
                <Button
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => setShowPayPerMatchModal(true)}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Pay Per Match"}
                </Button>
              ) : (
                <>
                  {(application.status === LoanStatus.IN_PROGRESS ||
                    application.status === LoanStatus.IN_CHAT) && (
                    <>
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
                    </>
                  )}

                  {application.status !== LoanStatus.IN_PROGRESS &&
                    application.status !== LoanStatus.IN_CHAT &&
                    application.status !== LoanStatus.APPROVED && (
                      <Button
                        variant="default"
                        onClick={handleAcceptApplication}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Accept Application"}
                      </Button>
                    )}
                </>
              )}
            </div>
          </div>

          {justUnlocked && (
            <div className="mb-2 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <span>
                <span className="font-semibold">Match unlocked.</span> Full
                loanee details and documents are now visible.
              </span>
              <span className="ml-3 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                Unlocked
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {isPotential ? (
                <LockedSection
                  title="Personal Information"
                  description="Unlock verified loanee details instantly with Pay Per Match."
                />
              ) : (
                <PersonalDetails application={application} />
              )}

              <FinancialOverview application={application} />

              <PropertyMortgageDetails application={application} />

              {application.hasCoApplicant && (
                <CoApplicantDetails application={application} />
              )}

              <WorkplaceDetails application={application} />
            </div>

            <div className="space-y-6">
              {isPotential ? (
                <LockedDocsAndPrequalSection />
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Submitted Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {application.documents.length > 0 ? (
                          application.documents.map((doc) => (
                            <div key={doc.id} className="rounded-lg border p-4">
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
                          <p className="text-gray-500">
                            No documents submitted
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <PrequalificationSummary application={application} />
                </>
              )}
            </div>
          </div>
        </div>

        {!isPotential && (
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
        )}
      </div>
      <PayPerMatchSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      <PayPerMatchModal
        open={showPayPerMatchModal}
        onClose={() => setShowPayPerMatchModal(false)}
        applicationId={application.id}
        role="LENDER"
      />
    </Section>
  );
}

function LockedDocsAndPrequalSection() {
  return (
    <Card className="relative min-h-[260px] overflow-hidden border border-dashed bg-gray-300/40">
      <div className="pointer-events-none absolute inset-0 bg-white/40 backdrop-blur-sm" />
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="flex flex-col gap-1 text-sm"></CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
          <Image
            src="/lock.svg"
            alt="Locked"
            width={52}
            height={52}
            className="h-13 w-13"
            priority
          />
        </div>
        <p className="max-w-sm text-xs text-gray-600">
          Unlock verified loanee details instantly with Pay Per Match.
        </p>
      </CardContent>
    </Card>
  );
}

function LockedSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="relative flex flex-col overflow-hidden border border-dashed bg-gray-300/40">
      <div className="pointer-events-none absolute inset-0 bg-white/40 backdrop-blur-md" />

      <CardHeader className="relative z-10 bg-white pb-4">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100/70">
          <Image
            src="/lock.svg"
            alt="Locked"
            width={52}
            height={52}
            className="h-13 w-13"
            priority
          />
        </div>
        <p className="max-w-sm text-xs text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}
