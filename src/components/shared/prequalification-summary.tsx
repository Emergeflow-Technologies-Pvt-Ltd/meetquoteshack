// src/components/shared/prequalification-summary.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Prisma, PrequalStatus } from "@prisma/client";

type NumericLike = Prisma.Decimal | number | null;

type ApplicationLike = {
  prequalStatus: PrequalStatus | null;
  prequalLabel: string | null;
  prequalCreditTier: string | null;
  prequalDti: NumericLike;
  prequalTdsr: NumericLike;
  prequalLti: NumericLike;
  prequalLtv: NumericLike;
  prequalPayment: NumericLike;
  prequalRoomMonthly: NumericLike;
  prequalMortMin: NumericLike;
  prequalMortMax: NumericLike;
};

type PrequalificationSummaryProps = {
  // 🔹 Now nullable to match your `ApplicationWithRelations | null`
  application: ApplicationLike | null | undefined;
  context?: "lender" | "loanee";
};

export function PrequalificationSummary({
  application,
  context = "lender",
}: PrequalificationSummaryProps) {
  // If no application or no prequal data, render nothing
  if (!application || !application.prequalStatus) return null;

  const {
    prequalStatus,
    prequalLabel,
    prequalCreditTier,
    prequalDti,
    prequalTdsr,
    prequalLti,
    prequalLtv,
    prequalPayment,
    prequalRoomMonthly,
    prequalMortMin,
    prequalMortMax,
  } = application;

  const toNum = (v: NumericLike): number | null =>
    v === null || v === undefined ? null : Number(v);

  const dti = toNum(prequalDti);
  const tdsr = toNum(prequalTdsr);
  const lti = toNum(prequalLti);
  const ltv = toNum(prequalLtv);
  const payment = toNum(prequalPayment);
  const roomMonthly = toNum(prequalRoomMonthly);
  const mortMin = toNum(prequalMortMin);
  const mortMax = toNum(prequalMortMax);

  const badgeClass =
    prequalStatus === "APPROVED"
      ? "bg-emerald-100 text-emerald-800"
      : prequalStatus === "CONDITIONAL"
      ? "bg-amber-100 text-amber-800"
      : "bg-red-100 text-red-800";

  const lenderExplanation =
    prequalStatus === "APPROVED"
      ? "Based on the declared income, debts, credit score and requested amount, this application meets the current automated pre-qualification thresholds."
      : prequalStatus === "CONDITIONAL"
      ? "This file is close to meeting automated guidelines. Approval may be possible with a lower loan amount, stronger down payment, or compensating factors."
      : "Based on the declared data, the application does not meet the automated pre-qualification thresholds. Manual review is recommended if there are additional compensating factors.";

  const loaneeExplanation =
    prequalStatus === "APPROVED"
      ? "Based on the information you provided, you currently meet our automated pre-qualification guidelines for the requested loan amount."
      : prequalStatus === "CONDITIONAL"
      ? "You are close to meeting our automated guidelines. A smaller loan amount, larger down payment, or stronger overall profile may help."
      : "Based on the information entered, you do not currently meet our automated pre-qualification guidelines. This is not a final decision; a lender may still review your file manually.";

  const explanation =
    context === "lender" ? lenderExplanation : loaneeExplanation;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">
          Pre-qualification Snapshot (System)
        </CardTitle>
        <span
          className={`px-3 py-1 text-xs rounded-full font-semibold ${badgeClass}`}
        >
          {prequalLabel}
        </span>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Credit Tier</p>
            <p className="font-medium">{prequalCreditTier || "N/A"}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">DTI (Back-End)</p>
            <p className="font-medium">
              {dti != null ? `${dti.toFixed(1)}%` : "--"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">TDSR</p>
            <p className="font-medium">
              {tdsr != null ? `${tdsr.toFixed(1)}%` : "--"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">LTI</p>
            <p className="font-medium">
              {lti != null ? `${lti.toFixed(1)}%` : "--"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Est. Proposed Payment
            </p>
            <p className="font-medium">
              {payment != null && payment > 0
                ? `$${payment.toFixed(2)}/mo`
                : "--"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Room for New Loan (DTI rule)
            </p>
            <p className="font-medium">
              {roomMonthly != null && roomMonthly > 0
                ? `$${roomMonthly.toFixed(2)}/mo`
                : "--"}
            </p>
          </div>

          {ltv != null && ltv > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">LTV</p>
              <p className="font-medium">{ltv.toFixed(1)}%</p>
            </div>
          )}

          {mortMin != null &&
            mortMax != null &&
            mortMin > 0 &&
            mortMax > 0 && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">
                  Suggested Mortgage Range
                </p>
                <p className="font-medium">
                  ${mortMin.toLocaleString()} – ${mortMax.toLocaleString()}
                </p>
              </div>
            )}
        </div>

        <p className="text-xs mt-2 font-medium text-black">{explanation}</p>
        <p className="text-[10px] text-muted-foreground mt-1">
          This is an automated pre-qualification snapshot based on the
          information provided in the application. It is not a credit decision.
        </p>
      </CardContent>
    </Card>
  );
}
