"use client";

import { useEffect, useCallback } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { GeneralLoanFormValues } from "@/app/(site)/loan-application/types";
import { HousingStatus } from "@prisma/client";

interface FinancialStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

function YesNoToggle({
  value,
  onChange,
}: {
  value?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-4">
      {["true", "false"].map((val) => (
        <label
          key={val}
          className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${String(value) === val
            ? "border-gray-400 bg-gray-100"
            : "border-gray-300 hover:border-gray-400"
            }`}
        >
          <input
            type="radio"
            value={val}
            checked={String(value) === val}
            onChange={() => onChange(val === "true")}
            className="accent-violet-600"
          />
          <span className="text-sm">{val === "true" ? "Yes" : "No"}</span>
        </label>
      ))}
    </div>
  );
}

export function FinancialStep({ form }: FinancialStepProps) {
  const housingStatus = useWatch({
    control: form.control,
    name: "housingStatus",
  }) as HousingStatus | undefined;

  const monthlyDebtsExist = useWatch({
    control: form.control,
    name: "monthlyDebtsExist",
  }) as boolean | undefined;

  const otherIncome = useWatch({
    control: form.control,
    name: "otherIncome",
  }) as boolean | undefined;

  const mortgage = useWatch({
    control: form.control,
    name: "mortgage",
  }) ?? 0;
  const propertyTaxMonthly = useWatch({
    control: form.control,
    name: "propertyTaxMonthly",
  }) ?? 0;
  const condoFees = useWatch({
    control: form.control,
    name: "condoFees",
  }) ?? 0;
  const heatingCost = useWatch({
    control: form.control,
    name: "heatingCosts",
  }) ?? 0;
  const homeInsurance = useWatch({
    control: form.control,
    name: "homeInsurance",
  }) ?? 0;

  // other debts
  const monthlyCarLoanPayment = useWatch({
    control: form.control,
    name: "monthlyCarLoanPayment",
  }) ?? 0;
  const monthlyCreditCardMinimums = useWatch({
    control: form.control,
    name: "monthlyCreditCardMinimums",
  }) ?? 0;
  const monthlyOtherLoanPayments = useWatch({
    control: form.control,
    name: "monthlyOtherLoanPayments",
  }) ?? 0;

  const toNumber = useCallback((v: unknown) => {
    if (typeof v === "number") return isFinite(v) ? v : 0;
    const n = parseFloat(String(v ?? "0"));
    return Number.isFinite(n) ? n : 0;
  }, []);

  // Housing = mortgage/rent + housing parts
  const housingComponent =
    toNumber(mortgage) +
    toNumber(propertyTaxMonthly) +
    toNumber(condoFees) +
    toNumber(heatingCost) +
    toNumber(homeInsurance);

  const otherDebts =
    toNumber(monthlyCarLoanPayment) +
    toNumber(monthlyCreditCardMinimums) +
    toNumber(monthlyOtherLoanPayments);

  const totalMonthlyDebts = housingComponent + otherDebts;

  useEffect(() => {
    const rounded = Number(housingComponent.toFixed(2));
    const current = form.getValues().housingPayment;
    const currentNum =
      current === undefined || current === null ? 0 : Number(current);

    if (Math.abs(currentNum - rounded) > 0.005) {
      form.setValue("housingPayment", rounded, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mortgage,
    propertyTaxMonthly,
    condoFees,
    heatingCost,
    homeInsurance,
    toNumber,
  ]);

  useEffect(() => {
    form.setValue("monthlyDebts", Number(totalMonthlyDebts.toFixed(2)), {
      shouldValidate: true,
      shouldDirty: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mortgage,
    propertyTaxMonthly,
    condoFees,
    heatingCost,
    homeInsurance,
    monthlyCarLoanPayment,
    monthlyCreditCardMinimums,
    monthlyOtherLoanPayments,
    toNumber,
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="savings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                How much savings do you have?{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? 0 : Number(e.target.value)
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
          name="monthlyDebtsExist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you have monthly liabilities / debts?{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <YesNoToggle
                  value={field.value as boolean}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="mortgage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {housingStatus === HousingStatus.RENT
                  ? "Rent (monthly)"
                  : "Mortgage (monthly)"}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 1200.00"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? 0 : Number(val));
                  }}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground mt-1">
                {housingStatus === HousingStatus.RENT
                  ? "Enter your monthly rent."
                  : "Enter your monthly mortgage payment."}
              </p>
            </FormItem>
          )}
        />
      </div>

      {monthlyDebtsExist === true && (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="propertyTaxMonthly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Tax (monthly)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 150.00"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
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
            name="condoFees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condo / HOA Fees (monthly)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 200.00"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
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
                <FormLabel>Heating / Utilities (monthly)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 80.00"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
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
            name="homeInsurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Insurance (monthly)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 60.00"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
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
            name="monthlyCarLoanPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Car Loan Payment</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 250.00"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
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
            name="monthlyCreditCardMinimums"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Credit Card Minimums</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 60.00"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
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
            name="monthlyOtherLoanPayments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Loan Payments (monthly)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g. 120.00"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Total Monthly Debts</label>
            <Input
              type="number"
              placeholder="auto-calculated"
              value={Number(totalMonthlyDebts.toFixed(2))}
              readOnly
            />
            <p className="text-xs text-muted-foreground">
              This is auto-calculated based on rent/mortgage and debts above.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="otherIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you have any other income?{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <YesNoToggle
                  value={field.value as boolean}
                  onChange={(v) => field.onChange(v)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {otherIncome === true && (
          <FormField
            control={form.control}
            name="otherIncomeAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Enter your other income amount{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="childCareBenefit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you receive Child Care Benefit?{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <YesNoToggle
                  value={field.value as boolean}
                  onChange={(v) => field.onChange(v)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creditScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Credit Score <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 300-600"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? 0 : Number(e.target.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
