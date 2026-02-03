import { NextResponse } from "next/server"
import type { GeneralLoanFormValues } from "@/app/(site)/loanee/loan-application/types"
import prisma from "@/lib/db"
import {
  ResidencyStatus,
  EmploymentStatus,
  HousingStatus,
  EducationLevel,
  Prisma,
  MaritalStatus,
  PrequalStatus,
  CreditTier,
} from "@prisma/client"
import { getServerSession } from "next-auth"
import { computePrequalification } from "@/lib/prequal"

export async function POST(request: Request) {
  try {
    const data = await validateRequestData(request)
    const user = await authenticateUser()
    validateRequiredFields(data)
    validateNumericFields(data)

    // 1) resolve agent from agentCode
    let agentConnect: Prisma.AgentWhereUniqueInput | undefined
    if (data.agentCode && data.agentCode.trim() !== "") {
      const agent = await prisma.agent.findUnique({
        where: { agentCode: data.agentCode.trim() },
      })

      if (agent) {
        agentConnect = { id: agent.id }
      }
    }

    // 2) prequal
    const prequal = computePrequalification({
      loanAmount: Number(data.loanAmount ?? 0),
      creditScore: Number(data.creditScore ?? 0),
      grossIncome: Number(data.grossIncome ?? 0),
      monthlyDebts: Number(data.monthlyDebts ?? 0),
      estimatedPropertyValue: Number(data.estimatedPropertyValue ?? 0),
      workplaceDuration: Number(data.workplaceDuration ?? 0),
      loanType: data.loanType,
      // Add refinance-specific fields
      currentMortgageBalance: data.currentMortgageBalance
        ? Number(data.currentMortgageBalance)
        : undefined,
      monthlyMortgagePayment: data.monthlyMortgagePayment
        ? Number(data.monthlyMortgagePayment)
        : undefined,
      propertyTaxMonthly: data.propertyTaxMonthly
        ? Number(data.propertyTaxMonthly)
        : undefined,
      heatingCostMonthly: data.heatingCosts
        ? Number(data.heatingCosts)
        : undefined,
      condoFeesMonthly: data.condoFees ? Number(data.condoFees) : undefined,
    })

    const formattedData: Prisma.ApplicationCreateInput = {
      user: {
        connect: {
          id: user.id,
        },
      },

      agentCode:
        data.agentCode && data.agentCode.trim() !== ""
          ? data.agentCode.trim()
          : null,

      ...(agentConnect && {
        agent: {
          connect: agentConnect,
        },
      }),

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
      otherIncomeAmount: data.otherIncomeAmount || null,
      estimatedPropertyValue: data.estimatedPropertyValue
        ? data.estimatedPropertyValue.toString()
        : null,
      houseType: data.houseType || null,
      downPayment: data.downPayment || null,
      vehicleType: data.vehicleType || null,
      tradeInCurrentVehicle: data.tradeInCurrentVehicle || null,
      savings: data.savings,
      sin: data.sin || null,
      workplaceDuration: data.workplaceDuration,
      hasBankruptcy: data.hasBankruptcy,
      firstName: data.firstName,
      lastName: data.lastName,
      currentAddress: data.currentAddress,
      yearsAtCurrentAddress: data.yearsAtCurrentAddress,
      housingStatus: data.housingStatus as HousingStatus,
      housingPayment: Number(data.housingPayment ?? 0),
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
      creditScore: data.creditScore,

      // 4) Store prequalification snapshot
      prequalStatus: prequal.prequalStatus as PrequalStatus,
      prequalLabel: prequal.prequalLabel,
      prequalCreditTier: prequal.creditTier.toUpperCase() as CreditTier,

      prequalDti: prequal.dti,
      prequalTdsr: prequal.tdsr,
      prequalLti: prequal.lti,
      prequalLtv: prequal.ltv,

      prequalPayment: prequal.proposedLoanPayment,
      prequalRoomMonthly: prequal.availableForNewLoanMonthly,
      prequalMortMin: prequal.mortgageRangeMin,
      prequalMortMax: prequal.mortgageRangeMax,

      prequalExplanation: prequal.statusDetail,
      prequalSnapshot: prequal,
    }

    return await createGeneralApplication(formattedData)
  } catch (error) {
    return handleError(error)
  }
}

async function validateRequestData(
  request: Request
): Promise<GeneralLoanFormValues> {
  if (!request.body) {
    throw createErrorResponse(
      "Invalid request",
      { message: "Request body is missing" },
      400
    )
  }

  const data: GeneralLoanFormValues = await request.json()
  if (!data) {
    throw createErrorResponse(
      "Invalid request",
      { message: "Request data is missing" },
      400
    )
  }

  return data
}

async function authenticateUser() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    throw createErrorResponse(
      "Unauthorized",
      { message: "User not authenticated" },
      401
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw createErrorResponse(
      "User not found",
      { message: "User account does not exist" },
      404
    )
  }

  return user
}

function validateRequiredFields(data: GeneralLoanFormValues) {
  const requiredFields = [
    "firstName",
    "lastName",
    "currentAddress",
    "employmentStatus",
    "housingStatus",
    "housingPayment",
    "residencyStatus",
    "workplaceName",
    "workplacePhone",
    "workplaceEmail",
    "dateOfBirth",
    "maritalStatus",
    "personalPhone",
    "personalEmail",
    "loanAmount",
  ] as const

  const missingFields = requiredFields.filter((field) => !data[field])
  if (missingFields.length) {
    throw createErrorResponse(
      "Missing required fields",
      {
        message: "The following required fields are missing",
        fields: missingFields,
        providedData: data,
      },
      400
    )
  }
}

function validateNumericFields(data: GeneralLoanFormValues) {
  const numericFields = [
    "yearsAtCurrentAddress",
    "housingPayment",
    "grossIncome",
    "loanAmount",
  ] as const
  const invalidFields = numericFields.filter(
    (field) =>
      data[field] !== undefined &&
      (isNaN(Number(data[field])) || Number(data[field]) < 0)
  )

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
    )
  }
}

async function createGeneralApplication(
  formattedData: Prisma.ApplicationCreateInput
) {
  try {
    const application = await prisma.application.create({
      data: formattedData,
    })
    return NextResponse.json(
      { message: "Success", id: application.id },
      { status: 201 }
    )
  } catch (dbError) {
    console.error("Database error:", dbError)
    throw createErrorResponse(
      "Database error",
      {
        message: "Failed to create general application",
        error:
          dbError instanceof Error ? dbError.message : "Unknown database error",
      },
      500
    )
  }
}

function createErrorResponse(
  title: string,
  error: { message: string; [key: string]: unknown },
  status: number
) {
  return NextResponse.json(error, { status })
}

function handleError(error: unknown) {
  console.error("Error:", error)
  return createErrorResponse(
    "Internal Server Error",
    { message: "An unexpected error occurred" },
    500
  )
}
