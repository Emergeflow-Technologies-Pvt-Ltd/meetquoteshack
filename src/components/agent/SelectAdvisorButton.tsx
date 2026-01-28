"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface SelectAdvisorButtonProps {
  agentId: string
  className?: string
  currentAdvisorId?: string | null
}

export default function SelectAdvisorButton({
  agentId,
  className,
  currentAdvisorId,
}: SelectAdvisorButtonProps) {
  const [loading, setLoading] = useState(false)
  const [isSelected, setIsSelected] = useState(currentAdvisorId === agentId)
  const router = useRouter()

  const handleSelect = async () => {
    if (isSelected) {
      // Already selected, maybe toggle chat?
      router.push(`/agents/${agentId}`)
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/user/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advisorId: agentId }),
      })

      if (!res.ok) throw new Error("Failed to select advisor")

      setIsSelected(true)
      router.refresh()
      // Wait for refresh to complete or just push to reload?
      // Refresh should update server component which will see the new advisorId
      router.push(`/agents/${agentId}`)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleSelect} disabled={loading} className={className}>
      {loading
        ? "Processing..."
        : isSelected
          ? "Chat with Advisor"
          : "Select Advisor"}
    </Button>
  )
}
