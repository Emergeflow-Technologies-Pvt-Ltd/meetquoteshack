import * as z from "zod";

export const loanFormSchema = z.object({
  isAdult: z
    .boolean({
      required_error: "You must be 19+ and agree to the privacy policy",
    })
    .refine((val) => val === true, {
      message: "You must be 19+ and agree to the privacy policy",
    }),
  hasBankruptcy: z.boolean(),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  currentAddress: z.string().min(5, "Please enter your complete address"),
  residencyDuration: z
    .string()
    .min(1, "Please specify how long you've lived here"),
  housingStatus: z.enum(["rent", "own"]),
  housingPayment: z.string().min(1, "Please enter your rent/mortgage amount"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  maritalStatus: z.enum([
    "single",
    "married",
    "divorced",
    "widowed",
    "separated",
  ]),
  canadianStatus: z.string().min(1, "Please specify your status in Canada"),
  personalPhone: z.string().min(10, "Please enter a valid phone number"),
  businessPhone: z.string().optional(),
  employmentStatus: z.enum([
    "fulltime",
    "parttime",
    "contract",
    "seasonal",
    "selfemployed",
    "other",
  ]),
  grossIncome: z.string().min(1, "Please enter your gross income"),
  workplace: z.object({
    name: z.string().min(1, "Workplace name is required"),
    address: z.string().min(1, "Workplace address is required"),
    phone: z.string().min(10, "Please enter a valid workplace phone"),
    email: z.string().email("Please enter a valid workplace email"),
  }),
  loanAmount: z.string().min(1, "Please specify how much you need"),
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
  downPayment: z.enum(["five", "ten", "fifteen", "twenty", "more"]),
});
