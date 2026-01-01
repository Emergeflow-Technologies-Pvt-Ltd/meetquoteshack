import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoanStatus } from "@prisma/client";

//Application moves: ASSIGNED_TO_LENDER → IN_PROGRESS
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log("Unauthorized - no user in session");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const {
      status: newStatus,
      lenderId,
    }: { status?: LoanStatus; lenderId?: string } = await request.json();

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return new NextResponse("Application not found", { status: 404 });
    }

    // Use provided status or default to IN_PROGRESS
    const finalStatus = newStatus || LoanStatus.IN_PROGRESS;

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: finalStatus,
        lender: lenderId
          ? {
              connect: { userId: lenderId },
            }
          : undefined,
      },
    });

    // Log status change in history
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: id,
        oldStatus: application.status,
        newStatus: finalStatus,
        changedById: session.user.id,
      },
    });

    return NextResponse.json({
      message: `Application status updated to ${finalStatus}`,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("[LENDER_ACCEPT_APPLICATION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
