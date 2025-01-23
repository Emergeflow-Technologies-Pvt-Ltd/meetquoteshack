import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { LoanFormValues } from "@/app/apply/mortgage/types";
import { EmploymentStatus } from "@prisma/client";
import { convertEnumValueToLabel } from "@/lib/utils";

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
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EmploymentStatus).map(([value]) => (
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
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? "" : e.target.valueAsNumber;
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="workplaceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workplace Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workplaceAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workplace Address</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="workplacePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workplace Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 555-5555" {...field} value={field.value || ""} />
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
                  <Input type="email" {...field} value={field.value || ""} />
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
