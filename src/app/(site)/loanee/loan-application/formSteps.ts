import { LoanType } from "@prisma/client"

export const loanTypeOptions = Object.values(LoanType)

export const formSteps = [
  {
    id: "step-1",
    title: "Step 1: Eligibility Check",
    description: "Basic eligibility requirements",
    variant: "regular",
    subSteps: [
      { key: "isAdult", label: "Terms and Conditions", required: true },
      { key: "hasBankruptcy", label: "Bankruptcy status", required: true },
      { key: "agentCode", label: "Agent code", required: false },
    ],
  },
  {
    id: "step-2",
    title: "Step 2: Application Type",
    description: "What type of loan are you applying for?",
    variant: "regular",
    subSteps: [
      {
        key: "loanType",
        label: "Loan type",
        required: true,
        options: loanTypeOptions,
      },
    ],
  },
  {
    id: "step-3",
    title: "Step 3: Personal and Educational Details",
    description: "Your personal and educational details",
    variant: "regular",
    subSteps: [
      { key: "firstName", label: "First name", required: true },
      { key: "lastName", label: "Last name", required: true },
      { key: "dateOfBirth", label: "DOB", required: true },
      { key: "personalPhone", label: "Phone Number", required: true },
      { key: "personalEmail", label: "Email address", required: true },
      { key: "sin", label: "SIN/SSN", required: false },
      {
        key: "generalEducationLevel",
        label: "Education level",
        required: false,
      },
      { key: "generalFieldOfStudy", label: "Field of study", required: false },
      { key: "maritalStatus", label: "Marital status", required: false },
    ],
  },
  {
    id: "step-4",
    title: "Step 4: Residential Information",
    description: "Your current residential details",
    variant: "regular",
    subSteps: [
      { key: "residencyStatus", label: "Status in canada", required: true },
      { key: "currentAddress", label: "Current address", required: true },
      {
        key: "yearsAtCurrentAddress",
        label: "Current address years",
        required: false,
      },
      { key: "housingStatus", label: "Housing status", required: false },
    ],
  },
  {
    id: "step-5",
    title: "Step 5: Employment Information",
    description: "Your current employment and income details",
    variant: "regular",
    subSteps: [
      { key: "employmentStatus", label: "Employment status", required: false },
      { key: "grossIncome", label: "Gross annual income", required: true },
      { key: "workplaceName", label: "Employer name", required: false },
      { key: "workplaceAddress", label: "Employer address", required: false },
      { key: "workplacePhone", label: "Work phone", required: false },
      { key: "workplaceEmail", label: "Work email", required: false },
      {
        key: "workplaceDuration",
        label: "Work experience (years)",
        required: true,
      },
    ],
  },
  {
    id: "step-6",
    title: "Step 6: Financial Details",
    description: "Your Banking and financial information",
    variant: "regular",
    subSteps: [
      { key: "savings", label: "Savings", required: false },
      {
        key: "monthlyDebtsExist",
        label: "Monthly debts exist",
        required: true,
      },
      { key: "mortgage", label: "Mortgage (monthly)", required: true },
      {
        key: "propertyTaxMonthly",
        label: "Property Tax",
        required: true,
      },
      { key: "condoFees", label: "Condo fees", required: true },
      { key: "heatingCosts", label: "Heating costs", required: true },
      { key: "homeInsurance", label: "Home insurance", required: true },
      {
        key: "monthlyCarLoanPayment",
        label: "Car loan",
        required: true,
      },
      {
        key: "monthlyCreditCardMinimums",
        label: "Credit card minimums",
        required: true,
      },
      {
        key: "monthlyOtherLoanPayments",
        label: "Other loans",
        required: true,
      },
      { key: "monthlyDebts", label: "Total debts", required: true },
      { key: "otherIncome", label: "Other income", required: true },
      {
        key: "otherIncomeAmount",
        label: "Other income amount",
        required: true,
      },
      { key: "childCareBenefit", label: "Child benefit", required: false },
      { key: "creditScore", label: "Credit score", required: true },
    ],
  },
  {
    id: "step-7",
    title: "Step 7: Review & Submit",
    description: "Review and submit your application",
    variant: "regular",
    subSteps: [
      { key: "loanAmount", label: "Loan amount", required: true },
      { key: "hasCoApplicant", label: "Co-applicant", required: false },
      {
        key: "coApplicantFullName",
        label: "Co-applicant name",
        required: false,
      },
    ],
  },
]
