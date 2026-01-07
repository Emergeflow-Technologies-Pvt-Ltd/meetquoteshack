"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Agent } from "@prisma/client"
import {
  LoanStatus,
  Application,
  User,
  Document,
  DocumentType,
  ApplicationStatusHistory,
} from "@prisma/client"
import { availableDocumentTypes } from "@/lib/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios"
import { getStatusColors } from "@/lib/utils"
import { ChevronLeft, Eye, Trash2 } from "lucide-react"
import DocumentReview from "@/components/admin/DocumentReview"
import { toast } from "@/hooks/use-toast"
import {
  getBackgroundColorLoanStatus,
  getTextColorLoanStatus,
} from "@/components/shared/chips"
import { useRouter } from "next/navigation"
import {
  applicationStatusLabels,
  downPaymentLabels,
  employmentTypeLabels,
  housingStatusTypeLabels,
  loanTypeLabels,
  maritalStatusLabels,
  propertyTypeLabels,
  residencyStatusTypeLabels,
  vehicleTypeLabels,
} from "@/components/shared/general.const"

import AgentAssignment from "@/components/admin/AgentAssignment"
import LenderAssignment from "@/components/admin/LenderAssignment"

interface Props {
  params: Promise<{
    applicationId: string
  }>
}

type ApplicationWithUser = Application & {
  user: User
  documents: Document[]
  documentKey?: string
  agent?: Agent | null
  estimatedPropertyValue?: number
  intendedPropertyAddress?: string
  applicationStatusHistory?: ApplicationStatusHistory[]
  potentialLenderIds?: string[]
  assignmentMode?: "single" | "multi"
}

type AgentWithUser = Agent & { user: User | null }


export default function ApplicationPage({ params }: Props) {
  const { applicationId } = use(params)
  const [application, setApplication] = useState<ApplicationWithUser | null>(
    null
  )
  const fetchRef = useRef(false)

  const [isLoading, setIsLoading] = useState(false)
  const [selectedDocTypes, setSelectedDocTypes] = useState<DocumentType[]>([])
  const [lenders, setLenders] = useState<User[]>([])
  const [agents, setAgents] = useState<AgentWithUser[]>([])
  const [loadingAgents, setLoadingAgents] = useState<boolean>(true)

  const router = useRouter()

  const fetchData = useCallback(async () => {
    setIsLoading(true)

    try {
      const { data } = await axios.get(`/api/applications/${applicationId}`)
      const app: ApplicationWithUser = data.application
      setApplication(app)
      setLenders(data.lenderList || [])
    } catch (error) {
      console.error("Error fetching application:", error)
      toast({
        title: "Error",
        description: "Failed to fetch application data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [applicationId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (fetchRef.current) return
    fetchRef.current = true

    const fetchAgents = async () => {
      setLoadingAgents(true)
      try {
        const res = await fetch("/api/agent")
        const text = await res.text()

        let parsed
        try {
          parsed = JSON.parse(text)
        } catch {
          setAgents([])
          return
        }

        if (Array.isArray(parsed)) {
          setAgents(parsed)
        } else if (Array.isArray(parsed?.agents)) {
          setAgents(parsed.agents)
        } else {
          setAgents([])
        }
      } catch {
        setAgents([])
      } finally {
        setLoadingAgents(false)
      }
    }

    fetchAgents()
  }, [])

  const onUpdateApplication = (updatedApp: ApplicationWithUser) => {
    setApplication(updatedApp)
  }

  const handleAddDocument = async () => {
    if (!selectedDocTypes.length || !application) return

    try {
      const { data } = await axios.post(
        `/api/applications/${application.id}/documents`,
        { documentTypes: selectedDocTypes }
      )
      const newDocs: Document[] = data
      setApplication((prev) =>
        prev
          ? {
              ...prev,
              documents: [...prev.documents, ...newDocs],
            }
          : null
      )
      setSelectedDocTypes([])
    } catch (error) {
      console.error("Failed to add document requirements:", error)
      toast({
        title: "Error",
        description: "Failed to add documents",
        variant: "destructive",
      })
    }
  }

  const handleRemoveDocument = async (docId: string) => {
    if (!application) return

    const doc = application.documents.find((d) => d.id === docId)
    if (!doc) return

    if (doc.fileKey) {
      alert("Cannot delete document after file has been uploaded")
      return
    }

    try {
      await axios.delete(`/api/applications/${application.id}/documents`, {
        data: { documentId: docId },
      })
      setApplication((prev) =>
        prev
          ? {
              ...prev,
              documents: prev.documents.filter((doc) => doc.id !== docId),
            }
          : null
      )
    } catch (error) {
      console.error("Failed to remove document:", error)
      toast({
        title: "Error",
        description: "Failed to remove document",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex animate-pulse flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-600">Loading application details...</span>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex animate-pulse flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-600">Loading application details...</span>
        </div>
      </div>
    )
  }

  const handleRejectApplication = async () => {
    try {
      await axios.patch(`/api/applications/${application.id}/reject`)
      setApplication((prev) => (prev ? { ...prev, status: "REJECTED" } : null))
    } catch (error) {
      console.error("Failed to update status:", error)
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      })
    }
  }

  const availableToAdd = availableDocumentTypes.filter(
    (docType) =>
      !application.documents.some((doc) => doc.documentType === docType.type)
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mt-8 flex justify-between gap-4 pb-4">
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
              color: getTextColorLoanStatus(application?.status as LoanStatus),
              backgroundColor: getBackgroundColorLoanStatus(
                application?.status as LoanStatus
              ),
            }}
          >
            {application?.status.replace(/_/g, " ")}
          </Badge>
        </div>

        {!["REJECTED", "APPROVED"].includes(application.status as string) && (
          <div className="w-full">
            <div className="mb-8 mt-6 w-full">
              <div className="flex w-full items-center justify-between px-4 py-2">
                <h3 className="text-lg font-semibold">Assign to Lender</h3>
                <div className="flex items-center gap-2">
                  <LenderAssignment
                    application={application}
                    lenders={lenders}
                    onUpdate={onUpdateApplication}
                  />

                  <AgentAssignment
                    application={application}
                    agents={agents}
                    loadingAgents={loadingAgents}
                    onUpdate={onUpdateApplication}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Applicant Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Personal & Employment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {application?.firstName ?? ""} {application?.lastName ?? ""}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Current Address
                  </label>
                  <p className="text-sm text-gray-900">
                    {application?.currentAddress ?? "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {application?.personalEmail ?? "N/A"}
                  </p>
                </div>

                <hr className="my-2" />

                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Previous Address
                  </label>
                  <p className="text-sm text-gray-900">
                    {application?.previousAddress || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Current Address Duration
                  </label>
                  <p className="text-sm text-gray-900">
                    {application?.yearsAtCurrentAddress} years
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Field of Study
                  </label>
                  <p className="text-sm text-gray-900">
                    {application?.generalFieldOfStudy}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Annual Income
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.grossIncome
                      ? `$${Number(application.grossIncome).toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Application Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Employment Status
                    </label>
                    <p className="text-sm capitalize text-gray-900">
                      {employmentTypeLabels[application.employmentStatus]}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Gross Income
                    </label>
                    <p className="text-sm text-gray-900">
                      ${application.grossIncome?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Workplace
                    </label>
                    <p className="text-sm text-gray-900">
                      {application.workplaceName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Work Duration
                    </label>
                    <p className="text-sm text-gray-900">
                      {application.workplaceDuration} year
                      {application.workplaceDuration > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Workplace Email
                    </label>
                    <p className="text-sm text-gray-900">
                      {application.workplaceEmail}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Workplace Phone
                    </label>
                    <p className="text-sm text-gray-900">
                      {application.workplacePhone}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Workplace Address
                    </label>
                    <p className="text-sm text-gray-900">
                      {application.workplaceAddress}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Housing Status
                    </label>
                    <p className="text-sm capitalize text-gray-900">
                      {housingStatusTypeLabels[application.housingStatus]}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Monthly Housing Payment
                    </label>
                    <p className="text-sm text-gray-900">
                      ${application.housingPayment?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Residency Status
                    </label>
                    <p className="text-sm capitalize text-gray-900">
                      {residencyStatusTypeLabels[application.residencyStatus]}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Marital Status
                    </label>
                    <p className="text-sm capitalize text-gray-900">
                      {maritalStatusLabels[application.maritalStatus]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Status History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.applicationStatusHistory &&
                application.applicationStatusHistory.length > 0 ? (
                  <div className="space-y-3">
                    {application.applicationStatusHistory.map(
                      (entry: ApplicationStatusHistory, index: number) => (
                        <div
                          key={index}
                          className="flex items-start justify-between border-b border-gray-200 pb-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {applicationStatusLabels[entry.oldStatus ?? ""] ??
                                "N/A"}{" "}
                              →{" "}
                              {applicationStatusLabels[entry.newStatus ?? ""] ??
                                "N/A"}
                            </p>
                          </div>
                          <p className="text-xs text-gray-400">
                            {new Date(entry.changedAt).toLocaleString()}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No history available</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Loan Amount
                  </label>
                  <p className="text-sm text-gray-900">
                    ${application.loanAmount?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    SIN
                  </label>
                  <p className="text-sm text-gray-900">
                    {application?.sin || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Loan Type
                  </label>
                  <p className="text-sm text-gray-900">
                    {loanTypeLabels[application.loanType]}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Estimated Property Value
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.estimatedPropertyValue
                      ? `$${application.estimatedPropertyValue.toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    House Type
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.houseType
                      ? propertyTypeLabels[application.houseType]
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Down Payment
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.downPayment
                      ? downPaymentLabels[application.downPayment]
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Vehicle Type
                  </label>
                  <p className="text-sm text-gray-900">
                    {application?.vehicleType
                      ? vehicleTypeLabels[application.vehicleType]
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Trade-in Vehicle
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.tradeInCurrentVehicle ? "Yes" : "No"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {application.hasCoApplicant && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Co-Applicant Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Full Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {application.coApplicantFullName || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Date of Birth
                    </label>
                    <p className="text-sm text-gray-900">
                      {application.coApplicantDateOfBirth
                        ? new Date(
                            application.coApplicantDateOfBirth
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Address
                    </label>
                    <p className="text-sm text-gray-900">
                      {application.coApplicantAddress || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="text-sm text-gray-900">
                      {application.coApplicantPhone || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">
                      {application.coApplicantEmail || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>Required Documents</CardTitle>
                <div className="flex gap-2">
                  <Select
                    value={undefined}
                    onValueChange={(value) => {
                      const docType = value as DocumentType
                      if (!selectedDocTypes.includes(docType)) {
                        setSelectedDocTypes((prev) => [...prev, docType])
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Add document" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableToAdd
                        .filter(
                          (docType) => !selectedDocTypes.includes(docType.type)
                        )
                        .map((docType) => (
                          <SelectItem key={docType.type} value={docType.type}>
                            {docType.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {!["REJECTED", "APPROVED"].includes(
                    application?.status as string
                  ) && (
                    <Button
                      onClick={handleAddDocument}
                      disabled={!selectedDocTypes.length}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Add ({selectedDocTypes.length})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedDocTypes.length > 0 && (
                  <div className="mb-4 rounded border border-blue-100 bg-blue-50 p-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedDocTypes.map((docType) => {
                        const docTypeConfig = availableDocumentTypes.find(
                          (type) => type.type === docType
                        )
                        return (
                          <Badge
                            key={docType}
                            className="flex items-center gap-1 border border-blue-200 bg-white px-2 py-1 text-blue-800"
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
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {application.documents.map((doc) => {
                    const docTypeConfig = availableDocumentTypes.find(
                      (type) => type.type === doc.documentType
                    )
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded border p-3 hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {docTypeConfig?.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {docTypeConfig?.description}
                          </p>
                          {doc.fileName && (
                            <p className="text-sm text-blue-500">
                              {doc.fileName}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColors(doc.status)}>
                            {doc.status}
                          </Badge>
                          {doc.fileKey && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                axios
                                  .get(`/api/documents/${doc.id}`)
                                  .then(({ data }) => {
                                    window.open(data.url, "_blank")
                                  })
                                  .catch((error) => {
                                    console.error(
                                      "Failed to fetch document URL:",
                                      error
                                    )
                                  })
                              }}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => handleRemoveDocument(doc.id)}
                            disabled={doc.fileKey !== null}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <DocumentReview
                          document={doc}
                          applicationId={application.id}
                          onStatusChange={fetchData}
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            {!["REJECTED", "APPROVED"].includes(
              application?.status as string
            ) && (
              <div className="mt-6 flex w-full justify-end">
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleRejectApplication()
                  }}
                >
                  Reject Application
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
