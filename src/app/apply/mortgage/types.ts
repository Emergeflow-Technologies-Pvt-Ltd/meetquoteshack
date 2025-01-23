import {
  EmploymentStatus,
  HousingStatus,
  MaritalStatus,
  MortgageDownPayment,
  MortgageHousingType,
  MortgagePurpose,
  MortgageType,
  ResidencyStatus,
} from "@prisma/client";
import * as z from "zod";

export const loanFormSchema = z.object({
  // Step 1: Eligibility Check
  isAdult: z
    .boolean({
      required_error: "You must be 19+ and agree to the privacy policy",
    })
    .refine((val) => val === true, {
      message: "You must be 19+ and agree to the privacy policy",
    }),
  hasBankruptcy: z.boolean(),

  // Step 2: Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }).refine(
    (date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 18;
    },
    { message: "You must be at least 18 years old" }
  ),
  maritalStatus: z.nativeEnum(MaritalStatus),
  personalPhone: z
    .string()
    .min(10, "Please enter a valid personal phone number"),
  personalEmail: z.string().email("Please enter a valid personal email"),

  // Step 3: Residence Information
  currentAddress: z.string().min(5, "Please enter your complete address"),
  yearsAtCurrentAddress: z
    .number()
    .min(1, "Please enter your residency duration in years"),
  housingStatus: z.nativeEnum(HousingStatus, {
    required_error: "Housing status is required",
  }),
  housingPayment: z
    .number({
      required_error: "Housing payment is required",
    })
    .min(1, "Please enter your housing payment in CAD"),
  residencyStatus: z.nativeEnum(ResidencyStatus),

  // Step 4: Employment Details
  employmentStatus: z.nativeEnum(EmploymentStatus),
  grossIncome: z
    .number()
    .min(1, "Please enter your gross income in CAD per year"),
  workplaceName: z.string().min(1, "Workplace name is required"),
  workplaceAddress: z.string().min(1, "Workplace address is required"),
  workplacePhone: z.string().min(10, "Please enter a valid workplace phone"),
  workplaceEmail: z.string().email("Please enter a valid workplace email"),

  // Step 5: Mortgage Details
  loanAmount: z.number().min(1, "Please specify how much you need in CAD"),
  mortgagePurpose: z.nativeEnum(MortgagePurpose),
  mortgageType: z.nativeEnum(MortgageType),
  mortgageHousingType: z.nativeEnum(MortgageHousingType),
  mortgageDownPayment: z.nativeEnum(MortgageDownPayment),
});

export type LoanFormValues = z.infer<typeof loanFormSchema>;
