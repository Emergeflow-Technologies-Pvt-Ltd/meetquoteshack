import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { LoanStatus } from "@prisma/client"
import { sendApplicationStatusEmailRejected } from "../../../../../../lib/mail.controller"

function getStatusLabel(status: LoanStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return "Accepted by lender"
    case "APPROVED":
      return "Approved 🎉"
    case "REJECTED":
      return "Rejected"
    case "IN_CHAT":
      return "In chat with lender"
    case "OPEN":
      return "Application is reopened"
    default:
      return status
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      console.log("Unauthorized - no user in session")
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!application) {
      return new NextResponse("Application not found", { status: 404 })
    }

    // Use provided status or default to IN_PROGRESS
    const finalStatus = LoanStatus.OPEN

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: finalStatus,
        lender: {
          // remove existing lender if status is OPEN and lenderId is not provided
          disconnect: true,
        },
      },
    })

    // Log status change in history
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: id,
        oldStatus: application.status,
        newStatus: finalStatus,
        changedById: session.user.id,
      },
    })

    try {
      await sendApplicationStatusEmailRejected({
        to: application.user.email!,
        name: application.user.name || "User",
        status: getStatusLabel(finalStatus), // cleaner label
      })
    } catch (err) {
      console.error("Email failed:", err)
    }

    return NextResponse.json({
      message: `Application status updated to ${finalStatus}`,
      application: updatedApplication,
    })
  } catch (error) {
    console.error("[LENDER_ACCEPT_APPLICATION_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
