import { LoanType } from "@prisma/client"
import * as z from "zod"

const moneyField = (message: string) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) {
        return 0
      }
      if (typeof val === "string") {
        const trimmed = val.trim()
        if (trimmed === "") return 0
        return Number(trimmed)
      }
      return val
    },
    z.number().min(0, message)
  )

export const quickPrequalSchema = z.object({
  // Loan Details
  loanType: z.nativeEnum(LoanType, {
    required_error: "Please select a loan type",
  }),
  loanAmount: z.coerce
    .number({ required_error: "Loan amount is required" })
    .positive("Loan amount must be positive"),

  // Employment & Income
  grossIncome: z.coerce
    .number({ required_error: "Gross annual income is required" })
    .min(0),
  workplaceDuration: z.coerce
    .number({ required_error: "Years of experience is required" })
    .min(0, "Years cannot be negative"),

  // Financials
  creditScore: z.coerce
    .number({ required_error: "Credit score is required" })
    .min(300, "Credit score must be at least 300")
    .max(900, "Credit score cannot exceed 900"),
  monthlyDebts: moneyField("Monthly debts must be 0 or more"),
  savings: moneyField("Savings must be 0 or more").optional(),

  // Property / Refinance Specific
  estimatedPropertyValue: moneyField(
    "Property value must be 0 or more"
  ).optional(),
  currentMortgageBalance: moneyField(
    "Current mortgage balance must be 0 or more"
  ).optional(),
  monthlyMortgagePayment: moneyField(
    "Monthly mortgage payment must be 0 or more"
  ).optional(),
  propertyTaxMonthly: moneyField(
    "Monthly property tax must be 0 or more"
  ).optional(),
  condoFees: moneyField("Monthly condo fees must be 0 or more").optional(),
  heatingCosts: moneyField(
    "Monthly heating costs must be 0 or more"
  ).optional(),
})

export type QuickPrequalValues = z.infer<typeof quickPrequalSchema>

export interface PrequalResult {
  prequalStatus: "APPROVED" | "CONDITIONAL" | "DENIED"
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
