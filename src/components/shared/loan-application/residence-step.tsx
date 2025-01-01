import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { LoanFormValues } from "@/app/apply/mortgage/types";

interface ResidenceStepProps {
  form: UseFormReturn<LoanFormValues>;
}

export function ResidenceStep({ form }: ResidenceStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="housingStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Housing Status</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                {Object.entries({
                  rent: "Rent",
                  own: "Own"
                }).map(([value, label]) => (
                  <FormItem key={value} className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel className="font-normal">{label}</FormLabel>
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
            <FormLabel>Monthly Housing Payment</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="1500" 
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
        name="canadianStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status in Canada</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                {Object.entries({
                  citizen: "Citizen",
                  permanentResident: "Permanent Resident", 
                  temporaryResident: "Temporary Resident",
                  other: "Other"
                }).map(([value, label]) => (
                  <FormItem key={value} className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel className="font-normal">{label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}