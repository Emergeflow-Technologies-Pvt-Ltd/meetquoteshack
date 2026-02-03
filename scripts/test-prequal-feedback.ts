// Test script to verify pre-qualification logic matches client's feedback
import { computePrequalification } from "../src/lib/prequal"
import { LoanType } from "@prisma/client"

console.log("=".repeat(80))
console.log("PRE-QUALIFICATION LOGIC VERIFICATION")
console.log("=".repeat(80))

// Test Case 1: Client's example from feedback.md
console.log("\n📊 TEST CASE 1: Client's Example (Non-Mortgage)")
console.log("-".repeat(80))

const testCase1 = {
  grossIncome: 75000, // Annual
  monthlyDebts: 2300, // rent+loans (1500+450+200+150)
  loanAmount: 30000,
  creditScore: 720,
  estimatedPropertyValue: 0,
  workplaceDuration: 5,
  loanType: LoanType.FIRST_TIME_HOME,
}

const result1 = computePrequalification(testCase1)

console.log("\nInputs:")
console.log(`  Annual Income: $${testCase1.grossIncome.toLocaleString()}`)
console.log(
  `  Monthly Income: $${(testCase1.grossIncome / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
)
console.log(
  `  Current Monthly Debts: $${testCase1.monthlyDebts.toLocaleString()}`
)
console.log(
  `  Requested Loan Amount: $${testCase1.loanAmount.toLocaleString()}`
)
console.log(`  Credit Score: ${testCase1.creditScore}`)

console.log("\n✅ Expected Results (from client):")
console.log(`  Front-End DTI (Current): 36.8%`)
console.log(`  Note: Client calculated 2300/6250*100 = 36.8%`)

console.log("\n🔍 Calculated Results:")
console.log(`  Monthly Income: $${(testCase1.grossIncome / 12).toFixed(2)}`)
console.log(
  `  Front-End DTI (Current debts only): ${result1.frontEndDTI.toFixed(1)}%`
)
console.log(
  `  Proposed Loan Payment: $${result1.proposedLoanPayment.toFixed(2)}`
)
console.log(`  Back-End DTI (With new loan): ${result1.backEndDTI.toFixed(1)}%`)
console.log(`  Status: ${result1.prequalStatus}`)
console.log(`  Label: ${result1.prequalLabel}`)
console.log(
  `  Eligible Max Payment (15% rule): $${result1.eligibleMaxPayment.toFixed(2)}`
)

// Verification
const expectedEligibleMaxPayment = (testCase1.grossIncome / 12) * 0.15
console.log(
  `  Eligible Max Payment matches 15%: ${Math.abs(result1.eligibleMaxPayment - expectedEligibleMaxPayment) < 0.01 ? "YES" : "NO"}`
)

const expectedFrontEndDTI = 36.8
const calculatedFrontEndDTI = parseFloat(result1.frontEndDTI.toFixed(1))
const matches = Math.abs(calculatedFrontEndDTI - expectedFrontEndDTI) < 0.2

console.log(
  `\n${matches ? "✅" : "❌"} Front-End DTI Match: ${matches ? "PASS" : "FAIL"}`
)
console.log(
  `  Expected: ${expectedFrontEndDTI}%, Got: ${calculatedFrontEndDTI}%`
)

// Test Case 2: Canadian Refinance Example
console.log("\n\n📊 TEST CASE 2: Canadian Refinance")
console.log("-".repeat(80))

const testCase2 = {
  grossIncome: 80000, // Annual
  monthlyDebts: 500, // Other debts (credit cards, car loan, etc.)
  loanAmount: 350000, // New mortgage amount
  creditScore: 700,
  estimatedPropertyValue: 500000, // Home value
  workplaceDuration: 5,
  loanType: LoanType.MORTGAGE_REFINANCE,
  currentMortgageBalance: 320000,
  propertyTaxMonthly: 300,
  heatingCostMonthly: 135, // Default Canadian standard
  condoFeesMonthly: 0,
}

const result2 = computePrequalification(testCase2)

console.log("\nInputs:")
console.log(`  Annual Income: $${testCase2.grossIncome.toLocaleString()}`)
console.log(
  `  Monthly Income: $${(testCase2.grossIncome / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
)
console.log(
  `  Current Monthly Debts (non-housing): $${testCase2.monthlyDebts.toLocaleString()}`
)
console.log(
  `  Home Value: $${testCase2.estimatedPropertyValue.toLocaleString()}`
)
console.log(
  `  Current Mortgage Balance: $${testCase2.currentMortgageBalance?.toLocaleString()}`
)
console.log(`  New Mortgage Amount: $${testCase2.loanAmount.toLocaleString()}`)
console.log(`  Property Tax (monthly): $${testCase2.propertyTaxMonthly}`)
console.log(`  Heating (monthly): $${testCase2.heatingCostMonthly}`)

console.log("\n🔍 Calculated Results:")
console.log(`  Monthly Income: $${(testCase2.grossIncome / 12).toFixed(2)}`)
console.log(
  `  New Mortgage Payment (with stress test): $${result2.proposedLoanPayment.toFixed(2)}`
)
console.log(`  LTV: ${result2.ltv.toFixed(1)}% (Max 80% for refinance)`)
console.log(
  `  Max Refinance Amount: $${result2.maxRefinanceAmount.toLocaleString()}`
)
console.log(
  `  Available Refinance Cash: $${result2.availableRefinanceCash.toLocaleString()}`
)

console.log("\n🇨🇦 Canadian Ratios:")
console.log(`  GDS (Gross Debt Service): ${result2.gds.toFixed(1)}% (Max 39%)`)
console.log(`  TDS (Total Debt Service): ${result2.tds.toFixed(1)}% (Max 44%)`)
console.log(`  Status: ${result2.prequalStatus}`)
console.log(`  Label: ${result2.prequalLabel}`)

// Verification for refinance limits
const ltvWithinLimit = result2.ltv <= 80
const gdsWithinLimit = result2.gds <= 39
const tdsWithinLimit = result2.tds <= 44

console.log(
  `\n${ltvWithinLimit ? "✅" : "❌"} LTV within 80% limit: ${ltvWithinLimit ? "PASS" : "FAIL"} (${result2.ltv.toFixed(1)}%)`
)
console.log(
  `${gdsWithinLimit ? "✅" : "❌"} GDS within 39% limit: ${gdsWithinLimit ? "PASS" : "FAIL"} (${result2.gds.toFixed(1)}%)`
)
console.log(
  `${tdsWithinLimit ? "✅" : "❌"} TDS within 44% limit: ${tdsWithinLimit ? "PASS" : "FAIL"} (${result2.tds.toFixed(1)}%)`
)

// Test Case 3: Refinance exceeding LTV limit
console.log("\n\n📊 TEST CASE 3: Refinance Exceeding 80% LTV (Should Decline)")
console.log("-".repeat(80))

const testCase3 = {
  grossIncome: 80000,
  monthlyDebts: 500,
  loanAmount: 450000, // 90% of home value
  creditScore: 700,
  estimatedPropertyValue: 500000,
  workplaceDuration: 5,
  loanType: LoanType.MORTGAGE_REFINANCE,
  currentMortgageBalance: 320000,
  propertyTaxMonthly: 300,
  heatingCostMonthly: 135,
  condoFeesMonthly: 0,
}

const result3 = computePrequalification(testCase3)

console.log("\nInputs:")
console.log(`  New Mortgage Amount: $${testCase3.loanAmount.toLocaleString()}`)
console.log(
  `  Home Value: $${testCase3.estimatedPropertyValue.toLocaleString()}`
)
console.log(`  LTV: ${result3.ltv.toFixed(1)}%`)

console.log("\n🔍 Results:")
console.log(`  Status: ${result3.prequalStatus}`)
console.log(`  Label: ${result3.prequalLabel}`)
console.log(
  `  ${result3.ltv > 80 ? "❌" : "✅"} LTV ${result3.ltv > 80 ? "EXCEEDS" : "WITHIN"} 80% limit`
)

// Test Case 4: Verify double-counting fix
console.log("\n\n📊 TEST CASE 4: Refinance Double-Counting Fix")
console.log("-".repeat(80))

const testCase4 = {
  grossIncome: 80000, // $6,666.67/month
  monthlyDebts: 2100, // Includes $1600 current mortgage + $500 other debts
  monthlyMortgagePayment: 1600, // Current mortgage payment (NEW FIELD)
  loanAmount: 350000,
  creditScore: 700,
  estimatedPropertyValue: 500000,
  workplaceDuration: 5,
  loanType: LoanType.MORTGAGE_REFINANCE,
  currentMortgageBalance: 320000,
  propertyTaxMonthly: 300,
  heatingCostMonthly: 135,
  condoFeesMonthly: 0,
}

const result4 = computePrequalification(testCase4)

console.log("\nInputs:")
console.log(
  `  Gross Monthly Income: $${(testCase4.grossIncome / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
)
console.log(
  `  Total Monthly Debts: $${testCase4.monthlyDebts.toLocaleString()}`
)
console.log(
  `  Current Mortgage Payment: $${testCase4.monthlyMortgagePayment.toLocaleString()}`
)
console.log(
  `  Other Debts (non-housing): $${(testCase4.monthlyDebts - testCase4.monthlyMortgagePayment).toLocaleString()}`
)

console.log("\n✅ Expected:")
console.log(
  "  OLD (Wrong): TDS would include $2100 existingDebts + housing = double-counts mortgage"
)
console.log(
  "  NEW (Fixed): TDS should only include $500 non-housing debts + housing"
)
console.log("  Non-housing debts = $2100 - $1600 = $500")

console.log("\n🔍 Calculated Results:")
console.log(
  `  New Mortgage Payment: $${result4.proposedLoanPayment.toFixed(2)}`
)
console.log(`  GDS: ${result4.gds.toFixed(1)}% (Max 39%)`)
console.log(`  TDS: ${result4.tds.toFixed(1)}% (Max 44%)`)
console.log(`  Status: ${result4.prequalStatus}`)

// Verify the fix
const monthlyIncome = testCase4.grossIncome / 12
const housingCosts = result4.proposedLoanPayment + 300 + 135 // mortgage + tax + heating
const nonHousingDebts = 500 // Should be $500, not $2100
const expectedTDS = ((housingCosts + nonHousingDebts) / monthlyIncome) * 100

console.log("\n🧮 Manual TDS Verification:")
console.log(`  Housing Costs: $${housingCosts.toFixed(2)}`)
console.log(`  Non-Housing Debts (fixed): $${nonHousingDebts}`)
console.log(`  Expected TDS: ${expectedTDS.toFixed(1)}%`)
console.log(`  Calculated TDS: ${result4.tds.toFixed(1)}%`)
console.log(
  `  ${Math.abs(result4.tds - expectedTDS) < 0.5 ? "✅" : "❌"} TDS calculation is ${Math.abs(result4.tds - expectedTDS) < 0.5 ? "CORRECT" : "WRONG"}`
)

// Summary
console.log("\n" + "=".repeat(80))
console.log("📋 SUMMARY")
console.log("=".repeat(80))
console.log("\n✅ Fixed Issues:")
console.log(
  "  1. Now calculating and returning BOTH Front-End DTI and Back-End DTI"
)
console.log("  2. Implemented Canadian GDS/TDS ratios for refinance loans")
console.log("  3. Set maximum LTV for refinance to 80% (Canadian requirement)")
console.log("  4. Added stress test for refinance (qualifying rate)")
console.log(
  "  5. Added fields for refinance: currentMortgageBalance, propertyTax, heating, condoFees"
)
console.log("  6. Calculate available refinance cash based on 80% LTV limit")
console.log(
  "  7. ✅ P0 FIX: Subtract current mortgage payment to avoid double-counting in TDS"
)
console.log(
  "  8. ✅ Added monthlyMortgagePayment field (required for refinance)"
)
console.log(
  "  9. ✅ Added eligibleMaxPayment calculation (15% of gross monthly income)"
)

console.log("\n📝 Key Formulas:")
console.log(
  "  Front-End DTI = (Current Monthly Debts / Gross Monthly Income) × 100"
)
console.log(
  "  Back-End DTI = (Current Debts + New Loan Payment / Gross Monthly Income) × 100"
)
console.log("  GDS = (Housing Costs / Gross Monthly Income) × 100")
console.log(
  "  TDS = (Housing Costs + NON-housing Debts / Gross Monthly Income) × 100"
)
console.log(
  "  NON-housing Debts = existingDebts - currentMortgagePayment (for refinance)"
)
console.log("  Max Refinance = Home Value × 80%")
console.log("  Eligible Max Payment = Gross Monthly Income × 15%")

console.log("\n" + "=".repeat(80))
