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

interface GeneralLoanStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

type PrequalStatus = "APPROVED" | "CONDITIONAL" | "DECLINED";

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
  } = useMemo(() => {
    const safe = (n: unknown) =>
      typeof n === "number" && isFinite(n) ? n : 0;

    const P = safe(loanAmount);             
    const grossYear = safe(grossIncome);      
    const grossMonth = grossYear / 12;        
    const existingDebts = safe(monthlyDebts); 
    const propValue = safe(estimatedPropertyValue);
    const employmentYears = safe(workplaceDuration);

    const mortgageLikeLoanTypes: LoanType[] = [
      LoanType.FIRST_TIME_HOME,
      LoanType.MORTGAGE_REFINANCE,
      LoanType.INVESTMENT_PROPERTY,
      LoanType.HELOC,
      LoanType.HOME_REPAIR,
    ];

    const isMortgageLike =
      !!loanType && mortgageLikeLoanTypes.includes(loanType);

    // ---- 1. Approximate proposed loan payment (A) ----
    // Rule 2: Back-End DTI = (Existing Debts + New Loan Payment) / Gross Monthly Income.
    // We assume:
    //   - Mortgage-like loans: 25 years @ 5%
    //   - Other loans: 5 years @ 10%
    const assumedTermYears = isMortgageLike ? 25 : 5;
    const assumedRateAnnual = isMortgageLike ? 5 : 10;
    const n = assumedTermYears * 12;
    const r = assumedRateAnnual / 100 / 12;

    let A = 0;
    if (P > 0 && r > 0 && n > 0) {
      const pow = Math.pow(1 + r, n);
      A = P * ((r * pow) / (pow - 1));
    }

    // ---- 2. Ratios ----

    // Back-end DTI = (Existing Debts + New Proposed Loan Payment) / Gross Monthly Income * 100
    const totalDebtWithNew = existingDebts + A;
    const dtiLocal =
      grossMonth > 0 ? (totalDebtWithNew / grossMonth) * 100 : 0;

    // TDSR = (Total monthly debt * 12) / Annual income * 100
    const tdsrLocal =
      grossYear > 0 ? ((existingDebts * 12) / grossYear) * 100 : 0;

    // LTI = LoanAmount / AnnualIncome * 100
    const ltiLocal =
      grossYear > 0 ? (P / grossYear) * 100 : 0;

    // LTV = LoanAmount / PropertyValue * 100 (only for mortgage-like loans)
    let ltvLocal = 0;
    if (isMortgageLike && propValue > 0 && P > 0) {
      ltvLocal = (P / propValue) * 100;
    }

    // ---- 3. Thresholds ----

    // Credit score cutoff
    const minCredit = isMortgageLike ? 650 : 730;

    // DTI thresholds
    const maxDTIForPass = 36; // strict pass for both
    const maxDTIForConditional = 40; // can stretch with conditions

    // TDSR threshold
    const maxTDSRForPass = 34;

    // LTI threshold
    const maxLTIForPass = 30;

    // Income requirement (non-mortgage only)
    const minIncomeNonMortgage = 50000;

    // Employment requirement
    const minEmploymentYears = 3;

    // LTV thresholds (for mortgage-like loans)
    const maxLTVIdeal = 80;
    const maxLTVAbsolute = 97;

    // ---- 4. Credit tier (Rule 1) ----
    let tier: "Excellent" | "Good" | "Fair" | "Poor" = "Poor";
    if (creditScore >= 720) tier = "Excellent";
    else if (creditScore >= 680) tier = "Good";
    else if (creditScore >= 620) tier = "Fair";

    // ---- 5. Base checks ----

    const incomeOk = isMortgageLike
      ? grossYear > 0 // any positive income; range is handled separately
      : grossYear > minIncomeNonMortgage; // > 50k for non-mortgage

    const tdsrOk = tdsrLocal < maxTDSRForPass;
    const dtiOk = dtiLocal < maxDTIForPass;
    const dtiConditionalOk =
      dtiLocal >= maxDTIForPass && dtiLocal <= maxDTIForConditional;

    const ltiOk = ltiLocal < maxLTIForPass;

    const creditOk = creditScore >= minCredit;
    const creditNear = !creditOk && creditScore >= minCredit - 20;

    const employmentOk = employmentYears > minEmploymentYears;

    let ltvOk = true;
    let ltvConditionalOk = false;

    if (isMortgageLike && ltvLocal > 0) {
      if (ltvLocal <= maxLTVIdeal) {
        ltvOk = true;
      } else if (ltvLocal > maxLTVIdeal && ltvLocal <= maxLTVAbsolute) {
        ltvOk = false;
        ltvConditionalOk = true; // allowed with PMI / higher rate
      } else {
        ltvOk = false;
        ltvConditionalOk = false; // too risky
      }
    }

    // ---- 6. Mortgage income → mortgage range ----
    let mortgageRangeMin = 0;
    let mortgageRangeMax = 0;

    if (isMortgageLike && grossYear > 0) {
      // From your examples:
      //  - 100k => 400k–600k
      //  -  20k => 80k–100k
      // So:
      //   min ≈ 4× income
      //   max ≈ 6× income (for income >= 50k), else 5×
      const minMultiple = 4;
      const maxMultiple = grossYear >= 50000 ? 6 : 5;

      mortgageRangeMin = grossYear * minMultiple;
      mortgageRangeMax = grossYear * maxMultiple;
    }

    // ---- 7. Prequalification decision ----

    let status: PrequalStatus = "DECLINED";
    const reasons: string[] = [];

    const allCoreOkNonMortgage =
      !isMortgageLike &&
      incomeOk &&
      tdsrOk &&
      dtiOk &&
      ltiOk &&
      creditOk &&
      employmentOk;

    const allCoreOkMortgage =
      isMortgageLike &&
      tdsrOk &&
      dtiOk &&
      ltiOk &&
      creditOk &&
      (ltvOk || (!ltvLocal && true)); // if no property value yet, skip LTV

    const allCoreOk = allCoreOkNonMortgage || allCoreOkMortgage;

    // reasons for non-approval
    if (!incomeOk && !isMortgageLike) {
      reasons.push("Annual income must be greater than $50,000.");
    }
    if (!creditOk) {
      reasons.push(
        `Credit score below minimum threshold (${minCredit}).`
      );
    }
    if (!employmentOk && !isMortgageLike) {
      reasons.push("Employment history should be greater than 3 years.");
    }
    if (!dtiOk) {
      reasons.push(`Debt-to-income ratio exceeds ${maxDTIForPass}%.`);
    }
    if (!tdsrOk) {
      reasons.push("Total debt service ratio exceeds 34%.");
    }
    if (!ltiOk) {
      reasons.push("Loan-to-income ratio exceeds 30% of annual income.");
    }
    if (isMortgageLike && ltvLocal > 0) {
      if (!ltvOk && ltvConditionalOk) {
        reasons.push(
          "Loan-to-value ratio is above 80%; private mortgage insurance or a higher rate may be required."
        );
      } else if (!ltvOk && !ltvConditionalOk) {
        reasons.push("Loan-to-value ratio is above acceptable maximum (97%).");
      }
    }

    // Decide status
    if (allCoreOk) {
      status = "APPROVED";
    } else if (
      (creditNear || dtiConditionalOk || ltvConditionalOk) &&
      creditScore >= 620 &&
      dtiLocal <= 45 &&
      tdsrLocal <= 40
    ) {
      status = "CONDITIONAL";
    } else {
      status = "DECLINED";
    }

    const label =
      status === "APPROVED"
        ? "Pre-Qualified"
        : status === "CONDITIONAL"
          ? "Likely Qualified with Conditions"
          : "Not Pre-Qualified";

    let statusDetail = "";
    if (status === "APPROVED") {
      statusDetail = isMortgageLike
        ? "You meet the current guidelines for a mortgage/property-backed loan based on income, debts, credit, and loan size."
        : "You meet the current guidelines for this loan type based on income, debts, credit, and loan-to-income ratio.";
    } else if (status === "CONDITIONAL") {
      statusDetail =
        "You may qualify with a lower loan amount, a larger down payment, or by improving one or more risk factors.";
    } else {
      statusDetail =
        reasons[0] ??
        "Based on the information provided, you are not pre-qualified at this time.";
    }

    // ---- 8. Available room for new loan (DTI rule) ----
    const maxDTIPercentForRule = isMortgageLike ? 0.36 : 0.4;
    const maxTotalMonthlyDebt = grossMonth * maxDTIPercentForRule;
    const availableForNewLoanMonthlyLocal = Math.max(
      maxTotalMonthlyDebt - existingDebts,
      0
    );

    return {
      dti: dtiLocal,
      tdsr: tdsrLocal,
      lti: ltiLocal,
      ltv: ltvLocal,
      availableForNewLoanMonthly: availableForNewLoanMonthlyLocal,
      proposedLoanPayment: A,
      creditTier: tier,
      prequalStatus: status,
      prequalLabel: label,
      statusDetail,
      mortgageRangeMin,
      mortgageRangeMax,
      isMortgageLike,
    };
  }, [
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
      {/* Loan Amount */}
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

      {/* Co-applicant Yes/No */}
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

      {/* Co-applicant Details */}
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

      {/* Pre-qualification snapshot */}
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
            className={`px-3 py-1 text-xs rounded-full font-semibold ${prequalStatus === "APPROVED"
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
