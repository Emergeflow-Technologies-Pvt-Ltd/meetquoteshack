"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { QuickPrequalForm } from "@/components/shared/quick-prequal/QuickPrequalForm"
import { PrequalResultDisplay } from "@/components/shared/quick-prequal/PrequalResultDisplay"
import {
  PrequalResult,
  QuickPrequalValues,
} from "@/components/shared/quick-prequal/types"

export default function PrequalCheckCard() {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<PrequalResult | null>(null)
  const [formValues, setFormValues] = useState<QuickPrequalValues | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch("/api/user/prequal")
        if (response.ok) {
          const data = await response.json()
          if (data) {
            // Map API response to our types
            setResult({
              prequalStatus:
                data.prequalStatus as PrequalResult["prequalStatus"],
              prequalLabel: data.prequalLabel,
              statusDetail: data.statusDetail || "",
              frontEndDTI: Number(data.frontEndDTI),
              backEndDTI: Number(data.backEndDTI),
              gds: Number(data.gds),
              tds: Number(data.tds),
              tdsr: Number(data.tdsr),
              lti: Number(data.lti),
              ltv: Number(data.ltv),
              isRefinance: data.isRefinance,
              isMortgageLike: data.isMortgageLike,
              maxRefinanceAmount: Number(data.maxRefinanceAmount),
              availableRefinanceCash: Number(data.availableRefinanceCash),
              eligibleMaxPayment: Number(data.eligibleMaxPayment),
              creditTier: data.creditTier,
            })
            setFormValues({
              loanType: data.loanType,
              loanAmount: Number(data.loanAmount),
              grossIncome: Number(data.grossIncome),
              workplaceDuration: Number(data.workplaceDuration),
              creditScore: Number(data.creditScore),
              monthlyDebts: Number(data.monthlyDebts),
              savings: Number(data.savings),
              estimatedPropertyValue: Number(data.estimatedPropertyValue),
              currentMortgageBalance: Number(data.currentMortgageBalance),
              monthlyMortgagePayment: Number(data.monthlyMortgagePayment),
              propertyTaxMonthly: Number(data.propertyTaxMonthly),
              condoFees: Number(data.condoFees),
              heatingCosts: Number(data.heatingCosts),
            })
          }
        }
      } catch (error) {
        console.error("Failed to fetch prequal result", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [])

  const handleResult = async (
    newResult: PrequalResult,
    values: QuickPrequalValues
  ) => {
    setResult(newResult)
    setFormValues(values)
    setOpen(false)

    // Save to API
    try {
      await fetch("/api/user/prequal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ result: newResult, values }),
      })
    } catch (error) {
      console.error("Failed to save prequal result", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center p-6">
          Loading...
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          {!result ? (
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">
                Calculate Pre-qualification
              </span>
              <Button onClick={() => setOpen(true)}>Check Eligibility</Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  Pre-qualification Result
                </span>
                <Button variant="outline" onClick={() => setOpen(true)}>
                  Change Values
                </Button>
              </div>
              <PrequalResultDisplay
                result={result}
                creditScore={formValues?.creditScore || 0}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="pt-6 text-center text-2xl font-bold">
              Quick Pre-qualification Check
            </DialogTitle>
          </DialogHeader>
          <QuickPrequalForm
            onResult={handleResult}
            defaultValues={formValues || undefined}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
