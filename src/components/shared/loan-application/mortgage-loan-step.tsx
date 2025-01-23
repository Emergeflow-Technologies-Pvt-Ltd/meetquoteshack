import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";

import { MortgageDownPayment, MortgageHousingType, MortgagePurpose, MortgageType } from "@prisma/client";
import { convertEnumValueToLabel } from "@/lib/utils";
import { MortgageLoanFormValues } from "@/app/apply/mortgage/types";

interface MortgageLoanStepProps {
  form: UseFormReturn<MortgageLoanFormValues>;
}

export function MortgageLoanStep({ form }: MortgageLoanStepProps) {
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

        <FormField
          control={form.control}
          name="mortgageDownPayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Down Payment Percentage</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select down payment percentage" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MortgageDownPayment).map(([value]) => (
                      <SelectItem key={value} value={value}>
                        {convertEnumValueToLabel(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="mortgagePurpose"
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
                  {Object.entries(MortgagePurpose).map(([value]) => (
                    <SelectItem key={value} value={value}>
                      {convertEnumValueToLabel(value)}
                    </SelectItem>
                  ))}
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
                  {Object.entries(MortgageType).map(([value]) => (
                    <SelectItem key={value} value={value}>
                      {convertEnumValueToLabel(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="mortgageHousingType"
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
                {Object.entries(MortgageHousingType).map(([value]) => (
                  <SelectItem key={value} value={value}>
                    {convertEnumValueToLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}