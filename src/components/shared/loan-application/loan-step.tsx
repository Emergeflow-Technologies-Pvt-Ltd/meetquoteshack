import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { LoanFormValues } from "@/app/apply/mortgage/types";

interface LoanStepProps {
  form: UseFormReturn<LoanFormValues>;
}

export function LoanStep({ form }: LoanStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="loanAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Desired Loan Amount</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="300000" 
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

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="loanPurpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Purpose</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="buying">Buying a House</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="renovation">Renovation</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mortgageType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mortgage Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mortgage type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="refinance">Refinance</SelectItem>
                  <SelectItem value="equity">Equity Mortgage</SelectItem>
                  <SelectItem value="bridge">Bridge Financing</SelectItem>
                  <SelectItem value="firsttime">First Time Home Buyer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="housingType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Desired Housing Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select housing type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="townhouse">Town House</SelectItem>
                <SelectItem value="detached">Detached House</SelectItem>
                <SelectItem value="semidetached">Semi-detached House</SelectItem>
                <SelectItem value="container">Container Home</SelectItem>
                <SelectItem value="mobile">Mobile Home</SelectItem>
                <SelectItem value="bungalow">Bungalow</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="downPayment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Down Payment Percentage</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select down payment percentage" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
                <SelectItem value="15">15%</SelectItem>
                <SelectItem value="20">20%</SelectItem>
                <SelectItem value="more">More than 20%</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}