"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoanType } from "@prisma/client"
import { computePrequalification, type PrequalStatus } from "@/lib/prequal"
import { convertEnumValueToLabel } from "@/lib/utils"
// UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { QuickPrequalValues, quickPrequalSchema } from "./types"

interface PrequalResult {
  prequalStatus: PrequalStatus
  prequalLabel: string
  statusDetail: string
  frontEndDTI: number
  backEndDTI: number
  gds: number
  tds: number
  tdsr: number
  lti: number
  ltv: number
  isRefinance: boolean
  isMortgageLike: boolean
  maxRefinanceAmount: number
  availableRefinanceCash: number
  eligibleMaxPayment: number
  creditTier: string
}

export function QuickPrequalForm() {
  const [result, setResult] = useState<PrequalResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<QuickPrequalValues>({
    resolver: zodResolver(quickPrequalSchema),
    defaultValues: {
      loanType: undefined,
      loanAmount: 0,
      grossIncome: 0,
      workplaceDuration: 0,
      creditScore: 0,
      monthlyDebts: 0,
      savings: 0,
      estimatedPropertyValue: 0,
      currentMortgageBalance: 0,
      monthlyMortgagePayment: 0,
      propertyTaxMonthly: 0,
      condoFees: 0,
      heatingCosts: 0,
    },
    mode: "onChange",
  })

  const loanType = form.watch("loanType")
  const isLoanTypeRefinance = loanType === LoanType.MORTGAGE_REFINANCE

  async function onSubmit(values: QuickPrequalValues) {
    setIsSubmitting(true)

    // Simulate a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    const input = {
      loanAmount: Number(values.loanAmount || 0),
      creditScore: Number(values.creditScore || 0),
      grossIncome: Number(values.grossIncome || 0),
      monthlyDebts: Number(values.monthlyDebts || 0),
      estimatedPropertyValue: Number(values.estimatedPropertyValue || 0),
      workplaceDuration: Number(values.workplaceDuration || 0),
      loanType: values.loanType,
      currentMortgageBalance: Number(values.currentMortgageBalance || 0),
      monthlyMortgagePayment: Number(values.monthlyMortgagePayment || 0),
      propertyTaxMonthly: Number(values.propertyTaxMonthly || 0),
      heatingCostMonthly: Number(values.heatingCosts || 0),
      condoFeesMonthly: Number(values.condoFees || 0),
    }

    const prequalResult = computePrequalification(input)
    setResult(prequalResult as PrequalResult)
    setIsSubmitting(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-6 md:px-8"
      >
        {/* Loan Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="loanType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Loan Type <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(LoanType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {convertEnumValueToLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Loan Amount <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 50000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Income & Employment */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="grossIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Annual Gross Income <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 85000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workplaceDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Years of Work Experience{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Financial Profile */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="creditScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Credit Score <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 720" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="monthlyDebts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Monthly Debts <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="savings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Savings (Optional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 10000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Refinance / Property Specifics */}
        {isLoanTypeRefinance && (
          <div className="space-y-4 rounded-md bg-blue-50 p-4">
            <h3 className="text-sm font-semibold text-blue-900">
              Refinance Details (Required)
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="estimatedPropertyValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Current Home Value <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 600000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentMortgageBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Current Mortgage Balance{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 300000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyMortgagePayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Current Monthly Payment{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 1800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyTaxMonthly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Property Tax Monthly{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heatingCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Heating Costs Monthly{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 135" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="condoFees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condo Fees Monthly (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Results Section - Only shown after submission */}
        {result && (
          <div
            className={`mt-6 space-y-3 rounded-lg border p-4 ${
              result.prequalStatus === "APPROVED"
                ? "border-emerald-500 bg-emerald-50/50"
                : result.prequalStatus === "CONDITIONAL"
                  ? "border-amber-500 bg-amber-50/50"
                  : "border-red-500 bg-red-50/50"
            }`}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Pre-qualification Summary
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on your financial inputs
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  result.prequalStatus === "APPROVED"
                    ? "bg-emerald-100 text-emerald-800"
                    : result.prequalStatus === "CONDITIONAL"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {result.prequalLabel}
              </span>
            </div>

            {/* Show refinance-specific info for Canadian refinance */}
            {result.isRefinance ? (
              <>
                {/* Canadian GDS/TDS Display */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded border bg-background p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        GDS (Housing Only)
                      </p>
                      <span
                        className={`text-sm font-bold ${
                          result.gds <= 39 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.gds.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full ${
                          result.gds <= 39 ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(result.gds, 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Max: 39%
                    </p>
                  </div>

                  <div className="rounded border bg-background p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        TDS (All Debts)
                      </p>
                      <span
                        className={`text-sm font-bold ${
                          result.tds <= 44 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.tds.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full ${
                          result.tds <= 44 ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(result.tds, 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Max: 44%
                    </p>
                  </div>
                </div>

                {/* Refinance Analysis */}
                <div className="space-y-1 rounded border bg-background p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Available Refinance Cash:
                    </span>
                    <span className="font-bold text-emerald-600">
                      ${result.availableRefinanceCash.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LTV:</span>
                    <span
                      className={
                        result.ltv > 80
                          ? "font-bold text-red-600"
                          : "font-medium"
                      }
                    >
                      {result.ltv.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Credit Score
                    </p>
                    <p className="font-medium">
                      {form.getValues("creditScore")} ({result.creditTier})
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">LTI</p>
                    <p className="font-medium">{result.lti.toFixed(1)}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Regular DTI Display for non-refinance loans */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded border bg-background p-3">
                    <p className="mb-1 text-xs text-muted-foreground">
                      Current DTI
                    </p>
                    <p className="text-2xl font-bold">
                      {result.frontEndDTI.toFixed(1)}%
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Existing debts only
                    </p>
                  </div>

                  <div className="rounded border bg-background p-3">
                    <p className="mb-1 text-xs text-muted-foreground">
                      Estimated DTI
                    </p>
                    <p className="text-2xl font-bold">
                      {result.backEndDTI.toFixed(1)}%
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      With new loan payment
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Credit Score
                    </p>
                    <p className="font-medium">
                      {form.getValues("creditScore")} ({result.creditTier})
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">TDSR</p>
                    <p className="font-medium">{result.tdsr.toFixed(1)}%</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">LTI</p>
                    <p className="font-medium">{result.lti.toFixed(1)}</p>
                  </div>

                  {result.isMortgageLike && result.ltv > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">LTV</p>
                      <p className="font-medium">{result.ltv.toFixed(1)}%</p>
                    </div>
                  )}
                </div>

                <div className="rounded border bg-background p-3 text-sm">
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">
                      Eligible Max Payment (15% of income):
                    </p>
                    <p className="font-medium">
                      ${result.eligibleMaxPayment.toLocaleString()}
                    </p>
                  </div>
                </div>
              </>
            )}

            {result.statusDetail && (
              <p className="text-xs text-muted-foreground">
                {result.statusDetail}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Calculating..." : "Check Eligibility"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
