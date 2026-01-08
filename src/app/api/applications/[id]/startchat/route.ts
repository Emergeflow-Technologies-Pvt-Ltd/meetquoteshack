import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { LoanStatus, UserRole } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const id = (await params).id;

    // Check authentication
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is lender
    if (session.user.role !== UserRole.LENDER) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Get old status before update
    const application = await prisma.application.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!application) {
      return new NextResponse("Application not found", { status: 404 });
    }

    // Update the status to IN_CHAT
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: LoanStatus.IN_CHAT,
      },
    });

    // Log status change in ApplicationStatusHistory
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: id,
        oldStatus: application.status,
        newStatus: LoanStatus.IN_CHAT,
        changedById: session.user.id,
      },
    });

    return NextResponse.json({
      message: "Application moved to IN_CHAT successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("[APPLICATION_IN_CHAT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
