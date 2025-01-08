"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LoanStatus,
  MortgageApplication,
  User,
  ApplicationDocument,
  DocumentType,
} from "@prisma/client";
import { availableDocumentTypes } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

interface Props {
  params: Promise<{
    applicationId: string;
  }>;
}

type ApplicationWithUser = MortgageApplication & {
  user: User;
  documents: ApplicationDocument[];
  documentKey?: string;
  estimatedPropertyValue?: number;
  intendedPropertyAddress?: string;
};

export default function ApplicationPage({ params }: Props) {
  const { applicationId } = use(params);
  const [application, setApplication] = useState<ApplicationWithUser | null>(
    null
  );
  const [documentUrls, setDocumentUrls] = useState<Map<string, string>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocTypes, setSelectedDocTypes] = useState<DocumentType[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/applications/${applicationId}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch application");
        }

        const app = await response.json();
        setApplication(app);

        if (app.documents?.length > 0) {
          const urlMap = new Map<string, string>();
          await Promise.all(
            app.documents.map(async (doc: ApplicationDocument) => {
              if (doc.fileKey) {
                const docResponse = await fetch(
                  `/api/documents/${doc.fileKey}`
                );
                if (docResponse.ok) {
                  const { url } = await docResponse.json();
                  urlMap.set(doc.id, url);
                }
              }
            })
          );
          setDocumentUrls(urlMap);
        }
      } catch (error) {
        console.error("Failed to fetch application:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [applicationId]);

  const handleAddDocument = async () => {
    if (!selectedDocTypes.length || !application) return;

    axios
      .post(`/api/applications/${application.id}/documents`, {
        documentTypes: selectedDocTypes,
      })
      .then(({ data: newDocs }) => {
        setApplication((prev) =>
          prev
            ? {
                ...prev,
                documents: [...prev.documents, ...newDocs],
              }
            : null
        );
        setSelectedDocTypes([]);
      })
      .catch((error) => {
        console.error("Failed to add document requirements:", error);
      });
  };

  if (!application) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-gray-600">Loading application details...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: LoanStatus) => {
    const colors: Record<string, string> = {
      [LoanStatus.VERIFIED]: "bg-green-100 text-green-800 border-green-300",
      [LoanStatus.REJECTED]: "bg-red-100 text-red-800 border-red-300",
      [LoanStatus.PROCESSING]:
        "bg-yellow-100 text-yellow-800 border-yellow-300",
      [LoanStatus.PROGRESSING]:
        "bg-yellow-100 text-yellow-800 border-yellow-300",
      default: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return colors[status] || colors.default;
  };

  const handleStatusUpdate = async (newStatus: LoanStatus) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplication((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableToAdd = availableDocumentTypes.filter(
    (docType) =>
      !application.documents.some((doc) => doc.documentType === docType.type)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Application Details
            </h1>
            <p className="mt-1 text-sm text-gray-500">ID: {application.id}</p>
          </div>
          <Badge
            className={`px-3 py-1 text-sm font-medium ${getStatusColor(
              application.status
            )}`}
          >
            {application.status.toLowerCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Applicant Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">Name</label>
                  <p className="text-sm text-gray-900">
                    {application.firstName} {application.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Address</label>
                  <p className="text-sm text-gray-900">
                    {application.currentAddress}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Employment</label>
                  <p className="text-sm text-gray-900">
                    {application.workplaceName}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Loan Amount</label>
                    <p className="text-sm text-gray-900">
                      ${application.loanAmount?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Down Payment</label>
                    <p className="text-sm text-gray-900">
                      ${application.downPayment?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Purpose</label>
                  <p className="text-sm text-gray-900 capitalize">
                    {application.loanPurpose?.toLowerCase() || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Type</label>
                  <p className="text-sm text-gray-900 capitalize">
                    {application.mortgageType?.toLowerCase() || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Property</label>
                  <p className="text-sm text-gray-900 capitalize">
                    {application.housingType?.toLowerCase() || "Not specified"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Documents */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>Required Documents</CardTitle>
                <div className="flex gap-2">
                  <Select
                    value={undefined}
                    onValueChange={(value) => {
                      const docType = value as DocumentType;
                      if (!selectedDocTypes.includes(docType)) {
                        setSelectedDocTypes((prev) => [...prev, docType]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Add document" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableToAdd
                        .filter((docType) => !selectedDocTypes.includes(docType.type))
                        .map((docType) => (
                          <SelectItem key={docType.type} value={docType.type}>
                            {docType.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleAddDocument}
                    disabled={!selectedDocTypes.length}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add ({selectedDocTypes.length})
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedDocTypes.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-100">
                    <div className="flex flex-wrap gap-2">
                      {selectedDocTypes.map((docType) => {
                        const docTypeConfig = availableDocumentTypes.find(
                          (type) => type.type === docType
                        );
                        return (
                          <Badge
                            key={docType}
                            className="bg-white border border-blue-200 text-blue-800 flex items-center gap-1 px-2 py-1"
                          >
                            {docTypeConfig?.label}
                            <button
                              onClick={() =>
                                setSelectedDocTypes((prev) =>
                                  prev.filter((t) => t !== docType)
                                )
                              }
                              className="hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {application.documents.map((doc) => {
                    const docTypeConfig = availableDocumentTypes.find(
                      (type) => type.type === doc.documentType
                    );
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {docTypeConfig?.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {docTypeConfig?.description}
                          </p>
                        </div>
                        {doc.fileKey && documentUrls.has(doc.id) ? (
                          <Button
                            variant="outline"
                            asChild
                            className="hover:bg-blue-50 border-blue-200 text-blue-600"
                          >
                            <a
                              href={documentUrls.get(doc.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              View
                            </a>
                          </Button>
                        ) : (
                          <Badge className="bg-yellow-50 text-yellow-800 border border-yellow-200">
                            Pending
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate(LoanStatus.REJECTED)}
                disabled={isLoading || application.status === LoanStatus.REJECTED}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                {isLoading ? "Processing..." : "Reject"}
              </Button>
              <Button
                onClick={() => handleStatusUpdate(LoanStatus.VERIFIED)}
                disabled={isLoading || application.status === LoanStatus.VERIFIED}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? "Processing..." : "Approve"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
