const PROVINCIAL_TAX_RATES = {
  AB: { GST: 5, PST: 0, HST: 0 },
  BC: { GST: 5, PST: 7, HST: 0 },
  MB: { GST: 5, PST: 7, HST: 0 },
  NB: { GST: 0, PST: 0, HST: 15 },
  NL: { GST: 0, PST: 0, HST: 15 },
  NS: { GST: 0, PST: 0, HST: 15 },
  ON: { GST: 0, PST: 0, HST: 13 },
  PE: { GST: 0, PST: 0, HST: 15 },
  QC: { GST: 5, PST: 9.975, HST: 0 },
  SK: { GST: 5, PST: 6, HST: 0 },
  NT: { GST: 5, PST: 0, HST: 0 },
  NU: { GST: 5, PST: 0, HST: 0 },
  YT: { GST: 5, PST: 0, HST: 0 },
} as const

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

export function calculateCarLoanCanada({
  vehiclePrice,
  downPayment,
  tradeIn,
  province,
  annualRatePercent,
  termMonths,
  paymentFrequency,
}: {
  vehiclePrice: number
  downPayment: number
  tradeIn: number
  province: keyof typeof PROVINCIAL_TAX_RATES
  annualRatePercent: number
  termMonths: number
  paymentFrequency: "monthly" | "biweekly" | "weekly"
}) {
  // 1. Taxable amount (Canada rule)
  const taxableAmount = vehiclePrice - tradeIn

  // 2. Get province tax rates
  const { GST, PST, HST } = PROVINCIAL_TAX_RATES[province]

  // 3. Calculate tax
  let totalTax = 0
  if (HST > 0) {
    totalTax = taxableAmount * (HST / 100)
  } else {
    totalTax = taxableAmount * (GST / 100) + taxableAmount * (PST / 100)
  }

  // 4. Total financed amount (tax rolled in)
  const principal = vehiclePrice + totalTax - downPayment - tradeIn

  // 5. Run standard installment loan calculation
  const loanResult = calculateInstallmentLoan({
    principal,
    annualRatePercent,
    termMonths,
    paymentFrequency,
  })

  return {
    ...loanResult,
    vehiclePrice,
    taxableAmount: Number(taxableAmount.toFixed(2)),
    taxAmount: Number(totalTax.toFixed(2)),
    financedAmount: Number(principal.toFixed(2)),
  }
}

export function calculateLineOfCreditCanada({
  balance,
  annualRatePercent,
  daysInPeriod = 30,
  paymentType,
  principalPercent = 0.02,
  fixedMonthlyPayment,
}: {
  balance: number
  annualRatePercent: number
  daysInPeriod?: number
  paymentType: "interest_only" | "minimum_percent"
  principalPercent?: number
  fixedMonthlyPayment?: number
}) {
  // 1. Daily → Monthly interest
  const dailyRate = annualRatePercent / 100 / 365
  const monthlyInterest = balance * dailyRate * daysInPeriod

  // 2. Minimum payment
  let minimumPayment: number

  if (paymentType === "interest_only") {
    minimumPayment = monthlyInterest
  } else {
    const percentPayment = balance * principalPercent
    minimumPayment = Math.max(monthlyInterest, percentPayment)
  }

  // 3. Optional payoff time (fixed payment)
  let payoffMonths: number | null = null

  if (fixedMonthlyPayment !== undefined) {
    let remainingBalance = balance
    let months = 0

    // Safety check: payment must exceed interest
    if (fixedMonthlyPayment <= monthlyInterest) {
      payoffMonths = Infinity
    } else {
      while (remainingBalance > 0 && months < 1000) {
        const interest = remainingBalance * dailyRate * daysInPeriod

        remainingBalance = remainingBalance + interest - fixedMonthlyPayment

        months++
      }
      payoffMonths = months
    }
  }

  return {
    monthlyInterest: Number(monthlyInterest.toFixed(2)),
    minimumPayment: Number(minimumPayment.toFixed(2)),
    payoffMonths,
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

  // Minimum down payment rule (Canada)
  if (downPaymentPercent < 5) {
    throw new Error("Minimum down payment in Canada is 5%")
  }

  const cmhcRate = getCMHCPremiumRate(downPaymentPercent)

  // Base mortgage (before insurance)
  const basePrincipal = purchasePrice - downPayment

  // CMHC premium (capitalized)
  const cmhcPremiumAmount = basePrincipal * cmhcRate
  const principal = basePrincipal + cmhcPremiumAmount

  // 🇨Semi-annual compounding (Canadian rule)
  const semiAnnualRate = annualRatePercent / 100 / 2
  const effectiveAnnualRate = Math.pow(1 + semiAnnualRate, 2) - 1

  const frequencyMap = {
    monthly: 12,
    biweekly: 26,
    weekly: 52,
  }

  const normalizedFrequency = paymentFrequency.replace(
    "accelerated_",
    ""
  ) as keyof typeof frequencyMap

  const paymentsPerYear = frequencyMap[normalizedFrequency]

  const periodicRate =
    Math.pow(1 + effectiveAnnualRate, 1 / paymentsPerYear) - 1

  const totalPayments = amortizationYears * paymentsPerYear

  // Monthly payment (used for accelerated logic)
  const monthlyRate = Math.pow(1 + effectiveAnnualRate, 1 / 12) - 1
  const monthlyPayment =
    (principal *
      (monthlyRate * Math.pow(1 + monthlyRate, amortizationYears * 12))) /
    (Math.pow(1 + monthlyRate, amortizationYears * 12) - 1)

  // Standard payment
  let payment =
    (principal * (periodicRate * Math.pow(1 + periodicRate, totalPayments))) /
    (Math.pow(1 + periodicRate, totalPayments) - 1)

  // Accelerated payment adjustments
  if (paymentFrequency === "accelerated_biweekly") {
    payment = monthlyPayment / 2
  }

  if (paymentFrequency === "accelerated_weekly") {
    payment = monthlyPayment / 4
  }

  return {
    payment: Number(payment.toFixed(2)),
    mortgageAmount: Number(principal.toFixed(2)),
    baseMortgageAmount: Number(basePrincipal.toFixed(2)),
    cmhcPremiumRate: cmhcRate,
    cmhcPremiumAmount: Number(cmhcPremiumAmount.toFixed(2)),
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
