import { useMemo } from "react"
import { useWatch, type UseFormReturn } from "react-hook-form"
import { LoanType } from "@prisma/client"
import { useRouter } from "next/navigation"
import { GeneralLoanFormValues } from "@/app/(site)/loanee/loan-application/types"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PlacesAutocompleteField } from "../PlacesAutocompleteField"
import { computePrequalification } from "@/lib/prequal"

interface GeneralLoanStepProps {
  form: UseFormReturn<GeneralLoanFormValues>
  subscriptionPlan?: "LOANEE_BASIC" | "LOANEE_STAY_SMART" | null
  freeTierActive?: boolean
}

export function GeneralLoanStep({
  form,
  subscriptionPlan,
  freeTierActive = false,
}: GeneralLoanStepProps) {
  const hasCoApplicant = form.watch("hasCoApplicant")

  const router = useRouter()
  console.log("🔍 GeneralLoanStep access check:", {
    subscriptionPlan,
    freeTierActive,
    canAccessPrequalification:
      freeTierActive || subscriptionPlan === "LOANEE_STAY_SMART",
  })

  const canAccessPrequalification =
    freeTierActive || subscriptionPlan === "LOANEE_STAY_SMART"
  const loanAmount =
    useWatch({ control: form.control, name: "loanAmount" }) ?? 0

  const creditScore =
    useWatch({ control: form.control, name: "creditScore" }) ?? 0

  const grossIncome =
    useWatch({ control: form.control, name: "grossIncome" }) ?? 0

  const monthlyDebts =
    useWatch({ control: form.control, name: "monthlyDebts" }) ?? 0

  const estimatedPropertyValue =
    useWatch({ control: form.control, name: "estimatedPropertyValue" }) ?? 0

  const loanType = useWatch({
    control: form.control,
    name: "loanType",
  }) as LoanType | undefined

  const workplaceDuration =
    useWatch({ control: form.control, name: "workplaceDuration" }) ?? 0

  const currentMortgageBalance =
    useWatch({ control: form.control, name: "currentMortgageBalance" }) ?? 0

  const monthlyMortgagePayment =
    useWatch({ control: form.control, name: "monthlyMortgagePayment" }) ?? 0

  const {
    dti,
    frontEndDTI,
    backEndDTI,
    gds,
    tds,
    tdsr,
    lti,
    ltv,
    creditTier,
    prequalStatus,
    prequalLabel,
    statusDetail,
    mortgageRangeMin,
    mortgageRangeMax,
    isMortgageLike,
    isRefinance,
    maxRefinanceAmount,
    availableRefinanceCash,
    eligibleMaxPayment,
  } = useMemo(
    () =>
      computePrequalification({
        loanAmount,
        creditScore,
        grossIncome,
        monthlyDebts,
        estimatedPropertyValue,
        workplaceDuration,
        loanType,
        currentMortgageBalance,
        monthlyMortgagePayment,
        propertyTaxMonthly: form.getValues("propertyTaxMonthly") || 0,
        heatingCostMonthly: form.getValues("heatingCosts") || 0,
        condoFeesMonthly: form.getValues("condoFees") || 0,
      }),
    [
      loanAmount,
      creditScore,
      grossIncome,
      monthlyDebts,
      estimatedPropertyValue,
      workplaceDuration,
      loanType,
      currentMortgageBalance,
      monthlyMortgagePayment,
      form,
    ]
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="loanAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desired Loan Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="50000"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : e.target.valueAsNumber
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Refinance-specific fields */}
      {loanType === LoanType.MORTGAGE_REFINANCE && (
        <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-blue-900">
            Refinance Information (Required for Canadian Standards)
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="currentMortgageBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Mortgage Balance *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 320000"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : e.target.valueAsNumber
                        )
                      }
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
                  <FormLabel>Current Mortgage Payment (Monthly) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 1600"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : e.target.valueAsNumber
                        )
                      }
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Required to avoid double-counting in debt calculations
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedPropertyValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Home Value *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 500000"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : e.target.valueAsNumber
                        )
                      }
                    />
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
                  <FormLabel>Property Tax (Monthly)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 300"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : e.target.valueAsNumber
                        )
                      }
                    />
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
                  <FormLabel>Heating Costs (Monthly)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Defaults to $135"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : e.target.valueAsNumber
                        )
                      }
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Leave blank to use standard $135/month
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condoFees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condo Fees (Monthly)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 200 (if applicable)"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : e.target.valueAsNumber
                        )
                      }
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-muted-foreground">
                    50% will be used in GDS calculation
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      <FormField
        control={form.control}
        name="hasCoApplicant"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Are you planning to add a co-applicant?</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value ? "yes" : "no"}
                onValueChange={(v) => field.onChange(v === "yes")}
                className="flex gap-4"
              >
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <RadioGroupItem value="yes" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>

                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <RadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />

      {hasCoApplicant && (
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="coApplicantFullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Co-applicant Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coApplicantDateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coApplicantAddress"
            render={() => (
              <PlacesAutocompleteField
                control={form.control}
                name="coApplicantAddress"
                label="Address"
                placeholder="123 Main St, City"
                onPlaceSelected={({ address }) => {
                  form.setValue("coApplicantAddress", address)
                }}
              />
            )}
          />
          <FormField
            control={form.control}
            name="coApplicantPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 123-456-7890" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coApplicantEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}

      {canAccessPrequalification && (
        <div className="mt-8 space-y-3 rounded-lg border bg-muted p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-semibold">Pre-qualification Summary</p>
              <p className="text-xs text-muted-foreground">
                Based on your financial inputs
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                prequalStatus === "APPROVED"
                  ? "bg-emerald-100 text-emerald-800"
                  : prequalStatus === "CONDITIONAL"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {prequalLabel}
            </span>
          </div>

          {/* Show refinance-specific info for Canadian refinance */}
          {isRefinance ? (
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
                        gds <= 39 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {gds.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
                        gds <= 39 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(gds, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Max: 39%</p>
                </div>

                <div className="rounded border bg-background p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      TDS (All Debts)
                    </p>
                    <span
                      className={`text-sm font-bold ${
                        tds <= 44 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tds.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
                        tds <= 44 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(tds, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Max: 44%</p>
                </div>
              </div>

              {/* Refinance Analysis */}
              <div className="space-y-2 rounded border bg-background p-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  Refinance Analysis
                </p>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Current Home Value:
                    </span>
                    <span className="font-medium">
                      ${estimatedPropertyValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Max Refinance (80%):
                    </span>
                    <span className="font-medium">
                      ${maxRefinanceAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Current Balance:
                    </span>
                    <span className="font-medium">
                      ${currentMortgageBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="font-medium">Available Cash:</span>
                    <span className="text-sm font-bold text-green-600">
                      ${availableRefinanceCash.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-muted-foreground">
                      Eligible Max Payment (15%):
                    </span>
                    <span className="font-medium">
                      ${eligibleMaxPayment.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-1">
                    <span className="text-muted-foreground">LTV: </span>
                    <span
                      className={`font-medium ${ltv > 80 ? "text-red-600" : "text-green-600"}`}
                    >
                      {ltv.toFixed(1)}%
                    </span>
                    {ltv > 80 && (
                      <span className="ml-2 text-xs font-semibold text-red-600">
                        Exceeds 80% limit!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded border-l-4 border-blue-500 bg-blue-50 p-2 text-xs text-blue-900">
                <strong>Note:</strong> Payment calculated using Bank of Canada
                stress test rate. Your actual payment may be lower.
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Credit Score</p>
                  <p className="font-medium">
                    {creditScore} ({creditTier})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">LTI</p>
                  <p className="font-medium">{lti.toFixed(1)}</p>
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
                    {frontEndDTI.toFixed(1)}%
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Existing debts only
                  </p>
                </div>

                <div className="rounded border bg-background p-3">
                  <p className="mb-1 text-xs text-muted-foreground">
                    Estimated DTI
                  </p>
                  <p className="text-2xl font-bold">{backEndDTI.toFixed(1)}%</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    With new loan payment
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Credit Score</p>
                  <p className="font-medium">
                    {creditScore} ({creditTier})
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">TDSR</p>
                  <p className="font-medium">{tdsr.toFixed(1)}%</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">LTI</p>
                  <p className="font-medium">{lti.toFixed(1)}</p>
                </div>

                {isMortgageLike && ltv > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">LTV</p>
                    <p className="font-medium">{ltv.toFixed(1)}%</p>
                  </div>
                )}
              </div>

              <div className="rounded border bg-background p-3 text-sm">
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    Eligible Max Payment (15% of income):
                  </p>
                  <p className="font-medium">
                    ${eligibleMaxPayment.toLocaleString()}
                  </p>
                </div>
              </div>

              {backEndDTI > 36 && backEndDTI <= 45 && (
                <div className="rounded border-l-4 border-amber-500 bg-amber-50 p-2 text-xs text-amber-900">
                  <strong>Notice:</strong> Your estimated DTI of{" "}
                  {backEndDTI.toFixed(1)}% is in the conditional range. Consider
                  reducing your loan amount or existing debts.
                </div>
              )}
            </>
          )}

          {isMortgageLike && !isRefinance && (
            <p className="text-xs text-muted-foreground">
              Suggested Range: ${mortgageRangeMin.toLocaleString()} – $
              {mortgageRangeMax.toLocaleString()}
            </p>
          )}

          {statusDetail && (
            <p className="text-xs text-muted-foreground">{statusDetail}</p>
          )}
        </div>
      )}

      {!canAccessPrequalification && (
        <div className="mt-8 rounded-lg border border-dashed bg-gray-50 p-4">
          <p className="font-semibold text-gray-800">
            Pre-qualification available on Smart plan
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Upgrade to view eligibility, risk score, and loan ranges.
          </p>

          <button
            type="button"
            onClick={() => router.push("/loanee/subscription")}
            className="mt-3 inline-flex rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700"
          >
            Upgrade to Smart
          </button>
        </div>
      )}
    </div>
  )
}
