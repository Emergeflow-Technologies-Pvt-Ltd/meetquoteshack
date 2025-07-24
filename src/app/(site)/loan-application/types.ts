import {
  DownPayment,
  EducationLevel,
  EmploymentStatus,
  HousingStatus,
  LoanType,
  MaritalStatus,
  PropertyType,
  ResidencyStatus,
} from "@prisma/client";
import * as z from "zod";

export const generalLoanFormSchema = z.object({
  // Step 0: Type of Application
  loanType: z.nativeEnum(LoanType, {
    required_error: "Please select a loan type",
  }),

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
  dateOfBirth: z
    .date({
      required_error: "Date of birth is required",
    })
    .refine(
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

  // Step 4: Education Details
  generalEducationLevel: z.nativeEnum(EducationLevel).optional(),
  generalFieldOfStudy: z.string().min(1, "Field of study is required").optional(),

  // Step 5: Employment Details
  employmentStatus: z.nativeEnum(EmploymentStatus),
  grossIncome: z
    .number()
    .min(1, "Please enter your gross income in CAD per year"),
  workplaceName: z.string().min(1, "Workplace name is required"),
  workplaceAddress: z.string().min(1, "Workplace address is required"),
  workplacePhone: z.string().min(10, "Please enter a valid workplace phone"),
  workplaceEmail: z.string().email("Please enter a valid workplace email"),
  workplaceDuration: z
    .number()
    .min(1, "Please enter your workplace duration in years"),

  // Step 6: Loan Details
  loanAmount: z.number().min(1, "Please specify how much you need in CAD"),
  previousAddress: z.string().min(1, "Previous address is required").optional(),
  estimatedPropertyValue: z.number().min(1).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  downPayment: z.nativeEnum(DownPayment).optional(),
  tradeInCurrentVehicle: z.boolean().optional(),
  sin: z
    .string()
    .min(9, "SIN must be at least 9 digits").optional(),
  hasCoApplicant: z.boolean(),
  coApplicantFullName: z.string().optional(),
  coApplicantDateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date",
    })
    .optional(),

  coApplicantAddress: z.string().optional(),
  coApplicantPhone: z
    .number()
    .optional(),
  coApplicantEmail: z.string().email().optional(),
  monthlyDebts: z.coerce.number().min(0, "Please enter your monthly debts in CAD"),
  savings: z.coerce.number().min(0, "Please enter your savings in CAD"),

  otherIncome: z.boolean({
    required_error: "Please specify if you have other income",
  }),
  childCareBenefit: z.boolean({
    required_error: "Please specify if you receive child care benefit",
  }),
});


export type GeneralLoanFormValues = z.infer<typeof generalLoanFormSchema>;
