"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import { Prisma } from "@prisma/client";

interface PropertyMortgageDetailsProps {
  application: Prisma.ApplicationGetPayload<{
    include: {
      documents: true;
      messages: true;
    };
  }> | null;
}

const PropertyMortgageDetails: React.FC<PropertyMortgageDetailsProps> = ({
  application,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5 text-blue-600" />
          Property & Mortgage Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <InfoRow
            label="Property Type"
            value={application?.houseType || "N/A"}
          />
          <InfoRow
            label="Estimated Property Value"
            value={
              application?.estimatedPropertyValue
                ? `$${Number(
                    application.estimatedPropertyValue
                  ).toLocaleString()}`
                : "N/A"
            }
          />
          <InfoRow
            label="Down Payment"
            value={application?.downPayment || "N/A"}
          />
          <InfoRow
            label="Trade-in Current Vehicle"
            value={application?.tradeInCurrentVehicle ? "Yes" : "No"}
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
    <p className="font-medium">{value}</p>
  </div>
);

export default PropertyMortgageDetails;
