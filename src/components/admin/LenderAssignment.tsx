"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import { LoanStatus, User } from "@prisma/client"
import type { ApplicationWithUser } from "./types"

interface LenderAssignmentProps {
  application: ApplicationWithUser
  lenders: User[]
  onUpdate: (app: ApplicationWithUser) => void
}

type ReturnedApplication = Partial<ApplicationWithUser> & {
  lender?: {
    id: string
  }
}

export default function LenderAssignment({
  application,
  lenders,
  onUpdate,
}: LenderAssignmentProps) {
  const [assignmentMode, setAssignmentMode] = useState<"single" | "multi">(
    "single"
  )
  const [selectedLenderId, setSelectedLenderId] = useState<string | null>(null)
  const [selectedPotentialLenderIds, setSelectedPotentialLenderIds] = useState<
    string[]
  >([])
  const [matchLendersDialogOpen, setMatchLendersDialogOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogOpenPotentialLender, setDialogOpenPotentialLender] =
    useState(false)
  const [isAssigning, setIsAssigning] = useState(false)

  // Match Lenders State
  const [selectedMatchLenderIds, setSelectedMatchLenderIds] = useState<
    string[]
  >([])
  const [isSavingMatches, setIsSavingMatches] = useState(false)

  const [hasAnyAssignment, setHasAnyAssignment] = useState<boolean>(false)

  useEffect(() => {
    const appHasLender = Boolean(application?.lenderId)
    const appHasPotentials =
      Array.isArray(application?.potentialLenderIds) &&
      application.potentialLenderIds.length > 0

    setHasAnyAssignment(appHasLender || appHasPotentials)
  }, [application?.lenderId, application?.potentialLenderIds])

  useEffect(() => {
    if (!dialogOpen || !application) return

    setAssignmentMode(
      application.assignmentMode ??
        ((application.potentialLenderIds?.length ?? 0) > 0 ? "multi" : "single")
    )

    setSelectedLenderId(application.lenderId ?? null)
    setSelectedPotentialLenderIds(application.potentialLenderIds ?? [])
  }, [dialogOpen, application])

  useEffect(() => {
    if (!application) return
    setSelectedMatchLenderIds(application.matchLenderIds ?? [])
  }, [application])

  useEffect(() => {
    if (assignmentMode === "single") {
      setSelectedPotentialLenderIds([])
    } else {
      setSelectedLenderId(null)
    }
  }, [assignmentMode])

  const togglePotentialLender = (id: string) => {
    setSelectedPotentialLenderIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleMatchLender = (id: string) => {
    setSelectedMatchLenderIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleAssign = async () => {
    if (!application) return

    if (assignmentMode === "single" && !selectedLenderId) {
      toast({
        title: "Select lender",
        description: "Please select a lender.",
        variant: "destructive",
      })
      return
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
      })
      return
    }

    setIsAssigning(true)
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
            }

      const res = await axios.patch(
        `/api/applications/${application.id}`,
        payload
      )

      const returnedApp: Partial<ApplicationWithUser> =
        res.data.application ?? res.data
      const returnedPotentialIds: string[] =
        res.data.potentialLenderIds ?? returnedApp.potentialLenderIds ?? []

      const newApp = {
        ...application,
        ...returnedApp,
        lenderId:
          (returnedApp &&
            (returnedApp.lenderId ??
              (returnedApp as ReturnedApplication).lender?.id)) ??
          (assignmentMode === "single" ? selectedLenderId : null),
        potentialLenderIds:
          returnedPotentialIds.length > 0
            ? returnedPotentialIds
            : assignmentMode === "multi"
              ? selectedPotentialLenderIds
              : [],
      } as ApplicationWithUser

      onUpdate(newApp)

      toast({
        title: "Success",
        description: "Assignment updated.",
      })
      setDialogOpen(false)
    } catch (err) {
      console.error("Assign error:", err)
      toast({
        title: "Error",
        description: "Failed to assign lenders",
        variant: "destructive",
      })
    } finally {
      setIsAssigning(false)
    }
  }

  const handleSaveMatches = async () => {
    if (!application) return
    setIsSavingMatches(true)
    try {
      const payload = {
        status: application.status,
        mode: "match",
        matchLenderIds: selectedMatchLenderIds,
      }
      const res = await axios.patch(
        `/api/applications/${application.id}`,
        payload
      )

      const returnedApp = res.data.application ?? res.data
      const returnedMatchIds =
        res.data.matchLenderIds ?? returnedApp.matchLenderIds ?? []

      onUpdate({
        ...application,
        ...returnedApp,
        matchLenderIds: returnedMatchIds,
      })

      toast({
        title: "Success",
        description: "Matches updated.",
      })
      setMatchLendersDialogOpen(false)
    } catch (err) {
      console.error("Match save error:", err)
      toast({
        title: "Error",
        description: "Failed to save matches",
        variant: "destructive",
      })
    } finally {
      setIsSavingMatches(false)
    }
  }

  const renderAssignmentForm = () => (
    <RadioGroup
      value={assignmentMode}
      onValueChange={(value) => {
        const m = value as "single" | "multi"
        setAssignmentMode(m)
        if (m === "single") setSelectedPotentialLenderIds([])
        else setSelectedLenderId(null)
      }}
      className="mt-2 space-y-3"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          setAssignmentMode("single")
          setSelectedPotentialLenderIds([])
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setAssignmentMode("single")
            setSelectedPotentialLenderIds([])
          }
        }}
        className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-left transition ${assignmentMode === "single" ? "border-primary/70 ring-2 ring-primary/20" : "border-border hover:border-primary/40"}`}
      >
        <RadioGroupItem value="single" className="mt-1" />
        <div className="w-full">
          <Label className="cursor-pointer">Assign a Lender</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose one lender.
          </p>

          {assignmentMode === "single" && (
            <div className="mt-4">
              <Select
                value={
                  selectedLenderId ||
                  (assignmentMode === "single"
                    ? application.lenderId || ""
                    : "")
                }
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
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          setAssignmentMode("multi")
          setSelectedLenderId(null)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setAssignmentMode("multi")
            setSelectedLenderId(null)
          }
        }}
        className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-left transition ${
          assignmentMode === "multi"
            ? "border-primary/70 ring-2 ring-primary/20"
            : "border-border hover:border-primary/40"
        }`}
      >
        <RadioGroupItem value="multi" className="mt-1" />

        <div className="w-full">
          <p className="text-sm font-medium">Select Potential Lenders (1–5)</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose potential lenders.
          </p>

          {assignmentMode === "multi" && (
            <div className="mt-4 space-y-2">
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
                {lenders.map((l) => {
                  const checked = selectedPotentialLenderIds.includes(l.id)

                  return (
                    <div
                      key={l.id}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePotentialLender(l.id)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          togglePotentialLender(l.id)
                        }
                      }}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-left transition ${
                        checked
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      } `}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => togglePotentialLender(l.id)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <span className="block text-left text-sm">{l.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </RadioGroup>
  )

  return (
    <>
      <Dialog
        open={matchLendersDialogOpen}
        onOpenChange={setMatchLendersDialogOpen}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Select Lenders to match</DialogTitle>
            <DialogDescription>
              Choose multiple lenders to match with loanee.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 max-h-60 space-y-2 overflow-y-auto rounded-md border p-2">
            {lenders.map((l) => {
              const checked = selectedMatchLenderIds.includes(l.id)
              return (
                <div
                  key={l.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleMatchLender(l.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      toggleMatchLender(l.id)
                    }
                  }}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-left transition ${
                    checked
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Checkbox checked={checked} />
                  <span className="block text-sm">{l.name}</span>
                </div>
              )
            })}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSaveMatches}
              disabled={isSavingMatches}
              className="bg-[#9b87f5] text-white hover:bg-[#7c6cf0]"
            >
              {isSavingMatches ? "Saving..." : "Save Matches"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {hasAnyAssignment ? (
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {selectedMatchLenderIds.length > 0 ? (
              <Button
                onClick={() => setMatchLendersDialogOpen(true)}
                className="rounded-md bg-[#FFCAED] px-3 py-1 text-sm text-[#FF2BB8] hover:bg-[#FFCAEG]"
                title="Edit matched lenders"
              >
                {selectedMatchLenderIds.length} Lenders to Match
              </Button>
            ) : (
              <Button
                onClick={() => setMatchLendersDialogOpen(true)}
                className="bg-violet-600 text-white hover:bg-violet-700"
              >
                Lenders to match
              </Button>
            )}

            {(() => {
              const hasPotentials =
                (application?.potentialLenderIds?.length ?? 0) > 0 ||
                selectedPotentialLenderIds.length > 0

              if (hasPotentials) {
                const count =
                  (application?.potentialLenderIds?.length ?? 0) ||
                  selectedPotentialLenderIds.length

                return (
                  <Button
                    type="button"
                    onClick={() => {
                      setAssignmentMode("multi")
                      setSelectedPotentialLenderIds(
                        application?.potentialLenderIds ?? []
                      )
                      setSelectedLenderId(null)
                      setDialogOpen(true)
                    }}
                    className="rounded-md bg-[#FFCAED] px-3 py-1 text-sm text-[#FF2BB8] hover:bg-[#FFCAEG]"
                    title="Edit potential lenders"
                  >
                    {count} Potential Lenders
                  </Button>
                )
              }

              const assignedLender = application?.lenderId
                ? lenders.find((l) => l.id === application.lenderId)
                : null

              const assignedLenderName =
                assignedLender?.name ?? "Unknown lender"

              return (
                <div className="inline-flex items-center justify-between gap-2 rounded-lg border bg-white px-4 py-2 shadow-sm">
                  <span className="text-sm font-medium text-slate-800">
                    Lender: {assignedLenderName}
                  </span>
                  <Button
                    type="button"
                    onClick={() => {
                      setAssignmentMode(
                        application?.assignmentMode ??
                          (application?.potentialLenderIds?.length
                            ? "multi"
                            : "single")
                      )
                      setSelectedLenderId(application?.lenderId ?? null)
                      setSelectedPotentialLenderIds(
                        application?.potentialLenderIds ?? []
                      )
                      setDialogOpen(true)
                    }}
                    size="icon"
                    className="h-7 w-7 bg-amber-400 text-white hover:bg-amber-500"
                  >
                    <Pencil size={16} />
                  </Button>
                </div>
              )
            })()}

            <Dialog
              open={dialogOpenPotentialLender}
              onOpenChange={setDialogOpenPotentialLender}
            >
              <DialogContent className="p-6 sm:max-w-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold leading-tight">
                      Selected Potential Lenders
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      For Application ID:{" "}
                      <span className="text-primary-600 font-medium">
                        {application?.id}
                      </span>
                    </p>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="max-h-72 space-y-4 overflow-y-auto pr-2">
                  {application.potentialLenderIds?.length ||
                  selectedPotentialLenderIds.length ? (
                    (application.potentialLenderIds?.length
                      ? application.potentialLenderIds
                      : selectedPotentialLenderIds
                    ).map((id) => {
                      const lender = lenders.find((l) => l.id === id)
                      const name = lender?.name ?? id
                      const initials = name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()

                      return (
                        <div
                          key={id}
                          className="flex items-center justify-between rounded-lg bg-card px-4 py-3 shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {initials}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{name}</div>
                            </div>
                          </div>

                          <div>
                            <div
                              className="rounded-md px-3 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: "#E6FFF4",
                                color: "#0F5132",
                              }}
                            >
                              Verified
                            </div>
                          </div>
                        </div>
                      )
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

                {renderAssignmentForm()}

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
                    className="bg-[#9b87f5] text-white hover:bg-[#7c6cf0]"
                  >
                    {isAssigning ? "Saving..." : "Assign"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <div className="flex justify-center gap-4">
          {selectedMatchLenderIds.length > 0 ? (
            <Button
              onClick={() => setMatchLendersDialogOpen(true)}
              className="rounded-md bg-[#FFCAED] px-3 py-1 text-sm text-[#FF2BB8] hover:bg-[#FFCAEG]"
              title="Edit matched lenders"
            >
              {selectedMatchLenderIds.length} Lenders to Match
            </Button>
          ) : (
            <Button
              onClick={() => setMatchLendersDialogOpen(true)}
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              Lenders to match
            </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-violet-600 text-white hover:bg-violet-700">
                Assign Lender
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Assign Lender</DialogTitle>
                <DialogDescription>
                  Choose how to assign a lender.
                </DialogDescription>
              </DialogHeader>

              {renderAssignmentForm()}

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
                  className="bg-[#9b87f5] text-white hover:bg-[#7c6cf0]"
                >
                  {isAssigning ? "Saving..." : "Assign"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  )
}
