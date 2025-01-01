import * as z from "zod";

export const loanFormSchema = z.object({
  // Eligibility
  isAdult: z
    .boolean({
      required_error: "You must be 19+ and agree to the privacy policy",
    })
    .refine((val) => val === true, {
      message: "You must be 19+ and agree to the privacy policy",
    }),
  hasBankruptcy: z.boolean(),

  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  currentAddress: z.string().min(5, "Please enter your complete address"),
  residencyDuration: z.number().min(1, "Please enter your residency duration in years"),

  // Residence Details
  housingStatus: z.enum(["rent", "own"]),
  housingPayment: z.number().min(1, "Please enter your housing payment in CAD"),
  canadianStatus: z.enum(["citizen", "permanentResident", "temporaryResident", "other"]),

  // Employment
  employmentStatus: z.enum([
    "fullTime",
    "partTime",
    "contract",
    "seasonal",
    "selfEmployed",
    "other",
  ]),
  grossIncome: z.number().min(1, "Please enter your gross income in CAD per year"),
  workplaceName: z.string().min(1, "Workplace name is required"),
  workplacePhone: z.string().min(10, "Please enter a valid workplace phone"),
  workplaceEmail: z.string().email("Please enter a valid workplace email"),

  // Loan Details
  loanAmount: z.number().min(1, "Please specify how much you need in CAD"),
  loanPurpose: z.enum(["buying", "repair", "renovation"]),
  mortgageType: z.enum(["refinance", "equity", "bridge", "firsttime"]),
  housingType: z.enum([
    "condo",
    "apartment",
    "duplex",
    "townhouse",
    "detached",
    "semidetached",
    "container",
    "mobile",
    "bungalow",
    "other",
  ]),
  downPayment: z.enum(["5", "10", "15", "20", "more"]),
});

export type LoanFormValues = z.infer<typeof loanFormSchema>;
