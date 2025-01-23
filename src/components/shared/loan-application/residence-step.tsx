import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { MortgageLoanFormValues } from "@/app/apply/mortgage/types";
import type { GeneralLoanFormValues } from "@/app/apply/general/types";

import { ResidencyStatus, HousingStatus } from "@prisma/client";
import { convertEnumValueToLabel } from "@/lib/utils";

interface ResidenceStepProps {
  form: UseFormReturn<GeneralLoanFormValues | MortgageLoanFormValues>;
}

export function ResidenceStep({ form }: ResidenceStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="residencyStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status in Canada</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-row space-x-4"
              >
                {Object.entries(ResidencyStatus).map(([value]) => (
                  <FormItem key={value} className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {convertEnumValueToLabel(value)}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="currentAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City, Province" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearsAtCurrentAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years at Current Address</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="housingStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Housing Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row space-x-4"
                >
                  {Object.entries(HousingStatus).map(([value]) => (
                    <FormItem
                      key={value}
                      className="flex items-center space-x-2"
                    >
                      <FormControl>
                        <RadioGroupItem value={value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {convertEnumValueToLabel(value)}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="housingPayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Housing Payment (CAD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1500"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
