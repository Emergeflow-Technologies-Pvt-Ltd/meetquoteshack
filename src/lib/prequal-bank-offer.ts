import { LoanType } from "@prisma/client"

export type LenderCategory =
  | "PRIME"
  | "B_LENDER"
  | "PRIVATE"
  | "NON_PRIME"
  | "SUBPRIME"

export interface RateRange {
  min: number
  max: number
}

export interface LenderInfo {
  name: string
  description?: string
}

export interface PrequalOffer {
  rateRange: RateRange
  lenderCategory: LenderCategory
  lenders: LenderInfo[]
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
  // SUBPRIME: credit <560
  if (creditScore < 560) {
    return { min: 15.99, max: 29.99 }
  }

  // NON_PRIME: credit 560–659 or DTI >40
  if (creditScore < 660 || dti > 40) {
    return { min: 10.99, max: 20.99 }
  }

  // --- PRIME tier (credit ≥660, DTI ≤40) ---

  // Excellent: >760 credit, DTI <30
  if (creditScore > 760 && dti < 30) {
    return { min: 3.99, max: 6.99 }
  }

  // Strong prime: ≥725, DTI ≤35
  if (creditScore >= 725 && dti <= 35) {
    return { min: 5.0, max: 7.5 }
  }

  // Prime with small premium: 660–724, DTI <35
  if (dti < 35) {
    return { min: 5.5, max: 8.0 }
  }

  // Prime with scrutiny: 660–724 (or ≥725 with DTI 35–40), DTI 35–40
  return { min: 6.0, max: 10.0 }
}

function getPersonalLoanRate(creditScore: number, dti: number): RateRange {
  if (dti > 40) {
    if (creditScore >= 660) {
      return { min: 15.0, max: 25.0 }
    }

    return { min: 20.0, max: 34.0 }
  }
  if (creditScore > 760 && dti < 30) return { min: 6.0, max: 9.99 }

  if (creditScore >= 725) return { min: 8.0, max: 12.0 }

  if (creditScore >= 660) return { min: 9.0, max: 15.0 }

  if (creditScore >= 560) return { min: 15.0, max: 25.0 }

  return { min: 20.0, max: 34.0 }
}

function getMortgageRate(creditScore: number, dti: number): RateRange {
  // High DTI override
  if (dti > 45) {
    return { min: 5.5, max: 8.5 }
  }

  if (dti > 40) {
    return { min: 4.75, max: 6.5 }
  }

  if (creditScore > 760 && dti < 30) {
    return { min: 3.64, max: 3.74 }
  }

  if (creditScore >= 725) {
    return { min: 3.74, max: 3.9 }
  }

  if (creditScore >= 660) {
    return { min: 3.9, max: 4.5 }
  }

  if (creditScore >= 560) {
    return { min: 4.5, max: 6.5 }
  }

  return { min: 6.5, max: 10.0 }
}

/* -------------------------------------------------- */
/* 🔹 LENDER CATEGORY */
/* -------------------------------------------------- */

function getMortgageCategory(creditScore: number, dti: number): LenderCategory {
  // Strong prime
  if (creditScore >= 760 && dti <= 35) {
    return "PRIME"
  }

  // Very good prime
  if (creditScore >= 725 && dti <= 35) {
    return "PRIME"
  }

  // Borderline prime
  if (creditScore >= 660 && dti <= 38) {
    return "PRIME"
  }

  // Alternative / B lenders
  if (creditScore >= 560 && dti <= 45) {
    return "B_LENDER"
  }

  // High-risk / private
  return "PRIVATE"
}

function getMortgageNotes(
  category: LenderCategory,
  creditScore: number,
  dti: number
): string[] {
  const notes: string[] = []

  // Strong prime
  if (creditScore > 760 && dti < 30) {
    notes.push("Eligible for competitive Big Six and monoline mortgage rates.")

    notes.push("Best fixed and variable mortgage pricing may be available.")
  }

  // Good credit but higher DTI
  else if (creditScore >= 660 && dti <= 40) {
    notes.push(
      "Approval possible with prime lenders, but application may face additional scrutiny."
    )

    notes.push(
      "May need a mortgage advisor or broker for best lender matching."
    )

    notes.push(
      "Strong equity or larger down payment may improve approval flexibility."
    )
  }

  // B lender
  if (category === "B_LENDER") {
    notes.push(
      "B lender mortgage or alternative mortgage solutions may be required."
    )

    notes.push(
      "May need a mortgage advisor for best advice. Connect with an Advisor now from your profile."
    )

    notes.push(
      "Co-signer, stronger equity position, or lower debts may improve approval chances."
    )
  }

  // Private
  if (category === "PRIVATE") {
    notes.push(
      "Private mortgage financing may be required due to higher risk profile."
    )

    notes.push("Larger equity/down payment or co-signer may be needed.")

    notes.push(
      "Private mortgage solutions are typically short-term and higher cost."
    )
  }

  if (dti > 40) {
    notes.push("Higher TDS/DTI may limit prime lender approval options.")
  }

  return notes
}

function getCarLoanCategory(creditScore: number, dti: number): LenderCategory {
  // PRIME: credit ≥660 and DTI ≤40 — Big Six territory
  if (creditScore >= 660 && dti <= 40) {
    return "PRIME"
  }

  // NON_PRIME: credit 560–659 or DTI >40
  if (creditScore >= 560) {
    return "NON_PRIME"
  }

  // SUBPRIME: credit <560
  return "SUBPRIME"
}

function getPersonalLoanCategory(
  creditScore: number,
  dti: number
): LenderCategory {
  if (creditScore >= 725 && dti <= 35) {
    return "PRIME"
  }

  if (creditScore >= 660 && dti <= 35) {
    return "PRIME"
  }

  if (creditScore >= 660 && dti <= 40) {
    return "B_LENDER"
  }

  if (creditScore >= 560) {
    return "NON_PRIME"
  }

  return "SUBPRIME"
}
// function getLenderCategory(creditScore: number, dti: number): LenderCategory {
//   if (creditScore >= 725 && dti <= 35) return "PRIME"
//   if (creditScore >= 660 && dti <= 40) return "ALT"
//   return "SUBPRIME"
// }

/* -------------------------------------------------- */
/* 🔹 LENDER LIST */
/* -------------------------------------------------- */

const MORTGAGE_LENDER_MAP: Record<LenderCategory, LenderInfo[]> = {
  PRIME: [
    {
      name: "RBC Royal Bank",
      description:
        "Competitive fixed and variable mortgage solutions with strong refinancing options.",
    },
    {
      name: "TD Bank",
      description:
        "Flexible mortgage products with extended amortization options.",
    },
    {
      name: "Scotiabank",
      description:
        "Strong mortgage approval flexibility with cashback and rate specials.",
    },
    {
      name: "CIBC",
      description: "Wide range of insured and uninsured mortgage products.",
    },
    {
      name: "BMO",
      description: "Competitive rates with flexible repayment privileges.",
    },
    {
      name: "National Bank",
      description:
        "Customized mortgage financing solutions for different borrower profiles.",
    },
    {
      name: "First National",
      description:
        "Large monoline mortgage lender with competitive broker-channel rates.",
    },
    {
      name: "MCAP",
      description:
        "Well-known mortgage lender offering flexible lending solutions.",
    },
    {
      name: "Desjardins",
      description:
        "Strong mortgage offerings with regional expertise and flexible options.",
    },
    {
      name: "Tangerine",
      description:
        "Online-focused lender with competitive simplified mortgage products.",
    },
    {
      name: "nesto",
      description:
        "Digital mortgage platform focused on competitive rate matching.",
    },
  ],

  B_LENDER: [
    {
      name: "Equitable Bank",
      description:
        "Alternative mortgage lending for self-employed and non-traditional borrowers.",
    },
    {
      name: "Home Trust",
      description: "Flexible mortgage approvals for bruised-credit borrowers.",
    },
    {
      name: "MCAP Eclipse",
      description:
        "Alternative lending division offering flexible qualification options.",
    },
    {
      name: "Merix Financial",
      description:
        "Broker-focused mortgage solutions with alternative lending programs.",
    },
    {
      name: "CMLS Financial",
      description: "Alternative and traditional mortgage lending programs.",
    },
    {
      name: "Pine Financial",
      description:
        "Technology-driven mortgage lender with competitive alternative products.",
    },
  ],

  PRIVATE: [
    {
      name: "MCAN Home",
      description: "Private mortgage solutions for complex credit situations.",
    },
    {
      name: "Optimum Mortgage",
      description:
        "Private lending solutions for borrowers outside traditional guidelines.",
    },
    {
      name: "Strive Capital",
      description:
        "Private mortgage funding for short-term or high-risk scenarios.",
    },
    {
      name: "Alpine Credits",
      description:
        "Home equity lending solutions with flexible approval criteria.",
    },
    {
      name: "Fisgard",
      description: "Private mortgage investment and lending solutions.",
    },
    {
      name: "Effort Trust",
      description:
        "Alternative mortgage lender focused on unique borrower situations.",
    },
  ],

  NON_PRIME: [],
  SUBPRIME: [],
}

const CAR_LOAN_LENDER_MAP: Record<LenderCategory, LenderInfo[]> = {
  PRIME: [
    {
      name: "RBC Royal Bank",
      description:
        "Competitive promos, up to $75k financing, terms up to 96 months.",
    },
    {
      name: "TD Auto Finance",
      description: "Flexible terms with strong dealership network support.",
    },
    {
      name: "Scotiabank",
      description:
        "Strong prime auto lending presence with high approval flexibility.",
    },
    {
      name: "CIBC",
      description:
        "Financing up to 96 months with some no down payment options.",
    },
    {
      name: "BMO",
      description: "Competitive new and used vehicle financing solutions.",
    },
    {
      name: "National Bank",
      description:
        "Tailored vehicle financing with fixed and variable options.",
    },
  ],

  NON_PRIME: [
    {
      name: "iA Auto Finance",
      description: "Known for flexible approvals for fair credit borrowers.",
    },
    {
      name: "Lendcare",
      description: "Strong dealership partnerships for non-prime financing.",
    },
    {
      name: "Scotia Dealer Advantage",
      description: "Scotiabank’s non-prime auto financing division.",
    },
    {
      name: "Santander Consumer",
      description: "Subprime-focused lender with flexible approval criteria.",
    },
    {
      name: "Eden Park",
      description: "Large non-prime auto lender for higher-risk profiles.",
    },
    {
      name: "AutoCapital Canada",
      description: "Flexible financing options for non-prime borrowers.",
    },
    {
      name: "Northlake Financial",
      description:
        "Alternative auto financing for challenged credit situations.",
    },
    {
      name: "OCM Auto Financing",
      description: "Works with dealerships for non-prime approvals.",
    },
  ],

  SUBPRIME: [
    {
      name: "401 Auto Financing",
      description: "High approval rates for bad credit auto financing.",
    },
    {
      name: "NewRoads Financial",
      description: "Focused on bad credit approvals with flexible terms.",
    },
    {
      name: "Bonnybrook Auto",
      description: "Subprime dealership financing network.",
    },
    {
      name: "CarMatch Canada",
      description: "Vehicle financing solutions for poor or rebuilding credit.",
    },
    {
      name: "Canada Drives",
      description: "Online approvals for difficult credit situations.",
    },
    {
      name: "Carnation Canada",
      description: "Subprime-focused vehicle financing marketplace.",
    },
  ],

  B_LENDER: [],
  PRIVATE: [],
}

const PERSONAL_LOAN_LENDER_MAP: Record<LenderCategory, LenderInfo[]> = {
  PRIME: [
    {
      name: "RBC Royal Bank",
      description:
        "Competitive unsecured personal loan options with flexible repayment terms.",
    },
    {
      name: "TD Bank",
      description: "Personal lending solutions with fixed monthly payments.",
    },
    {
      name: "Scotiabank",
      description:
        "Flexible personal financing with multiple borrowing options.",
    },
    {
      name: "CIBC",
      description:
        "Unsecured and secured personal loans with competitive rates.",
    },
  ],

  NON_PRIME: [
    {
      name: "Fairstone",
      description:
        "Alternative personal loan solutions for fair-credit borrowers.",
    },
    {
      name: "Spring Financial",
      description: "Credit-building and installment loan solutions.",
    },
    {
      name: "goPeer",
      description:
        "Peer-to-peer lending platform with flexible qualification criteria.",
    },
    {
      name: "Fig Financial",
      description:
        "Alternative lending for borrowers with limited credit history.",
    },
  ],

  SUBPRIME: [
    {
      name: "easyfinancial",
      description: "Subprime installment loans for rebuilding credit profiles.",
    },
    {
      name: "SkyCap Financial",
      description:
        "Fast personal loan approvals for challenged credit situations.",
    },
    {
      name: "LoanConnect",
      description:
        "Loan marketplace connecting borrowers with alternative lenders.",
    },
    {
      name: "Money Mart",
      description: "Short-term and installment lending solutions.",
    },
    {
      name: "Cash Money",
      description: "Alternative lending products for urgent financing needs.",
    },
  ],

  B_LENDER: [
    {
      name: "Fairstone",
      description:
        "Alternative personal loan solutions for fair-credit borrowers.",
    },
    {
      name: "Spring Financial",
      description: "Credit-building and installment loan solutions.",
    },
    {
      name: "goPeer",
      description:
        "Peer-to-peer lending platform with flexible qualification criteria.",
    },
    {
      name: "Fig Financial",
      description:
        "Alternative lending for borrowers with limited credit history.",
    },
  ],
  PRIVATE: [],
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

  if (category === "B_LENDER" || category === "NON_PRIME") {
    notes.push("Approval possible with slightly higher rates.")

    notes.push(
      "Consider improving DTI or increasing down payment for better rates."
    )
  }

  if (category === "SUBPRIME" || category === "PRIVATE") {
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

function getCarLoanNotes(
  category: LenderCategory,
  creditScore: number,
  dti: number
): string[] {
  const notes: string[] = []

  if (category === "PRIME") {
    if (creditScore > 760 && dti < 30) {
      notes.push("You may qualify for the lowest promotional vehicle financing rates.")
      notes.push("Big bank financing and dealership promotional offers are available.")
    } else if (dti >= 35 && dti <= 40) {
      notes.push("Approval possible with TD, Scotiabank, RBC, or CIBC — a small rate premium may apply.")
      notes.push("Scrutiny increases at this DTI level; consider getting pre-approved directly through your bank.")
    } else {
      notes.push("You qualify for competitive prime auto financing rates.")
      notes.push("Big bank financing and dealership promotional offers may be available.")
    }
  }

  if (category === "NON_PRIME") {
    notes.push("Approval possible through alternative or non-prime auto lenders.")
    notes.push("Interest rates are typically above 10% due to credit profile or DTI.")
    notes.push("Pre-approval through dealership financing may improve approval chances.")
  }

  if (category === "SUBPRIME") {
    notes.push("Approval may require subprime or high-risk vehicle financing programs.")
    notes.push("Larger down payment or co-signer may improve lender options.")
    notes.push("Higher interest rates and stricter approval conditions are likely.")
  }

  return notes
}
/* -------------------------------------------------- */
/* 🔹 MAIN FUNCTION */
/* -------------------------------------------------- */

export function computeOffer(input: OfferInput): PrequalOffer {
  const { creditScore, dti, loanType } = input

  let rateRange: RateRange
  let lenderCategory: LenderCategory
  let lenders: LenderInfo[]
  let notes: string[] = []

  switch (loanType) {
    case LoanType.CAR:
      rateRange = getCarLoanRate(creditScore, dti)

      lenderCategory = getCarLoanCategory(creditScore, dti)

      lenders = CAR_LOAN_LENDER_MAP[lenderCategory]

      notes = getCarLoanNotes(lenderCategory, creditScore, dti)

      break

    case LoanType.PERSONAL:
      rateRange = getPersonalLoanRate(creditScore, dti)

      lenderCategory = getPersonalLoanCategory(creditScore, dti)

      lenders = PERSONAL_LOAN_LENDER_MAP[lenderCategory]

      notes = getNotes(lenderCategory, creditScore, dti)

      break

    default:
      // Mortgage / Refinance / HELOC etc.
      rateRange = getMortgageRate(creditScore, dti)

      lenderCategory = getMortgageCategory(creditScore, dti)

      lenders = MORTGAGE_LENDER_MAP[lenderCategory]

      notes = getMortgageNotes(lenderCategory, creditScore, dti)

      break
  }

  return {
    rateRange,
    lenderCategory,
    lenders,
    notes,
  }
}
