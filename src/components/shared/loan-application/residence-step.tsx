import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { GeneralLoanFormValues } from "@/app/(site)/loan-application/types";
import { ResidencyStatus, HousingStatus } from "@prisma/client";
import { convertEnumValueToLabel } from "@/lib/utils";

interface ResidenceStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

export function ResidenceStep({ form }: ResidenceStepProps) {
  const watchYearsAtAddress = form.watch("yearsAtCurrentAddress");

  return (
    <div className="space-y-6">
      {/* Residency Status */}
      <FormField
        control={form.control}
        name="residencyStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Status in Canada <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(ResidencyStatus).map(([value]) => (
                  <label
                    key={value}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
                      field.value === value
                        ? "border-gray-400 bg-gray-100"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      value={value}
                      checked={field.value === value}
                      onChange={() => field.onChange(value)}
                      className="accent-violet-600"
                    />
                    <span className="text-sm">
                      {convertEnumValueToLabel(value)}
                    </span>
                  </label>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Current Address and Years */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="currentAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Current Address <span className="text-red-500">*</span>
              </FormLabel>
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
              <FormLabel>
                Years at Current Address <span className="text-red-500">*</span>
              </FormLabel>
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

      {/* Previous Address - if < 2 years */}
      {watchYearsAtAddress !== undefined && watchYearsAtAddress < 2 && (
        <FormField
          control={form.control}
          name="previousAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Previous Address <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="456 Old St, City, Province" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Housing Status and Monthly Payment */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="housingStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Housing Status <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(HousingStatus).map(([value]) => (
                    <label
                      key={value}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
                        field.value === value
                          ? "border-gray-400 bg-gray-100"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        value={value}
                        checked={field.value === value}
                        onChange={() => field.onChange(value)}
                        className="accent-violet-600"
                      />
                      <span className="text-sm">
                        {convertEnumValueToLabel(value)}
                      </span>
                    </label>
                  ))}
                </div>
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
              <FormLabel>
                Monthly Housing Payment (CAD){" "}
                <span className="text-red-500">*</span>
              </FormLabel>
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
