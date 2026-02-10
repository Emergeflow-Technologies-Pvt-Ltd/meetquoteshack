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

      {/* Show refinance-specific info for Canadian refinance */}
      {result.isRefinance ? (
        <>
          {/* Canadian GDS/TDS Display */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded border bg-background p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  GDS (Housing Only)
                </p>
                <span
                  className={`text-sm font-bold ${
                    result.gds <= 39 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {result.gds.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${
                    result.gds <= 39 ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(result.gds, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Max: 39%</p>
            </div>

            <div className="rounded border bg-background p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">TDS (All Debts)</p>
                <span
                  className={`text-sm font-bold ${
                    result.tds <= 44 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {result.tds.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${
                    result.tds <= 44 ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(result.tds, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Max: 44%</p>
            </div>
          </div>

          {/* Refinance Analysis */}
          <div className="space-y-1 rounded border bg-background p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Available Refinance Cash:
              </span>
              <span className="font-bold text-emerald-600">
                ${result.availableRefinanceCash.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">LTV:</span>
              <span
                className={
                  result.ltv > 80 ? "font-bold text-red-600" : "font-medium"
                }
              >
                {result.ltv.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Credit Score</p>
              <p className="font-medium">
                {creditScore} ({result.creditTier})
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">LTI</p>
              <p className="font-medium">{result.lti.toFixed(1)}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Regular DTI Display for non-refinance loans */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded border bg-background p-3">
              <p className="mb-1 text-xs text-muted-foreground">Current DTI</p>
              <p className="text-2xl font-bold">
                {result.frontEndDTI.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Existing debts only
              </p>
            </div>

            <div className="rounded border bg-background p-3">
              <p className="mb-1 text-xs text-muted-foreground">
                Estimated DTI
              </p>
              <p className="text-2xl font-bold">
                {result.backEndDTI.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                With new loan payment
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Credit Score</p>
              <p className="font-medium">
                {creditScore} ({result.creditTier})
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">TDSR</p>
              <p className="font-medium">{result.tdsr.toFixed(1)}%</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">LTI</p>
              <p className="font-medium">{result.lti.toFixed(1)}</p>
            </div>

            {result.isMortgageLike && result.ltv > 0 && (
              <div>
                <p className="text-xs text-muted-foreground">LTV</p>
                <p className="font-medium">{result.ltv.toFixed(1)}%</p>
              </div>
            )}
          </div>

          <div className="rounded border bg-background p-3 text-sm">
            <div className="flex justify-between">
              <p className="text-xs text-muted-foreground">
                Eligible Max Payment (15% of income):
              </p>
              <p className="font-medium">
                ${result.eligibleMaxPayment.toLocaleString()}
              </p>
            </div>
          </div>
        </>
      )}

      {result.statusDetail && (
        <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
      )}
    </div>
  )
}
