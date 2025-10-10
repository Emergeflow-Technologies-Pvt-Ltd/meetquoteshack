"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Laptop } from "lucide-react";
import { Prisma } from "@prisma/client";

interface WorkpalceDetailsProps {
  application: Prisma.ApplicationGetPayload<{
    include: {
      documents: true;
      messages: true;
    };
  }> | null;
}

const WorkplaceDetails: React.FC<WorkpalceDetailsProps> = ({ application }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Laptop className="w-5 h-5 text-blue-600" />
          Workplace Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <InfoRow label="Worplace Name" value={application?.workplaceName} />
          <InfoRow
            label="Workplace Duration"
            value={application?.workplaceDuration}
          />
          <InfoRow
            label="Worplace Address"
            value={application?.workplaceAddress}
          />
          <InfoRow
            label="Workplace email"
            value={application?.workplaceEmail}
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
    <p className="font-medium break-words">{value}</p>
  </div>
);

export default WorkplaceDetails;
