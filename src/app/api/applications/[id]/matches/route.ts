import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const id = (await params).id

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const application = await prisma.application.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!application) {
      return new NextResponse("Not found", { status: 404 })
    }

    // Check permissions: Owner or Admin
    if (application.userId !== user.id && user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await request.json()
    const { matchLenderIds } = body

    if (!Array.isArray(matchLenderIds)) {
      return new NextResponse("Invalid payload", { status: 400 })
    }

    // Update matches in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get existing matches (Admin's shortlist)
      const existingMatches = await tx.matchLendertoLoanee.findMany({
        where: { applicationId: id },
        select: { lenderId: true },
      })

      const existingLenderIds = existingMatches.map((m) => m.lenderId)

      // 2. Filter incoming IDs to ensure they are in the shortlist
      const validLenderIds = matchLenderIds.filter((lid) =>
        existingLenderIds.includes(lid)
      )

      // 3. Mark selected as shortlisted
      if (validLenderIds.length > 0) {
        await tx.matchLendertoLoanee.updateMany({
          where: {
            applicationId: id,
            lenderId: { in: validLenderIds },
          },
          data: { loaneeShortlisted: true },
        })
      }

      // 4. Mark unselected as NOT shortlisted
      const unselectedLenderIds = existingLenderIds.filter(
        (lid) => !validLenderIds.includes(lid)
      )

      if (unselectedLenderIds.length > 0) {
        await tx.matchLendertoLoanee.updateMany({
          where: {
            applicationId: id,
            lenderId: { in: unselectedLenderIds },
          },
          data: { loaneeShortlisted: false },
        })

        await tx.potentialLender.deleteMany({
          where: {
            applicationId: id,
            lenderId: { in: unselectedLenderIds },
          },
        })
      }

      // 5. Sync SELECTED to PotentialLenders
      if (validLenderIds.length > 0) {
        const existingPotentials = await tx.potentialLender.findMany({
          where: {
            applicationId: id,
            lenderId: { in: validLenderIds },
          },
          select: { lenderId: true },
        })
        const existingPotentialIds = existingPotentials.map((p) => p.lenderId)

        const newPotentialIds = validLenderIds.filter(
          (lid) => !existingPotentialIds.includes(lid)
        )

        if (newPotentialIds.length > 0) {
          await tx.potentialLender.createMany({
            data: newPotentialIds.map((lenderId) => ({
              applicationId: id,
              lenderId,
            })),
          })
        }
      }

      // 6. Return updated selections
      const updatedMatches = await tx.matchLendertoLoanee.findMany({
        where: {
          applicationId: id,
          loaneeShortlisted: true,
        },
        select: { lenderId: true },
      })
      return updatedMatches.map((m) => m.lenderId)
    })

    return NextResponse.json({ matchLenderIds: result })
  } catch (error) {
    console.error("[APPLICATION_MATCHES_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
