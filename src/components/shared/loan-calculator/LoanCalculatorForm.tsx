"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

import {
  calculateInstallmentLoan,
  calculateCarLoanCanada,
  calculateLineOfCreditCanada,
  calculateCanadianMortgage,
  calculateMortgageRestOfWorld,
} from "@/lib/loan-calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define strict types for provinces
const PROVINCES = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
] as const

const PROVINCE_OPTIONS = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon Territory" },
] as const

// Base schema for shared validations
const baseSchema = z.object({
  interestRate: z.number().min(0, "Interest rate must be positive"),
})

// Personal Loan Schema
const personalLoanSchema = baseSchema.extend({
  loanAmount: z
    .number()
    .min(0, "Loan amount must be positive")
    .max(100000, "Loan amount cannot exceed $100,000"),
  interestRate: z
    .number()
    .min(0, "Interest rate must be positive")
    .max(30, "Interest rate cannot exceed 30%"),
  loanTerm: z
    .number()
    .int("Loan term must be a whole number")
    .min(1, "Loan term is required")
    .max(120, "Loan term cannot exceed 120 months"),
  paymentFrequency: z.enum(["monthly", "biweekly", "weekly"]),
})

// Car Loan Schema
const carLoanSchema = baseSchema
  .extend({
    vehiclePrice: z.number().min(0, "Vehicle price must be positive"),
    downPayment: z.number().min(0).default(0),
    tradeInValue: z.number().min(0).default(0),
    interestRate: z
      .number()
      .min(0, "Interest rate must be positive")
      .max(30, "Interest rate cannot exceed 30%"),
    loanTerm: z
      .number()
      .int("Loan term must be a whole number")
      .min(1, "Loan term is required")
      .max(96, "Loan term cannot exceed 96 months"),
    paymentFrequency: z.enum(["monthly", "biweekly", "weekly"]),
    province: z.enum(PROVINCES, {
      required_error: "Province is required",
    }),
  })
  .refine((data) => data.downPayment <= data.vehiclePrice, {
    message: "Down payment cannot exceed vehicle price",
    path: ["downPayment"],
  })
  .refine((data) => data.tradeInValue <= data.vehiclePrice, {
    message: "Trade-in value cannot exceed vehicle price",
    path: ["tradeInValue"],
  })

// Line of Credit Schema
const lineOfCreditSchema = baseSchema.extend({
  currentBalance: z.number().min(0, "Current balance must be positive"),
  interestRate: z
    .number()
    .min(0, "Interest rate must be positive")
    .max(30, "Interest rate cannot exceed 30%"),
  paymentType: z.enum(["interest_only", "minimum_percent"]),
  principalPercent: z
    .number()
    .min(0, "Must be positive")
    .max(100, "Cannot exceed 100%")
    .optional(),
  fixedMonthlyPayment: z.number().min(0, "Payment must be positive").optional(),
})

// Mortgage Canada Schema
const mortgageCanadaSchema = baseSchema
  .extend({
    purchasePrice: z.number().min(0, "Purchase price must be positive"),
    downPaymentAmount: z.number().min(0).optional(),
    downPaymentPercent: z.number().min(0).optional(),
    interestRate: z
      .number()
      .min(0, "Interest rate must be positive")
      .max(20, "Interest rate cannot exceed 20%"),
    amortizationPeriod: z.enum(["25", "30"]),
    termLength: z.enum(["1", "2", "3", "4", "5"]),
    paymentFrequency: z.enum([
      "monthly",
      "biweekly",
      "accelerated_biweekly",
      "weekly",
      "accelerated_weekly",
    ]),
  })
  .refine(
    (data) => {
      const price = data.purchasePrice || 0
      const dpAmount = data.downPaymentAmount
      const dpPercent = data.downPaymentPercent

      if (dpAmount !== undefined) {
        return dpAmount >= price * 0.05
      }
      if (dpPercent !== undefined) {
        return dpPercent >= 5
      }
      return true
    },
    {
      message: "Down payment must be at least 5% of purchase price",
      path: ["downPaymentAmount"],
    }
  )

// Mortgage Other Schema
const mortgageOtherSchema = baseSchema.extend({
  homePrice: z.number().min(0, "Home price must be positive"),
  downPaymentPercent: z.number().min(0, "Down payment must be positive"),
  interestRate: z
    .number()
    .min(0, "Interest rate must be positive")
    .max(20, "Interest rate cannot exceed 20%"),
  loanTerm: z.enum(["15", "20", "30"]),
  annualPropertyTax: z.number().min(0, "Property tax must be positive"),
  annualInsurance: z.number().min(0, "Insurance must be positive"),
  pmiRate: z.number().min(0).optional(),
  monthlyHoaFees: z.number().min(0).optional(),
})

type LoanType = "PERSONAL_LOAN" | "CAR_LOAN" | "LINE_OF_CREDIT" | "MORTGAGE"

interface Props {
  loanType: LoanType | string
  formId?: string
}

export default function LoanCalculatorForm({ loanType, formId }: Props) {
  return (
    <div className="mx-auto max-w-2xl">
      {loanType === "PERSONAL_LOAN" && <PersonalLoanForm formId={formId} />}
      {loanType === "CAR_LOAN" && <CarLoanForm formId={formId} />}
      {loanType === "LINE_OF_CREDIT" && <LineOfCreditForm formId={formId} />}
      {loanType === "MORTGAGE" && <MortgageForm formId={formId} />}
    </div>
  )
}

function PersonalLoanForm({ formId }: { formId?: string }) {
  const [results, setResults] = useState<{
    payment: number
    totalInterest: number
    totalCost: number
  } | null>(null)

  const form = useForm<z.infer<typeof personalLoanSchema>>({
    resolver: zodResolver(personalLoanSchema),
    defaultValues: {
      paymentFrequency: "monthly",
    },
  })

  function onSubmit(data: z.infer<typeof personalLoanSchema>) {
    const res = calculateInstallmentLoan({
      principal: data.loanAmount,
      annualRatePercent: data.interestRate,
      termMonths: data.loanTerm,
      paymentFrequency: data.paymentFrequency,
    })
    setResults(res)
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="loanAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    className="pl-7"
                    placeholder="10000"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate (APR %)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-8"
                      placeholder="5.99"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loanTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Term (Months)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="60"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="paymentFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Frequency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      {results && (
        <Card className="mt-8 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Payment ({form.getValues("paymentFrequency")}):</span>
              <span className="font-bold">${results.payment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Interest:</span>
              <span className="font-bold">
                ${results.totalInterest.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Cost:</span>
              <span className="font-bold">${results.totalCost.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </Form>
  )
}

function CarLoanForm({ formId }: { formId?: string }) {
  const [results, setResults] = useState<{
    payment: number
    totalInterest: number
    totalCost: number
    taxAmount: number
    financedAmount: number
  } | null>(null)

  const form = useForm<z.infer<typeof carLoanSchema>>({
    resolver: zodResolver(carLoanSchema),
    defaultValues: {
      paymentFrequency: "monthly",
      downPayment: 0,
      tradeInValue: 0,
    },
  })

  function onSubmit(data: z.infer<typeof carLoanSchema>) {
    const res = calculateCarLoanCanada({
      vehiclePrice: data.vehiclePrice,
      downPayment: data.downPayment,
      tradeIn: data.tradeInValue,
      province: data.province,
      annualRatePercent: data.interestRate,
      termMonths: data.loanTerm,
      paymentFrequency: data.paymentFrequency,
    })
    setResults(res)
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="vehiclePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    className="pl-7"
                    placeholder="35000"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="downPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Down Payment</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      className="pl-7"
                      placeholder="5000"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tradeInValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trade-In Value</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      className="pl-7"
                      placeholder="0"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate (APR %)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-8"
                      placeholder="6.99"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loanTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Term (Months)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="72"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="paymentFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Frequency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROVINCE_OPTIONS.map((prov) => (
                      <SelectItem key={prov.value} value={prov.value}>
                        {prov.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
      {results && (
        <Card className="mt-8 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Payment ({form.getValues("paymentFrequency")}):</span>
              <span className="font-bold">${results.payment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax:</span>
              <span className="font-bold">${results.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Financed:</span>
              <span className="font-bold">
                ${results.financedAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Interest:</span>
              <span className="font-bold">
                ${results.totalInterest.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Cost:</span>
              <span className="font-bold">${results.totalCost.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </Form>
  )
}

function LineOfCreditForm({ formId }: { formId?: string }) {
  const [results, setResults] = useState<{
    monthlyInterest: number
    minimumPayment: number
    payoffMonths: number | null
  } | null>(null)

  const form = useForm<z.infer<typeof lineOfCreditSchema>>({
    resolver: zodResolver(lineOfCreditSchema),
    defaultValues: {
      paymentType: "interest_only",
      principalPercent: 2,
    },
  })

  const paymentType = form.watch("paymentType")

  function onSubmit(data: z.infer<typeof lineOfCreditSchema>) {
    const res = calculateLineOfCreditCanada({
      balance: data.currentBalance,
      annualRatePercent: data.interestRate,
      paymentType: data.paymentType,
      principalPercent: data.principalPercent
        ? data.principalPercent / 100
        : 0.02,
      fixedMonthlyPayment: data.fixedMonthlyPayment,
    })
    setResults(res)
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="currentBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Balance</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    className="pl-7"
                    placeholder="5000"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interestRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interest Rate (APR %)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    className="pr-8"
                    placeholder="8.50"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Payment Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="interest_only" />
                    </FormControl>
                    <FormLabel className="font-normal">Interest Only</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="minimum_percent" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Interest + % of Balance
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {paymentType === "minimum_percent" && (
          <FormField
            control={form.control}
            name="principalPercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Principal Percentage (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-8"
                      placeholder="2.00"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="fixedMonthlyPayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fixed Monthly Payment (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    className="pl-7"
                    placeholder="Optional"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      {results && (
        <Card className="mt-8 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Monthly Interest:</span>
              <span className="font-bold">
                ${results.monthlyInterest.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Minimum Payment:</span>
              <span className="font-bold">
                ${results.minimumPayment.toFixed(2)}
              </span>
            </div>
            {results.payoffMonths !== null && (
              <div className="flex justify-between">
                <span>Payoff Time:</span>
                <span className="font-bold">
                  {results.payoffMonths === Infinity
                    ? "Never (Payment too low)"
                    : `${results.payoffMonths} months`}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Form>
  )
}

function MortgageForm({ formId }: { formId?: string }) {
  const [location, setLocation] = useState<"CANADA" | "OTHER">("CANADA")

  // We are creating two separate forms based on location to toggle betweeen fields
  if (location === "CANADA") {
    return (
      <div className="space-y-6">
        <MortgageLocationToggle location={location} onChange={setLocation} />
        <MortgageCanadaForm formId={formId} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <MortgageLocationToggle location={location} onChange={setLocation} />
      <MortgageOtherForm formId={formId} />
    </div>
  )
}

function MortgageLocationToggle({
  location,
  onChange,
}: {
  location: "CANADA" | "OTHER"
  onChange: (loc: "CANADA" | "OTHER") => void
}) {
  return (
    <div className="flex flex-col space-y-3">
      <Label>Mortgage Location</Label>
      <RadioGroup
        onValueChange={(val) => onChange(val as "CANADA" | "OTHER")}
        value={location}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="CANADA" id="loc-canada" />
          <Label htmlFor="loc-canada" className="cursor-pointer font-normal">
            Canada
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="OTHER" id="loc-other" />
          <Label htmlFor="loc-other" className="cursor-pointer font-normal">
            Other Countries
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}

function MortgageCanadaForm({ formId }: { formId?: string }) {
  const [results, setResults] = useState<{
    payment: number
    mortgageAmount: number
    cmhcPremiumAmount: number
    cmhcApplied: boolean
  } | null>(null)

  const form = useForm<z.infer<typeof mortgageCanadaSchema>>({
    resolver: zodResolver(mortgageCanadaSchema),
    defaultValues: {
      amortizationPeriod: "25",
      termLength: "5",
      paymentFrequency: "monthly",
    },
  })

  function onSubmit(data: z.infer<typeof mortgageCanadaSchema>) {
    try {
      const res = calculateCanadianMortgage({
        purchasePrice: data.purchasePrice,
        downPayment:
          data.downPaymentAmount ||
          (data.downPaymentPercent
            ? (data.purchasePrice * data.downPaymentPercent) / 100
            : 0),
        annualRatePercent: data.interestRate,
        amortizationYears: Number(data.amortizationPeriod),
        paymentFrequency: data.paymentFrequency,
      })
      setResults(res)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="purchasePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    className="pl-7"
                    placeholder="500000"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value
                      const numVal = val === "" ? "" : Number(val)
                      field.onChange(numVal)

                      // Update down payment amount based on existing percent
                      if (typeof numVal === "number") {
                        const percent = form.getValues("downPaymentPercent")
                        if (percent) {
                          form.setValue(
                            "downPaymentAmount",
                            (numVal * percent) / 100
                          )
                        }
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="downPaymentAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Down Payment ($)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      className="pl-7"
                      placeholder="100000"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value
                        const numVal = val === "" ? "" : Number(val)
                        field.onChange(numVal)

                        // Update percent based on this amount
                        if (typeof numVal === "number") {
                          const price = form.getValues("purchasePrice")
                          if (price && price > 0) {
                            form.setValue(
                              "downPaymentPercent",
                              (numVal / price) * 100
                            )
                          }
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="downPaymentPercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Down Payment (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-8"
                      placeholder="20"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value
                        const numVal = val === "" ? "" : Number(val)
                        field.onChange(numVal)

                        // Update amount based on this percent
                        if (typeof numVal === "number") {
                          const price = form.getValues("purchasePrice")
                          if (price && price > 0) {
                            form.setValue(
                              "downPaymentAmount",
                              (price * numVal) / 100
                            )
                          }
                        }
                      }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="interestRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interest Rate (%)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    className="pr-8"
                    placeholder="4.50"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="amortizationPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amortization Period</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["25", "30"].map((year) => (
                      <SelectItem key={year} value={year}>
                        {year} Years
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
            name="termLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mortgage Term</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["1", "2", "3", "4", "5"].map((year) => (
                      <SelectItem key={year} value={year}>
                        {year} Years
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="paymentFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Frequency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="accelerated_biweekly">
                    Accelerated Bi-weekly
                  </SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="accelerated_weekly">
                    Accelerated Weekly
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      {results && (
        <Card className="mt-8 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>
                Mortgage Payment ({form.getValues("paymentFrequency")}):
              </span>
              <span className="font-bold">${results.payment.toFixed(2)}</span>
            </div>
            {results.cmhcApplied && (
              <div className="flex justify-between">
                <span>CMHC Insurance (Added to Loan):</span>
                <span className="font-bold">
                  ${results.cmhcPremiumAmount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Total Mortgage Amount:</span>
              <span className="font-bold">
                ${results.mortgageAmount.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </Form>
  )
}

function MortgageOtherForm({ formId }: { formId?: string }) {
  const [results, setResults] = useState<{
    principalInterest: number
    monthlyTax: number
    monthlyInsurance: number
    monthlyPMI: number
    totalMonthlyPayment: number
  } | null>(null)

  const form = useForm<z.infer<typeof mortgageOtherSchema>>({
    resolver: zodResolver(mortgageOtherSchema),
    defaultValues: {
      loanTerm: "30",
    },
  })

  function onSubmit(data: z.infer<typeof mortgageOtherSchema>) {
    const res = calculateMortgageRestOfWorld({
      homePrice: data.homePrice,
      downPaymentPercent: data.downPaymentPercent,
      annualRatePercent: data.interestRate,
      termYears: Number(data.loanTerm),
      annualPropertyTax: data.annualPropertyTax,
      annualInsurance: data.annualInsurance,
      pmiRatePercent: data.pmiRate || 0,
      monthlyHOA: data.monthlyHoaFees || 0,
    })
    setResults(res)
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="homePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    className="pl-7"
                    placeholder="400000"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="downPaymentPercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Down Payment (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-8"
                      placeholder="20"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-8"
                      placeholder="3.5"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="loanTerm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Term</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["15", "20", "30"].map((year) => (
                    <SelectItem key={year} value={year}>
                      {year} Years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="annualPropertyTax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Property Tax</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      className="pl-7"
                      placeholder="3000"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="annualInsurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Insurance</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      className="pl-7"
                      placeholder="1200"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="pmiRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PMI Rate</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-8"
                      placeholder="0.5"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlyHoaFees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly HOA Fees</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      className="pl-7"
                      placeholder="200"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
      {results && (
        <Card className="mt-8 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Principal & Interest:</span>
              <span className="font-bold">
                ${results.principalInterest.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Property Tax (Monthly):</span>
              <span className="font-bold">
                ${results.monthlyTax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Homeowners Insurance (Monthly):</span>
              <span className="font-bold">
                ${results.monthlyInsurance.toFixed(2)}
              </span>
            </div>
            {results.monthlyPMI > 0 && (
              <div className="flex justify-between">
                <span>PMI (Monthly):</span>
                <span className="font-bold">
                  ${results.monthlyPMI.toFixed(2)}
                </span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t pt-2">
              <span className="font-semibold">Total Monthly Payment:</span>
              <span className="text-lg font-bold text-primary">
                ${results.totalMonthlyPayment.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </Form>
  )
}
