import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { GeneralLoanFormValues } from "@/app/apply/general/types";
import { EducationLevel } from "@prisma/client";
import { convertEnumValueToLabel } from "@/lib/utils";

interface EducationStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

export function EducationStep({ form }: EducationStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="generalEducationLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Education Level</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value as string}
                className="flex flex-col space-y-2"
              >
                {Object.entries(EducationLevel).map(([value]) => (
                  <FormItem key={value} className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel className="font-normal">{convertEnumValueToLabel(value)}</FormLabel>
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
        name="generalFieldOfStudy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Field of Study</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Computer Science" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
