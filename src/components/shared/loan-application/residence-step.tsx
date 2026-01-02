"use client";

import { useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { GeneralLoanFormValues } from "@/app/(site)/loanee/loan-application/types";
import { ResidencyStatus, HousingStatus } from "@prisma/client";
import { convertEnumValueToLabel } from "@/lib/utils";
import { PlacesAutocompleteField } from "../PlacesAutocompleteField";

interface ResidenceStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

export function ResidenceStep({ form }: ResidenceStepProps) {
  const watchYearsAtAddress = form.watch("yearsAtCurrentAddress");
  const housingStatus = form.watch("housingStatus");

  useEffect(() => {
    if (housingStatus === HousingStatus.RENT) {
      form.trigger("mortgage");
      form.trigger("propertyTaxMonthly");
      form.trigger("condoFees");
      form.trigger("heatingCosts");
      form.trigger("homeInsurance");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [housingStatus]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="residencyStatus"
        render={({ field }) => {
          const f = field as {
            value?: ResidencyStatus;
            onChange: (v: ResidencyStatus) => void;
          };

          return (
            <FormItem>
              <FormLabel>
                Status in Canada <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-4">
                  {(Object.values(ResidencyStatus) as ResidencyStatus[]).map(
                    (value) => (
                      <label
                        key={value}
                        className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-all ${
                          String(f.value) === String(value)
                            ? "border-gray-400 bg-gray-100"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          value={value}
                          checked={String(f.value) === String(value)}
                          onChange={() => f.onChange(value)}
                          className="accent-violet-600"
                        />
                        <span className="text-sm">
                          {convertEnumValueToLabel(value)}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {/* Current Address and Years */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="currentAddress"
          render={() => (
            <PlacesAutocompleteField
              control={form.control}
              name="currentAddress"
              label="Current Address"
              placeholder="123 Main St, City, Province"
              onPlaceSelected={({ address }) => {
                form.setValue("currentAddress", address);
              }}
            />
          )}
        />

        <FormField
          control={form.control}
          name="yearsAtCurrentAddress"
          render={({ field }) => {
            const f = field as {
              value?: number;
              onChange: (v: number) => void;
            };
            return (
              <FormItem>
                <FormLabel>
                  Years at Current Address{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2"
                    value={f.value ?? ""}
                    onChange={(e) => f.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      {/* Previous Address - if < 2 years */}
      {watchYearsAtAddress !== undefined && watchYearsAtAddress < 2 && (
        <FormField
          control={form.control}
          name="previousAddress"
          render={() => (
            <PlacesAutocompleteField
              control={form.control}
              name="previousAddress"
              label="Previous Address"
              placeholder="123 Main St, City, Province"
              onPlaceSelected={({ address }) => {
                form.setValue("previousAddress", address);
              }}
            />
          )}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="housingStatus"
          render={({ field }) => {
            const f = field as {
              value?: HousingStatus;
              onChange: (v: HousingStatus) => void;
            };

            return (
              <FormItem>
                <FormLabel>
                  Housing Status <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-4">
                    {(Object.values(HousingStatus) as HousingStatus[]).map(
                      (value) => (
                        <label
                          key={value}
                          className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-all ${
                            String(f.value) === String(value)
                              ? "border-gray-400 bg-gray-100"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <input
                            type="radio"
                            value={value}
                            checked={String(f.value) === String(value)}
                            onChange={() => f.onChange(value)}
                            className="accent-violet-600"
                          />
                          <span className="text-sm">
                            {convertEnumValueToLabel(value)}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
}
