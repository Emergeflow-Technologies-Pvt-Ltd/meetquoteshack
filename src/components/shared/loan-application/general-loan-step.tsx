import { useMemo } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { LoanType } from "@prisma/client";

import { GeneralLoanFormValues } from "@/app/(site)/loan-application/types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlacesAutocompleteField } from "../PlacesAutocompleteField";
import { computePrequalification } from "@/lib/prequal";

interface GeneralLoanStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

export function GeneralLoanStep({ form }: GeneralLoanStepProps) {
  const hasCoApplicant = form.watch("hasCoApplicant");

  const loanAmount = useWatch({
    control: form.control,
    name: "loanAmount",
  }) ?? 0;

  const creditScore = useWatch({
    control: form.control,
    name: "creditScore",
  }) ?? 0;

  const grossIncome = useWatch({
    control: form.control,
    name: "grossIncome",
  }) ?? 0;

  const monthlyDebts = useWatch({
    control: form.control,
    name: "monthlyDebts",
  }) ?? 0;

  const estimatedPropertyValue = useWatch({
    control: form.control,
    name: "estimatedPropertyValue",
  }) ?? 0;

  const loanType = useWatch({
    control: form.control,
    name: "loanType",
  }) as LoanType | undefined;

  const workplaceDuration = useWatch({
    control: form.control,
    name: "workplaceDuration",
  }) ?? 0;

  const {
    dti,
    tdsr,
    lti,
    ltv,
    availableForNewLoanMonthly,
    proposedLoanPayment,
    creditTier,
    prequalStatus,
    prequalLabel,
    statusDetail,
    mortgageRangeMin,
    mortgageRangeMax,
    isMortgageLike,
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
      }),
    [
      loanAmount,
      creditScore,
      grossIncome,
      monthlyDebts,
      estimatedPropertyValue,
      workplaceDuration,
      loanType,
    ]);

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
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? undefined
                        : e.target.valueAsNumber;
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="hasCoApplicant"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Are you planning to add a co-applicant?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === "yes")}
                value={
                  field.value === undefined
                    ? undefined
                    : field.value
                    ? "yes"
                    : "no"
                }
                className="flex flex-row gap-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="yes" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
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
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
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
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
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
                  form.setValue("coApplicantAddress", address);
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <div className="mt-8 border rounded-lg p-4 bg-muted space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Pre-qualification Summary</p>
            <p className="text-xs text-muted-foreground">
              Based on your income, debts, credit score, and requested loan
              amount.
            </p>
          </div>
          <span
            className={`px-3 py-1 text-xs rounded-full font-semibold ${
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Credit Score</p>
            <p className="font-medium">
              {creditScore || "N/A"}{" "}
              <span className="text-xs text-muted-foreground">
                ({creditTier})
              </span>
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">DTI (Back-End)</p>
            <p className="font-medium">
              {isFinite(dti) ? dti.toFixed(1) : "--"}%
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">TDSR</p>
            <p className="font-medium">
              {isFinite(tdsr) ? tdsr.toFixed(1) : "--"}%
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">LTI</p>
            <p className="font-medium">
              {isFinite(lti) ? lti.toFixed(1) : "--"}%
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Proposed Loan Payment (est.)
            </p>
            <p className="font-medium">
              {proposedLoanPayment > 0
                ? `$${proposedLoanPayment.toFixed(2)} / mo`
                : "--"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Available for New Loan (DTI rule)
            </p>
            <p className="font-medium">
              {availableForNewLoanMonthly > 0
                ? `$${availableForNewLoanMonthly.toFixed(2)} / mo`
                : "--"}
            </p>
          </div>

          {isMortgageLike && (
            <>
              <div>
                <p className="text-xs text-muted-foreground">LTV</p>
                <p className="font-medium">
                  {ltv > 0 && isFinite(ltv) ? ltv.toFixed(1) : "--"}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Suggested Mortgage Range
                </p>
                <p className="font-medium">
                  {mortgageRangeMin > 0 && mortgageRangeMax > 0
                    ? `$${mortgageRangeMin.toLocaleString()} - $${mortgageRangeMax.toLocaleString()}`
                    : "--"}
                </p>
              </div>
            </>
          )}
        </div>

        {statusDetail && (
          <p className="text-xs text-muted-foreground mt-2">
            {statusDetail}
          </p>
        )}
      </div>
    </div>
  );
}
