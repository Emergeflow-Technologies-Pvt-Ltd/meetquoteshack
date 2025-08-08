"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface CoApplicantDetailsProps {
  application: {
    coApplicantFullName?: string;
    coApplicantDateOfBirth?: string | Date;
    coApplicantAddress?: string;
    coApplicantPhone?: string;
    coApplicantEmail?: string;
  };
}

const CoApplicantDetails: React.FC<CoApplicantDetailsProps> = ({
  application,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Co-applicant Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <InfoRow
            label="Name"
            value={application.coApplicantFullName || "N/A"}
          />
          <InfoRow
            label="Date of Birth"
            value={
              application.coApplicantDateOfBirth
                ? new Date(
                    application.coApplicantDateOfBirth
                  ).toLocaleDateString()
                : "N/A"
            }
          />
          <InfoRow
            label="Address"
            value={application.coApplicantAddress || "N/A"}
          />
          <InfoRow
            label="Phone"
            value={application.coApplicantPhone || "N/A"}
          />
          <InfoRow
            label="Email"
            value={application.coApplicantEmail || "N/A"}
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

export default CoApplicantDetails;
