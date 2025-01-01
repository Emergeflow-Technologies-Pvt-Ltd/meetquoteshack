import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { LoanFormValues } from "@/app/apply/mortgage/types";

interface EmploymentStepProps {
  form: UseFormReturn<LoanFormValues>;
}

export function EmploymentStep({ form }: EmploymentStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="employmentStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employment Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries({
                  fullTime: "Full Time",
                  partTime: "Part Time",
                  contract: "Contract",
                  seasonal: "Seasonal",
                  selfEmployed: "Self Employed",
                  other: "Other"
                }).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="grossIncome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gross Annual Income</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="75000" 
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

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="workplaceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workplace Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="workplacePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workplace Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 555-5555" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workplaceEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workplace Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}