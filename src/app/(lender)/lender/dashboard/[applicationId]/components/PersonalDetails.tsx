"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { Prisma } from "@prisma/client";
import {
  housingStatusTypeLabels,
  maritalStatusLabels,
  residencyStatusTypeLabels,
} from "@/components/shared/general.const";

interface PersonalDetailsProps {
  application: Prisma.ApplicationGetPayload<{
    include: {
      documents: true;
      messages: true;
    };
  }> | null;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ application }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-700">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <InfoRow
            label="Name"
            value={`${application?.firstName} ${application?.lastName}`}
          />
          <InfoRow
            label="Date of Birth (mm-dd-yy)"
            value={
              application?.dateOfBirth
                ? new Date(application.dateOfBirth).toLocaleDateString()
                : ""
            }
          />
          <InfoRow
            label="Current Address"
            value={application?.currentAddress}
          />
          <InfoRow
            label="Previous Address"
            value={application?.previousAddress || "N/A"}
          />
          <InfoRow
            label="Years at Current Address"
            value={application?.yearsAtCurrentAddress}
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
          <InfoRow
            label="Canadian Status"
            value={
              application?.residencyStatus
                ? residencyStatusTypeLabels[application.residencyStatus]
                : "N/A"
            }
          />
          <InfoRow
            label="Marital Status"
            value={
              application?.maritalStatus
                ? maritalStatusLabels[application.maritalStatus]
                : "N/A"
            }
          />
          <InfoRow label="Phone" value={application?.personalPhone} />
          <InfoRow label="Email" value={application?.personalEmail} />
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

export default PersonalDetails;
