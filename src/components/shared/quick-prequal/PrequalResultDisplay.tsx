"use client"

import { PrequalResult } from "./types"

interface PrequalResultDisplayProps {
  result: PrequalResult
  creditScore: number
}

export function PrequalResultDisplay({
  result,
  creditScore,
}: PrequalResultDisplayProps) {
  return (
    <div
      className={`space-y-6 rounded-lg border p-6 pb-12 ${
        result.prequalStatus === "APPROVED"
          ? "border-emerald-500 bg-emerald-50/50"
          : result.prequalStatus === "CONDITIONAL"
            ? "border-amber-500 bg-amber-50/50"
            : "border-red-500 bg-red-50/50"
      }`}
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold">Pre-qualification Summary</p>
          <p className="text-xs text-muted-foreground">
            Based on your financial inputs
          </p>
        </div>

        <span
          className={`rounded-md px-3 py-1 text-sm font-semibold ${
            result.prequalStatus === "APPROVED"
              ? "bg-emerald-100 text-emerald-800"
              : result.prequalStatus === "CONDITIONAL"
                ? "bg-amber-100 text-amber-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {result.prequalLabel}
        </span>
      </div>

      {/* ================= REFINANCE ================= */}
      {result.isRefinance ? (
        <>
          {/* GDS / TDS */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <MetricBar label="GDS" value={result.gds} limit={39} />
            <MetricBar label="TDS" value={result.tds} limit={44} />
          </div>

          {/* Refinance Info */}
          <div className="space-y-1 rounded border bg-background p-3 text-xs">
            <Row
              label="Max Refinance"
              value={`$${result.maxRefinanceAmount.toLocaleString()}`}
            />
            <Row
              label="Available Cash"
              value={`$${result.availableRefinanceCash.toLocaleString()}`}
              highlight
            />
            <Row
              label="LTV"
              value={`${result.ltv.toFixed(1)}%`}
              danger={result.ltv > 80}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Metric
              label="Credit"
              value={`${creditScore} (${result.creditTier})`}
            />
            <Metric label="LTI" value={result.lti.toFixed(1)} />
          </div>
        </>
      ) : (
        <>
          {/* ================= DTI ================= */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <MetricCard
              title="Current DTI"
              value={`${result.frontEndDTI.toFixed(1)}%`}
              sub="Existing debts"
            />
            <MetricCard
              title="Estimated DTI"
              value={`${result.backEndDTI.toFixed(1)}%`}
              sub="With new loan"
            />
          </div>

          {/* ================= CORE METRICS ================= */}
          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <Metric
              label="Credit"
              value={`${creditScore} (${result.creditTier})`}
            />
            <Metric label="TDSR" value={`${result.tdsr.toFixed(1)}%`} />
            <Metric label="LTI" value={result.lti.toFixed(1)} />

            {result.isMortgageLike && result.ltv > 0 && (
              <Metric label="LTV" value={`${result.ltv.toFixed(1)}%`} />
            )}
          </div>

          {/* ================= CAPACITY ================= */}
          <div className="space-y-2 rounded border bg-background p-3 text-sm">
            <Row
              label="Eligible Max Payment"
              value={`$${result.eligibleMaxPayment.toLocaleString()}/mo`}
            />
            <Row
              label="Room Available"
              value={`$${result.availableForNewLoanMonthly.toLocaleString()}/mo`}
            />
          </div>
        </>
      )}

      {/* ================= MORTGAGE RANGE ================= */}
      {result.isMortgageLike && result.mortgageRangeMax > 0 && (
        <div className="rounded border bg-background p-3 text-sm">
          <p className="text-xs text-muted-foreground">
            Suggested Mortgage Range
          </p>
          <p className="font-semibold">
            ${result.mortgageRangeMin.toLocaleString()} – $
            {result.mortgageRangeMax.toLocaleString()}
          </p>
        </div>
      )}

      {/* ================= 🔥 OFFER ================= */}
      {result.offer && result.prequalStatus !== "DECLINED" && (
        <div className="space-y-2 rounded border bg-muted p-3">
          <p className="text-xs font-semibold text-muted-foreground">
            Estimated Offer
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Metric
              label="Rate"
              value={`${result.offer.rateRange.min}% – ${result.offer.rateRange.max}%`}
            />
            <Metric label="Category" value={result.offer.lenderCategory} />
          </div>

          <p className="text-xs">
            <span className="text-muted-foreground">Lenders: </span>
            {result.offer.lenders.join(", ")}
          </p>

          {result.offer.notes?.length > 0 && (
            <ul className="list-disc pl-4 text-xs text-muted-foreground">
              {result.offer.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ================= STATUS ================= */}
      {result.statusDetail && (
        <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
      )}
    </div>
  )
}

/* ================= SMALL COMPONENTS ================= */

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
  danger,
}: {
  label: string
  value: string
  highlight?: boolean
  danger?: boolean
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-medium ${
          highlight
            ? "font-bold text-emerald-600"
            : danger
              ? "text-red-600"
              : ""
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function MetricCard({
  title,
  value,
  sub,
}: {
  title: string
  value: string
  sub: string
}) {
  return (
    <div className="rounded border bg-background p-3">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

function MetricBar({
  label,
  value,
  limit,
}: {
  label: string
  value: number
  limit: number
}) {
  return (
    <div className="rounded border bg-background p-3">
      <div className="mb-1 flex justify-between text-xs">
        <span>{label}</span>
        <span className={value <= limit ? "text-green-600" : "text-red-600"}>
          {value.toFixed(1)}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-gray-200">
        <div
          className={`h-2 rounded-full ${
            value <= limit ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  )
}
