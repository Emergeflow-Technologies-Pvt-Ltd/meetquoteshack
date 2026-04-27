export const fieldTypeMap: Record<string, string> = {
  isAdult: "Boolean (Checkbox)",
  hasBankruptcy: "Boolean (Checkbox)",
  agentCode: "Text",

  loanType: "Dropdown",

  firstName: "Text",
  lastName: "Text",
  dateOfBirth: "Date",
  maritalStatus: "Dropdown",
  personalPhone: "Phone",
  personalEmail: "Email",
  sin: "Number",

  currentAddress: "Text",
  yearsAtCurrentAddress: "Number",
  housingStatus: "Dropdown",
  residencyStatus: "Dropdown",

  generalEducationLevel: "Dropdown",
  generalFieldOfStudy: "Text",

  employmentStatus: "Dropdown",
  grossIncome: "Number",
  workplaceName: "Text",
  workplaceAddress: "Text",
  workplacePhone: "Phone",
  workplaceEmail: "Email",
  workplaceDuration: "Number",

  loanAmount: "Currency",
  houseType: "Dropdown",
  downPayment: "Dropdown",
  vehicleType: "Dropdown",

  monthlyDebts: "Currency",
  savings: "Currency",
  mortgage: "Currency",
  creditScore: "Number",

  otherIncome: "Boolean",
  otherIncomeAmount: "Currency",

  childCareBenefit: "Boolean",
  monthlyDebtsExist: "Checkbox",
  propertyTaxMonthly: "Currency",
  heatingCosts: "Currency",
  homeInsurance: "Currency",
  condoFees: "Currency",
  monthlyCarLoanPayment: "Currency",
  monthlyCreditCardMinimums: "Currency",
  monthlyOtherLoanPayments: "Currency",
  hasCoApplicant: "Boolean",
  coApplicantFullName: "Text",
}
