import { DocumentType } from "@prisma/client";

export const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
];

export const investRanges = [
  { value: "Below 20000$", label: "Below 20000$" },
  { value: "2000$ to 50000$", label: "20000$ to 50000$" },
  { value: "50000$ to 100000$", label: "50000$ to 100000$" },
  { value: "Above 100000$", label: "Above 100000$" },
];

export const documentTypes = [
  { value: DocumentType.IDENTITY_PROOF, label: "Upload your government-issued photo ID (passport, driver's license, etc.)" },
  { value: DocumentType.INCOME_PROOF, label: "Upload your last 3 months of pay stubs or income statements" },
  { value: DocumentType.EMPLOYMENT_LETTER, label: "Upload an employment verification letter from your current employer" },
  { value: DocumentType.TAX_RETURN, label: "Upload your T4 and Notice of Assessment from the last tax year" },
  { value: DocumentType.BANK_STATEMENT, label: "Upload 3 months of bank statements from your primary account" },
  { value: DocumentType.PROPERTY_DOCUMENT, label: "Upload property related documents (deed, assessment, etc.)" },
  { value: DocumentType.OTHER, label: "Other" },
];
