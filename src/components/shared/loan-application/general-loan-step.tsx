import { useMemo } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { LoanType } from "@prisma/client";
import { useRouter } from "next/navigation";
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
  subscriptionPlan?: "LOANEE_BASIC" | "LOANEE_STAY_SMART" | null;
  freeTierActive?: boolean;
}

export function GeneralLoanStep({
  form,
  subscriptionPlan,
  freeTierActive = false,
}: GeneralLoanStepProps) {
  const hasCoApplicant = form.watch("hasCoApplicant");

  const router = useRouter();
  console.log("🔍 GeneralLoanStep access check:", {
    subscriptionPlan,
    freeTierActive,
    canAccessPrequalification:
      freeTierActive || subscriptionPlan === "LOANEE_STAY_SMART",
  });

  const canAccessPrequalification =
    freeTierActive || subscriptionPlan === "LOANEE_STAY_SMART";
  const loanAmount =
    useWatch({ control: form.control, name: "loanAmount" }) ?? 0;

  const creditScore =
    useWatch({ control: form.control, name: "creditScore" }) ?? 0;

  const grossIncome =
    useWatch({ control: form.control, name: "grossIncome" }) ?? 0;

  const monthlyDebts =
    useWatch({ control: form.control, name: "monthlyDebts" }) ?? 0;

  const estimatedPropertyValue =
    useWatch({ control: form.control, name: "estimatedPropertyValue" }) ?? 0;

  const loanType = useWatch({
    control: form.control,
    name: "loanType",
  }) as LoanType | undefined;

  const workplaceDuration =
    useWatch({ control: form.control, name: "workplaceDuration" }) ?? 0;

  const {
    dti,
    tdsr,
    lti,
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
    ]
  );

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

          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Credit Score</p>
              <p className="font-medium">
                {creditScore} ({creditTier})
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">DTI</p>
              <p className="font-medium">{dti.toFixed(1)}%</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">TDSR</p>
              <p className="font-medium">{tdsr.toFixed(1)}%</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">LTI</p>
              <p className="font-medium">{lti.toFixed(1)}</p>
            </div>
          </div>

          {isMortgageLike && (
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
  );
}
