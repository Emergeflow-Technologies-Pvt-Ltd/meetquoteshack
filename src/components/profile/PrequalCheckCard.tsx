"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { QuickPrequalForm } from "@/components/shared/quick-prequal/QuickPrequalForm"

export default function PrequalCheckCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <span className="font-medium text-gray-700">
            Calculate Pre-qualification
          </span>
          <Button onClick={() => setOpen(true)}>Check Eligibility</Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold pt-6">
              Quick Pre-qualification Check
            </DialogTitle>
          </DialogHeader>
          <QuickPrequalForm />
        </DialogContent>
      </Dialog>
    </>
  )
}
