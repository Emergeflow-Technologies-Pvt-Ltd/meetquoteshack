import { DocumentType, DownPayment, EmploymentStatus, HousingStatus, LoanStatus, LoanType, MaritalStatus, PropertyType, ResidencyStatus } from "@prisma/client";

export const loanTypeLabels: Record<string, string> = {
    [LoanType.BUSINESS]: "Business Loan",
    [LoanType.CAR]: "Car Loan",
    [LoanType.COMMERCIAL]: "Commercial Loan",
    [LoanType.FIRST_TIME_HOME]: "First time home buyer",
    [LoanType.HELOC]: "HELOC",
    [LoanType.HOME_REPAIR]: "Home Repair / Renovation",
    [LoanType.INVESTMENT_PROPERTY]: "Investment Property",
    [LoanType.LINE_OF_CREDIT]: "Line of Credit",
    [LoanType.MORTGAGE_REFINANCE]: "Mortgage Refinance",
    [LoanType.PERSONAL]: "Personal Loan",
    [LoanType.OTHER]: "Other"
};

export const propertyTypeLabels: Record<string, string> = {
    [PropertyType.CONDO]: "Condo",
    [PropertyType.APARTMENT]: "Apartment",
    [PropertyType.DUPLEX]: "Duplex",
    [PropertyType.TOWNHOUSE]: "Townhouse",
    [PropertyType.DETACHED]: "Detached House",
    [PropertyType.SEMI_DETACHED]: "Semi-Detached House",
    [PropertyType.HOUSE]: "House",
    [PropertyType.CONTAINER]: "Container Home",
    [PropertyType.MOBILE]: "Mobile Home",
    [PropertyType.BUNGALOW]: "Bungalow",
    [PropertyType.OTHER]: "Other",
};

export const downPaymentLabels: Record<string, string> = {
    [DownPayment.FIVE]: "5%",
    [DownPayment.TEN]: "10%",
    [DownPayment.FIFTEEN]: "15%",
    [DownPayment.TWENTY]: "20%",
    [DownPayment.MORE]: "More than 20%",
};

export const employmentTypeLabels: Record<string, string> = {
    [EmploymentStatus.CONTRACT]: "Contract",
    [EmploymentStatus.FULL_TIME]: "Full time",
    [EmploymentStatus.OTHER]: "Other",
    [EmploymentStatus.PART_TIME]: "Part time",
    [EmploymentStatus.SEASONAL]: "Seasonal",
    [EmploymentStatus.SELF_EMPLOYED]: "Self Employed",

};

export const documentTypeLabels: Record<string, string> = {
    [DocumentType.IDENTITY_PROOF]: "Identity Proof",
    [DocumentType.INCOME_PROOF]: "Income Proof",
    [DocumentType.EMPLOYMENT_LETTER]: "Employment Letter",
    [DocumentType.TAX_RETURN]: "Tax Return",
    [DocumentType.BANK_STATEMENT]: "Bank Statement",
    [DocumentType.PROPERTY_DOCUMENT]: "Property Document",
    [DocumentType.OTHER]: "Other",
};


export const residencyStatusTypeLabels: Record<string, string> = {
    [ResidencyStatus.CITIZEN]: "Citizen",
    [ResidencyStatus.OTHER]: "Other",
    [ResidencyStatus.PERMANENT_RESIDENT]: "Permanent Resident",
    [ResidencyStatus.STUDENT_VISA]: "Student visa",
    [ResidencyStatus.WORK_PERMIT]: "Work permit",
    [ResidencyStatus.REFUGEE]: "Refugee"
};

export const housingStatusTypeLabels: Record<string, string> = {
    [HousingStatus.OWN]: "Own",
    [HousingStatus.RENT]: "Rent",
};
export const maritalStatusLabels: Record<string, string> = {
    [MaritalStatus.SINGLE]: "Single",
    [MaritalStatus.MARRIED]: "Married",
    [MaritalStatus.DIVORCED]: "Divorced",
    [MaritalStatus.WIDOWED]: "Widowed",
    [MaritalStatus.OTHER]: "Other"
};
export const applicationStatusLabels: Record<string, string> = {
    [LoanStatus.OPEN]: "OPEN",
    [LoanStatus.APPROVED]: "APPROVED",
    [LoanStatus.ARCHIVED]: "ARCHIVED",
    [LoanStatus.ASSIGNED_TO_LENDER]: "ASSIGNED TO LENDER",
    [LoanStatus.IN_CHAT]: "IN CHAT",
    [LoanStatus.IN_PROGRESS]: "IN PROGRESS",
    [LoanStatus.REJECTED]: "REJECTED",
};

