import {
  DownPayment,
  EducationLevel,
  EmploymentStatus,
  HousingStatus,
  LoanType,
  MaritalStatus,
  PropertyType,
  ResidencyStatus,
  VehicleType,
} from "@prisma/client"
import * as z from "zod"

const moneyField = (message: string) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) {
        return 0
      }
      if (typeof val === "string") {
        const trimmed = val.trim()
        if (trimmed === "") return 0
        return trimmed
      }
      return val
    },
    z.number().min(0, message)
  )

export const generalLoanFormSchema = z
  .object({
    // Step 0: Eligibility Check
    isAdult: z
      .boolean({
        required_error: "You must be 19+ and agree to the privacy policy",
      })
      .refine((val) => val === true, {
        message: "You must be 19+ and agree to the privacy policy",
      }),
    hasBankruptcy: z.boolean(),
    agentCode: z.string().trim().optional().or(z.literal("")),

    // Step 1: Type of Application
    loanType: z.nativeEnum(LoanType, {
      required_error: "Please select a loan type",
    }),

    // Step 2: Personal Information
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    dateOfBirth: z.preprocess(
      (arg) => {
        // Accept Date instances or strings in ISO (YYYY-MM-DD) or common d-m-y formats (DD-MM-YYYY)
        if (typeof arg === "string") {
          // If string looks like YYYY-MM-DD, use directly
          if (/^\d{4}-\d{2}-\d{2}$/.test(arg)) {
            return new Date(arg)
          }

          // If string looks like DD-MM-YYYY or D-M-YYYY, convert to ISO
          const parts = arg.split("-")
          if (parts.length === 3) {
            const [p1, p2, p3] = parts
            // assume DD-MM-YYYY
            if (p3.length === 4) {
              const iso = `${p3}-${p2.padStart(2, "0")}-${p1.padStart(2, "0")}`
              return new Date(iso)
            }
          }

          // fallback: let Date try to parse
          const d = new Date(arg)
          return isNaN(d.getTime()) ? undefined : d
        }
        if (arg instanceof Date) return arg
        return undefined
      },
      z.date({ required_error: "Date of birth is required" }).refine(
        (date) => {
          const now = new Date()
          const age =
            now.getFullYear() -
            date.getFullYear() -
            (now < new Date(now.getFullYear(), date.getMonth(), date.getDate())
              ? 1
              : 0)
          return age >= 18
        },
        { message: "You must be at least 18 years old" }
      )
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

    housingPayment: z.number().optional(),

    residencyStatus: z.nativeEnum(ResidencyStatus),

    // Step 4: Education Details
    generalEducationLevel: z.nativeEnum(EducationLevel).optional(),
    generalFieldOfStudy: z.string().optional(),

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
    loanAmount: z.coerce
      .number({ required_error: "Required", invalid_type_error: "Required" })
      .positive(),
    previousAddress: z
      .string()
      .min(1, "Previous address is required")
      .optional(),
    estimatedPropertyValue: z.number().min(1).optional(),
    houseType: z.nativeEnum(PropertyType).optional(),
    downPayment: z.nativeEnum(DownPayment).optional(),
    vehicleType: z.nativeEnum(VehicleType).optional(),
    tradeInCurrentVehicle: z.boolean().optional(),
    sin: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || /^\d{9}$/.test(val), {
        message: "SIN must be exactly 9 digits",
      })
      .transform((val) => (val ? Number(val) : null)),

    // Refinance-specific fields
    currentMortgageBalance: moneyField(
      "Please enter your current mortgage balance in CAD"
    ).optional(),
    monthlyMortgagePayment: moneyField(
      "Please enter your current monthly mortgage payment in CAD"
    ).optional(),

    hasCoApplicant: z.boolean({
      required_error: "Required",
      invalid_type_error: "Required",
    }),
    coApplicantFullName: z.string().optional(),
    coApplicantDateOfBirth: z
      .preprocess(
        (arg) => {
          if (typeof arg === "string") {
            if (/^\d{4}-\d{2}-\d{2}$/.test(arg)) {
              return new Date(arg)
            }
            const parts = arg.split("-")
            if (parts.length === 3) {
              const [p1, p2, p3] = parts
              if (p3.length === 4) {
                const iso = `${p3}-${p2.padStart(2, "0")}-${p1.padStart(2, "0")}`
                return new Date(iso)
              }
            }
            const d = new Date(arg)
            return isNaN(d.getTime()) ? undefined : d
          }
          if (arg instanceof Date) return arg
          return undefined
        },
        z
          .date()
          .refine((date) => !isNaN(date.getTime()), { message: "Invalid date" })
      )
      .optional(),

    coApplicantAddress: z.string().optional(),
    coApplicantPhone: z.string().optional(),
    coApplicantEmail: z.string().email().optional(),
    monthlyDebts: moneyField("Please enter your monthly debts in CAD"),
    monthlyDebtsExist: z.boolean({
      required_error: "Please specify if you have monthly debts",
    }),
    savings: z.coerce.number().min(0, "Please enter your savings in CAD"),
    mortgage: moneyField("Please enter your mortgage amount in CAD"),
    propertyTaxMonthly: moneyField(
      "Please enter your monthly property tax in CAD"
    ),
    condoFees: moneyField("Please enter your condo fees in CAD"),
    heatingCosts: moneyField("Please enter your heating costs in CAD"),
    homeInsurance: moneyField("Please enter your home insurance amount in CAD"),
    monthlyCarLoanPayment: moneyField(
      "Please enter your monthly car loan payment in CAD"
    ),
    monthlyCreditCardMinimums: moneyField(
      "Please enter your monthly credit card minimums in CAD"
    ),
    monthlyOtherLoanPayments: moneyField(
      "Please enter your other loan payments in CAD"
    ),
    otherIncome: z.boolean({
      required_error: "Please specify if you have other income",
    }),
    otherIncomeAmount: moneyField(
      "Please enter your other income amount in CAD"
    ).optional(),
    childCareBenefit: z.boolean({
      required_error: "Please specify if you receive child care benefit",
    }),
    creditScore: z.coerce
      .number()
      .min(300, "Credit score must be at least 300")
      .max(900, "Credit score cannot exceed 900"),
  })
  .superRefine((data, ctx) => {
    if (data.housingStatus === HousingStatus.RENT) {
      if (!data.mortgage || data.mortgage <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Monthly rent is required when housing status is Rent",
          path: ["mortgage"],
        })
      }
    }
  })

export type GeneralLoanFormValues = z.infer<typeof generalLoanFormSchema>
