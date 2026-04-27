import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { UseFormReturn } from "react-hook-form"
import type { GeneralLoanFormValues } from "@/app/(site)/loanee/loan-application/types"
import { CustomFormConfig } from "@/types/customForm"

interface EligibilityStepProps {
  form: UseFormReturn<GeneralLoanFormValues>
  config?: CustomFormConfig | null
  stepId?: string
}

export function EligibilityStep({
  form,
  config,
  stepId,
}: EligibilityStepProps) {
  // ✅ STEP 3: ADD MAPPING HERE
  const stepKeyMapping: Record<string, string> = {
    eligibility: "step-1",
    type: "step-2",
    personal: "step-3",
    residence: "step-4",
    employment: "step-5",
    financial: "step-6",
    loan: "step-7",
  }

  // ✅ use mapping
  const backendStepKey = stepKeyMapping[stepId || ""]

  // ✅ FIXED allowedFields
  const allowedFields = config?.fields?.[backendStepKey]

  const showAll = !allowedFields
  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {(showAll || allowedFields?.isAdult?.enabled) && (
        <FormField
          control={form.control}
          name="isAdult"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-between rounded-lg border p-4 md:flex-row md:p-6 lg:p-8">
              <div className="w-full space-y-0.5 md:w-2/3 md:space-y-1 lg:w-3/4 lg:space-y-2">
                <FormLabel className="text-base md:text-lg lg:text-xl">
                  Terms, Age and Privacy Agreement
                </FormLabel>
                <FormDescription>
                  By clicking this button, you are accepting the terms...
                </FormDescription>
                <FormMessage />
              </div>
              <FormControl className="ml-auto mt-4 md:mt-0">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      {(showAll || allowedFields?.hasBankruptcy?.enabled) && (
        <FormField
          control={form.control}
          name="hasBankruptcy"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-between rounded-lg border p-4 md:flex-row md:p-6 lg:p-8">
              <div className="w-full space-y-0.5 md:w-2/3 md:space-y-1 lg:w-3/4 lg:space-y-2">
                <FormLabel className="text-base md:text-lg lg:text-xl">
                  Bankruptcy Status
                </FormLabel>
                <FormDescription>
                  Have you filed for bankruptcy/consumer proposal?
                </FormDescription>
                <FormMessage />
              </div>
              <FormControl className="ml-auto mt-4 md:mt-0">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      {(showAll || allowedFields?.agentCode?.enabled) && (
        <FormField
          control={form.control}
          name="agentCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Code (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter agent code eg AG-1001"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
