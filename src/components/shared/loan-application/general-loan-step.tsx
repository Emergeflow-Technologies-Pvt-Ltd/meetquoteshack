import { GeneralLoanFormValues } from "@/app/apply/general/types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";

interface GeneralLoanStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

export function GeneralLoanStep({ form }: GeneralLoanStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
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
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : e.target.valueAsNumber;
                    field.onChange(value);
                  }}
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

