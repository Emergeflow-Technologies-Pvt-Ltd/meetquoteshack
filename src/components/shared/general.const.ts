import { DownPayment, LoanType, PropertyType } from "@prisma/client";

export const profileTypeLabels: Record<string, string> = {
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