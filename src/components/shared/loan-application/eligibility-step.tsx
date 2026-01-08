import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { UseFormReturn } from "react-hook-form";
import type { GeneralLoanFormValues } from "@/app/(site)/loanee/loan-application/types";

interface EligibilityStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

export function EligibilityStep({ form }: EligibilityStepProps) {
  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
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
                By clicking this button, you are accepting the terms and
                conditions, as well as the privacy policy, of MeetQuoteShack
                Inc. This also allows us to obtain your credit information from
                credit reporting agencies (credit bureaus) and confirms that you
                are 19 years of age or older.
              </FormDescription>
              <FormMessage />
            </div>
            <FormControl className="ml-auto mt-4 md:mt-0">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

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
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

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
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
