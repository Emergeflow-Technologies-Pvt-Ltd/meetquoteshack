// import {
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import type { UseFormReturn } from "react-hook-form";
// import type { GeneralLoanFormValues } from "@/app/(site)/loan-application/types";
// import { ResidencyStatus, HousingStatus } from "@prisma/client";
// import { convertEnumValueToLabel } from "@/lib/utils";
// import { PlacesAutocompleteField } from "../PlacesAutocompleteField";

// interface ResidenceStepProps {
//   form: UseFormReturn<GeneralLoanFormValues>;
// }

// export function ResidenceStep({ form }: ResidenceStepProps) {
//   const watchYearsAtAddress = form.watch("yearsAtCurrentAddress");

//   return (
//     <div className="space-y-6">
//       {/* Residency Status */}
//       <FormField
//         control={form.control}
//         name="residencyStatus"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>
//               Status in Canada <span className="text-red-500">*</span>
//             </FormLabel>
//             <FormControl>
//               <div className="grid grid-cols-2 gap-4">
//                 {Object.entries(ResidencyStatus).map(([value]) => (
//                   <label
//                     key={value}
//                     className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
//                       field.value === value
//                         ? "border-gray-400 bg-gray-100"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       value={value}
//                       checked={field.value === value}
//                       onChange={() => field.onChange(value)}
//                       className="accent-violet-600"
//                     />
//                     <span className="text-sm">
//                       {convertEnumValueToLabel(value)}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       {/* Current Address and Years */}
//       <div className="grid grid-cols-2 gap-4">
//         <FormField
//           control={form.control}
//           name="currentAddress"
//           render={() => (
//             <PlacesAutocompleteField
//               control={form.control}
//               name="currentAddress"
//               label="Current Address"
//               placeholder="123 Main St, City, Province"
//               onPlaceSelected={({ address }) => {
//                 form.setValue("currentAddress", address);
//               }}
//             />
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="yearsAtCurrentAddress"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Years at Current Address <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   placeholder="2"
//                   value={field.value || ""}
//                   onChange={(e) => field.onChange(e.target.valueAsNumber)}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>

//       {/* Previous Address - if < 2 years */}
//       {watchYearsAtAddress !== undefined && watchYearsAtAddress < 2 && (
//         <FormField
//           control={form.control}
//           name="previousAddress"
//           render={() => (
//             <PlacesAutocompleteField
//               control={form.control}
//               name="previousAddress"
//               label="Previous Address"
//               placeholder="123 Main St, City, Province"
//               onPlaceSelected={({ address }) => {
//                 form.setValue("previousAddress", address);
//               }}
//             />
//           )}
//         />
//       )}

//       {/* Housing Status and Monthly Payment */}
//       <div className="grid grid-cols-2 gap-4">
//         <FormField
//           control={form.control}
//           name="housingStatus"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Housing Status <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <div className="grid grid-cols-2 gap-4">
//                   {Object.entries(HousingStatus).map(([value]) => (
//                     <label
//                       key={value}
//                       className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
//                         field.value === value
//                           ? "border-gray-400 bg-gray-100"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         value={value}
//                         checked={field.value === value}
//                         onChange={() => field.onChange(value)}
//                         className="accent-violet-600"
//                       />
//                       <span className="text-sm">
//                         {convertEnumValueToLabel(value)}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="housingPayment"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Monthly Housing Payment (CAD){" "}
//                 <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   placeholder="1500"
//                   value={field.value || ""}
//                   onChange={(e) => field.onChange(e.target.valueAsNumber)}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>
//     </div>
//   );
// }

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
import type { GeneralLoanFormValues } from "@/app/(site)/loan-application/types";
import { ResidencyStatus, HousingStatus } from "@prisma/client";
import { convertEnumValueToLabel } from "@/lib/utils";
import { PlacesAutocompleteField } from "../PlacesAutocompleteField";

interface ResidenceStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

export function ResidenceStep({ form }: ResidenceStepProps) {
  const watchYearsAtAddress = form.watch("yearsAtCurrentAddress");
  const housingStatus = form.watch("housingStatus");
  const housingRentPayment = form.watch("housingRentPayment");

  // Load saved residential info on mount and prefill
  useEffect(() => {
    try {
      const raw = localStorage.getItem("residentialInfo");
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        housingStatus?: HousingStatus | null;
        housingRentPayment?: number | null;
      };

      if (parsed.housingStatus) {
        form.setValue("housingStatus", parsed.housingStatus);
      }
      // Only prefill housingPayment if it's a number
      if (typeof parsed.housingRentPayment === "number") {
        form.setValue("housingRentPayment", parsed.housingRentPayment);
      }
    } catch (e) {
      // ignore localStorage errors (e.g. SSR or restricted environments)
      // eslint-disable-next-line no-console
      console.warn("Could not read residentialInfo from localStorage", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist housingStatus + housingPayment to localStorage whenever they change
  useEffect(() => {
    try {
      const payload = {
        housingStatus: housingStatus ?? null,
        housingRentPayment:
          typeof housingRentPayment === "number" && !Number.isNaN(housingRentPayment)
            ? housingRentPayment
            : null,
      };
      localStorage.setItem("residentialInfo", JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [housingStatus, housingRentPayment]);

  // If user switches to Own, clear the housingPayment (since mortgage details live in FinancialStep)
  useEffect(() => {
    if (housingStatus === HousingStatus.OWN) {
      if (typeof form.resetField === "function") {
      form.resetField("housingRentPayment");
    } else {
      // fallback: set value undefined and clear errors (if older react-hook-form)
      form.setValue("housingRentPayment" as any, undefined as any, { shouldDirty: true, shouldValidate: true });
    }
    form.clearErrors("housingRentPayment");
  } else if (housingStatus === HousingStatus.RENT) {
    // when switching back to rent, re-trigger validation so the required rule (if any) runs
    // and the UI shows the error if user left it empty.
    form.trigger("housingRentPayment");
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [housingStatus]);

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
                        field.value === value ? "border-gray-400 bg-gray-100" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        value={value}
                        checked={field.value === value}
                        onChange={() => field.onChange(value)}
                        className="accent-violet-600"
                      />
                      <span className="text-sm">{convertEnumValueToLabel(value)}</span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Render housingPayment ONLY when user selects Rent */}
        {housingStatus === HousingStatus.RENT && (
          <FormField
            control={form.control}
            name="housingRentPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Monthly Housing Rent Payment (CAD) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1500"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const num = e.target.value === "" ? undefined : Number(e.target.value);
                      field.onChange(num);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
