import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { z } from "zod"
import { quickPrequalSchema } from "@/components/shared/quick-prequal/types"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { result, values } = body

    // Validate values against schema
    const validatedValues = quickPrequalSchema.parse(values)

    // Upsert the prequal result
    const prequalResult = await prisma.prequalResult.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        // Input Values
        loanType: validatedValues.loanType,
        loanAmount: validatedValues.loanAmount,
        grossIncome: validatedValues.grossIncome,
        workplaceDuration: validatedValues.workplaceDuration,
        creditScore: validatedValues.creditScore,
        monthlyDebts: validatedValues.monthlyDebts,
        heatingCosts: validatedValues.heatingCosts || 0,
        savings: validatedValues.savings,
        estimatedPropertyValue: validatedValues.estimatedPropertyValue,
        currentMortgageBalance: validatedValues.currentMortgageBalance,
        monthlyMortgagePayment: validatedValues.monthlyMortgagePayment,
        propertyTaxMonthly: validatedValues.propertyTaxMonthly,
        condoFees: validatedValues.condoFees,

        // Calculated Results
        prequalStatus: result.prequalStatus,
        prequalLabel: result.prequalLabel,
        statusDetail: result.statusDetail,
        frontEndDTI: result.frontEndDTI,
        backEndDTI: result.backEndDTI,
        gds: result.gds,
        tds: result.tds,
        tdsr: result.tdsr,
        lti: result.lti,
        ltv: result.ltv,
        isRefinance: result.isRefinance,
        isMortgageLike: result.isMortgageLike,
        maxRefinanceAmount: result.maxRefinanceAmount,
        availableRefinanceCash: result.availableRefinanceCash,
        eligibleMaxPayment: result.eligibleMaxPayment,
        creditTier: result.creditTier,
      },
      create: {
        userId: session.user.id,
        // Input Values
        loanType: validatedValues.loanType,
        loanAmount: validatedValues.loanAmount,
        grossIncome: validatedValues.grossIncome,
        workplaceDuration: validatedValues.workplaceDuration,
        creditScore: validatedValues.creditScore,
        monthlyDebts: validatedValues.monthlyDebts,
        heatingCosts: validatedValues.heatingCosts || 0,
        savings: validatedValues.savings,
        estimatedPropertyValue: validatedValues.estimatedPropertyValue,
        currentMortgageBalance: validatedValues.currentMortgageBalance,
        monthlyMortgagePayment: validatedValues.monthlyMortgagePayment,
        propertyTaxMonthly: validatedValues.propertyTaxMonthly,
        condoFees: validatedValues.condoFees,

        // Calculated Results
        prequalStatus: result.prequalStatus,
        prequalLabel: result.prequalLabel,
        statusDetail: result.statusDetail,
        frontEndDTI: result.frontEndDTI,
        backEndDTI: result.backEndDTI,
        gds: result.gds,
        tds: result.tds,
        tdsr: result.tdsr,
        lti: result.lti,
        ltv: result.ltv,
        isRefinance: result.isRefinance,
        isMortgageLike: result.isMortgageLike,
        maxRefinanceAmount: result.maxRefinanceAmount,
        availableRefinanceCash: result.availableRefinanceCash,
        eligibleMaxPayment: result.eligibleMaxPayment,
        creditTier: result.creditTier,
      },
    })

    return NextResponse.json(prequalResult)
  } catch (error) {
    console.error("[PREQUAL_POST]", error)
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 })
    }
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const prequalResult = await prisma.prequalResult.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json(prequalResult)
  } catch (error) {
    console.error("[PREQUAL_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
