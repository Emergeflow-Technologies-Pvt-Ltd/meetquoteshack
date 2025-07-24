import { NextResponse } from "next/server";
import type { GeneralLoanFormValues } from "@/app/(site)/loan-application/types";
import prisma from "@/lib/db";
import {
  ResidencyStatus,
  EmploymentStatus,
  HousingStatus,
  EducationLevel,
  Prisma,
  MaritalStatus,
} from "@prisma/client";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    const data = await validateRequestData(request);
    const user = await authenticateUser();
    validateRequiredFields(data);
    validateNumericFields(data);

    const formattedData: Prisma.ApplicationCreateInput = {
      user: {
        connect: {
          id: user.id,
        },
      },

      loanType: data.loanType,
      hasCoApplicant: data.hasCoApplicant,
      monthlyDebts: data.monthlyDebts,
      childCareBenefit: data.childCareBenefit,
      coApplicantFullName: data.coApplicantFullName || null,
      coApplicantDateOfBirth: data.coApplicantDateOfBirth || null,
      coApplicantPhone: data.coApplicantPhone || null,
      coApplicantAddress: data.coApplicantAddress || null,
      coApplicantEmail: data.coApplicantEmail || null,
      otherIncome: data.otherIncome,
      savings: data.savings,
      workplaceDuration: data.workplaceDuration,
      hasBankruptcy: data.hasBankruptcy,
      firstName: data.firstName,
      lastName: data.lastName,
      currentAddress: data.currentAddress,
      yearsAtCurrentAddress: data.yearsAtCurrentAddress,
      housingStatus: data.housingStatus as HousingStatus,
      housingPayment: data.housingPayment,
      residencyStatus: data.residencyStatus as ResidencyStatus,
      employmentStatus: data.employmentStatus as EmploymentStatus,
      grossIncome: data.grossIncome,
      workplaceName: data.workplaceName,
      workplaceAddress: data.workplaceAddress,
      workplacePhone: data.workplacePhone,
      workplaceEmail: data.workplaceEmail,
      generalEducationLevel: data.generalEducationLevel as EducationLevel,
      generalFieldOfStudy: data.generalFieldOfStudy,
      dateOfBirth: data.dateOfBirth,
      maritalStatus: data.maritalStatus as MaritalStatus,
      personalPhone: data.personalPhone,
      personalEmail: data.personalEmail,
      loanAmount: data.loanAmount,
    };
    return await createGeneralApplication(formattedData);
  } catch (error) {
    return handleError(error);
  }
}

async function validateRequestData(request: Request): Promise<GeneralLoanFormValues> {
  if (!request.body) {
    throw createErrorResponse(
      "Invalid request",
      { message: "Request body is missing" },
      400
    );
  }

  const data: GeneralLoanFormValues = await request.json();
  if (!data) {
    throw createErrorResponse(
      "Invalid request",
      { message: "Request data is missing" },
      400
    );
  }

  return data;
}

async function authenticateUser() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    throw createErrorResponse(
      "Unauthorized",
      { message: "User not authenticated" },
      401
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw createErrorResponse(
      "User not found",
      { message: "User account does not exist" },
      404
    );
  }

  return user;
}

function validateRequiredFields(data: GeneralLoanFormValues) {
  const requiredFields = [
    "firstName",
    "lastName",
    "currentAddress",
    "employmentStatus",
    "housingStatus",
    "residencyStatus",
    "workplaceName",
    "workplacePhone",
    "workplaceEmail",
    "dateOfBirth",
    "maritalStatus",
    "personalPhone",
    "personalEmail",
    "loanAmount"
  ] as const;

  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length) {
    throw createErrorResponse(
      "Missing required fields",
      {
        message: "The following required fields are missing",
        fields: missingFields,
        providedData: data,
      },
      400
    );
  }
}

function validateNumericFields(data: GeneralLoanFormValues) {
  const numericFields = [
    "yearsAtCurrentAddress",
    "housingPayment",
    "grossIncome",
    "loanAmount"
  ] as const;
  const invalidFields = numericFields.filter(
    (field) =>
      data[field] !== undefined &&
      (isNaN(Number(data[field])) || Number(data[field]) < 0)
  );

  if (invalidFields.length) {
    throw createErrorResponse(
      "Invalid numeric values",
      {
        message: "The following fields must be valid positive numbers",
        fields: invalidFields,
        providedValues: invalidFields.reduce(
          (acc, field) => ({
            ...acc,
            [field]: data[field],
          }),
          {}
        ),
      },
      400
    );
  }
}

async function createGeneralApplication(
  formattedData: Prisma.ApplicationCreateInput
) {
  try {
    const application = await prisma.application.create({
      data: formattedData,
    });
    return NextResponse.json(
      { message: "Success", id: application.id },
      { status: 201 }
    );
  } catch (dbError) {
    console.error("Database error:", dbError);
    throw createErrorResponse(
      "Database error",
      {
        message: "Failed to create general application",
        error: dbError instanceof Error ? dbError.message : "Unknown database error",
      },
      500
    );
  }
}

function createErrorResponse(
  title: string,
  error: { message: string;[key: string]: unknown; },
  status: number
) {
  return NextResponse.json(error, { status });
}

function handleError(error: unknown) {
  console.error("Error:", error);
  return createErrorResponse(
    "Internal Server Error",
    { message: "An unexpected error occurred" },
    500
  );
}
