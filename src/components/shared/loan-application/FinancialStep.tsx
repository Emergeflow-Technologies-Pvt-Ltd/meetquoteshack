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

// interface FinancialStepProps {
//   form: UseFormReturn<GeneralLoanFormValues>;
// }

// export function FinancialStep({ form }: FinancialStepProps) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <FormField
//         control={form.control}
//         name="monthlyDebts"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>
//               Your monthly liabilities/debts?{" "}
//               <span className="text-red-500">*</span>
//             </FormLabel>
//             <FormControl>
//               <Input type="number" placeholder="e.g. 1200" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={form.control}
//         name="savings"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>
//               How much savings do you have?{" "}
//               <span className="text-red-500">*</span>
//             </FormLabel>
//             <FormControl>
//               <Input type="number" placeholder="e.g. 5000" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={form.control}
//         name="otherIncome"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>
//               Do you have any other income? <span className="text-red-500">*</span>
//             </FormLabel>
        
//             <FormControl>
//               <div className="flex gap-4">
//                 {["true", "false"].map((val) => (
//                   <label
//                     key={val}
//                     className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
//                       field.value?.toString() === val
//                         ? "border-gray-400 bg-gray-100"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       value={val}
//                       checked={field.value?.toString() === val}
//                       onChange={() => field.onChange(val === "true")}
//                       className="accent-violet-600"
//                     />
//                     <span className="text-sm">{val === "true" ? "Yes" : "No"}</span>
//                   </label>
//                 ))}
//               </div>
//             </FormControl>
              
//             <FormMessage />
//           </FormItem>
//         )}
//       />
      
//       {/* === SHOW WHEN otherIncome === true === */}
//       {form.watch("otherIncome") === true && (
//         <FormField
//           control={form.control}
//           name="otherIncomeAmount"
//           render={({ field }) => (
//             <FormItem className="mt-4">
//               <FormLabel>
//                 Enter your other income amount <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   placeholder="Enter amount"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       )}

// <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//   <FormField
//     control={form.control}
//     name="mortgage"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel>Rent / Mortgage (monthly)</FormLabel>
//         <FormControl>
//           <Input type="number" placeholder="e.g. 1200.00" {...field} />
//         </FormControl>
//         <FormMessage />
//       </FormItem>
//     )}
//   />

//   <FormField
//     control={form.control}
//     name="propertyTaxMonthly"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel>Property Tax (monthly)</FormLabel>
//         <FormControl>
//           <Input type="number" placeholder="e.g. 150.00" {...field} />
//         </FormControl>
//         <FormMessage />
//       </FormItem>
//     )}
//   />

//   <FormField
//     control={form.control}
//     name="condoFees"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel>Condo / HOA Fees (monthly)</FormLabel>
//         <FormControl>
//           <Input type="number" placeholder="e.g. 200.00" {...field} />
//         </FormControl>
//         <FormMessage />
//       </FormItem>
//     )}
//   />

//   <FormField
//     control={form.control}
//     name="heatingCost"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel>Heating / Utilities (monthly)</FormLabel>
//         <FormControl>
//           <Input type="number" placeholder="e.g. 80.00" {...field} />
//         </FormControl>
//         <FormMessage />
//       </FormItem>
//     )}
//   />

//   <FormField
//     control={form.control}
//     name="homeInsurance"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel>Home Insurance (monthly)</FormLabel>
//         <FormControl>
//           <Input type="number" placeholder="e.g. 60.00" {...field} />
//         </FormControl>
//         <FormMessage />
//       </FormItem>
//     )}
//   />

//   {/* housingPayment (read-only) — shows the computed total */}
//   <FormField
//     control={form.control}
//     name="housingPayment"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel>Total Housing Payment</FormLabel>
//         <FormControl>
//           <Input
//             type="number"
//             placeholder="auto-calculated"
//             value={field.value ?? ""}
//             readOnly
//             onChange={() => {}}
//           />
//         </FormControl>
//         <FormMessage />
//       </FormItem>
//     )}
//   />
// </div>

// {/* Monthly debts breakdown */}
// <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//   <FormField
//     control={form.control}
//     name="monthlyCarLoanPayment"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel>Monthly Car Loan Payment</FormLabel>
//         <FormControl>
//           <Input type="number" placeholder="e.g. 250.00" {...field} />
//         </FormControl>
//         <FormMessage />
//       </FormItem>
//     )}
//   />

//   <FormField
//     control={form.control}
//     name="monthlyCreditCardMinimums"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel>Monthly Credit Card Minimums</FormLabel>
//         <FormControl>
//           <Input type="number" placeholder="e.g. 60.00" {...field} />
//         </FormControl>
//         <FormMessage />
//       </FormItem>
//     )}
//   />

//   <FormField
//     control={form.control}
//     name="monthlyOtherLoanPayments"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel>Other Loan Payments (monthly)</FormLabel>
//         <FormControl>
//           <Input type="number" placeholder="e.g. 120.00" {...field} />
//         </FormControl>
//         <FormMessage />
//       </FormItem>
//     )}
//   />
// </div>

// {/* OPTIONAL: give the user transparency on what goes into 'monthlyDebts' */}
// <div className="mt-3 text-sm text-gray-600">
//   Monthly debts include: car loans, credit card minimums, rent/mortgage, utilities, heating,
//   condo fees, property tax, and other loan payments. (You can hide rent/mortgage here if you
//   prefer to keep it only under housing.)
// </div>

// {/* --- Auto-calc logic for housingPayment --- */}
// {/* useEffect(() => {
//   // watch the individual components and update housingPayment automatically
//   const subs = [
//     form.watch("mortgage") || 0,
//     form.watch("propertyTaxMonthly") || 0,
//     form.watch("condoFees") || 0,
//     form.watch("heatingCost") || 0,
//     form.watch("homeInsurance") || 0,
//   ];

//   // parse numbers safely (handles strings from inputs)
//   const parsed = subs.map((v) => {
//     const n = typeof v === "number" ? v : parseFloat(String(v || "0"));
//     return Number.isFinite(n) ? n : 0;
//   });

//   const total = parsed.reduce((s, n) => s + n, 0);

//   // write back to the form; format according to your needs
//   form.setValue("housingPayment", total.toFixed(2), { shouldValidate: true, shouldDirty: true });
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [
//   form.watch("mortgage"),
//   form.watch("propertyTaxMonthly"),
//   form.watch("condoFees"),
//   form.watch("heatingCost"),
//   form.watch("homeInsurance"),
// ]); */}



//       <FormField
//         control={form.control}
//         name="childCareBenefit"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>
//               Do you receive Child Care Benefit?{" "}
//               <span className="text-red-500">*</span>
//             </FormLabel>
//             <FormControl>
//               <div className="flex gap-4">
//                 {["true", "false"].map((val) => (
//                   <label
//                     key={val}
//                     className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
//                       field.value?.toString() === val
//                         ? "border-gray-400 bg-gray-100"
//                         : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       value={val}
//                       checked={field.value?.toString() === val}
//                       onChange={() => field.onChange(val === "true")}
//                       className="accent-violet-600"
//                     />
//                     <span className="text-sm">
//                       {val === "true" ? "Yes" : "No"}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={form.control}
//         name="creditScore"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>
//               Credit Score{" "}
//               <span className="text-red-500">*</span>
//             </FormLabel>
//             <FormControl>
//               <Input type="number" placeholder="e.g. 300-600" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </div>
//   );
//--------------------------------------------------------------- }

// "use client";

// import { useEffect } from "react";
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

// interface FinancialStepProps {
//   form: UseFormReturn<GeneralLoanFormValues>;
// }

// export function FinancialStep({ form }: FinancialStepProps) {
//   // watch relevant values
//   const monthlyDebtsExist = form.watch("monthlyDebtsExist");
//   const otherIncome = form.watch("otherIncome");

//   const mortgage = form.watch("mortgage") ?? 0;
//   const propertyTaxMonthly = form.watch("propertyTaxMonthly") ?? 0;
//   const condoFees = form.watch("condoFees") ?? 0;
//   const heatingCost = form.watch("heatingCost") ?? 0;
//   const homeInsurance = form.watch("homeInsurance") ?? 0;

//   const monthlyCarLoanPayment = form.watch("monthlyCarLoanPayment") ?? 0;
//   const monthlyCreditCardMinimums = form.watch("monthlyCreditCardMinimums") ?? 0;
//   const monthlyOtherLoanPayments = form.watch("monthlyOtherLoanPayments") ?? 0;

//   // helper to safely parse numbers (handles string inputs)
//   const toNumber = (v: unknown) => {
//     if (typeof v === "number") return isFinite(v) ? v : 0;
//     const n = parseFloat(String(v ?? "0"));
//     return Number.isFinite(n) ? n : 0;
//   };

//   // auto-calc housingPayment when any housing field changes
//   useEffect(() => {
//     const totalHousing =
//       toNumber(mortgage) +
//       toNumber(propertyTaxMonthly) +
//       toNumber(condoFees) +
//       toNumber(heatingCost) +
//       toNumber(homeInsurance);

//     // Write back to the canonical housingPayment field (read-only in UI)
//     form.setValue("housingPayment", Number(totalHousing.toFixed(2)), {
//       shouldValidate: true,
//       shouldDirty: true,
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mortgage, propertyTaxMonthly, condoFees, heatingCost, homeInsurance]);

//   // auto-calc monthlyDebts (canonical numeric) when any debt/housing field changes
//   useEffect(() => {
//     // Sum debt components (including housingPayment)
//     const housing = toNumber(form.getValues("housingPayment") ?? 0);
//     const car = toNumber(monthlyCarLoanPayment);
//     const cc = toNumber(monthlyCreditCardMinimums);
//     const other = toNumber(monthlyOtherLoanPayments);

//     const totalDebts = housing + car + cc + other;

//     form.setValue("monthlyDebts", Number(totalDebts.toFixed(2)), {
//       shouldValidate: true,
//       shouldDirty: true,
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     form.watch("housingPayment"),
//     monthlyCarLoanPayment,
//     monthlyCreditCardMinimums,
//     monthlyOtherLoanPayments,
//   ]);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* ASK: do you have monthly debts? */}
//         <FormField
//           control={form.control}
//           name="monthlyDebtsExist"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Do you have monthly liabilities / debts?{" "}
//                 <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <div className="flex gap-4">
//                   {["true", "false"].map((val) => (
//                     <label
//                       key={val}
//                       className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
//                         field.value?.toString() === val
//                           ? "border-gray-400 bg-gray-100"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         value={val}
//                         checked={field.value?.toString() === val}
//                         onChange={() => field.onChange(val === "true")}
//                         className="accent-violet-600"
//                       />
//                       <span className="text-sm">{val === "true" ? "Yes" : "No"}</span>
//                     </label>
//                   ))}
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//               {/* --- If user has monthly debts -> show all debt and housing breakdown fields --- */}
//       {monthlyDebtsExist === true && (
//         <>
//           {/* Housing breakdown */}
//           <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="mortgage"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Rent / Mortgage (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 1200.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="propertyTaxMonthly"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Property Tax (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 150.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="condoFees"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Condo / HOA Fees (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 200.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="heatingCost"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Heating / Utilities (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 80.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="homeInsurance"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Home Insurance (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 60.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* read-only total housing payment */}
//             <FormField
//               control={form.control}
//               name="housingPayment"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Total Housing Payment</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="auto-calculated"
//                       value={field.value ?? ""}
//                       readOnly
//                       onChange={() => {}}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           {/* Monthly debts breakdown */}
//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="monthlyCarLoanPayment"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Monthly Car Loan Payment</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 250.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="monthlyCreditCardMinimums"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Monthly Credit Card Minimums</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 60.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="monthlyOtherLoanPayments"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Other Loan Payments (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 120.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </>
//       )}
//         {/* Savings */}
//         <FormField
//           control={form.control}
//           name="savings"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 How much savings do you have? <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input type="number" placeholder="e.g. 5000" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>

//       {/* if other income -> show amount */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <FormField
//           control={form.control}
//           name="otherIncome"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Do you have any other income? <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <div className="flex gap-4">
//                   {["true", "false"].map((val) => (
//                     <label
//                       key={val}
//                       className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
//                         field.value?.toString() === val
//                           ? "border-gray-400 bg-gray-100"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         value={val}
//                         checked={field.value?.toString() === val}
//                         onChange={() => {
//                           field.onChange(val === "true");
//                           // clear amount when disabled
//                           if (val === "false") {
//                             form.setValue("otherIncomeAmount", undefined, {
//                               shouldDirty: true,
//                             });
//                           }
//                         }}
//                         className="accent-violet-600"
//                       />
//                       <span className="text-sm">{val === "true" ? "Yes" : "No"}</span>
//                     </label>
//                   ))}
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {otherIncome === true && (
//           <FormField
//             control={form.control}
//             name="otherIncomeAmount"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>
//                   Enter your other income amount <span className="text-red-500">*</span>
//                 </FormLabel>
//                 <FormControl>
//                   <Input type="number" placeholder="Enter amount" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         )}
//       </div>



//       {/* keep childCareBenefit and creditScore fields as before */}
//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//         <FormField
//           control={form.control}
//           name="childCareBenefit"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Do you receive Child Care Benefit? <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <div className="flex gap-4">
//                   {["true", "false"].map((val) => (
//                     <label
//                       key={val}
//                       className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
//                         field.value?.toString() === val
//                           ? "border-gray-400 bg-gray-100"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         value={val}
//                         checked={field.value?.toString() === val}
//                         onChange={() => field.onChange(val === "true")}
//                         className="accent-violet-600"
//                       />
//                       <span className="text-sm">{val === "true" ? "Yes" : "No"}</span>
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
//           name="creditScore"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Credit Score <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input type="number" placeholder="e.g. 300-600" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useCallback } from "react";
// import {
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import type { UseFormReturn } from "react-hook-form";
// import { useWatch } from "react-hook-form";
// import type { GeneralLoanFormValues } from "@/app/(site)/loan-application/types";

// interface FinancialStepProps {
//   form: UseFormReturn<GeneralLoanFormValues>;
// }

// /** small reusable Yes/No toggle (keeps markup consistent) */
// function YesNoToggle({
//   value,
//   onChange,
// }: {
//   value?: boolean;
//   onChange: (v: boolean) => void;
// }) {
//   return (
//     <div className="flex gap-4">
//       {["true", "false"].map((val) => (
//         <label
//           key={val}
//           className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
//             String(value) === val ? "border-gray-400 bg-gray-100" : "border-gray-300 hover:border-gray-400"
//           }`}
//         >
//           <input
//             type="radio"
//             value={val}
//             checked={String(value) === val}
//             onChange={() => onChange(val === "true")}
//             className="accent-violet-600"
//           />
//           <span className="text-sm">{val === "true" ? "Yes" : "No"}</span>
//         </label>
//       ))}
//     </div>
//   );
// }

// export function FinancialStep({ form }: FinancialStepProps) {
//   // subscribe to the flags and the numeric parts we need using useWatch
//   const monthlyDebtsExist = useWatch({
//     control: form.control,
//     name: "monthlyDebtsExist",
//   }) as boolean | undefined;

//   const otherIncome = useWatch({
//     control: form.control,
//     name: "otherIncome",
//   }) as boolean | undefined;

//   // housing pieces
//   const mortgage = useWatch({ control: form.control, name: "mortgage" }) ?? 0;
//   const propertyTaxMonthly = useWatch({ control: form.control, name: "propertyTaxMonthly" }) ?? 0;
//   const condoFees = useWatch({ control: form.control, name: "condoFees" }) ?? 0;
//   const heatingCost = useWatch({ control: form.control, name: "heatingCost" }) ?? 0;
//   const homeInsurance = useWatch({ control: form.control, name: "homeInsurance" }) ?? 0;

//   // other debts
//   const monthlyCarLoanPayment = useWatch({ control: form.control, name: "monthlyCarLoanPayment" }) ?? 0;
//   const monthlyCreditCardMinimums = useWatch({ control: form.control, name: "monthlyCreditCardMinimums" }) ?? 0;
//   const monthlyOtherLoanPayments = useWatch({ control: form.control, name: "monthlyOtherLoanPayments" }) ?? 0;

//   // small helper to parse user input safely
//   const toNumber = useCallback((v: unknown) => {
//     if (typeof v === "number") return isFinite(v) ? v : 0;
//     const n = parseFloat(String(v ?? "0"));
//     return Number.isFinite(n) ? n : 0;
//   }, []);

//   // compute housing payment and write back
//   useEffect(() => {
//     const totalHousing =
//       toNumber(mortgage) +
//       toNumber(propertyTaxMonthly) +
//       toNumber(condoFees) +
//       toNumber(heatingCost) +
//       toNumber(homeInsurance);

//     form.setValue("housingPayment", Number(totalHousing.toFixed(2)), {
//       shouldValidate: true,
//       shouldDirty: true,
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mortgage, propertyTaxMonthly, condoFees, heatingCost, homeInsurance, toNumber]);

//   // compute monthlyDebts (canonical) as sum(housingPayment + other debt components)
//   useEffect(() => {
//     const housing = toNumber(form.getValues("housingPayment") ?? 0);
//     const totalDebts =
//       housing +
//       toNumber(monthlyCarLoanPayment) +
//       toNumber(monthlyCreditCardMinimums) +
//       toNumber(monthlyOtherLoanPayments);

//     form.setValue("monthlyDebts", Number(totalDebts.toFixed(2)), {
//       shouldValidate: true,
//       shouldDirty: true,
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [monthlyCarLoanPayment, monthlyCreditCardMinimums, monthlyOtherLoanPayments, form, toNumber]);

//   // when user toggles off monthlyDebtsExist, clear dependent values
//   useEffect(() => {
//     if (!monthlyDebtsExist) {
//       form.setValue("mortgage", undefined);
//       form.setValue("propertyTaxMonthly", undefined);
//       form.setValue("condoFees", undefined);
//       form.setValue("heatingCost", undefined);
//       form.setValue("homeInsurance", undefined);
//       form.setValue("housingPayment", 0);
//       form.setValue("monthlyCarLoanPayment", undefined);
//       form.setValue("monthlyCreditCardMinimums", undefined);
//       form.setValue("monthlyOtherLoanPayments", undefined);
//       form.setValue("monthlyDebts", 0);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [monthlyDebtsExist]);

//   // when user toggles off otherIncome, clear amount
//   useEffect(() => {
//     if (!otherIncome) {
//       form.setValue("otherIncomeAmount", undefined);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [otherIncome]);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* monthly debts exist */}
//         <FormField
//           control={form.control}
//           name="monthlyDebtsExist"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Do you have monthly liabilities / debts? <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <YesNoToggle value={field.value as boolean} onChange={field.onChange} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Savings */}
//         <FormField
//           control={form.control}
//           name="savings"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 How much savings do you have? <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input type="number" placeholder="e.g. 5000" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>

//       {/* Debts + housing (only shown when monthlyDebtsExist) */}
//       {monthlyDebtsExist === true && (
//         <>
//           <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="mortgage"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Rent / Mortgage (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 1200.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="propertyTaxMonthly"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Property Tax (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 150.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="condoFees"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Condo / HOA Fees (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 200.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="heatingCost"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Heating / Utilities (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 80.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="homeInsurance"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Home Insurance (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 60.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="housingPayment"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Total Housing Payment</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="auto-calculated"
//                       value={field.value ?? ""}
//                       readOnly
//                       onChange={() => {}}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="monthlyCarLoanPayment"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Monthly Car Loan Payment</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 250.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="monthlyCreditCardMinimums"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Monthly Credit Card Minimums</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 60.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="monthlyOtherLoanPayments"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Other Loan Payments (monthly)</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g. 120.00" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </>
//       )}

//       {/* otherIncome controls */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <FormField
//           control={form.control}
//           name="otherIncome"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Do you have any other income? <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <YesNoToggle value={field.value as boolean} onChange={(v) => field.onChange(v)} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {otherIncome === true && (
//           <FormField
//             control={form.control}
//             name="otherIncomeAmount"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>
//                   Enter your other income amount <span className="text-red-500">*</span>
//                 </FormLabel>
//                 <FormControl>
//                   <Input type="number" placeholder="Enter amount" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         )}
//       </div>

//       {/* childcare + credit score */}
//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//         <FormField
//           control={form.control}
//           name="childCareBenefit"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Do you receive Child Care Benefit? <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <YesNoToggle value={field.value as boolean} onChange={(v) => field.onChange(v)} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="creditScore"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Credit Score <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input type="number" placeholder="e.g. 300-600" {...field} />
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

import { useEffect, useCallback } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { GeneralLoanFormValues } from "@/app/(site)/loan-application/types";
import { HousingStatus } from "@prisma/client";

interface FinancialStepProps {
  form: UseFormReturn<GeneralLoanFormValues>;
}

/** small reusable Yes/No toggle (keeps markup consistent) */
function YesNoToggle({
  value,
  onChange,
}: {
  value?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-4">
      {["true", "false"].map((val) => (
        <label
          key={val}
          className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${
            String(value) === val ? "border-gray-400 bg-gray-100" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input
            type="radio"
            value={val}
            checked={String(value) === val}
            onChange={() => onChange(val === "true")}
            className="accent-violet-600"
          />
          <span className="text-sm">{val === "true" ? "Yes" : "No"}</span>
        </label>
      ))}
    </div>
  );
}

export function FinancialStep({ form }: FinancialStepProps) {
  // Prefill from saved residential info on mount (localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("residentialInfo");
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        housingStatus?: HousingStatus | null;
        housingRentPayment?: number | null;
      };

      if (parsed.housingStatus) {
        // Normalize stored value (accept 'rent'|'own' or 'RENT'|'OWN') and write back the enum key
        const hsStr = String(parsed.housingStatus).toUpperCase();
        if (hsStr === String(HousingStatus.RENT) || hsStr === "RENT") {
          form.setValue("housingStatus", HousingStatus.RENT as any, {
            shouldDirty: true,
            shouldValidate: true,
          });
        } else if (hsStr === String(HousingStatus.OWN) || hsStr === "OWN") {
          form.setValue("housingStatus", HousingStatus.OWN as any, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }

      // If user was renting and a housingPayment exists, prefill mortgage
      if (typeof parsed.housingRentPayment === "number") {
        const hsStr = parsed.housingStatus ? String(parsed.housingStatus).toUpperCase() : undefined;
        const isRent = hsStr === String(HousingStatus.RENT) || hsStr === "RENT";
        if (isRent) {
        form.setValue("mortgage", parsed.housingRentPayment, {
          shouldDirty: true,
          shouldValidate: true,
        });
        // Also set the canonical housingPayment (total) so calculations pick it up
        form.setValue("housingRentPayment", parsed.housingRentPayment, {
          shouldDirty: true,
          shouldValidate: true,
        });
        } else {
          // owner or unknown - still set canonical housingPayment
          form.setValue("housingRentPayment", parsed.housingRentPayment, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }
    } catch (e) {
      // ignore
      // eslint-disable-next-line no-console
      console.warn("Could not read residentialInfo from localStorage", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // subscribe to the flags and the numeric parts we need using useWatch
  const monthlyDebtsExist = useWatch({
    control: form.control,
    name: "monthlyDebtsExist",
  }) as boolean | undefined;

  const otherIncome = useWatch({
    control: form.control,
    name: "otherIncome",
  }) as boolean | undefined;

  // housing pieces
  const mortgage = useWatch({ control: form.control, name: "mortgage" }) ?? 0;
  const propertyTaxMonthly = useWatch({ control: form.control, name: "propertyTaxMonthly" }) ?? 0;
  const condoFees = useWatch({ control: form.control, name: "condoFees" }) ?? 0;
  const heatingCost = useWatch({ control: form.control, name: "heatingCosts" }) ?? 0;
  const homeInsurance = useWatch({ control: form.control, name: "homeInsurance" }) ?? 0;

  // other debts
  const monthlyCarLoanPayment = useWatch({ control: form.control, name: "monthlyCarLoanPayment" }) ?? 0;
  const monthlyCreditCardMinimums = useWatch({ control: form.control, name: "monthlyCreditCardMinimums" }) ?? 0;
  const monthlyOtherLoanPayments = useWatch({ control: form.control, name: "monthlyOtherLoanPayments" }) ?? 0;

  // small helper to parse user input safely
  const toNumber = useCallback((v: unknown) => {
    if (typeof v === "number") return isFinite(v) ? v : 0;
    const n = parseFloat(String(v ?? "0"));
    return Number.isFinite(n) ? n : 0;
  }, []);

  // compute housing payment and write back
  useEffect(() => {
    const totalHousing =
      toNumber(mortgage) +
      toNumber(propertyTaxMonthly) +
      toNumber(condoFees) +
      toNumber(heatingCost) +
      toNumber(homeInsurance);

    form.setValue("housingTotalPayment", Number(totalHousing.toFixed(2)), {
      shouldValidate: true,
      shouldDirty: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mortgage, propertyTaxMonthly, condoFees, heatingCost, homeInsurance, toNumber]);

  // compute monthlyDebts (canonical) as sum(housingPayment + other debt components)
  useEffect(() => {
    const housing = toNumber(form.getValues("housingTotalPayment") ?? 0);
    const totalDebts =
      housing +
      toNumber(monthlyCarLoanPayment) +
      toNumber(monthlyCreditCardMinimums) +
      toNumber(monthlyOtherLoanPayments);

    form.setValue("monthlyDebts", Number(totalDebts.toFixed(2)), {
      shouldValidate: true,
      shouldDirty: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyCarLoanPayment, monthlyCreditCardMinimums, monthlyOtherLoanPayments, form, toNumber]);

  // when user toggles off monthlyDebtsExist, clear dependent values
// when user toggles off monthlyDebtsExist, clear dependent values
useEffect(() => {
  if (!monthlyDebtsExist) {
    // reset fields so types remain satisfied and inputs become empty
    form.resetField("mortgage");
    form.resetField("propertyTaxMonthly");
    form.resetField("condoFees");
    form.resetField("heatingCosts");
    form.resetField("homeInsurance");

    // Clear computed totals with resetField too
    form.resetField("housingTotalPayment");
    form.resetField("monthlyCarLoanPayment");
    form.resetField("monthlyCreditCardMinimums");
    form.resetField("monthlyOtherLoanPayments");
    form.resetField("monthlyDebts");
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [monthlyDebtsExist]);


  // when user toggles off otherIncome, clear amount
  useEffect(() => {
    if (!otherIncome) {
      form.setValue("otherIncomeAmount", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherIncome]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* monthly debts exist */}
        <FormField
          control={form.control}
          name="monthlyDebtsExist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you have monthly liabilities / debts? <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <YesNoToggle value={field.value as boolean} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Savings */}
        <FormField
          control={form.control}
          name="savings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                How much savings do you have? <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Debts + housing (only shown when monthlyDebtsExist) */}
      {monthlyDebtsExist === true && (
        <>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mortgage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mortgage (monthly)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 1200.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyTaxMonthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Tax (monthly)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 150.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condoFees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condo / HOA Fees (monthly)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 200.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heatingCosts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heating / Utilities (monthly)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 80.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="homeInsurance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Insurance (monthly)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 60.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="housingTotalPayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Housing Payment</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="auto-calculated"
                      value={field.value ?? ""}
                      readOnly
                      onChange={() => {}}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="monthlyCarLoanPayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Car Loan Payment</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 250.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyCreditCardMinimums"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Credit Card Minimums</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 60.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyOtherLoanPayments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Loan Payments (monthly)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 120.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}

      {/* otherIncome controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="otherIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you have any other income? <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <YesNoToggle value={field.value as boolean} onChange={(v) => field.onChange(v)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {otherIncome === true && (
          <FormField
            control={form.control}
            name="otherIncomeAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Enter your other income amount <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* childcare + credit score */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="childCareBenefit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you receive Child Care Benefit? <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <YesNoToggle value={field.value as boolean} onChange={(v) => field.onChange(v)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creditScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Credit Score <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 300-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
