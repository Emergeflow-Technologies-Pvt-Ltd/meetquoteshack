"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload, X, FileText, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { uploadFile } from "@/lib/upload"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import axios, { isAxiosError } from "axios"
import { DocumentType, Document } from "@prisma/client"

interface VerificationUploadModalProps {
  applicationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: () => void
}

interface FileWithProgress {
  file: File
  progress: number
  uploading: boolean
  error?: string
}

export default function VerificationUploadModal({
  applicationId,
  open,
  onOpenChange,
  onUploadComplete,
}: VerificationUploadModalProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [uploading, setUploading] = useState(false)
  const [existingDocs, setExistingDocs] = useState<Document[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null)
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null)

  const fetchExistingDocuments = useCallback(async () => {
    setLoadingDocs(true)
    try {
      const { data } = await axios.get(`/api/applications/${applicationId}`)
      const app = data.application || data
      const verificationDocs = (app.documents || []).filter(
        (doc: Document) => doc.documentType === DocumentType.VERIFICATION_RECORD
      )
      setExistingDocs(verificationDocs)
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoadingDocs(false)
    }
  }, [applicationId])

  // Fetch existing verification documents when modal opens
  useEffect(() => {
    if (open) {
      fetchExistingDocuments()
    }
  }, [open, fetchExistingDocuments])

  const handleDeleteDocument = async (docId: string) => {
    if (
      !confirm("Are you sure you want to delete this verification document?")
    ) {
      return
    }

    setDeletingDocId(docId)
    try {
      await axios.delete(`/api/documents/${docId}`)

      toast({
        title: "Success",
        description: "Verification document deleted successfully",
      })

      // Refresh the list
      await fetchExistingDocuments()

      // Notify parent to refresh
      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      let errorMessage = "Failed to delete document"
      if (isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDeletingDocId(null)
    }
  }

  const handleViewDocument = async (docId: string) => {
    try {
      setLoadingDocId(docId)
      const { data } = await axios.get(`/api/documents/${docId}`)
      if (data.url) {
        window.open(data.url, "_blank")
      }
    } catch (error) {
      console.error("Error fetching document URL:", error)
      toast({
        title: "Error",
        description: "Failed to load document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingDocId(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const newFiles: FileWithProgress[] = selectedFiles.map((file) => ({
      file,
      progress: 0,
      uploading: false,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      let successCount = 0
      let failCount = 0

      // Upload files sequentially
      for (let i = 0; i < files.length; i++) {
        const fileItem = files[i]

        // Update file status to uploading
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, uploading: true, progress: 0 } : f
          )
        )

        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            setFiles((prev) =>
              prev.map((f, idx) => {
                if (idx === i && f.progress < 90) {
                  return { ...f, progress: f.progress + 10 }
                }
                return f
              })
            )
          }, 200)
          // Upload file
          const key = await uploadFile("admin", fileItem.file)

          clearInterval(progressInterval)

          if (typeof key === "string") {
            // Update progress to 90% (file uploaded, now saving to DB)
            setFiles((prev) =>
              prev.map((f, idx) =>
                idx === i ? { ...f, progress: 90, uploading: true } : f
              )
            )

            // Save document record to database
            await axios.post(
              `/api/applications/${applicationId}/documents/verification`,
              {
                fileName: fileItem.file.name,
                fileKey: key,
                fileType: fileItem.file.type,
                documentType: "VERIFICATION_RECORD",
              }
            )

            // Update progress to 100%
            setFiles((prev) =>
              prev.map((f, idx) =>
                idx === i ? { ...f, progress: 100, uploading: false } : f
              )
            )

            successCount++
          } else {
            throw new Error("Upload failed: Invalid key returned")
          }
        } catch (error) {
          console.error("Error uploading file:", error)
          let errorMessage = "Upload failed"
          let errorDetails = {}

          if (isAxiosError(error)) {
            errorMessage =
              error.response?.data?.error || error.message || "Upload failed"
            errorDetails = {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status,
            }
          } else if (error instanceof Error) {
            errorMessage = error.message
            errorDetails = { message: error.message }
          }

          console.error("Error details:", errorDetails)

          failCount++

          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? {
                    ...f,
                    uploading: false,
                    error: errorMessage,
                  }
                : f
            )
          )

          toast({
            title: "Upload Failed",
            description: `Failed to upload ${fileItem.file.name}: ${errorMessage}`,
            variant: "destructive",
          })
        }
      }

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `${successCount} verification document(s) uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ""}`,
        })

        // Call completion callback
        if (onUploadComplete) {
          onUploadComplete()
        }

        // Reset and close only if all succeeded
        if (failCount === 0) {
          setTimeout(() => {
            setFiles([])
            onOpenChange(false)
          }, 1000)
        }
      } else if (failCount > 0) {
        toast({
          title: "Upload Failed",
          description: `All ${failCount} file(s) failed to upload. Check console for details.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description:
          (error as Error)?.message ||
          "Failed to upload verification documents",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload Verification Documents</DialogTitle>
          <DialogDescription>
            Upload verification reports generated from third-party verification
            for this application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          <div className="flex w-full items-center justify-center">
            <label
              htmlFor="verification-upload"
              className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <Upload className="mb-2 h-8 w-8 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, or images (MAX. 10MB)
                </p>
              </div>
              <input
                id="verification-upload"
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {files.map((fileItem, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border bg-white p-3"
                >
                  <FileText className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {fileItem.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {fileItem.uploading && (
                      <Progress value={fileItem.progress} className="mt-2" />
                    )}
                    {fileItem.error && (
                      <p className="mt-1 text-xs text-red-500">
                        {fileItem.error}
                      </p>
                    )}
                  </div>
                  {!fileItem.uploading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {fileItem.uploading && (
                    <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Existing Verification Documents */}
          {existingDocs.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Previously Uploaded Documents ({existingDocs.length})
                </h3>
                {loadingDocs ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {existingDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
                      >
                        <FileText className="h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {doc.fileName || "Verification Document"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.uploadedAt).toLocaleDateString()} at{" "}
                            {new Date(doc.uploadedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-2">
                          {doc.fileKey && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocument(doc.id)}
                              disabled={loadingDocId === doc.id}
                              className="text-gray-700 hover:bg-gray-50"
                            >
                              {loadingDocId === doc.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Loading
                                </>
                              ) : (
                                "View"
                              )}
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id)}
                            disabled={deletingDocId === doc.id}
                          >
                            {deletingDocId === doc.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Removing
                              </>
                            ) : (
                              "Remove"
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
            className="border border-violet-600 bg-white text-violet-600 hover:bg-violet-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="bg-violet-600 text-white hover:bg-violet-700"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>Upload {files.length > 0 && `(${files.length})`}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
