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
import { documentTypeLabels } from "@/components/shared/general.const";
import LenderChat from "../../../../(lender)/lender/dashboard/[applicationId]/components/LenderChat";
import PersonalDetails from "../../../../(lender)/lender/dashboard/[applicationId]/components/PersonalDetails";
import FinancialOverview from "../../../../(lender)/lender/dashboard/[applicationId]/components/FinancialOverview";
import PropertyMortgageDetails from "../../../../(lender)/lender/dashboard/[applicationId]/components/PropertyMortgageDetails";
import CoApplicantDetails from "../../../../(lender)/lender/dashboard/[applicationId]/components/CoApplicantDetails";
import WorkplaceDetails from "../../../../(lender)/lender/dashboard/[applicationId]/components/WorkplaceDetails";
import { useSession } from "next-auth/react";
import { PayPerMatchModal } from "@/components/PayPerMatchModal";
import Image from "next/image";


export default function AgentApplicationDetailsPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const router = useRouter();
  const [application, setApplication] =
    useState<
      Prisma.ApplicationGetPayload<{
        include: {
          documents: true;
          messages: true;
        };
      }> | null
    >(null);
  const { applicationId } = use(params);
  const [messages, setMessages] = useState<
    Prisma.MessageGetPayload<object>[]
  >([]);
  const { data: session } = useSession();
  const [isUnlocked, setIsUnlocked] = useState(false);
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

    const checkUnlock = async () => {
      try {
        const res = await axios.get(
          `/api/agent/unlock-status?applicationId=${application.id}`
        );
        setIsUnlocked(res.data.unlocked);
      } catch (e) {
        console.error("Failed to check agent unlock", e);
      }
    };

    checkUnlock();
  }, [application]);

  if (!application) {
    return (
      <Section className="py-12">
        <div className="text-center">Loading...</div>
      </Section>
    );
  }
  const isAgentLocked =
    session?.user?.role === "AGENT" && !isUnlocked;




  const submittedTypes = new Set(
    application.documents.map((doc) => doc.documentType)
  );
  const missingDocumentTypes = (
    Object.keys(documentTypeLabels) as unknown as DocumentType[]
  ).filter((type) => !submittedTypes.has(type as DocumentType));

  return (
    <Section className="py-12">
      <div className="flex flex-col lg:flex-row lg:gap-6">

        <div
          className={`flex-1 space-y-6 ${application.status === LoanStatus.IN_PROGRESS ||
              application.status === LoanStatus.IN_CHAT
              ? "lg:h-[88vh] lg:overflow-y-auto lg:pr-4"
              : ""
            }`}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sticky top-0 bg-white z-20 pb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/agent/dashboard")}
                className="flex items-center gap-2"
              >
                <ChevronLeft />
              </Button>

              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Application Details
                </h1>
                <p className="text-sm text-gray-500">
                  ID: {application.id}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Current Status
              </span>
              <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                {application.status.replace(/_/g, " ")}
              </span>

              {isAgentLocked && (
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setShowPayPerMatchModal(true)}
                >
                  Pay Per Match
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isAgentLocked ? (
              <LockedSection
                title="Personal Information"
                description="Unlock verified loanee details with Pay Per Match."
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

          {isAgentLocked ? (
            <LockedDocsSection />
          ) : (
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
          )}
        </div>

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

      <PayPerMatchModal
        open={showPayPerMatchModal}
        onClose={() => setShowPayPerMatchModal(false)}
        applicationId={application.id}
        role="AGENT"
      />
    </Section>
  );

}

function LockedDocsSection() {
  return (
    <Card className="relative overflow-hidden border border-dashed bg-gray-200/50 min-h-[220px]">
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      <CardContent className="relative z-10 flex flex-col items-center justify-center py-16 text-center">
        <Image src="/lock.svg" alt="Locked" width={48} height={48} />
        <p className="mt-3 text-xs text-gray-600 max-w-sm">
          Documents and prequalification are locked. Unlock with Pay Per Match.
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
    <Card className="relative overflow-hidden border border-dashed bg-gray-200/50">
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 flex flex-col items-center text-center py-12">
        <Image src="/lock.svg" alt="Locked" width={48} height={48} />
        <p className="mt-3 text-xs text-gray-600 max-w-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
