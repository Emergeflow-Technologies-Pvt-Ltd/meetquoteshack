// lib/prequal.ts
import { LoanType } from "@prisma/client";

export type PrequalStatus = "APPROVED" | "CONDITIONAL" | "DECLINED";
export type CreditTier = "Excellent" | "Good" | "Fair" | "Poor";

export interface PrequalInput {
  loanAmount: number;
  creditScore: number;
  grossIncome: number;
  monthlyDebts: number;
  estimatedPropertyValue: number;
  workplaceDuration: number;
  loanType?: LoanType;
}

export function computePrequalification(input: PrequalInput) {
  const safe = (n: unknown) => (typeof n === "number" && isFinite(n) ? n : 0);

  const P = safe(input.loanAmount);
  const grossYear = safe(input.grossIncome);
  const grossMonth = grossYear / 12;
  const existingDebts = safe(input.monthlyDebts);
  const propValue = safe(input.estimatedPropertyValue);
  const employmentYears = safe(input.workplaceDuration);
  const creditScore = safe(input.creditScore);
  const loanType = input.loanType;

  const mortgageLikeLoanTypes: LoanType[] = [
    LoanType.FIRST_TIME_HOME,
    LoanType.MORTGAGE_REFINANCE,
    LoanType.INVESTMENT_PROPERTY,
    LoanType.HELOC,
    LoanType.HOME_REPAIR,
  ];

  const isMortgageLike = !!loanType && mortgageLikeLoanTypes.includes(loanType);

  // 1. Payment estimate
  const assumedTermYears = isMortgageLike ? 25 : 5;
  const assumedRateAnnual = isMortgageLike ? 5 : 10;
  const n = assumedTermYears * 12;
  const r = assumedRateAnnual / 100 / 12;

  let proposedLoanPayment = 0;
  if (P > 0 && r > 0 && n > 0) {
    const pow = Math.pow(1 + r, n);
    proposedLoanPayment = P * ((r * pow) / (pow - 1));
  }

  // 2. Ratios
  const totalDebtWithNew = existingDebts + proposedLoanPayment;
  const dti = grossMonth > 0 ? (totalDebtWithNew / grossMonth) * 100 : 0;

  const tdsr = grossYear > 0 ? ((existingDebts * 12) / grossYear) * 100 : 0;

  const lti = grossYear > 0 ? (P / grossYear) * 100 : 0;

  let ltv = 0;
  if (isMortgageLike && propValue > 0 && P > 0) {
    ltv = (P / propValue) * 100;
  }

  // 3. Thresholds
  const minCredit = isMortgageLike ? 650 : 730;
  const maxDTIForPass = 36;
  const maxDTIForConditional = 40;
  const maxTDSRForPass = 34;
  const maxLTIForPass = 30;
  const minIncomeNonMortgage = 50000;
  const minEmploymentYears = 3;
  const maxLTVIdeal = 80;
  const maxLTVAbsolute = 97;

  // 4. Credit tier
  let creditTier: CreditTier = "Poor";
  if (creditScore >= 720) creditTier = "Excellent";
  else if (creditScore >= 680) creditTier = "Good";
  else if (creditScore >= 620) creditTier = "Fair";

  // 5. Rules
  const incomeOk = isMortgageLike
    ? grossYear > 0
    : grossYear > minIncomeNonMortgage;

  const tdsrOk = tdsr < maxTDSRForPass;
  const dtiOk = dti < maxDTIForPass;
  const dtiConditionalOk = dti >= maxDTIForPass && dti <= maxDTIForConditional;
  const ltiOk = lti < maxLTIForPass;

  const creditOk = creditScore >= minCredit;
  const creditNear = !creditOk && creditScore >= minCredit - 20;

  const employmentOk = employmentYears > minEmploymentYears;

  let ltvOk = true;
  let ltvConditionalOk = false;

  if (isMortgageLike && ltv > 0) {
    if (ltv <= maxLTVIdeal) {
      ltvOk = true;
    } else if (ltv > maxLTVIdeal && ltv <= maxLTVAbsolute) {
      ltvOk = false;
      ltvConditionalOk = true;
    } else {
      ltvOk = false;
      ltvConditionalOk = false;
    }
  }

  // 6. Mortgage range
  let mortgageRangeMin = 0;
  let mortgageRangeMax = 0;

  if (isMortgageLike && grossYear > 0) {
    const minMultiple = 4;
    const maxMultiple = grossYear >= 50000 ? 6 : 5;
    mortgageRangeMin = grossYear * minMultiple;
    mortgageRangeMax = grossYear * maxMultiple;
  }

  // 7. Decision
  let prequalStatus: PrequalStatus = "DECLINED";
  const reasons: string[] = [];

  const allCoreOkNonMortgage =
    !isMortgageLike &&
    incomeOk &&
    tdsrOk &&
    dtiOk &&
    ltiOk &&
    creditOk &&
    employmentOk;

  const allCoreOkMortgage =
    isMortgageLike &&
    tdsrOk &&
    dtiOk &&
    ltiOk &&
    creditOk &&
    (ltvOk || (!ltv && true));

  const allCoreOk = allCoreOkNonMortgage || allCoreOkMortgage;

  if (!incomeOk && !isMortgageLike) {
    reasons.push("Annual income must be greater than $50,000.");
  }
  if (!creditOk) {
    reasons.push(`Credit score below minimum threshold (${minCredit}).`);
  }
  if (!employmentOk && !isMortgageLike) {
    reasons.push("Employment history should be greater than 3 years.");
  }
  if (!dtiOk) {
    reasons.push(`Debt-to-income ratio exceeds ${maxDTIForPass}%.`);
  }
  if (!tdsrOk) {
    reasons.push("Total debt service ratio exceeds 34%.");
  }
  if (!ltiOk) {
    reasons.push("Loan-to-income ratio exceeds 30% of annual income.");
  }
  if (isMortgageLike && ltv > 0) {
    if (!ltvOk && ltvConditionalOk) {
      reasons.push(
        "Loan-to-value ratio is above 80%; private mortgage insurance or a higher rate may be required."
      );
    } else if (!ltvOk && !ltvConditionalOk) {
      reasons.push("Loan-to-value ratio is above acceptable maximum (97%).");
    }
  }

  if (allCoreOk) {
    prequalStatus = "APPROVED";
  } else if (
    (creditNear || dtiConditionalOk || ltvConditionalOk) &&
    creditScore >= 620 &&
    dti <= 45 &&
    tdsr <= 40
  ) {
    prequalStatus = "CONDITIONAL";
  } else {
    prequalStatus = "DECLINED";
  }

  const prequalLabel =
    prequalStatus === "APPROVED"
      ? "Pre-Qualified"
      : prequalStatus === "CONDITIONAL"
        ? "Likely Qualified with Conditions"
        : "Not Pre-Qualified";

  let statusDetail = "";
  if (prequalStatus === "APPROVED") {
    statusDetail = isMortgageLike
      ? "You meet the current guidelines for a mortgage/property-backed loan based on income, debts, credit, and loan size."
      : "You meet the current guidelines for this loan type based on income, debts, credit, and loan-to-income ratio.";
  } else if (prequalStatus === "CONDITIONAL") {
    statusDetail =
      "You may qualify with a lower loan amount, a larger down payment, or by improving one or more risk factors.";
  } else {
    statusDetail =
      reasons[0] ??
      "Based on the information provided, you are not pre-qualified at this time.";
  }

  // 8. Available room
  const maxDTIPercentForRule = isMortgageLike ? 0.36 : 0.4;
  const maxTotalMonthlyDebt = grossMonth * maxDTIPercentForRule;
  const availableForNewLoanMonthly = Math.max(
    maxTotalMonthlyDebt - existingDebts,
    0
  );

  return {
    dti,
    tdsr,
    lti,
    ltv,
    availableForNewLoanMonthly,
    proposedLoanPayment,
    creditTier,
    prequalStatus,
    prequalLabel,
    statusDetail,
    mortgageRangeMin,
    mortgageRangeMax,
    isMortgageLike,
  };
}
