import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { UseFormReturn } from "react-hook-form";
import type { GeneralLoanFormValues } from "@/app/apply/general/types";
import type { MortgageLoanFormValues } from "@/app/apply/mortgage/types";

type CombinedLoanFormValues = GeneralLoanFormValues | MortgageLoanFormValues;

interface EligibilityStepProps {
  form: UseFormReturn<CombinedLoanFormValues>;
}

export function EligibilityStep({ form }: EligibilityStepProps) {
  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <FormField
        control={form.control}
        name="isAdult"
        render={({ field }) => (
          <FormItem className="flex flex-col md:flex-row items-center justify-between rounded-lg border p-4 md:p-6 lg:p-8">
            <div className="space-y-0.5 md:space-y-1 lg:space-y-2 w-full md:w-2/3 lg:w-3/4">
              <FormLabel className="text-base md:text-lg lg:text-xl">
                Age and Privacy Policy Agreement
              </FormLabel>
              <FormDescription>
                Confirm you are 19+ and agree to our privacy policy
              </FormDescription>
              <FormMessage />
            </div>
            <FormControl className="mt-4 md:mt-0 ml-auto">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hasBankruptcy"
        render={({ field }) => (
          <FormItem className="flex flex-col md:flex-row items-center justify-between rounded-lg border p-4 md:p-6 lg:p-8">
            <div className="space-y-0.5 md:space-y-1 lg:space-y-2 w-full md:w-2/3 lg:w-3/4">
              <FormLabel className="text-base md:text-lg lg:text-xl">
                Bankruptcy Status
              </FormLabel>
              <FormDescription>
                Have you filed for bankruptcy/consumer proposal?
              </FormDescription>
              <FormMessage />
            </div>
            <FormControl className="mt-4 md:mt-0 ml-auto">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
