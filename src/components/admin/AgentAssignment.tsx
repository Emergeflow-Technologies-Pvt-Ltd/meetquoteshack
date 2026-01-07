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
  DialogClose,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Pencil } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import axios, { AxiosError } from "axios"
import type { ApplicationWithUser, AgentWithUser } from "./types"

interface AgentAssignmentProps {
  application: ApplicationWithUser
  agents: AgentWithUser[]
  loadingAgents: boolean
  onUpdate: (app: ApplicationWithUser) => void
}

export default function AgentAssignment({
  application,
  agents,
  loadingAgents,
  onUpdate,
}: AgentAssignmentProps) {
  const [dialogOpenAgent, setDialogOpenAgent] = useState(false)
  const [isReassignAgent, setIsReassignAgent] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    if (dialogOpenAgent) {
      setSelectedAgentId(application?.agentId ?? null)
    }
  }, [dialogOpenAgent, application])

  const assignAgentHandler = async () => {
    if (!selectedAgentId || !application) return

    try {
      setIsAssigning(true)

      const res = await axios.post(
        `/api/applications/${application.id}/agent`,
        { agentId: selectedAgentId }
      )

      const updatedApp = res.data?.application

      const newApp = {
        ...application,
        agentId: selectedAgentId,
        agent: updatedApp?.agent ?? application.agent,
      }

      onUpdate(newApp)

      toast({
        title: "Agent Assigned",
        description:
          "Agent has been successfully assigned to this application.",
      })

      setDialogOpenAgent(false)
    } catch (err: unknown) {
      const error = err as AxiosError<{ error?: string }>

      console.error("Assign agent failed:", error)

      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          error.message ||
          "Failed to assign agent",
        variant: "destructive",
      })
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <>
      <Dialog
        open={dialogOpenAgent}
        onOpenChange={(open) => {
          setDialogOpenAgent(open)
          if (!open) setIsReassignAgent(false)
        }}
      >
        {application?.agentId ? (
          <div className="inline-flex items-center justify-between gap-2 rounded-lg border bg-white px-4 py-2 shadow-sm">
            <p className="text-sm font-medium text-slate-800">
              Agent:{" "}
              <span className="font-medium">
                {agents.find((a) => a.id === application.agentId)?.name ??
                  agents.find((a) => a.id === application.agentId)?.user
                    ?.name ??
                  application.agentId}
              </span>
            </p>

            <Button
              type="button"
              onClick={() => {
                setIsReassignAgent(true)
                setDialogOpenAgent(true)
              }}
              size="icon"
              className="ml-6 mr-0 h-7 w-7 bg-amber-400 text-white hover:bg-amber-500"
            >
              <Pencil size={18} />
            </Button>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => {
                setIsReassignAgent(false)
                setDialogOpenAgent(true)
              }}
              className="border border-violet-600 bg-white text-violet-600 hover:bg-violet-50"
            >
              Assign Agent
            </Button>
          </div>
        )}

        <DialogContent className="max-h-[70vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isReassignAgent
                ? "Reassign Agent to Loanee"
                : "Assign Agent to Loanee"}
            </DialogTitle>
            <DialogDescription>
              {isReassignAgent
                ? "Select a different agent to manage this loan application"
                : "Select an agent to manage this loan application"}
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
              className="max-h-[44rem] space-y-0 overflow-y-auto"
            >
              {agents.map((agent, idx) => {
                const name = agent.name ?? agent.user?.name ?? "Unknown"
                const email = agent.email ?? agent.user?.email ?? ""
                const initials = name
                  .split(" ")
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()

                return (
                  <div key={agent.id}>
                    <div
                      className={`flex items-center justify-between px-4 py-2 ${
                        selectedAgentId === agent.id
                          ? "border border-primary/40 bg-primary/5"
                          : "bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
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
                      <div className="mx-8 my-2 border-t border-muted" />
                    )}
                  </div>
                )
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
  )
}
