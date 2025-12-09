"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Agent } from "@prisma/client";
import { Pencil } from "lucide-react";
import {
  LoanStatus,
  Application,
  User,
  Document,
  DocumentType,
  ApplicationStatusHistory,
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
import { getStatusColors } from "@/lib/utils";
import { ChevronLeft, Eye, Trash2 } from "lucide-react";
import DocumentReview from "@/components/admin/DocumentReview";
import { toast } from "@/hooks/use-toast";
import {
  getBackgroundColorLoanStatus,
  getTextColorLoanStatus,
} from "@/components/shared/chips";
import { useRouter } from "next/navigation";
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
} from "@/components/shared/general.const";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  params: Promise<{
    applicationId: string;
  }>;
}

type ApplicationWithUser = Application & {
  user: User;
  documents: Document[];
  documentKey?: string;
  agent?: Agent | null;
  estimatedPropertyValue?: number;
  intendedPropertyAddress?: string;
  applicationStatusHistory?: ApplicationStatusHistory[];
  potentialLenderIds?: string[];
  assignmentMode?: "single" | "multi";
};

type AgentWithUser = Agent & { user: User | null };

export default function ApplicationPage({ params }: Props) {
  const { applicationId } = use(params);
  const [application, setApplication] = useState<ApplicationWithUser | null>(
    null
  );
  const fetchRef = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocTypes, setSelectedDocTypes] = useState<DocumentType[]>(
    []
  );
  const [lenders, setLenders] = useState<User[]>([]);
  const [agents, setAgents] = useState<AgentWithUser[]>([]);
  const [loadingAgents, setLoadingAgents] = useState<boolean>(true);
  const [selectedLenderId, setSelectedLenderId] = useState<string | null>(
    null
  );
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(
    null
  );
  const [selectedPotentialLenderIds, setSelectedPotentialLenderIds] = useState<
    string[]
  >([]);
  const [hasAnyAssignment, setHasAnyAssignment] = useState<boolean>(false);
  const [assignmentMode, setAssignmentMode] = useState<"single" | "multi">(
    "single"
  );
  const [isAssigning, setIsAssigning] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenPotentialLender, setDialogOpenPotentialLender] = useState(false);
  const [dialogOpenAgent, setDialogOpenAgent] = useState(false);

  const router = useRouter();

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.get(`/api/applications/${applicationId}`);
      const app: ApplicationWithUser = data.application;
      setApplication(app);
      setLenders(data.lenderList || []);

      if (app.lenderId) {
        setSelectedLenderId(app.lenderId);
      } else {
        setSelectedLenderId(null);
      }

      if (Array.isArray(app.potentialLenderIds) && app.potentialLenderIds.length) {
        setSelectedPotentialLenderIds(app.potentialLenderIds);
      } else {
        setSelectedPotentialLenderIds([]);
      }

      if (app.assignmentMode) {
        setAssignmentMode(app.assignmentMode);
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      toast({
        title: "Error",
        description: "Failed to fetch application data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const appHasLender = Boolean(application?.lenderId);
    const appHasPotentials = Array.isArray(application?.potentialLenderIds) && application.potentialLenderIds.length > 0;
    const uiHasSelectedLender = Boolean(selectedLenderId);
    const uiHasPotentials = selectedPotentialLenderIds.length > 0;

    setHasAnyAssignment(appHasLender || appHasPotentials || uiHasSelectedLender || uiHasPotentials);
  }, [
    application?.lenderId,
    application?.potentialLenderIds,
    selectedLenderId,
    selectedPotentialLenderIds,
  ]);


  useEffect(() => {
    if (fetchRef.current) return;
    fetchRef.current = true;

    const fetchAgents = async () => {
      setLoadingAgents(true);
      try {
        const res = await fetch("/api/agent");
        const text = await res.text();

        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          setAgents([]);
          return;
        }

        if (Array.isArray(parsed)) {
          setAgents(parsed);
        } else if (Array.isArray(parsed?.agents)) {
          setAgents(parsed.agents);
        } else {
          setAgents([]);
        }
      } catch {
        setAgents([]);
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchAgents();
  }, []);



  useEffect(() => {
    if (dialogOpenAgent) {
      setSelectedAgentId(application?.agentId ?? null);
    }
  }, [dialogOpenAgent, application]);

  const handleAddDocument = async () => {
    if (!selectedDocTypes.length || !application) return;

    try {
      const { data } = await axios.post(
        `/api/applications/${application.id}/documents`,
        { documentTypes: selectedDocTypes }
      );
      const newDocs: Document[] = data;
      setApplication((prev) =>
        prev
          ? {
            ...prev,
            documents: [...prev.documents, ...newDocs],
          }
          : null
      );
      setSelectedDocTypes([]);
    } catch (error) {
      console.error("Failed to add document requirements:", error);
      toast({ title: "Error", description: "Failed to add documents", variant: "destructive" });
    }
  };

  const handleRemoveDocument = async (docId: string) => {
    if (!application) return;

    const doc = application.documents.find((d) => d.id === docId);
    if (!doc) return;

    if (doc.fileKey) {
      alert("Cannot delete document after file has been uploaded");
      return;
    }

    try {
      await axios.delete(`/api/applications/${application.id}/documents`, {
        data: { documentId: docId },
      });
      setApplication((prev) =>
        prev
          ? {
            ...prev,
            documents: prev.documents.filter((doc) => doc.id !== docId),
          }
          : null
      );
    } catch (error) {
      console.error("Failed to remove document:", error);
      toast({ title: "Error", description: "Failed to remove document", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-gray-600">Loading application details...</span>
        </div>
      </div>
    );
  }

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

  const handleRejectApplication = async () => {
    try {
      await axios.patch(`/api/applications/${application.id}/reject`);
      setApplication((prev) => (prev ? { ...prev, status: "REJECTED" } : null));
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({ title: "Error", description: "Failed to reject application", variant: "destructive" });
    }
  };


  const availableToAdd = availableDocumentTypes.filter(
    (docType) =>
      !application.documents.some((doc) => doc.documentType === docType.type)
  );

  const togglePotentialLender = (id: string) => {
    setSelectedPotentialLenderIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!application) return;

    if (assignmentMode === "single" && !selectedLenderId) {
      toast({
        title: "Select lender",
        description: "Please select a lender.",
        variant: "destructive",
      });
      return;
    }

    if (
      assignmentMode === "multi" &&
      (selectedPotentialLenderIds.length < 1 ||
        selectedPotentialLenderIds.length > 5)
    ) {
      toast({
        title: "Choose lenders",
        description: "Select between 1 and 5 potential lenders.",
        variant: "destructive",
      });
      return;
    }

    setIsAssigning(true);
    try {
      const payload =
        assignmentMode === "single"
          ? {
            status: "ASSIGNED_TO_LENDER" as LoanStatus,
            mode: "single" as const,
            lenderId: selectedLenderId,
            potentialLenderIds: [] as string[],
          }
          : {
            status: "ASSIGNED_TO_POTENTIAL_LENDER" as LoanStatus,
            mode: "multi" as const,
            lenderId: null,
            potentialLenderIds: selectedPotentialLenderIds,
          };

      const res = await axios.patch(`/api/applications/${application.id}`, payload);

      const returnedApp: Partial<ApplicationWithUser> =
        res.data.application ?? res.data;
      const returnedPotentialIds: string[] =
        res.data.potentialLenderIds ??
        returnedApp.potentialLenderIds ??
        [];

      setApplication((prev) =>
        prev
          ? {
            ...prev,
            ...returnedApp,
            lenderId:
              (returnedApp &&
                (returnedApp.lenderId ??
                  (returnedApp as any).lender?.id)) ??
              (assignmentMode === "single" ? selectedLenderId : null),
            potentialLenderIds:
              returnedPotentialIds.length > 0
                ? returnedPotentialIds
                : assignmentMode === "multi"
                  ? selectedPotentialLenderIds
                  : [],
          }
          : prev
      );

      if (returnedPotentialIds.length > 0) {
        setSelectedPotentialLenderIds(returnedPotentialIds);
      } else if (assignmentMode === "single") {
        setSelectedPotentialLenderIds([]);
      }

      if (assignmentMode === "single" && selectedLenderId) {
        setSelectedLenderId(selectedLenderId);
      } else if (returnedApp?.lenderId) {
        setSelectedLenderId(returnedApp.lenderId);
      } else if (assignmentMode === "multi") {
        setSelectedLenderId(null);
      }

      toast({
        title: "Success",
        description: "Assignment updated.",
      });
      setDialogOpen(false);
    } catch (err) {
      console.error("Assign error:", err);
      toast({
        title: "Error",
        description: "Failed to assign lenders",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };


  const assignAgentHandler = async () => {
    if (!selectedAgentId || !application) return;

    try {
      setIsAssigning(true);

      const res = await axios.post(
        `/api/applications/${application.id}/agent`,
        { agentId: selectedAgentId }
      );

      const updatedApp = res.data?.application;

      setApplication((prev) =>
        prev
          ? {
            ...prev,
            agentId: selectedAgentId,
            agent: updatedApp?.agent ?? prev.agent,
          }
          : prev
      );

      toast({
        title: "Agent Assigned",
        description: "Agent has been successfully assigned to this application.",
      });

      setDialogOpenAgent(false);

    } catch (err: any) {
      console.error("Assign agent failed:", err);

      toast({
        title: "Error",
        description:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to assign agent",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between gap-4 mt-8 pb-4">
          <div className="flex items-center gap-4">
            <button className="rounded-full" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Application Details
              </h1>
              <p className="mt-1 text-sm text-gray-500">ID: {application?.id}</p>
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
            <div className="mt-6 mb-8 w-full">
              <div className="flex w-full items-center justify-between px-4 py-2">
                <h3 className="text-lg font-semibold">Assign to Lender</h3>
                <div className="flex items-center gap-2">

                  {hasAnyAssignment ? (
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {(() => {
                          const hasPotentials =
                            (application?.potentialLenderIds?.length ?? 0) > 0 ||
                            selectedPotentialLenderIds.length > 0;

                          if (hasPotentials) {
                            const count =
                              (application?.potentialLenderIds?.length ?? 0) ||
                              selectedPotentialLenderIds.length;

                            return (
                              <Button
                                type="button"
                                onClick={() => setDialogOpenPotentialLender(true)}
                                className="bg-[#FFCAED] hover:bg-[#FFCAEG] text-[#FF2BB8] text-sm px-3 py-1 rounded-md"
                                title="View potential lenders"
                              >
                                {count} potential
                              </Button>

                            );
                          }

                          const assignedLenderName =
                            lenders.find((l) => l.id === application.lenderId)?.name ??
                            application.lenderId ??
                            "Unknown lender";

                          return (
                            <div className="inline-flex items-center justify-between gap-2 rounded-lg border bg-white px-4 py-2 shadow-sm">
                              <span className="text-sm font-medium text-slate-800">
                                Lender: {assignedLenderName}
                              </span>
                              <Button
                                type="button"
                                onClick={() => {
                                  setSelectedLenderId(
                                    selectedLenderId || application.lenderId || null
                                  );
                                  setDialogOpen(true);
                                }}
                                size="icon"
                                className="h-7 w-7 bg-amber-400 hover:bg-amber-500 text-white"
                              >
                                <Pencil size={16} />
                              </Button>
                            </div>
                          );
                        })()}

                        <Dialog open={dialogOpenPotentialLender} onOpenChange={setDialogOpenPotentialLender}>
                          <DialogContent className="sm:max-w-sm p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h2 className="text-xl font-semibold leading-tight">Selected Potential Lenders</h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  For Application ID:{" "}
                                  <span className="font-medium text-primary-600">{application?.id}</span>
                                </p>
                              </div>
                            </div>

                            <hr className="my-4" />

                            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                              {(application.potentialLenderIds?.length || selectedPotentialLenderIds.length) ? (
                                (application.potentialLenderIds?.length
                                  ? application.potentialLenderIds
                                  : selectedPotentialLenderIds
                                ).map((id) => {
                                  const lender = lenders.find((l) => l.id === id);
                                  const name = lender?.name ?? id;
                                  const initials = name
                                    .split(" ")
                                    .map((s) => s[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase();

                                  return (
                                    <div key={id} className="flex items-center justify-between bg-card rounded-lg px-4 py-3 shadow-sm">
                                      <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                                          {initials}
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium">{name}</div>
                                        </div>
                                      </div>

                                      <div>
                                        <div
                                          className="rounded-md px-3 py-1 text-xs font-medium"
                                          style={{ backgroundColor: "#E6FFF4", color: "#0F5132" }}
                                        >
                                          Verified
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                  No potential lenders selected.
                                </div>
                              )}
                            </div>

                            <DialogFooter className="mt-6">
                              <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader className="space-y-1">
                              <DialogTitle>Assign Lender</DialogTitle>
                              <DialogDescription>
                                Choose how you want to assign lenders to this loanee.
                              </DialogDescription>
                            </DialogHeader>

                            <RadioGroup
                              value={assignmentMode}
                              onValueChange={(value) => {
                                const m = value as "single" | "multi";
                                setAssignmentMode(m);
                                if (m === "single") setSelectedPotentialLenderIds([]);
                                else setSelectedLenderId(null);
                              }}
                              className="mt-2 space-y-3"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setAssignmentMode("single");
                                  setSelectedPotentialLenderIds([]);
                                }}
                                className={`w-full rounded-lg border px-4 py-3 text-left flex items-start gap-3 cursor-pointer transition
                      ${assignmentMode === "single" ? "border-primary/70 ring-2 ring-primary/20" : "border-border hover:border-primary/40"}`}
                              >
                                <RadioGroupItem value="single" className="mt-1" />
                                <div className="w-full">
                                  <Label>Assign a Lender</Label>
                                  <p className="text-xs mt-1 text-muted-foreground">Choose one lender.</p>

                                  {assignmentMode === "single" && (
                                    <div className="mt-4">
                                      <Select
                                        value={selectedLenderId || application.lenderId || ""}
                                        onValueChange={(v) => setSelectedLenderId(v)}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select lender..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {lenders.map((lender) => (
                                            <SelectItem key={lender.id} value={lender.id}>
                                              {lender.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setAssignmentMode("multi");
                                  setSelectedLenderId(null);
                                }}
                                className={`w-full rounded-lg border px-4 py-3 text-left flex items-start gap-3 cursor-pointer transition
                      ${assignmentMode === "multi" ? "border-primary/70 ring-2 ring-primary/20" : "border-border hover:border-primary/40"}`}
                              >
                                <RadioGroupItem value="multi" className="mt-1" />

                                <div className="w-full">
                                  <p className="text-sm font-medium">Select Potential Lenders (1–5)</p>
                                  <p className="text-xs mt-1 text-muted-foreground">Choose potential lenders.</p>

                                  {assignmentMode === "multi" && (
                                    <div className="mt-4 space-y-2">
                                      <div className="border rounded-md p-2 space-y-1 max-h-40 overflow-y-auto">
                                        {lenders.map((l) => {
                                          const checked = selectedPotentialLenderIds.includes(l.id);
                                          return (
                                            <Button
                                              key={l.id}
                                              variant="outline"
                                              onClick={() => togglePotentialLender(l.id)}
                                              className={`w-full flex items-center justify-between px-3 py-2 ${checked ? "border-primary/40 bg-primary/5" : ""
                                                }`}
                                            >
                                              <div className="flex items-center gap-3">
                                                <Checkbox
                                                  checked={checked}
                                                  onCheckedChange={() => togglePotentialLender(l.id)}
                                                />
                                                <span className="text-sm">{l.name}</span>
                                              </div>
                                            </Button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </button>
                            </RadioGroup>

                            <DialogFooter className="mt-6">
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>

                              <Button
                                onClick={handleAssign}
                                disabled={
                                  isAssigning ||
                                  (assignmentMode === "single" && !selectedLenderId) ||
                                  (assignmentMode === "multi" &&
                                    (selectedPotentialLenderIds.length < 1 ||
                                      selectedPotentialLenderIds.length > 5))
                                }
                                className="bg-[#9b87f5] hover:bg-[#7c6cf0] text-white"
                              >
                                {isAssigning ? "Saving..." : "Assign"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                            Assign Lender
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[480px]">
                          <DialogHeader>
                            <DialogTitle>Assign Lender</DialogTitle>
                            <DialogDescription>Choose how to assign a lender.</DialogDescription>
                          </DialogHeader>

                          <RadioGroup
                            value={assignmentMode}
                            onValueChange={(v) => {
                              const m = v as "single" | "multi";
                              setAssignmentMode(m);
                              if (m === "single") setSelectedPotentialLenderIds([]);
                              else setSelectedLenderId(null);
                            }}
                            className="mt-2 space-y-3"
                          >
                            {/* Single */}
                            <button
                              type="button"
                              onClick={() => {
                                setAssignmentMode("single");
                                setSelectedPotentialLenderIds([]);
                              }}
                              className={`w-full rounded-lg border px-4 py-3 flex items-start gap-3 cursor-pointer transition 
                    ${assignmentMode === "single" ? "border-primary/70 ring-2 ring-primary/20" : "border-border hover:border-primary/40"}`}
                            >
                              <RadioGroupItem value="single" className="mt-1" />

                              <div className="w-full">
                                <p className="text-sm font-medium">Assign a Lender</p>

                                {assignmentMode === "single" && (
                                  <div className="mt-4">
                                    <Select
                                      value={selectedLenderId || ""}
                                      onValueChange={setSelectedLenderId}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select lender..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {lenders.map((lender) => (
                                          <SelectItem key={lender.id} value={lender.id}>
                                            {lender.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                            </button>

                            {/* Multi */}
                            <button
                              type="button"
                              onClick={() => {
                                setAssignmentMode("multi");
                                setSelectedLenderId(null);
                              }}
                              className={`w-full rounded-lg border px-4 py-3 flex items-start gap-3 cursor-pointer transition 
                    ${assignmentMode === "multi" ? "border-primary/70 ring-2 ring-primary/20" : "border-border hover:border-primary/40"}`}
                            >
                              <RadioGroupItem value="multi" className="mt-1" />

                              <div className="w-full">
                                <p className="text-sm font-medium">Select Potential Lenders (1–5)</p>

                                {assignmentMode === "multi" && (
                                  <div className="mt-4 space-y-2">
                                    <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                                      {lenders.map((l) => {
                                        const checked = selectedPotentialLenderIds.includes(l.id);

                                        return (
                                          <button
                                            key={l.id}
                                            type="button"
                                            onClick={() => togglePotentialLender(l.id)}
                                            className={`w-full flex items-center justify-between rounded px-2 py-1 text-left cursor-pointer ${checked
                                              ? "bg-primary/5 border border-primary/40"
                                              : "border border-transparent hover:border-border"
                                              }`}
                                          >
                                            <input type="checkbox" checked={checked} readOnly className="h-4 w-4 mr-2" />
                                            <span className="text-sm">{l.name}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </button>
                          </RadioGroup>

                          <DialogFooter className="mt-6">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button
                              onClick={handleAssign}
                              disabled={
                                isAssigning ||
                                (assignmentMode === "single" && !selectedLenderId) ||
                                (assignmentMode === "multi" &&
                                  (selectedPotentialLenderIds.length < 1 ||
                                    selectedPotentialLenderIds.length > 5))
                              }
                              className="bg-[#9b87f5] hover:bg-[#7c6cf0] text-white"
                            >
                              {isAssigning ? "Saving..." : "Assign"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {/* Agent Dialog Below */}
                  <>
                    <Dialog open={dialogOpenAgent} onOpenChange={setDialogOpenAgent}>
                      {application?.agentId ? (
                        <div className="inline-flex items-center justify-between gap-2 rounded-lg border bg-white px-4 py-2 shadow-sm">
                          <p className="text-sm font-medium text-slate-800">
                            Agent:{" "}
                            <span className="font-medium">
                              {
                                (agents.find((a) => a.id === application.agentId)?.name ??
                                  agents.find((a) => a.id === application.agentId)?.user?.name ??
                                  application.agentId)
                              }
                            </span>
                          </p>

                          <Button
                            type="button"
                            onClick={() => setDialogOpenAgent(true)}
                            size="icon"
                            className="h-7 w-7 bg-amber-400 hover:bg-amber-500 text-white ml-6 mr-0"
                          >
                            <Pencil size={18} />
                          </Button>

                        </div>
                      ) : (
                        <DialogTrigger asChild>
                          <Button className="bg-white text-violet-600 border border-violet-600 hover:bg-violet-50">
                            Assign Agent
                          </Button>
                        </DialogTrigger>
                      )}

                      <DialogContent className="sm:max-w-[500px] max-h-[70vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Assign Agent to Loanee</DialogTitle>
                          <DialogDescription>
                            Select an agent to manage this loan application
                          </DialogDescription>
                        </DialogHeader>

                        <hr className="my-4" />

                        {loadingAgents ? (
                          <div className="py-6 text-center">Loading agents...</div>
                        ) : agents.length === 0 ? (
                          <div className="py-6 text-center text-muted-foreground">
                            No agents available.
                          </div>
                        ) : (
                          <RadioGroup
                            value={selectedAgentId ?? ""}
                            onValueChange={(v) => setSelectedAgentId(v || null)}
                            className="space-y-0 max-h-[44rem] overflow-y-auto"
                          >
                            {agents.map((agent, idx) => {
                              const name = agent.name ?? agent.user?.name ?? "Unknown";
                              const email = agent.email ?? agent.user?.email ?? "";
                              const initials = name
                                .split(" ")
                                .map((s) => s[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase();

                              return (
                                <div key={agent.id}>
                                  <div
                                    className={`flex items-center justify-between px-4 py-2 ${selectedAgentId === agent.id
                                      ? "bg-primary/5 border border-primary/40"
                                      : "bg-card"
                                      }`}
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="mt-2 h-10 w-10 flex items-center justify-center rounded-full bg-violet-100 text-violet-700 font-semibold">
                                        {initials}
                                      </div>
                                      <div>
                                        <div className="text-sm font-semibold">{name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {email}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          AGENT CODE
                                        </div>
                                      </div>
                                    </div>

                                    <RadioGroupItem value={agent.id} />
                                  </div>

                                  {idx < agents.length - 1 && (
                                    <div className="mx-8 border-t border-muted my-2" />
                                  )}
                                </div>
                              );
                            })}
                          </RadioGroup>
                        )}

                        <DialogFooter className="mt-6">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>

                          <Button
                            onClick={assignAgentHandler}
                            disabled={!selectedAgentId || isAssigning}
                            className="bg-purple-600 text-white"
                          >
                            {isAssigning ? "Assigning..." : "Assign"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>

                </div>
              </div>

            </div>
          </div>
        )}



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
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
                    <p className="text-sm text-gray-900 capitalize">
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
                    <p className="text-sm text-gray-900 capitalize">
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
                    <p className="text-sm text-gray-900 capitalize">
                      {residencyStatusTypeLabels[application.residencyStatus]}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Marital Status
                    </label>
                    <p className="text-sm text-gray-900 capitalize">
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
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Add ({selectedDocTypes.length})
                      </Button>
                    )}
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
                                    window.open(data.url, "_blank");
                                  })
                                  .catch((error) => {
                                    console.error(
                                      "Failed to fetch document URL:",
                                      error
                                    );
                                  });
                              }}
                              className="hover:bg-blue-50 border-blue-200 text-blue-600"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => handleRemoveDocument(doc.id)}
                            disabled={doc.fileKey !== null}
                            className="hover:bg-red-50 border-red-200 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <DocumentReview
                          document={doc}
                          applicationId={application.id}
                          onStatusChange={fetchData}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            {!["REJECTED", "APPROVED"].includes(
              application?.status as string
            ) && (
                <div className="flex w-full justify-end mt-6">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleRejectApplication();
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
  );
}
