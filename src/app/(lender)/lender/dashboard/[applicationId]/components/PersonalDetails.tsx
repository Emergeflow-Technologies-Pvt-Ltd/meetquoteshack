"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface PersonalDetailsProps {
  application: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    currentAddress: string;
    previousAddress?: string;
    yearsAtCurrentAddress: number;
    housingStatus: string;
    housingPayment: number;
    residencyStatus: string;
    maritalStatus: string;
    personalPhone: string;
    personalEmail: string;
  };
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
            value={`${application.firstName} ${application.lastName}`}
          />
          <InfoRow
            label="Date of Birth"
            value={new Date(application.dateOfBirth).toLocaleDateString()}
          />
          <InfoRow label="Current Address" value={application.currentAddress} />
          <InfoRow
            label="Previous Address"
            value={application.previousAddress || "N/A"}
          />
          <InfoRow
            label="Years at Current Address"
            value={application.yearsAtCurrentAddress}
          />
          <InfoRow label="Housing Status" value={application.housingStatus} />
          <InfoRow
            label="Housing Payment"
            value={`$${Number(application.housingPayment).toLocaleString()}`}
          />
          <InfoRow
            label="Canadian Status"
            value={application.residencyStatus}
          />
          <InfoRow label="Marital Status" value={application.maritalStatus} />
          <InfoRow label="Phone" value={application.personalPhone} />
          <InfoRow label="Email" value={application.personalEmail} />
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

export default PersonalDetails;
