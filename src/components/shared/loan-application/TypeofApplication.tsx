"use client";

import React from "react";
import { Controller, useWatch, UseFormReturn } from "react-hook-form";
import { GeneralLoanFormValues } from "@/app/(site)/loan-application/types";
import { DownPayment, LoanType, PropertyType } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  downPaymentLabels,
  loanTypeLabels,
  propertyTypeLabels,
} from "../general.const";

type Props = {
  form: UseFormReturn<GeneralLoanFormValues>;
};

const TypeofApplication = ({ form }: Props) => {
  const loanType = useWatch({ control: form.control, name: "loanType" });

  const loanTypesForPropertyDetails: LoanType[] = [
    "FIRST_TIME_HOME",
    "INVESTMENT_PROPERTY",
    "MORTGAGE_REFINANCE",
    "HELOC",
    "HOME_REPAIR",
  ];

  const loanTypesForDownPayment: LoanType[] = [
    "FIRST_TIME_HOME",
    "INVESTMENT_PROPERTY",
    "CAR",
  ];

  const showPropertyDetails = loanTypesForPropertyDetails.includes(loanType);
  const showDownPayment = loanTypesForDownPayment.includes(loanType);

  const showPropertyType =
    loanType === LoanType.FIRST_TIME_HOME ||
    loanType === LoanType.INVESTMENT_PROPERTY;

  const showTradeIn = loanType === LoanType.CAR;

  return (
    <div className="space-y-6">
      <Label htmlFor="loanType" className="text-lg font-semibold">
        What type of loan are you applying for?{" "}
        <span className="text-red-500">*</span>
      </Label>
      <Controller
        control={form.control}
        name="loanType"
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger id="loanType">
              <SelectValue placeholder="Select a loan type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LoanType).map((type) => (
                <SelectItem key={type} value={type}>
                  {loanTypeLabels[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {showPropertyDetails && (
        <FormField
          control={form.control}
          name="estimatedPropertyValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Estimated Property Value <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 500000"
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : +e.target.value
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {showPropertyType && (
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What kind of house are you looking for?{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-4">
                  {Object.values(PropertyType).map((type) => (
                    <label
                      key={type}
                      className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-all ${
                        field.value === type
                          ? "border-gray-400 bg-gray-100"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="propertyType"
                        value={type}
                        checked={field.value === type}
                        onChange={field.onChange}
                        className="accent-violet-600"
                      />
                      <span className="text-sm">
                        {propertyTypeLabels[type] ?? type}
                      </span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {showDownPayment && (
        <FormField
          control={form.control}
          name="downPayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Down Payment Available <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-4">
                  {Object.values(DownPayment).map((type) => (
                    <label
                      key={type}
                      className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-all ${
                        field.value === type
                          ? "border-gray-400 bg-gray-100"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="downPayment"
                        value={type}
                        checked={field.value === type}
                        onChange={field.onChange}
                        className="accent-violet-600"
                      />
                      <span className="text-sm">
                        {downPaymentLabels[type] ?? type}
                      </span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {showTradeIn && (
        <FormField
          control={form.control}
          name="tradeInCurrentVehicle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Are you trading in your current vehicle?{" "}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  {[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ].map((option) => (
                    <label
                      key={option.label}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
                        field.value === option.value
                          ? "border-gray-400 bg-gray-100"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tradeInCurrentVehicle"
                        value={option.label.toLowerCase()}
                        checked={field.value === option.value}
                        onChange={() => field.onChange(option.value)}
                        className="accent-violet-600"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default TypeofApplication;
