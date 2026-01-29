"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Section from "@/components/shared/section"
import { ChevronLeft, FileText, Loader2 } from "lucide-react"
import axios from "axios"
import { Application, Document } from "@prisma/client"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"

interface Props {
  params: Promise<{ id: string }>
}

type ApplicationWithDocuments = Application & {
  documents: Document[]
}

export default function DocumentVerifiedDetailPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const [application, setApplication] =
    useState<ApplicationWithDocuments | null>(null)
  const [loading, setLoading] = useState(true)
  const [verificationDocs, setVerificationDocs] = useState<Document[]>([])
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    url: "",
    fileName: "",
    fileType: "",
  })
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null)
  const [contentLoading, setContentLoading] = useState(true)

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`/api/applications/${id}`)
        const app = data.application || data
        setApplication(app)

        // Filter verification documents
        const verificationDocuments = (app.documents || []).filter(
          (doc: Document) => doc.documentType === "VERIFICATION_RECORD"
        )
        setVerificationDocs(verificationDocuments)
      } catch (error) {
        console.error("Error fetching application:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [id])

  const handleViewDocument = async (docId: string, fileName: string) => {
    try {
      setLoadingDocId(docId)
      const { data } = await axios.get(`/api/documents/${docId}`)
      if (data.url) {
        // Determine file type from fileName
        const fileExtension = fileName.split(".").pop()?.toLowerCase() || ""
        const isPdf = fileExtension === "pdf"
        const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(
          fileExtension
        )

        setContentLoading(true)
        setPreviewModal({
          isOpen: true,
          url: data.url,
          fileName,
          fileType: isPdf ? "pdf" : isImage ? "image" : "other",
        })
      }
    } catch (error) {
      console.error("Error fetching document URL:", error)
    } finally {
      setLoadingDocId(null)
    }
  }

  if (loading) {
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
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    )
  }

  if (!application) {
    return (
      <Section className="py-24">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-lg font-medium">Application not found</p>
              <Button
                onClick={() => router.back()}
                className="mt-4"
                variant="outline"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>
    )
  }

  return (
    <Section className="py-12 md:py-24">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button className="rounded-full" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Verification Documents
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Application ID: {application.id}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Application Summary - Horizontal Card */}
        <Card>
          <CardHeader>
            <CardTitle>Application Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-gray-500">Applicant Name</p>
                <p className="font-semibold text-gray-900">
                  {application.firstName} {application.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-700">
                  {application.personalEmail}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm text-gray-700">
                  {application.personalPhone}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Current Address</p>
                <p className="text-sm text-gray-700">
                  {application.currentAddress}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Annual Income</p>
                <p className="font-medium text-gray-900">
                  ${application.grossIncome.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Loan Amount</p>
                <p className="font-medium text-gray-900">
                  ${application.loanAmount.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Status</p>
                <Badge variant="secondary" className="mt-1">
                  {application.status.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Verification Documents ({verificationDocs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {verificationDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <FileText className="mb-4 h-16 w-16 text-gray-400" />
                <p className="text-lg font-medium text-gray-900">
                  No Verification Documents
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Admin has not uploaded any verification documents yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {verificationDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-emerald-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {doc.fileName || "Verification Document"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Uploaded on{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.fileKey && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleViewDocument(
                              doc.id,
                              doc.fileName || "document"
                            )
                          }
                          disabled={loadingDocId === doc.id}
                          className="border-violet-600 text-violet-600 hover:bg-violet-50 hover:text-violet-800"
                        >
                          {loadingDocId === doc.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "View Document"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document Preview Modal */}
      <Dialog
        open={previewModal.isOpen}
        onOpenChange={(open) => {
          setPreviewModal({ ...previewModal, isOpen: open })
          if (!open) {
            setContentLoading(true)
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewModal.fileName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[calc(90vh-120px)] overflow-auto">
            {previewModal.fileType === "pdf" ? (
              <div className="relative">
                {contentLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                      <p className="text-sm text-gray-600">Loading PDF...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={previewModal.url}
                  className="h-[70vh] w-full border-0"
                  title={previewModal.fileName}
                  onLoad={() => setContentLoading(false)}
                />
              </div>
            ) : previewModal.fileType === "image" ? (
              <div className="relative">
                {contentLoading && (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                      <p className="text-sm text-gray-600">Loading image...</p>
                    </div>
                  </div>
                )}
                <Image
                  src={previewModal.url}
                  alt={previewModal.fileName}
                  className={`h-auto w-full ${contentLoading ? "hidden" : ""}`}
                  onLoad={() => setContentLoading(false)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <FileText className="mb-4 h-16 w-16 text-gray-400" />
                <p className="text-lg font-medium text-gray-900">
                  Preview not available
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  This file type cannot be previewed in the browser
                </p>
                <Button
                  onClick={() => window.open(previewModal.url, "_blank")}
                  className="mt-4"
                >
                  Open in New Tab
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Section>
  )
}
