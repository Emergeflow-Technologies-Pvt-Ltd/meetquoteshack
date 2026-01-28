"use client"

import { useState } from "react"
import { Agent } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"

interface ConnectAdvisorCardProps {
  agents: Agent[]
  advisor: Agent | null
}

export default function ConnectAdvisorCard({
  agents,
  advisor,
}: ConnectAdvisorCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <span className="font-medium text-gray-700">
            {advisor ? `Advisor: ${advisor.name}` : "Connect Advisors"}
          </span>
          {advisor ? (
            <Link href={`/agents/${advisor.id}?chat=true`}>
              <Button>Chat with Advisor</Button>
            </Link>
          ) : (
            <Button onClick={() => setOpen(true)}>Select Agent</Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Select an Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-gray-500">{agent.email}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/agents/${agent.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-violet-600 text-violet-600 hover:bg-violet-50"
                    >
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {agents.length === 0 && (
              <p className="text-center text-gray-500">No agents available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
