import { calculateMortgageRestOfWorld } from "../src/lib/loan-calculator"

function testGuard() {
  console.log("Testing Loan Guard Clause...")
  try {
    calculateMortgageRestOfWorld({
      homePrice: -100, // Invalid
      downPaymentPercent: 20,
      annualRatePercent: 5,
      termYears: 30,
      annualPropertyTax: 1000,
      annualInsurance: 500,
      pmiRatePercent: 0.5,
      monthlyHOA: 100,
    })
    console.error("FAIL: Did not throw on invalid homePrice")
  } catch (e: any) {
    if (e.message === "Invalid mortgage inputs") {
      console.log("PASS: Caught invalid homePrice")
    } else {
      console.error("FAIL: Incorrect error message", e.message)
    }
  }

  try {
    calculateMortgageRestOfWorld({
      homePrice: 100000,
      downPaymentPercent: 120, // Invalid
      annualRatePercent: 5,
      termYears: 30,
      annualPropertyTax: 1000,
      annualInsurance: 500,
      pmiRatePercent: 0.5,
      monthlyHOA: 100,
    })
    console.error("FAIL: Did not throw on invalid downPaymentPercent")
  } catch (e: any) {
    if (e.message === "Invalid mortgage inputs") {
      console.log("PASS: Caught invalid downPaymentPercent")
    } else {
      console.error("FAIL: Incorrect error message", e.message)
    }
  }

  // Valid case
  try {
    const result = calculateMortgageRestOfWorld({
      homePrice: 500000,
      downPaymentPercent: 20,
      annualRatePercent: 5,
      termYears: 30,
      annualPropertyTax: 3000,
      annualInsurance: 1200,
      pmiRatePercent: 0.5,
      monthlyHOA: 200,
    })
    console.log("PASS: Valid inputs calculated successfully", result)
  } catch (e) {
    console.error("FAIL: Valid inputs threw error", e)
  }
}

testGuard()
