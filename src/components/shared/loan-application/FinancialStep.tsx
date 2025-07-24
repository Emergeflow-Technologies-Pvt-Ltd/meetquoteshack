import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { GeneralLoanFormValues } from "@/app/(site)/loan-application/types";

interface FinancialStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

export function FinancialStep({ form }: FinancialStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="monthlyDebts"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Your monthly liabilities/debts?{" "}
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input type="number" placeholder="e.g. 1200" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
              <Input type="number" placeholder="e.g. 5000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
              <div className="flex gap-4">
                {["true", "false"].map((val) => (
                  <label
                    key={val}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
                      field.value?.toString() === val
                        ? "border-gray-400 bg-gray-100"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      value={val}
                      checked={field.value?.toString() === val}
                      onChange={() => field.onChange(val === "true")}
                      className="accent-violet-600"
                    />
                    <span className="text-sm">
                      {val === "true" ? "Yes" : "No"}
                    </span>
                  </label>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
              <div className="flex gap-4">
                {["true", "false"].map((val) => (
                  <label
                    key={val}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
                      field.value?.toString() === val
                        ? "border-gray-400 bg-gray-100"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      value={val}
                      checked={field.value?.toString() === val}
                      onChange={() => field.onChange(val === "true")}
                      className="accent-violet-600"
                    />
                    <span className="text-sm">
                      {val === "true" ? "Yes" : "No"}
                    </span>
                  </label>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
