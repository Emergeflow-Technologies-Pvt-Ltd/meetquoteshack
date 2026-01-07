export function calculateInstallmentLoan({
  principal,
  annualRatePercent,
  termMonths,
  paymentFrequency,
}: {
  principal: number
  annualRatePercent: number
  termMonths: number
  paymentFrequency: "monthly" | "biweekly" | "weekly"
}) {
  const frequencyMap = {
    monthly: 12,
    biweekly: 26,
    weekly: 52,
  }

  const paymentsPerYear = frequencyMap[paymentFrequency]
  const totalPayments = (termMonths / 12) * paymentsPerYear

  // Monthly compounding (Canada rule)
  const monthlyRate = annualRatePercent / 100 / 12

  // Convert monthly rate to payment-period rate
  const periodicRate = Math.pow(1 + monthlyRate, 12 / paymentsPerYear) - 1

  // PMT formula
  const payment =
    (principal * (periodicRate * Math.pow(1 + periodicRate, totalPayments))) /
    (Math.pow(1 + periodicRate, totalPayments) - 1)

  const totalPaid = payment * totalPayments
  const totalInterest = totalPaid - principal

  return {
    payment: Number(payment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalCost: Number(totalPaid.toFixed(2)),
  }
}
export function calculateAutoLoanCanada({
  vehiclePrice,
  downPayment,
  tradeIn,
  provinceTaxRate,
  annualRatePercent,
  termMonths,
  paymentFrequency,
}: {
  vehiclePrice: number
  downPayment: number
  tradeIn: number
  provinceTaxRate: number
  annualRatePercent: number
  termMonths: number
  paymentFrequency: "monthly" | "biweekly" | "weekly"
}) {
  const taxableAmount = vehiclePrice - tradeIn
  const taxAmount = taxableAmount * provinceTaxRate

  const principal = vehiclePrice + taxAmount - downPayment - tradeIn

  return calculateInstallmentLoan({
    principal,
    annualRatePercent,
    termMonths,
    paymentFrequency,
  })
}

export function calculateLineOfCredit({
  balance,
  annualRatePercent,
  daysInPeriod,
  paymentType,
  principalPercent = 0,
}: {
  balance: number
  annualRatePercent: number
  daysInPeriod: number
  paymentType: "interest_only" | "interest_plus_percent"
  principalPercent?: number
}) {
  const dailyRate = annualRatePercent / 100 / 365
  const interest = balance * dailyRate * daysInPeriod

  let minimumPayment = interest

  if (paymentType === "interest_plus_percent") {
    minimumPayment += balance * principalPercent
  }

  return {
    monthlyInterest: Number(interest.toFixed(2)),
    minimumPayment: Number(minimumPayment.toFixed(2)),
    endingBalance: Number((balance - minimumPayment).toFixed(2)),
  }
}

function getCMHCPremiumRate(downPaymentPercent: number) {
  if (downPaymentPercent >= 20) return 0
  if (downPaymentPercent >= 15) return 0.028
  if (downPaymentPercent >= 10) return 0.031
  if (downPaymentPercent >= 5) return 0.04
  return 0
}

export function calculateCanadianMortgage({
  purchasePrice,
  downPayment,
  annualRatePercent,
  amortizationYears,
  paymentFrequency,
}: {
  purchasePrice: number
  downPayment: number
  annualRatePercent: number
  amortizationYears: number
  paymentFrequency:
    | "monthly"
    | "biweekly"
    | "accelerated_biweekly"
    | "weekly"
    | "accelerated_weekly"
}) {
  const downPaymentPercent = (downPayment / purchasePrice) * 100
  const cmhcRate = getCMHCPremiumRate(downPaymentPercent)

  let principal = purchasePrice - downPayment
  principal += principal * cmhcRate

  // Semi-annual compounding
  const semiAnnualRate = annualRatePercent / 100 / 2
  const effectiveAnnualRate = Math.pow(1 + semiAnnualRate, 2) - 1

  const frequencyMap = {
    monthly: 12,
    biweekly: 26,
    weekly: 52,
  }

  const paymentsPerYear =
    frequencyMap[
      paymentFrequency.replace("accelerated_", "") as keyof typeof frequencyMap
    ]
  const periodicRate =
    Math.pow(1 + effectiveAnnualRate, 1 / paymentsPerYear) - 1

  const totalPayments = amortizationYears * paymentsPerYear

  // Monthly payment (used for accelerated logic)
  const monthlyRate = Math.pow(1 + effectiveAnnualRate, 1 / 12) - 1

  const monthlyPayment =
    (principal *
      (monthlyRate * Math.pow(1 + monthlyRate, amortizationYears * 12))) /
    (Math.pow(1 + monthlyRate, amortizationYears * 12) - 1)

  let payment =
    (principal * (periodicRate * Math.pow(1 + periodicRate, totalPayments))) /
    (Math.pow(1 + periodicRate, totalPayments) - 1)

  // Accelerated payments
  if (paymentFrequency === "accelerated_biweekly") {
    payment = monthlyPayment / 2
  }
  if (paymentFrequency === "accelerated_weekly") {
    payment = monthlyPayment / 4
  }

  return {
    payment: Number(payment.toFixed(2)),
    mortgageAmount: Number(principal.toFixed(2)),
    cmhcApplied: cmhcRate > 0,
  }
}

export function calculateMortgageRestOfWorld({
  homePrice,
  downPaymentPercent,
  annualRatePercent,
  termYears,
  annualPropertyTax,
  annualInsurance,
  pmiRatePercent,
  monthlyHOA,
}: {
  homePrice: number
  downPaymentPercent: number
  annualRatePercent: number
  termYears: number
  annualPropertyTax: number
  annualInsurance: number
  pmiRatePercent: number
  monthlyHOA: number
}) {
  const loanAmount = homePrice * (1 - downPaymentPercent / 100)
  const totalPayments = termYears * 12
  const monthlyRate = annualRatePercent / 100 / 12

  // Principal & Interest
  const principalInterest =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)

  // Monthly add-ons
  const monthlyTax = annualPropertyTax / 12
  const monthlyInsurance = annualInsurance / 12
  const monthlyPMI =
    downPaymentPercent < 20 ? (loanAmount * (pmiRatePercent / 100)) / 12 : 0

  const totalMonthlyPayment =
    principalInterest + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA

  return {
    principalInterest: Number(principalInterest.toFixed(2)),
    monthlyTax: Number(monthlyTax.toFixed(2)),
    monthlyInsurance: Number(monthlyInsurance.toFixed(2)),
    monthlyPMI: Number(monthlyPMI.toFixed(2)),
    totalMonthlyPayment: Number(totalMonthlyPayment.toFixed(2)),
  }
}
