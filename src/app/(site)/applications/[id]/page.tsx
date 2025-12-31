//src\app\(site)\applications\[id]\page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/shared/section";
import Image from "next/image";
import {
  Home,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  DollarSign,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";
import { Application, Document, LoanStatus, Message } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { availableDocumentTypes } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { uploadFile, getPresignedUrl } from "@/lib/upload";
import { getStatusColors } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  applicationStatusLabels,
  downPaymentLabels,
  housingStatusTypeLabels,
  loanTypeLabels,
  maritalStatusLabels,
  propertyTypeLabels,
  residencyStatusTypeLabels,
  vehicleTypeLabels,
} from "@/components/shared/general.const";
import {
  getBackgroundColorLoanStatus,
  getTextColorLoanStatus,
} from "@/components/shared/chips";
import LoaneeChat from "../components/LoaneeChat";
import { useRouter } from "next/navigation";
import { PrequalificationSummary } from "@/components/shared/prequalification-summary";

export default function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const { id } = use(params);

  const [application, setApplication] = useState<
    | (Application & {
      documents: Document[];
      lender?: {
        user?: { id: string };
      } | null;
      agent?: {
        id: string;
        name: string;
        email: string;
        phone: string;
      } | null;
    })
    | null
  >(null);


  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const [loadingApp, setLoadingApp] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [canAccessPrequalification, setCanAccessPrequalification] = useState(false);


  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch Application + Messages
  useEffect(() => {
    const fetchApplication = async () => {
      if (!session?.user?.email) return;

      try {
        setLoadingApp(true);

        const res = await axios.get(`/api/applications/${id}`);



        const applicationData = res.data?.application ?? res.data;

        setApplication(applicationData ?? null);


        // ✅ Safe status check
        if (applicationData?.status === "IN_CHAT") {
          setLoadingMessages(true);
          const msgRes = await axios.get(
            `/api/messages?applicationId=${id}`
          );
          setMessages(msgRes.data);
          setLoadingMessages(false);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
        setApplication(null);
        setCanAccessPrequalification(false);
      } finally {
        setLoadingApp(false);
      }
    };

    fetchApplication();
  }, [session, id]);


  useEffect(() => {
    if (!session?.user) return;

    const fetchAccess = async () => {
      try {
        const res = await axios.get("/api/subscription/access");

        setCanAccessPrequalification(
          Boolean(res.data?.canAccessPrequalification)
        );
      } catch (err) {
        console.error("Failed to fetch access", err);
        setCanAccessPrequalification(false);
      }
    };

    fetchAccess();
  }, [session]);



  useEffect(() => {
  }, [application]);


  const lenderUserId = application?.lender?.user?.id;



  type AssignedAgent = {
    id: string;
    name: string;
    email: string;
    phone: string;
    agentCode?: string | null;
    calendlyUrl?: string | null;
  };

  const [assignedAgent, setAssignedAgent] = useState<AssignedAgent | null>(null);
  const [agentLoading, setAgentLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignedAgent() {
      try {
        const res = await fetch(
          `/api/applications/${id}/agent`
        );

        if (!res.ok) {
          setAssignedAgent(null);
          return;
        }

        const data = await res.json();
        setAssignedAgent(data.agent);
      } catch {
        setAssignedAgent(null);
      } finally {
        setAgentLoading(false);
      }
    }

    fetchAssignedAgent();
  }, [application, id]);

  const handleFileUpload = async (docId: string, file: File) => {
    if (!session?.user?.email) return;

    try {
      setUploadingDocId(docId);
      setUploadProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);

      const key = await uploadFile(session.user.email, file);

      if (typeof key === "string") {
        const signedUrl = await getPresignedUrl(key);

        await axios.patch(`/api/applications/${id}`, {
          fileName: file.name,
          fileKey: key,
          fileUrl: signedUrl,
          docId: docId,
        });

        await axios.post(`/api/notifications/submitted`, {
          applicationId: id,
          ...(lenderUserId && { lenderUserId }),
        });

        setUploadProgress(100);
        clearInterval(progressInterval);

        const { data } = await axios.get(`/api/applications/${id}`);
        setApplication(data);

        setTimeout(() => {
          setUploadingDocId(null);
          setUploadProgress(0);
        }, 1000);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadingDocId(null);
      setUploadProgress(0);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  if (loadingApp || loadingMessages) {
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
      <div
        className={`flex flex-col lg:flex-row lg:gap-6 md:mb-6 ${application?.status === LoanStatus.IN_CHAT ? "h-auto lg:h-[88vh]" : ""
          }`}
      >
        <div
          className={`flex-1 space-y-8 ${application?.status === LoanStatus.IN_CHAT
            ? "overflow-y-auto lg:pr-4 mb-6"
            : ""
            }`}
        >
          {!agentLoading && assignedAgent && (
            <Card className="border-violet-500 bg-violet-50/60">
              <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6">

                {/* Left */}
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white text-xl font-semibold">
                    {assignedAgent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Assigned Agent</p>
                    <h2 className="text-lg font-semibold text-violet-700">
                      {assignedAgent.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {assignedAgent.email} • {assignedAgent.phone}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      router.push(`/applications/agent/${assignedAgent.id}`)
                    }
                  >
                    View Agent Details
                  </Button>

                  

                </div>

              </CardContent>
            </Card>
          )}


          <div className="flex justify-between gap-4 sticky top-0 bg-white z-10 pb-4">
            <div className="flex items-center gap-4">
              <button className="rounded-full" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Application Details
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  ID: {application?.id}
                </p>
              </div>
            </div>
            <Badge
              className="px-3 py-1 text-sm font-medium"
              style={{
                color: getTextColorLoanStatus(
                  application?.status as LoanStatus
                ),
                backgroundColor: getBackgroundColorLoanStatus(
                  application?.status as LoanStatus
                ),
              }}
            >
              {application?.status
                ? applicationStatusLabels[application.status]
                : null}
            </Badge>
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
                        {application?.firstName} {application?.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        Date of Birth (mm-dd-yy)
                      </span>
                      <p className="font-medium">
                        {application?.dateOfBirth
                          ? new Date(
                            application.dateOfBirth
                          ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Address</span>
                      <p className="font-medium">
                        {application?.currentAddress}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Previous Address</span>
                      <p className="font-medium">
                        {application?.previousAddress || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        Current Address Duration
                      </span>
                      <p className="font-medium">
                        {application?.yearsAtCurrentAddress}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Housing Status</span>
                      <p className="font-medium">
                        {application?.housingStatus
                          ? housingStatusTypeLabels[application.housingStatus]
                          : null}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Housing Payment</span>
                      <p className="font-medium">
                        ${Number(application?.housingPayment).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Canadian Status</span>
                      <p className="font-medium">
                        {application?.residencyStatus
                          ? residencyStatusTypeLabels[
                          application.residencyStatus
                          ]
                          : null}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Marital Status</span>
                      <p className="font-medium">
                        {application?.maritalStatus
                          ? maritalStatusLabels[application.maritalStatus]
                          : null}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone</span>
                      <p className="font-medium">
                        {application?.personalPhone}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email</span>
                      <p className="font-medium">
                        {application?.personalEmail}
                      </p>
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
                        ${Number(application?.grossIncome).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Monthly Debts</span>
                      <p className="font-medium">
                        ${Number(application?.monthlyDebts).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Savings</span>
                      <p className="font-medium">
                        ${Number(application?.savings).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Other Income</span>
                      <p className="font-medium">
                        {application?.otherIncome ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Child Care Benefit</span>
                      <p className="font-medium">
                        {application?.childCareBenefit ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">SIN</span>
                      <p className="font-medium">{application?.sin || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Has Bankruptcy?</span>
                      <p className="font-medium">
                        {application?.hasBankruptcy ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Loan Amount</span>
                      <p className="font-medium">
                        ${Number(application?.loanAmount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Loan Type</span>
                      <p className="font-medium">
                        {application?.loanType
                          ? loanTypeLabels[application.loanType]
                          : "N/A"}
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
                      <span className="text-gray-500">Property Type</span>
                      <p className="font-medium">
                        {application?.houseType
                          ? propertyTypeLabels[application.houseType]
                          : null}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        Estimated Property Value
                      </span>
                      <p className="font-medium">
                        {application?.estimatedPropertyValue
                          ? `$${Number(
                            application.estimatedPropertyValue
                          ).toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Down Payment</span>
                      <p className="font-medium">
                        {application?.downPayment
                          ? downPaymentLabels[application.downPayment]
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        Trade-in Current Vehicle
                      </span>
                      <p className="font-medium">
                        {application?.tradeInCurrentVehicle ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Type of Vehicle?</span>
                      <p className="font-medium">
                        {application?.vehicleType
                          ? vehicleTypeLabels[application.vehicleType]
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Co-applicant Details */}
              {application?.hasCoApplicant && (
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
                        <span className="text-gray-500">
                          Date of Birth (mm-dd-yy)
                        </span>
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
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application?.documents?.map((doc) => (
                    <div
                      key={doc.id}
                      className={`flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg transition-all ${doc.status === "APPROVED"
                        ? "bg-green-50 border-green-200"
                        : doc.status === "UPLOADED"
                          ? "bg-blue-50 border-blue-200"
                          : "hover:border-primary/50"
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-3 md:mb-0">
                        <FileText
                          className={`w-5 h-5 ${doc.status === "APPROVED"
                            ? "text-green-500"
                            : doc.status === "UPLOADED"
                              ? "text-blue-500"
                              : "text-muted-foreground"
                            }`}
                        />
                        <div>
                          <p className="font-medium">
                            {
                              availableDocumentTypes.find(
                                (type) => type.type === doc.documentType
                              )?.label
                            }
                          </p>
                          {doc.fileName && (
                            <p className="text-sm text-blue-600">
                              {doc.fileName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                className={`${getStatusColors(
                                  doc.status
                                )} flex items-center gap-1`}
                              >
                                {getStatusIcon(doc.status)}
                                {doc.status}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              {doc.status === "PENDING" &&
                                "Document needs to be uploaded"}
                              {doc.status === "UPLOADED" &&
                                "Document is under review"}
                              {doc.status === "APPROVED" &&
                                "Document has been approved"}
                              {doc.status === "REJECTED" &&
                                "Document was rejected and needs to be re-uploaded"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {doc.status !== "UPLOADED" &&
                          doc.status !== "APPROVED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={uploadingDocId === doc.id}
                              onClick={() => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept =
                                  ".pdf,.jpg,.jpeg,.png,.doc,.docx";
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement)
                                    .files?.[0];
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
                                  <Progress
                                    value={uploadProgress}
                                    className="h-1 w-12"
                                  />
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
              </CardContent>
            </Card>

            {canAccessPrequalification ? (
              <PrequalificationSummary
                application={application}
                context="loanee"
              />
            ) : (
              <LockedPrequalificationSection
                onUpgrade={() => router.push("/loanee/subscription")}
              />
            )}


          </div>
        </div>
        {application?.status === "IN_CHAT" && (
          <LoaneeChat
            application={application}
            applicationId={application ? application.id : ""} // fallback string
            messages={messages}
            setMessages={setMessages}
          />
        )}
      </div>
    </Section>
  );
}

function LockedPrequalificationSection({
  onUpgrade,
}: {
  onUpgrade: () => void;
}) {
  return (
    <Card className="relative overflow-hidden border border-dashed bg-gray-300/40 min-h-[220px]">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm pointer-events-none" />

      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-sm font-semibold">
          Pre-qualification Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 flex flex-col items-center justify-center text-center py-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 mb-3">
          <Image
            src="/lock.svg"
            alt="Locked"
            width={52}
            height={52}
            priority
          />
        </div>

        <p className="text-xs text-gray-600 max-w-sm mb-4">
          View eligibility, affordability, and risk insights with Smart plan
          or during your free trial.
        </p>

        <Button size="sm" onClick={onUpgrade}>
          Upgrade to Smart
        </Button>
      </CardContent>
    </Card>
  );
}
