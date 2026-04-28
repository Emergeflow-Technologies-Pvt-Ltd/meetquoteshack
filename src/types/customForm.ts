import { LoanType } from "@prisma/client"

export type FieldConfig = {
  enabled?: boolean
  required?: boolean
  options?: LoanType[] // or LoanType[] if you want strict typing
}

export type StepFieldConfig = {
  [fieldName: string]: FieldConfig
}

export type CustomFormStep = {
  id: string
}

export type CustomFormConfig = {
  status: "ACTIVE" | "DISABLED"
  steps: CustomFormStep[]
  fields?: Record<string, StepFieldConfig>
  agentCode?: string | null // ✅ FIXED
}
