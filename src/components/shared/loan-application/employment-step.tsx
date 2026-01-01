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
import type { GeneralLoanFormValues } from "@/app/(site)/loan-application/types";

import { EmploymentStatus } from "@prisma/client";
import { convertEnumValueToLabel } from "@/lib/utils";
import { PlacesAutocompleteField } from "../PlacesAutocompleteField";

interface EmploymentStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

export function EmploymentStep({ form }: EmploymentStepProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="employmentStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Employment Status <span className="text-red-500">*</span>
            </FormLabel>
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
            <FormLabel>
              Gross Annual Income <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="75000"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? "" : e.target.valueAsNumber;
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
                <FormLabel>
                  Current Employer <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter current employer"
                    {...field}
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : String(field.value)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workplaceAddress"
            render={() => (
              <PlacesAutocompleteField
                control={form.control}
                name="workplaceAddress"
                label="Company Address"
                placeholder="Enter company address"
                onPlaceSelected={({ address }) => {
                  form.setValue("workplaceAddress", address);
                }}
              />
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="workplacePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Work Phone <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="(555) 555-5555"
                    {...field}
                    value={field.value || ""}
                  />
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
                <FormLabel>
                  Work Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter work email"
                    type="email"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workplaceDuration"
            render={({ field }) => {
              const inputValue =
                field.value === undefined || field.value === null
                  ? ""
                  : field.value.toString();

              return (
                <FormItem>
                  <FormLabel>
                    Total Work Experience{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter years of experience"
                      {...field}
                      value={inputValue}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
