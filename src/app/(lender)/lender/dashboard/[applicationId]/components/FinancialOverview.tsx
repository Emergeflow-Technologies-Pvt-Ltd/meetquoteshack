"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface FinancialOverviewProps {
  application: {
    grossIncome: number;
    monthlyDebts: number;
    savings: number;
    otherIncome: boolean;
    childCareBenefit: boolean;
    sin?: string;
    hasBankruptcy: boolean;
    loanAmount: number;
    loanType: string;
    loanPurpose?: string;
  };
  loanTypeLabels: Record<string, string>;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  application,
  loanTypeLabels,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <InfoRow label="Gross Income" value={`$${application.grossIncome}`} />
          <InfoRow
            label="Monthly Debts"
            value={`$${application.monthlyDebts}`}
          />
          <InfoRow label="Savings" value={`$${application.savings}`} />
          <InfoRow
            label="Other Income"
            value={application.otherIncome ? "Yes" : "No"}
          />
          <InfoRow
            label="Child Care Benefit"
            value={application.childCareBenefit ? "Yes" : "No"}
          />
          <InfoRow label="SIN" value={application.sin || "N/A"} />
          <InfoRow
            label="Has Bankruptcy?"
            value={application.hasBankruptcy ? "Yes" : "No"}
          />
          <InfoRow label="Loan Amount" value={`$${application.loanAmount}`} />
          <InfoRow
            label="Loan Type"
            value={loanTypeLabels[application.loanType]}
          />
          <InfoRow
            label="Loan Purpose"
            value={application.loanPurpose || "N/A"}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div>
    <span className="text-gray-500">{label}</span>
    <p className="font-medium">{value}</p>
  </div>
);

export default FinancialOverview;
