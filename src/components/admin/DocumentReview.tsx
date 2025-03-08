"use client";

import { useState } from "react";
import { DocumentStatus, DocumentType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, FileEdit } from "lucide-react";
import axios from "axios";

// Define our own Document interface that includes the fields we need
interface DocumentWithReview {
  id: string;
  documentType: DocumentType;
  status: DocumentStatus;
  rejectionReason?: string | null;
  fileUrl?: string | null;
  fileKey?: string | null;
  fileType?: string | null;
  fileName?: string | null;
}

interface DocumentReviewProps {
  document: DocumentWithReview;
  applicationId: string;
  onStatusChange: () => void;
}

export default function DocumentReview({
  document,
  onStatusChange,
}: DocumentReviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<DocumentStatus | string>(document.status || "PENDING");
  const [rejectionReason, setRejectionReason] = useState(document.rejectionReason || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (status === "REJECTED" && !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.patch(`/api/admin/${document.id}`, {
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason : undefined,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      toast({
        title: "Success",
        description: `Document ${status === "APPROVED" ? "approved" : "rejected"} successfully`,
      });
      
      setIsOpen(false);
      onStatusChange();
    } catch (error) {
      console.error("Error updating document status:", error);
      toast({
        title: "Error",
        description: "Failed to update document status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show review options for already reviewed documents
  if (document.status === "APPROVED" || document.status === "REJECTED") {
    return (
      <div className="mt-2 flex items-center gap-2">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          document.status === "APPROVED" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {document.status === "APPROVED" ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          <span>{document.status}</span>
        </div>
        {document.status === "REJECTED" && document.rejectionReason && (
          <span className="text-xs text-gray-500">
            Reason: {document.rejectionReason}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <FileEdit className="h-3 w-3" />
            <span>Review</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Review Document</DialogTitle>
            <DialogDescription>
              Review and update the status of this document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="document-type">Document Type</Label>
              <div className="font-medium">
                {document.documentType.replace(/_/g, " ")}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  if (value !== "REJECTED") {
                    setRejectionReason("");
                  }
                }}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === "REJECTED" && (
              <div className="grid gap-2">
                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a reason for rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={status === "APPROVED" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isSubmitting ? "Submitting..." : status === "APPROVED" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 