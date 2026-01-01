"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

import { Prisma } from "@prisma/client";
import {
  housingStatusTypeLabels,
  loanTypeLabels,
} from "@/components/shared/general.const";

interface FinancialOverviewProps {
  application: Prisma.ApplicationGetPayload<{
    include: {
      documents: true;
      messages: true;
    };
  }> | null;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  application,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <InfoRow
            label="Gross Income"
            value={`$${application?.grossIncome}`}
          />
          <InfoRow
            label="Monthly Debts"
            value={`$${application?.monthlyDebts}`}
          />
          <InfoRow
            label="Housing Status"
            value={
              application?.housingStatus
                ? housingStatusTypeLabels[application.housingStatus]
                : "N/A"
            }
          />
          <InfoRow
            label="Housing Payment"
            value={`$${Number(application?.housingPayment).toLocaleString()}`}
          />
          <InfoRow label="Savings" value={`$${application?.savings}`} />
          <InfoRow
            label="Other Income"
            value={application?.otherIncome ? "Yes" : "No"}
          />
          <InfoRow
            label="Child Care Benefit"
            value={application?.childCareBenefit ? "Yes" : "No"}
          />
          <InfoRow
            label="Has Bankruptcy?"
            value={application?.hasBankruptcy ? "Yes" : "No"}
          />
          <InfoRow label="Loan Amount" value={`$${application?.loanAmount}`} />
          <InfoRow
            label="Loan Type"
            value={
              application?.loanType
                ? loanTypeLabels[application.loanType]
                : "N/A"
            }
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
  value: string | number | undefined;
}) => (
  <div>
    <span className="text-gray-500">{label}</span>
    <p className="break-words font-medium">{value}</p>
  </div>
);

export default FinancialOverview;
