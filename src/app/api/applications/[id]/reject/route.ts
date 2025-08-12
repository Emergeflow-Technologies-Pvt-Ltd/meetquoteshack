import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { LoanStatus, UserRole } from "@prisma/client";


export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string; }>; }
) {
    try {
        const session = await getServerSession(authOptions);
        const id = (await params).id;

        // Check authentication
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if user is admin
        if (session.user.role !== UserRole.ADMIN) {
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

        // Update the status to REJECTED
        const updatedApplication = await prisma.application.update({
            where: { id },
            data: {
                status: LoanStatus.REJECTED,
            },
        });

        // Log status change
        await prisma.applicationStatusHistory.create({
            data: {
                applicationId: id,
                oldStatus: application.status,
                newStatus: LoanStatus.REJECTED,
                changedById: session.user.id,
            },
        });

        return NextResponse.json({
            message: "Application rejected successfully",
            application: updatedApplication,
        });
    } catch (error) {
        console.error("[APPLICATION_REJECT_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

