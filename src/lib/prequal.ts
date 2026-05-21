// // lib/prequal.ts
// import { LoanType } from "@prisma/client"

// export type PrequalStatus = "APPROVED" | "CONDITIONAL" | "DECLINED"
// export type CreditTier = "Excellent" | "Good" | "Fair" | "Poor"

// export interface PrequalInput {
//   loanAmount: number
//   creditScore: number
//   grossIncome: number
//   monthlyDebts: number
//   estimatedPropertyValue: number
//   workplaceDuration: number
//   loanType?: LoanType
//   // Additional fields for refinance
//   currentMortgageBalance?: number
//   monthlyMortgagePayment?: number
//   propertyTaxMonthly?: number
//   heatingCostMonthly?: number
//   condoFeesMonthly?: number
// }

// export function computePrequalification(input: PrequalInput) {
//   const safe = (n: unknown) => (typeof n === "number" && isFinite(n) ? n : 0)

//   const P = safe(input.loanAmount)
//   const grossYear = safe(input.grossIncome)
//   const grossMonth = grossYear / 12
//   const existingDebts = safe(input.monthlyDebts)
//   const propValue = safe(input.estimatedPropertyValue)
//   const employmentYears = safe(input.workplaceDuration)
//   const creditScore = safe(input.creditScore)
//   const loanType = input.loanType

//   // Refinance-specific fields
//   const currentMortgageBalance = safe(input.currentMortgageBalance)
//   const monthlyMortgagePayment = safe(input.monthlyMortgagePayment)
//   const propertyTaxMonthly = safe(input.propertyTaxMonthly)
//   const heatingCostMonthly = safe(input.heatingCostMonthly) || 135 // Default $135 as per Canadian standard
//   const condoFeesMonthly = safe(input.condoFeesMonthly)

//   const mortgageLikeLoanTypes: LoanType[] = [
//     LoanType.FIRST_TIME_HOME,
//     LoanType.MORTGAGE_REFINANCE,
//     LoanType.INVESTMENT_PROPERTY,
//     LoanType.HELOC,
//     LoanType.HOME_REPAIR,
//   ]

//   const isMortgageLike = !!loanType && mortgageLikeLoanTypes.includes(loanType)
//   const isRefinance = loanType === LoanType.MORTGAGE_REFINANCE

//   // 1. Payment estimate
//   const assumedTermYears = isMortgageLike ? 25 : 5
//   let assumedRateAnnual = isMortgageLike ? 5 : 10

//   // Stress test for refinance (Canadian requirement)
//   // Must qualify at higher of: contract rate + 2% OR Bank of Canada qualifying rate
//   const bankOfCanadaQualifyingRate = 5.25 // This should be updated regularly
//   if (isRefinance) {
//     const stressRate = Math.max(
//       assumedRateAnnual + 2,
//       bankOfCanadaQualifyingRate
//     )
//     assumedRateAnnual = stressRate
//   }

//   const n = assumedTermYears * 12
//   const r = assumedRateAnnual / 100 / 12

//   let proposedLoanPayment = 0
//   if (P > 0 && r > 0 && n > 0) {
//     const pow = Math.pow(1 + r, n)
//     proposedLoanPayment = P * ((r * pow) / (pow - 1))
//   }

//   // 2. Ratios
//   // NOTE: DTI values are still calculated for all loan types for informational purposes.
//   // For Canadian refinance loans, approval decisions use GDS/TDS exclusively.
//   // The DTI values below are NOT used in refinance approval logic.

//   // Front-End DTI: Current debts only (excluding new loan)
//   const frontEndDTI = grossMonth > 0 ? (existingDebts / grossMonth) * 100 : 0

//   // Back-End DTI: Total debts including new loan
//   const totalDebtWithNew = existingDebts + proposedLoanPayment
//   const backEndDTI = grossMonth > 0 ? (totalDebtWithNew / grossMonth) * 100 : 0

//   // Keep dti as backEndDTI for backward compatibility
//   const dti = backEndDTI

//   // Canadian GDS and TDS (for refinance)
//   let gds = 0
//   let tds = 0

//   if (isRefinance) {
//     // P0 FIX: Subtract current mortgage payment to avoid double-counting
//     // User's existingDebts includes their current mortgage payment,
//     // but we're replacing it with the new proposedLoanPayment in housingCosts.
//     // So we must remove the old payment to get true non-housing debts.
//     const nonHousingDebts = Math.max(existingDebts - monthlyMortgagePayment, 0)

//     // GDS: Housing costs only
//     const housingCosts =
//       proposedLoanPayment +
//       propertyTaxMonthly +
//       heatingCostMonthly +
//       condoFeesMonthly * 0.5
//     gds = grossMonth > 0 ? (housingCosts / grossMonth) * 100 : 0

//     // TDS: Housing costs + NON-housing debts (fixed to avoid double-counting)
//     const totalDebts = housingCosts + nonHousingDebts
//     tds = grossMonth > 0 ? (totalDebts / grossMonth) * 100 : 0
//   }

//   const tdsr = grossYear > 0 ? ((existingDebts * 12) / grossYear) * 100 : 0

//   const lti = grossYear > 0 ? (P / grossYear) * 100 : 0

//   let ltv = 0
//   if (isMortgageLike && propValue > 0 && P > 0) {
//     ltv = (P / propValue) * 100
//   }

//   // For refinance, calculate available refinance cash
//   let availableRefinanceCash = 0
//   let maxRefinanceAmount = 0
//   if (isRefinance && propValue > 0) {
//     // In Canada, max refinance is 80% of home value
//     maxRefinanceAmount = propValue * 0.8
//     availableRefinanceCash = Math.max(
//       maxRefinanceAmount - currentMortgageBalance,
//       0
//     )
//   }

//   // 3. Thresholds
//   const minCredit = isMortgageLike ? 650 : 730

//   // Different thresholds for refinance (Canadian) vs other loans
//   const maxDTIForPass = 36
//   const maxDTIForConditional = 40
//   const maxTDSRForPass = 34
//   let maxGDSForPass = 39
//   let maxTDSForPass = 44
//   let maxLTVIdeal = 80
//   let maxLTVAbsolute = 97

//   if (isRefinance) {
//     // Canadian refinance limits
//     maxGDSForPass = 39
//     maxTDSForPass = 44
//     maxLTVAbsolute = 80 // Maximum 80% LTV for refinance in Canada
//     maxLTVIdeal = 80 // Same for refinance
//   }

//   const maxLTIForPass = 30
//   const minIncomeNonMortgage = 50000
//   const minEmploymentYears = 3

//   // 4. Credit tier
//   let creditTier: CreditTier = "Poor"
//   if (creditScore >= 720) creditTier = "Excellent"
//   else if (creditScore >= 680) creditTier = "Good"
//   else if (creditScore >= 620) creditTier = "Fair"

//   // 5. Rules
//   const incomeOk = isMortgageLike
//     ? grossYear > 0
//     : grossYear > minIncomeNonMortgage

//   // Use GDS/TDS for refinance, DTI/TDSR for others
//   let tdsrOk = tdsr < maxTDSRForPass
//   let dtiOk = dti < maxDTIForPass
//   let dtiConditionalOk = dti >= maxDTIForPass && dti <= maxDTIForConditional

//   if (isRefinance) {
//     // For refinance, use Canadian GDS/TDS instead
//     const gdsOk = gds <= maxGDSForPass
//     const tdsOk = tds <= maxTDSForPass
//     // Override regular DTI checks for refinance
//     dtiOk = gdsOk && tdsOk
//     dtiConditionalOk = gds <= maxGDSForPass + 5 && tds <= maxTDSForPass + 2 // Small buffer for conditional
//     tdsrOk = tdsOk // Use TDS instead of TDSR for refinance
//   }

//   const ltiOk = lti < maxLTIForPass

//   const creditOk = creditScore >= minCredit
//   const creditNear = !creditOk && creditScore >= minCredit - 20

//   const employmentOk = employmentYears > minEmploymentYears

//   let ltvOk = true
//   let ltvConditionalOk = false

//   if (isMortgageLike && ltv > 0) {
//     if (isRefinance) {
//       // For refinance in Canada, max LTV is 80%
//       if (ltv <= maxLTVIdeal) {
//         ltvOk = true
//       } else {
//         ltvOk = false
//         ltvConditionalOk = false // No conditional for refinance above 80%
//       }
//     } else {
//       // For other mortgage-like loans
//       if (ltv <= maxLTVIdeal) {
//         ltvOk = true
//       } else if (ltv > maxLTVIdeal && ltv <= maxLTVAbsolute) {
//         ltvOk = false
//         ltvConditionalOk = true
//       } else {
//         ltvOk = false
//         ltvConditionalOk = false
//       }
//     }
//   }

//   // 6. Mortgage range
//   let mortgageRangeMin = 0
//   let mortgageRangeMax = 0

//   if (isMortgageLike && grossYear > 0) {
//     const minMultiple = 4
//     const maxMultiple = grossYear >= 50000 ? 6 : 5
//     mortgageRangeMin = grossYear * minMultiple
//     mortgageRangeMax = grossYear * maxMultiple
//   }

//   // 7. Decision
//   let prequalStatus: PrequalStatus = "DECLINED"
//   const reasons: string[] = []

//   const allCoreOkNonMortgage =
//     !isMortgageLike &&
//     incomeOk &&
//     tdsrOk &&
//     dtiOk &&
//     ltiOk &&
//     creditOk &&
//     employmentOk

//   const allCoreOkMortgage =
//     isMortgageLike &&
//     tdsrOk &&
//     dtiOk &&
//     ltiOk &&
//     creditOk &&
//     (ltvOk || (!ltv && true))

//   const allCoreOk = allCoreOkNonMortgage || allCoreOkMortgage

//   if (!incomeOk && !isMortgageLike) {
//     reasons.push("Annual income must be greater than $50,000.")
//   }
//   if (!creditOk) {
//     reasons.push(`Credit score below minimum threshold (${minCredit}).`)
//   }
//   if (!employmentOk && !isMortgageLike) {
//     reasons.push("Employment history should be greater than 3 years.")
//   }
//   if (!dtiOk) {
//     reasons.push(`Debt-to-income ratio exceeds ${maxDTIForPass}%.`)
//   }
//   if (!tdsrOk) {
//     reasons.push("Total debt service ratio exceeds 34%.")
//   }
//   if (!ltiOk) {
//     reasons.push("Loan-to-income ratio exceeds 30% of annual income.")
//   }
//   if (isMortgageLike && ltv > 0) {
//     if (!ltvOk && ltvConditionalOk) {
//       reasons.push(
//         "Loan-to-value ratio is above 80%; private mortgage insurance or a higher rate may be required."
//       )
//     } else if (!ltvOk && !ltvConditionalOk) {
//       if (isRefinance) {
//         reasons.push(
//           "Loan-to-value ratio exceeds 80% maximum for refinance in Canada."
//         )
//       } else {
//         reasons.push("Loan-to-value ratio is above acceptable maximum (97%).")
//       }
//     }
//   }

//   // Additional reasons for refinance
//   if (isRefinance) {
//     if (gds > maxGDSForPass) {
//       reasons.push(
//         `Gross Debt Service (GDS) ratio of ${gds.toFixed(1)}% exceeds the ${maxGDSForPass}% limit.`
//       )
//     }
//     if (tds > maxTDSForPass) {
//       reasons.push(
//         `Total Debt Service (TDS) ratio of ${tds.toFixed(1)}% exceeds the ${maxTDSForPass}% limit.`
//       )
//     }
//   }

//   if (allCoreOk) {
//     prequalStatus = "APPROVED"
//   } else if (
//     (creditNear || dtiConditionalOk || ltvConditionalOk) &&
//     creditScore >= 620 &&
//     dti <= 45 &&
//     tdsr <= 40
//   ) {
//     prequalStatus = "CONDITIONAL"
//   } else {
//     prequalStatus = "DECLINED"
//   }

//   const prequalLabel =
//     prequalStatus === "APPROVED"
//       ? "Pre-Qualified"
//       : prequalStatus === "CONDITIONAL"
//         ? "Likely Qualified with Conditions"
//         : "Not Pre-Qualified"

//   let statusDetail = ""
//   if (prequalStatus === "APPROVED") {
//     statusDetail = isMortgageLike
//       ? "You meet the current guidelines for a mortgage/property-backed loan based on income, debts, credit, and loan size."
//       : "You meet the current guidelines for this loan type based on income, debts, credit, and loan-to-income ratio."
//   } else if (prequalStatus === "CONDITIONAL") {
//     statusDetail =
//       "You may qualify with a lower loan amount, a larger down payment, or by improving one or more risk factors."
//   } else {
//     statusDetail =
//       reasons[0] ??
//       "Based on the information provided, you are not pre-qualified at this time."
//   }

//   // 8. Available room
//   const maxDTIPercentForRule = isMortgageLike ? 0.36 : 0.4
//   const maxTotalMonthlyDebt = grossMonth * maxDTIPercentForRule
//   const availableForNewLoanMonthly = Math.max(
//     maxTotalMonthlyDebt - existingDebts,
//     0
//   )

//   return {
//     // DTI values
//     dti, // Back-End DTI for backward compatibility
//     frontEndDTI, // Current debts only (NEW)
//     backEndDTI, // With new loan payment (NEW)

//     // Canadian ratios for refinance
//     gds, // Gross Debt Service (NEW)
//     tds, // Total Debt Service (NEW)

//     tdsr,
//     lti,
//     ltv,

//     // Refinance-specific (NEW)
//     maxRefinanceAmount,
//     availableRefinanceCash,

//     availableForNewLoanMonthly,
//     proposedLoanPayment,
//     eligibleMaxPayment: grossMonth * 0.15, // Client request: Eligible max monthly payment - Monthly income*15%
//     creditTier,
//     prequalStatus,
//     prequalLabel,
//     statusDetail,
//     mortgageRangeMin,
//     mortgageRangeMax,
//     isMortgageLike,
//     isRefinance, // NEW
//   }
// }

// // lib/prequal.ts
// import { LoanType } from "@prisma/client"
// import { computeOffer, PrequalOffer } from "./prequal-bank-offer" // ✅ NEW

// export type PrequalStatus = "APPROVED" | "CONDITIONAL" | "DECLINED"
// export type CreditTier = "Excellent" | "Good" | "Fair" | "Poor"

// export interface PrequalInput {
//   loanAmount: number
//   creditScore: number
//   grossIncome: number
//   monthlyDebts: number
//   estimatedPropertyValue: number
//   workplaceDuration: number
//   loanType?: LoanType
//   currentMortgageBalance?: number
//   monthlyMortgagePayment?: number
//   propertyTaxMonthly?: number
//   heatingCostMonthly?: number
//   condoFeesMonthly?: number
// }

// export function computePrequalification(input: PrequalInput) {
//   const safe = (n: unknown) => (typeof n === "number" && isFinite(n) ? n : 0)

//   const P = safe(input.loanAmount)
//   const grossYear = safe(input.grossIncome)
//   const grossMonth = grossYear / 12
//   const existingDebts = safe(input.monthlyDebts)
//   const propValue = safe(input.estimatedPropertyValue)
//   const employmentYears = safe(input.workplaceDuration)
//   const creditScore = safe(input.creditScore)
//   const loanType = input.loanType

//   const currentMortgageBalance = safe(input.currentMortgageBalance)
//   const monthlyMortgagePayment = safe(input.monthlyMortgagePayment)
//   const propertyTaxMonthly = safe(input.propertyTaxMonthly)
//   const heatingCostMonthly = safe(input.heatingCostMonthly) || 135
//   const condoFeesMonthly = safe(input.condoFeesMonthly)

//   const mortgageLikeLoanTypes: LoanType[] = [
//     LoanType.FIRST_TIME_HOME,
//     LoanType.MORTGAGE_REFINANCE,
//     LoanType.INVESTMENT_PROPERTY,
//     LoanType.HELOC,
//     LoanType.HOME_REPAIR,
//   ]

//   const isMortgageLike = !!loanType && mortgageLikeLoanTypes.includes(loanType)

//   const isRefinance = loanType === LoanType.MORTGAGE_REFINANCE

//   /* -------------------------------------------------- */
//   /* PAYMENT */
//   /* -------------------------------------------------- */

//   const assumedTermYears = isMortgageLike ? 25 : 5
//   let assumedRateAnnual = isMortgageLike ? 5 : 10

//   const bankOfCanadaQualifyingRate = 5.25
//   if (isRefinance) {
//     assumedRateAnnual = Math.max(
//       assumedRateAnnual + 2,
//       bankOfCanadaQualifyingRate
//     )
//   }

//   const n = assumedTermYears * 12
//   const r = assumedRateAnnual / 100 / 12

//   let proposedLoanPayment = 0
//   if (P > 0 && r > 0 && n > 0) {
//     const pow = Math.pow(1 + r, n)
//     proposedLoanPayment = P * ((r * pow) / (pow - 1))
//   }

//   /* -------------------------------------------------- */
//   /* RATIOS */
//   /* -------------------------------------------------- */

//   const frontEndDTI = grossMonth > 0 ? (existingDebts / grossMonth) * 100 : 0

//   const totalDebtWithNew = existingDebts + proposedLoanPayment
//   const backEndDTI = grossMonth > 0 ? (totalDebtWithNew / grossMonth) * 100 : 0

//   const dti = backEndDTI

//   let gds = 0
//   let tds = 0

//   if (isRefinance) {
//     const nonHousingDebts = Math.max(existingDebts - monthlyMortgagePayment, 0)

//     const housingCosts =
//       proposedLoanPayment +
//       propertyTaxMonthly +
//       heatingCostMonthly +
//       condoFeesMonthly * 0.5

//     gds = grossMonth > 0 ? (housingCosts / grossMonth) * 100 : 0

//     const totalDebts = housingCosts + nonHousingDebts
//     tds = grossMonth > 0 ? (totalDebts / grossMonth) * 100 : 0
//   }

//   const tdsr = grossYear > 0 ? ((existingDebts * 12) / grossYear) * 100 : 0

//   const lti = grossYear > 0 ? (P / grossYear) * 100 : 0

//   let ltv = 0
//   if (isMortgageLike && propValue > 0 && P > 0) {
//     ltv = (P / propValue) * 100
//   }

//   /* -------------------------------------------------- */
//   /* CREDIT TIER */
//   /* -------------------------------------------------- */

//   let creditTier: CreditTier = "Poor"
//   if (creditScore >= 720) creditTier = "Excellent"
//   else if (creditScore >= 680) creditTier = "Good"
//   else if (creditScore >= 620) creditTier = "Fair"

//   /* -------------------------------------------------- */
//   /* RULES */
//   /* -------------------------------------------------- */

//   const minCredit = isMortgageLike ? 650 : 730
//   const creditOk = creditScore >= minCredit

//   const dtiOk = dti < 36
//   const tdsrOk = tdsr < 34
//   const ltiOk = lti < 30
//   const employmentOk = employmentYears > 3

//   let prequalStatus: PrequalStatus = "DECLINED"

//   if (creditOk && dtiOk && tdsrOk && ltiOk && employmentOk) {
//     prequalStatus = "APPROVED"
//   } else if (creditScore >= minCredit - 20 && dti <= 45) {
//     prequalStatus = "CONDITIONAL"
//   }

//   const prequalLabel =
//     prequalStatus === "APPROVED"
//       ? "Pre-Qualified"
//       : prequalStatus === "CONDITIONAL"
//         ? "Likely Qualified with Conditions"
//         : "Not Pre-Qualified"

//   /* -------------------------------------------------- */
//   /* 🔥 NEW: OFFER ENGINE */
//   /* -------------------------------------------------- */

//   const offer: PrequalOffer = computeOffer({
//     creditScore,
//     dti,
//     loanType,
//   })

//   let mortgageRangeMin = 0
//   let mortgageRangeMax = 0

//   if (isMortgageLike && grossYear > 0) {
//     const minMultiple = 4
//     const maxMultiple = grossYear >= 50000 ? 6 : 5

//     mortgageRangeMin = grossYear * minMultiple
//     mortgageRangeMax = grossYear * maxMultiple
//   }

//   let statusDetail = ""

//   if (prequalStatus === "APPROVED") {
//     statusDetail = isMortgageLike
//       ? "You meet the current guidelines for a mortgage/property-backed loan."
//       : "You meet the current guidelines for this loan type."
//   } else if (prequalStatus === "CONDITIONAL") {
//     statusDetail =
//       "You may qualify with adjustments like lower loan or better profile."
//   } else {
//     statusDetail = "You are not pre-qualified based on current inputs."
//   }

//   // Refinance values
//   let maxRefinanceAmount = 0
//   let availableRefinanceCash = 0

//   if (isRefinance && propValue > 0) {
//     maxRefinanceAmount = propValue * 0.8
//     availableRefinanceCash = Math.max(
//       maxRefinanceAmount - currentMortgageBalance,
//       0
//     )
//   }

//   const eligibleMaxPayment = grossMonth * 0.15

//   /* -------------------------------------------------- */
//   /* RETURN */
//   /* -------------------------------------------------- */

//   return {
//     dti,
//     frontEndDTI,
//     backEndDTI,
//     gds,
//     tds,
//     tdsr,
//     lti,
//     ltv,

//     proposedLoanPayment,
//     availableForNewLoanMonthly: Math.max(grossMonth * 0.4 - existingDebts, 0),

//     creditTier,
//     prequalStatus,
//     prequalLabel,

//     isMortgageLike,
//     isRefinance,

//     // ✅ ADD THESE BACK
//     statusDetail,
//     maxRefinanceAmount,
//     availableRefinanceCash,
//     eligibleMaxPayment,

//     // ✅ NEW
//     offer,
//     mortgageRangeMin,
//     mortgageRangeMax,
//   }
// }
// lib/prequal.ts
// lib/prequal.ts
import { LoanType } from "@prisma/client"
import { computeOffer, PrequalOffer } from "./prequal-bank-offer"

export type PrequalStatus = "APPROVED" | "CONDITIONAL" | "DECLINED"
export type CreditTier = "Excellent" | "Good" | "Fair" | "Poor"

export interface PrequalInput {
  loanAmount: number
  creditScore: number
  grossIncome: number
  monthlyDebts: number
  estimatedPropertyValue: number
  workplaceDuration: number
  loanType?: LoanType

  currentMortgageBalance?: number
  monthlyMortgagePayment?: number
  propertyTaxMonthly?: number
  heatingCostMonthly?: number
  condoFeesMonthly?: number
}

export function computePrequalification(input: PrequalInput) {
  const safe = (n: unknown) => (typeof n === "number" && isFinite(n) ? n : 0)

  const P = safe(input.loanAmount)
  const grossYear = safe(input.grossIncome)
  const grossMonth = grossYear / 12
  const existingDebts = safe(input.monthlyDebts)
  const propValue = safe(input.estimatedPropertyValue)
  const employmentYears = safe(input.workplaceDuration)
  const creditScore = safe(input.creditScore)
  const loanType = input.loanType

  const currentMortgageBalance = safe(input.currentMortgageBalance)
  const monthlyMortgagePayment = safe(input.monthlyMortgagePayment)
  const propertyTaxMonthly = safe(input.propertyTaxMonthly)
  const heatingCostMonthly = safe(input.heatingCostMonthly) || 135
  const condoFeesMonthly = safe(input.condoFeesMonthly)

  const mortgageLikeLoanTypes: LoanType[] = [
    LoanType.FIRST_TIME_HOME,
    LoanType.MORTGAGE_REFINANCE,
    LoanType.INVESTMENT_PROPERTY,
    LoanType.HELOC,
    LoanType.HOME_REPAIR,
  ]

  const isMortgageLike = !!loanType && mortgageLikeLoanTypes.includes(loanType)
  const isRefinance = loanType === LoanType.MORTGAGE_REFINANCE

  /* ================= THRESHOLDS ================= */

  const thresholds = {
    minCredit: isMortgageLike ? 650 : 730,
    minIncome: 50000,
    minEmploymentYears: 3,

    maxDTIForPass: 36,
    maxDTIForConditional: 40,
    maxDTIHardStop: 45,

    maxTDSRForPass: 34,
    maxTDSRHardStop: 40,

    maxGDS: 39,
    maxTDS: 44,

    maxLTI: 30,

    maxLTVIdeal: 80,
    maxLTVAbsolute: isRefinance ? 80 : 97,
  }

  /* ================= PAYMENT ================= */

  const assumedTermYears = isMortgageLike ? 25 : 5
  let assumedRateAnnual = isMortgageLike ? 5 : 10

  if (isRefinance) {
    assumedRateAnnual = Math.max(assumedRateAnnual + 2, 5.25)
  }

  const n = assumedTermYears * 12
  const r = assumedRateAnnual / 100 / 12

  let proposedLoanPayment = 0
  if (P > 0 && r > 0 && n > 0) {
    const pow = Math.pow(1 + r, n)
    proposedLoanPayment = P * ((r * pow) / (pow - 1))
  }

  /* ================= RATIOS ================= */

  const frontEndDTI = grossMonth > 0 ? (existingDebts / grossMonth) * 100 : 0
  const totalDebtWithNew = existingDebts + proposedLoanPayment
  const backEndDTI = grossMonth > 0 ? (totalDebtWithNew / grossMonth) * 100 : 0
  const dti = backEndDTI

  let gds = 0
  let tds = 0

  if (isRefinance) {
    const nonHousingDebts = Math.max(existingDebts - monthlyMortgagePayment, 0)

    const housingCosts =
      proposedLoanPayment +
      propertyTaxMonthly +
      heatingCostMonthly +
      condoFeesMonthly * 0.5

    gds = grossMonth > 0 ? (housingCosts / grossMonth) * 100 : 0
    tds =
      grossMonth > 0 ? ((housingCosts + nonHousingDebts) / grossMonth) * 100 : 0
  }

  const tdsr = grossYear > 0 ? ((existingDebts * 12) / grossYear) * 100 : 0
  const lti = grossYear > 0 ? (P / grossYear) * 100 : 0

  let ltv = 0
  if (isMortgageLike && propValue > 0 && P > 0) {
    ltv = (P / propValue) * 100
  }

  /* ================= REFINANCE ================= */

  let maxRefinanceAmount = 0
  let availableRefinanceCash = 0

  if (isRefinance && propValue > 0) {
    maxRefinanceAmount = propValue * 0.8
    availableRefinanceCash = Math.max(
      maxRefinanceAmount - currentMortgageBalance,
      0
    )
  }

  /* ================= CREDIT ================= */

  let creditTier: CreditTier = "Poor"
  if (creditScore >= 720) creditTier = "Excellent"
  else if (creditScore >= 680) creditTier = "Good"
  else if (creditScore >= 620) creditTier = "Fair"

  /* ================= RULES ================= */

  const incomeOk = isMortgageLike
    ? grossYear > 0
    : grossYear > thresholds.minIncome

  const creditOk = creditScore >= thresholds.minCredit
  const creditNear = !creditOk && creditScore >= thresholds.minCredit - 20

  const employmentOk = employmentYears > thresholds.minEmploymentYears

  let dtiOk = dti < thresholds.maxDTIForPass
  let dtiConditionalOk =
    dti >= thresholds.maxDTIForPass && dti <= thresholds.maxDTIForConditional

  let tdsrOk = tdsr < thresholds.maxTDSRForPass

  if (isRefinance) {
    const gdsOk = gds <= thresholds.maxGDS
    const tdsOk = tds <= thresholds.maxTDS

    dtiOk = gdsOk && tdsOk
    dtiConditionalOk =
      gds <= thresholds.maxGDS + 5 && tds <= thresholds.maxTDS + 2

    tdsrOk = tdsOk
  }

  const ltiOk = lti < thresholds.maxLTI

  /* ================= LTV ================= */

  let ltvOk = true
  let ltvConditionalOk = false

  if (isMortgageLike && ltv > 0) {
    if (ltv <= thresholds.maxLTVIdeal) {
      ltvOk = true
    } else if (ltv <= thresholds.maxLTVAbsolute) {
      ltvOk = false
      ltvConditionalOk = true
    } else {
      ltvOk = false
    }
  }

  /* ================= DECISION ================= */

  const reasons: string[] = []

  if (!incomeOk && !isMortgageLike) {
    reasons.push(`Income must exceed $${thresholds.minIncome}.`)
  }

  if (!creditOk) {
    reasons.push(`Credit score below ${thresholds.minCredit}.`)
  }

  if (!employmentOk && !isMortgageLike) {
    reasons.push(
      `Employment must exceed ${thresholds.minEmploymentYears} years.`
    )
  }

  if (!dtiOk && !isRefinance) {
    reasons.push(`DTI exceeds ${thresholds.maxDTIForPass}%.`)
  }

  if (!tdsrOk && !isRefinance) {
    reasons.push(`TDSR exceeds ${thresholds.maxTDSRForPass}%.`)
  }

  if (!ltiOk) {
    reasons.push(`Loan exceeds ${thresholds.maxLTI}% of income.`)
  }

  if (isMortgageLike && ltv > 0) {
    if (!ltvOk && ltvConditionalOk) {
      reasons.push("LTV above 80% — insurance or higher rate may apply.")
    } else if (!ltvOk) {
      reasons.push(`LTV exceeds maximum of ${thresholds.maxLTVAbsolute}%.`)
    }
  }

  if (isRefinance) {
    if (gds > thresholds.maxGDS) {
      reasons.push(`GDS ${gds.toFixed(1)}% exceeds ${thresholds.maxGDS}%.`)
    }
    if (tds > thresholds.maxTDS) {
      reasons.push(`TDS ${tds.toFixed(1)}% exceeds ${thresholds.maxTDS}%.`)
    }
  }

  /* ================= CORE LOGIC (RESTORED) ================= */

  const allCoreOkNonMortgage =
    !isMortgageLike &&
    incomeOk &&
    tdsrOk &&
    dtiOk &&
    ltiOk &&
    creditOk &&
    employmentOk

  const allCoreOkMortgage =
    isMortgageLike && tdsrOk && dtiOk && ltiOk && creditOk && (ltvOk || !ltv)

  const allCoreOk = allCoreOkNonMortgage || allCoreOkMortgage

  let prequalStatus: PrequalStatus = "DECLINED"

  if (allCoreOk) {
    prequalStatus = "APPROVED"
  } else if (
    (creditNear || dtiConditionalOk || ltvConditionalOk) &&
    creditScore >= 620 &&
    dti <= thresholds.maxDTIHardStop &&
    tdsr <= thresholds.maxTDSRHardStop
  ) {
    prequalStatus = "CONDITIONAL"
  }

  const prequalLabel =
    prequalStatus === "APPROVED"
      ? "Pre-Qualified"
      : prequalStatus === "CONDITIONAL"
        ? "Likely Qualified with Conditions"
        : "Not Pre-Qualified"

  const statusDetail =
    prequalStatus === "APPROVED"
      ? "You meet current lending guidelines."
      : prequalStatus === "CONDITIONAL"
        ? "You may qualify with improvements."
        : reasons[0] || "Not pre-qualified."

  /* ================= OFFER ================= */

  const offer: PrequalOffer = computeOffer({
    creditScore,
    dti,
    loanType,
  })

  /* ================= RANGE ================= */

  let mortgageRangeMin = 0
  let mortgageRangeMax = 0

  if (isMortgageLike && grossYear > 0) {
    mortgageRangeMin = grossYear * 4
    mortgageRangeMax = grossYear * (grossYear >= 50000 ? 6 : 5)
  }

  /* ================= RETURN ================= */

  return {
    dti,
    frontEndDTI,
    backEndDTI,
    gds,
    tds,
    tdsr,
    lti,
    ltv,

    proposedLoanPayment,
    availableForNewLoanMonthly: Math.max(grossMonth * 0.4 - existingDebts, 0),
    eligibleMaxPayment: isMortgageLike ? grossMonth * 0.32 : grossMonth * 0.15,
    creditTier,
    prequalStatus,
    prequalLabel,
    statusDetail,

    isMortgageLike,
    isRefinance,

    maxRefinanceAmount,
    availableRefinanceCash,

    mortgageRangeMin,
    mortgageRangeMax,

    offer,
  }
}
