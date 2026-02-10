"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoanType } from "@prisma/client"
import { computePrequalification } from "@/lib/prequal"
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

import { QuickPrequalValues, quickPrequalSchema, PrequalResult } from "./types"

interface QuickPrequalFormProps {
  onResult?: (result: PrequalResult, values: QuickPrequalValues) => void
  defaultValues?: Partial<QuickPrequalValues>
}

export function QuickPrequalForm({
  onResult,
  defaultValues,
}: QuickPrequalFormProps) {
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
      ...defaultValues,
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

    const prequalResult = computePrequalification(input) as PrequalResult

    if (onResult) {
      onResult(prequalResult, values)
    }

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

        {/* Submit Button */}
        <div className="flex justify-end pb-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Calculating..." : "Check Eligibility"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
