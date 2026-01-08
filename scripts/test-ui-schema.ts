import * as z from "zod"

// Copy of the schema logic for verification
const baseSchema = z.object({
  interestRate: z.number().min(0, "Interest rate must be positive"),
})

const mortgageOtherSchema = baseSchema.extend({
  homePrice: z.number().min(1, "Home Price must be greater than 0"),
  downPaymentPercent: z
    .number()
    .min(0, "Down payment cannot be negative")
    .max(100, "Down payment cannot exceed 100%"),
  interestRate: z
    .number()
    .min(0, "Interest rate must be positive")
    .max(100, "Interest rate cannot exceed 100%"),
  loanTerm: z.enum(["15", "20", "30"]),
  annualPropertyTax: z.number().min(0, "Property tax must be positive"),
  annualInsurance: z.number().min(0, "Insurance must be positive"),
  pmiRate: z.number().min(0, "PMI rate must be positive").optional(),
  monthlyHoaFees: z.number().min(0, "HOA fees must be positive").optional(),
})

function testSchema() {
  console.log("Testing UI Schema Validation...")

  const validData = {
    homePrice: 500000,
    downPaymentPercent: 20,
    interestRate: 5.5,
    loanTerm: "30",
    annualPropertyTax: 3000,
    annualInsurance: 1200,
    pmiRate: 0,
    monthlyHoaFees: 50,
  }

  const result = mortgageOtherSchema.safeParse(validData)
  if (result.success) {
    console.log("PASS: Valid data accepted")
  } else {
    console.error("FAIL: Valid data rejected", result.error)
  }

  // Test invalid home price
  const invalidPrice = { ...validData, homePrice: 0 }
  const res1 = mortgageOtherSchema.safeParse(invalidPrice)
  if (
    !res1.success &&
    res1.error.issues[0].message === "Home Price must be greater than 0"
  ) {
    console.log("PASS: Invalid homePrice rejected")
  } else {
    console.error("FAIL: Invalid homePrice check failed", res1.error)
  }

  // Test invalid down payment > 100
  const invalidDown = { ...validData, downPaymentPercent: 120 }
  const res2 = mortgageOtherSchema.safeParse(invalidDown)
  if (
    !res2.success &&
    res2.error.issues[0].message === "Down payment cannot exceed 100%"
  ) {
    console.log("PASS: Invalid downPaymentPercent > 100 rejected")
  } else {
    console.error(
      "FAIL: Invalid downPaymentPercent > 100 check failed",
      res2.error
    )
  }

  // Test negative insurance
  const invalidIns = { ...validData, annualInsurance: -100 }
  const res3 = mortgageOtherSchema.safeParse(invalidIns)
  if (
    !res3.success &&
    res3.error.issues[0].message === "Insurance must be positive"
  ) {
    console.log("PASS: Negative annualInsurance rejected")
  } else {
    console.error("FAIL: Negative annualInsurance check failed", res3.error)
  }
}

testSchema()
