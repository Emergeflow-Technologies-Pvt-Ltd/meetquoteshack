import { DocumentType } from "@prisma/client";
import { DocumentTypeConfig } from "./types";

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

export const availableDocumentTypes: DocumentTypeConfig[] = [
  {
    type: DocumentType.IDENTITY_PROOF,
    label: "Identity Proof",
    description:
      "Government-issued photo ID (passport, driver's license, etc.)",
  },
  {
    type: DocumentType.INCOME_PROOF,
    label: "Income Proof",
    description: "Last 3 months of pay stubs or income statements",
  },
  {
    type: DocumentType.EMPLOYMENT_LETTER,
    label: "Employment Letter",
    description: "Employment verification letter from current employer",
  },
  {
    type: DocumentType.TAX_RETURN,
    label: "Tax Return",
    description: "T4 and Notice of Assessment from the last tax year",
  },
  {
    type: DocumentType.BANK_STATEMENT,
    label: "Bank Statements",
    description: "3 months of bank statements from primary account",
  },
  {
    type: DocumentType.PROPERTY_DOCUMENT,
    label: "Property Documents",
    description: "Property related documents (deed, assessment, etc.)",
  },
  {
    type: DocumentType.OTHER,
    label: "Other Documents",
    description: "Additional supporting documents",
  },
];
