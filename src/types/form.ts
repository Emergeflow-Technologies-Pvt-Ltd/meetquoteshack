import { LoanType } from "@prisma/client"

export type SubStep = {
  key: string
  label: string
  required?: boolean
  options?: LoanType[] // only for loanType
}

export type FormStep = {
  id: string
  title: string
  description?: string
  variant?: "compact" | "default"
  subSteps: SubStep[]
}
