import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { UseFormReturn } from "react-hook-form"
import type { GeneralLoanFormValues } from "@/app/(site)/loanee/loan-application/types"

import { MaritalStatus, EducationLevel } from "@prisma/client"
import { convertEnumValueToLabel } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CustomFormConfig } from "@/types/customForm"

interface PersonalStepProps {
  form: UseFormReturn<GeneralLoanFormValues>
  config?: CustomFormConfig | null
  stepId?: string
}

export function PersonalStep({ form, config, stepId }: PersonalStepProps) {
  const stepKeyMapping: Record<string, string> = {
    eligibility: "step-1",
    type: "step-2",
    personal: "step-3",
    residence: "step-4",
    employment: "step-5",
    financial: "step-6",
    loan: "step-7",
  }

  const backendStepKey = stepKeyMapping[stepId || ""]
  const allowedFields = config?.fields?.[backendStepKey]

  const isFieldVisible = (field: keyof GeneralLoanFormValues) => {
    if (!allowedFields) return true
    return allowedFields[field]?.enabled === true
  }
  // console.log("STEP ID:", stepId)
  // console.log("BACKEND KEY:", backendStepKey)
  // console.log("CONFIG:", config)
  // console.log("FIELDS:", config?.fields)
  // console.log("ALLOWED FIELDS:", allowedFields)

  return (
    <div className="space-y-4">
      {/* Name */}
      <div className="grid gap-4 md:grid-cols-2">
        {isFieldVisible("firstName") && (
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isFieldVisible("lastName") && (
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* DOB & Marital Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {isFieldVisible("dateOfBirth") && (
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Date of Birth <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().split("T")[0]
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isFieldVisible("maritalStatus") && (
          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Marital Status <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MaritalStatus).map(([value]) => (
                        <SelectItem key={value} value={value}>
                          {convertEnumValueToLabel(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Phone & Email */}
      <div className="grid gap-4 md:grid-cols-2">
        {isFieldVisible("personalPhone") && (
          <FormField
            control={form.control}
            name="personalPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isFieldVisible("personalEmail") && (
          <FormField
            control={form.control}
            name="personalEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email Address <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* SIN */}
      {isFieldVisible("sin") && (
        <FormField
          control={form.control}
          name="sin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SIN / SSN</FormLabel>
              <FormControl>
                <Input
                  placeholder="123456789"
                  value={field.value ? field.value.toString() : ""}
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/\D/g, ""))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Education */}
      {isFieldVisible("generalEducationLevel") && (
        <FormField
          control={form.control}
          name="generalEducationLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Level</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value as string}
                >
                  {Object.entries(EducationLevel).map(([value]) => (
                    <FormItem
                      key={value}
                      className="flex items-center space-x-2"
                    >
                      <FormControl>
                        <RadioGroupItem value={value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {convertEnumValueToLabel(value)}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Field of Study */}
      {isFieldVisible("generalFieldOfStudy") && (
        <FormField
          control={form.control}
          name="generalFieldOfStudy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field of Study</FormLabel>
              <FormControl>
                <Input placeholder="Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
