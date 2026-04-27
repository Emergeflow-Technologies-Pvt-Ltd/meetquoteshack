import { LoanType } from "@prisma/client"

export type LenderCategory = "PRIME" | "ALT" | "SUBPRIME"

export interface RateRange {
  min: number
  max: number
}

export interface PrequalOffer {
  rateRange: RateRange
  lenderCategory: LenderCategory
  lenders: string[]
  notes: string[]
}

export interface OfferInput {
  creditScore: number
  dti: number
  loanType?: LoanType
}

/* -------------------------------------------------- */
/* 🔹 RATE LOGIC */
/* -------------------------------------------------- */

function getCarLoanRate(creditScore: number, dti: number): RateRange {
  if (creditScore > 760 && dti < 30) return { min: 3.99, max: 6.99 }

  if (creditScore >= 725 && dti <= 35) return { min: 5.0, max: 7.5 }

  if (creditScore >= 660 && dti <= 40) return { min: 5.99, max: 9.99 }

  if (creditScore >= 560) return { min: 8.99, max: 16.99 }

  return { min: 10.99, max: 29.99 }
}

function getPersonalLoanRate(creditScore: number, dti: number): RateRange {
  if (creditScore > 760 && dti < 30) return { min: 6.0, max: 9.99 }

  if (creditScore >= 725) return { min: 8.0, max: 12.0 }

  if (creditScore >= 660) return { min: 9.0, max: 15.0 }

  if (creditScore >= 560) return { min: 15.0, max: 25.0 }

  return { min: 20.0, max: 34.0 }
}

function getMortgageRate(creditScore: number, dti: number): RateRange {
  if (creditScore > 760 && dti < 30) return { min: 3.64, max: 3.74 }

  if (creditScore >= 725) return { min: 3.74, max: 3.9 }

  if (creditScore >= 660) return { min: 3.9, max: 4.2 }

  if (creditScore >= 560) return { min: 4.2, max: 5.0 }

  return { min: 5.0, max: 7.0 }
}

/* -------------------------------------------------- */
/* 🔹 LENDER CATEGORY */
/* -------------------------------------------------- */

function getLenderCategory(creditScore: number, dti: number): LenderCategory {
  if (creditScore >= 725 && dti <= 35) return "PRIME"
  if (creditScore >= 660 && dti <= 40) return "ALT"
  return "SUBPRIME"
}

/* -------------------------------------------------- */
/* 🔹 LENDER LIST */
/* -------------------------------------------------- */

const LENDER_MAP: Record<LenderCategory, string[]> = {
  PRIME: [
    "RBC Royal Bank",
    "TD Bank",
    "Scotiabank",
    "CIBC",
    "BMO",
    "National Bank",
  ],
  ALT: ["Lendcare", "Fairstone", "Spring Financial", "goPeer", "Fig Financial"],
  SUBPRIME: [
    "easyfinancial",
    "SkyCap Financial",
    "LoanConnect",
    "Money Mart",
    "Cash Money",
  ],
}

/* -------------------------------------------------- */
/* 🔹 NOTES */
/* -------------------------------------------------- */

function getNotes(
  category: LenderCategory,
  creditScore: number,
  dti: number
): string[] {
  const notes: string[] = []

  if (category === "PRIME") {
    notes.push("You qualify for competitive market rates.")
    if (creditScore > 760 && dti < 30) {
      notes.push("You may be eligible for promotional or lowest-tier rates.")
    }
  }

  if (category === "ALT") {
    notes.push("Approval possible with slightly higher rates.")
    notes.push(
      "Consider improving DTI or increasing down payment for better rates."
    )
  }

  if (category === "SUBPRIME") {
    notes.push("Limited lender options with higher interest rates.")
    notes.push(
      "Consider adding a co-signer or improving credit score before applying."
    )
  }

  if (dti > 40) {
    notes.push("High DTI may reduce approval chances.")
  }

  return notes
}

/* -------------------------------------------------- */
/* 🔹 MAIN FUNCTION */
/* -------------------------------------------------- */

export function computeOffer(input: OfferInput): PrequalOffer {
  const { creditScore, dti, loanType } = input

  let rateRange: RateRange

  switch (loanType) {
    case LoanType.CAR:
      rateRange = getCarLoanRate(creditScore, dti)
      break

    case LoanType.PERSONAL:
      rateRange = getPersonalLoanRate(creditScore, dti)
      break

    default:
      // Treat all others as mortgage-like
      rateRange = getMortgageRate(creditScore, dti)
      break
  }

  const lenderCategory = getLenderCategory(creditScore, dti)

  const lenders = LENDER_MAP[lenderCategory]

  const notes = getNotes(lenderCategory, creditScore, dti)

  return {
    rateRange,
    lenderCategory,
    lenders,
    notes,
  }
}
