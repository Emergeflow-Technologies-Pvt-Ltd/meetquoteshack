// src/components/shared/prequalification-summary.tsx
"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Prisma, PrequalStatus } from "@prisma/client"

type NumericLike = Prisma.Decimal | number | null

type ApplicationLike = {
  prequalStatus: PrequalStatus | null
  prequalLabel: string | null
  prequalCreditTier: string | null

  prequalDti: NumericLike
  prequalTdsr: NumericLike
  prequalLti: NumericLike
  prequalLtv: NumericLike

  prequalPayment: NumericLike
  prequalRoomMonthly: NumericLike
  prequalEligiblePayment?: NumericLike // ✅ NEW

  prequalMortMin: NumericLike
  prequalMortMax: NumericLike

  // 🔥 OFFER
  prequalRateMin?: NumericLike
  prequalRateMax?: NumericLike
  prequalLenderCategory?: string | null
  prequalLenders?: LenderInfo[] | null
  // 🔥 REFINANCE
  prequalMaxRefinanceAmount?: NumericLike
  prequalAvailableCash?: NumericLike
}

type Props = {
  application: ApplicationLike | null | undefined
  context?: "lender" | "loanee"
  hideEstimatedOffer?: boolean
}

type LenderInfo = {
  name: string
  description?: string
}

export function PrequalificationSummary({
  application,
  context = "lender",
  hideEstimatedOffer = false,
}: Props) {
  if (!application || !application.prequalStatus) return null

  const toNum = (v: NumericLike | undefined): number | null =>
    v === null || v === undefined ? null : Number(v)

  const dti = toNum(application.prequalDti)
  const tdsr = toNum(application.prequalTdsr)
  const lti = toNum(application.prequalLti)
  const ltv = toNum(application.prequalLtv)

  const payment = toNum(application.prequalPayment)
  const roomMonthly = toNum(application.prequalRoomMonthly)
  const eligiblePayment = toNum(application.prequalEligiblePayment)

  const mortMin = toNum(application.prequalMortMin)
  const mortMax = toNum(application.prequalMortMax)

  const rateMin = toNum(application.prequalRateMin)
  const rateMax = toNum(application.prequalRateMax)

  const refinanceMax = toNum(application.prequalMaxRefinanceAmount)
  const refinanceCash = toNum(application.prequalAvailableCash)

  // ✅ fallback for backward compatibility
  const displayEligiblePayment = eligiblePayment ?? payment ?? null

  const badgeClass =
    application.prequalStatus === "APPROVED"
      ? "bg-emerald-100 text-emerald-800"
      : application.prequalStatus === "CONDITIONAL"
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800"

  // ✅ RESTORED detailed explanation logic
  const explanation =
    context === "lender"
      ? application.prequalStatus === "APPROVED"
        ? "Based on the declared income, debts, and credit profile, this application meets automated pre-qualification thresholds."
        : application.prequalStatus === "CONDITIONAL"
          ? "This file is close to meeting guidelines. Adjustments or compensating factors may help."
          : "The application does not meet automated thresholds. Manual review may still be possible."
      : application.prequalStatus === "APPROVED"
        ? "You meet the current pre-qualification criteria."
        : application.prequalStatus === "CONDITIONAL"
          ? "You are close to qualifying. Improvements may help."
          : "You currently do not meet pre-qualification criteria."

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Pre-qualification Snapshot
        </CardTitle>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
        >
          {application.prequalLabel}
        </span>
      </CardHeader>

      <CardContent className="space-y-5 text-sm">
        {/* ================= FINANCIAL RATIOS ================= */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            Financial Ratios
          </p>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Metric
              label="DTI"
              value={dti !== null ? `${dti.toFixed(1)}%` : "--"}
            />
            <Metric
              label="TDSR"
              value={tdsr !== null ? `${tdsr.toFixed(1)}%` : "--"}
            />
            <Metric
              label="LTI"
              value={lti !== null ? `${lti.toFixed(1)}%` : "--"}
            />
            {ltv !== null && ltv > 0 && (
              <Metric label="LTV" value={`${ltv.toFixed(1)}%`} />
            )}
          </div>
        </div>

        {/* ================= AFFORDABILITY ================= */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            Affordability
          </p>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <Metric
              label="Est. Payment"
              value={payment !== null ? `$${payment.toFixed(0)}/mo` : "--"}
            />
            <Metric
              label="Room Available"
              value={
                roomMonthly !== null ? `$${roomMonthly.toFixed(0)}/mo` : "--"
              }
            />
            <Metric
              label="Max Eligible Payment"
              value={
                displayEligiblePayment !== null
                  ? `$${displayEligiblePayment.toFixed(0)}/mo`
                  : "--"
              }
            />
          </div>
        </div>

        {/* ================= MORTGAGE RANGE ================= */}
        {mortMin !== null && mortMax !== null && mortMin > 0 && mortMax > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">
              Suggested Mortgage Range
            </p>
            <p className="font-semibold">
              ${mortMin.toLocaleString()} – ${mortMax.toLocaleString()}
            </p>
          </div>
        )}

        {/* ================= OFFER ================= */}
        {!hideEstimatedOffer && (rateMin !== null || application.prequalLenderCategory) && (
          <div className="rounded-md border bg-muted p-3">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Estimated Offer
            </p>

            <div className="grid grid-cols-2 gap-3">
              {rateMin !== null && rateMax !== null && (
                <Metric
                  label="Rate Range"
                  value={`${rateMin}% – ${rateMax}%`}
                />
              )}

              <Metric
                label="Lender Category"
                value={application.prequalLenderCategory || "--"}
              />
            </div>

            {application.prequalLenders?.length ? (
              <p className="mt-2 text-xs">
                <span className="text-muted-foreground">Lenders: </span>

                {application.prequalLenders
                  .map((lender) => lender.name)
                  .join(", ")}
              </p>
            ) : null}
          </div>
        )}

        {/* ================= REFINANCE ================= */}
        {(refinanceMax !== null || refinanceCash !== null) && (
          <div className="rounded-md border bg-blue-50 p-3">
            <p className="mb-2 text-xs font-semibold text-blue-900">
              Refinance Insights
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Metric
                label="Max Refinance"
                value={
                  refinanceMax !== null
                    ? `$${refinanceMax.toLocaleString()}`
                    : "--"
                }
              />
              <Metric
                label="Available Cash"
                value={
                  refinanceCash !== null
                    ? `$${refinanceCash.toLocaleString()}`
                    : "--"
                }
              />
            </div>
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <p className="text-xs font-medium">{explanation}</p>
        <p className="text-[10px] text-muted-foreground">
          This is an automated pre-qualification snapshot based on provided
          data. It is not a final credit decision.
        </p>
      </CardContent>
    </Card>
  )
}

/* 🔹 Reusable Metric */
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
