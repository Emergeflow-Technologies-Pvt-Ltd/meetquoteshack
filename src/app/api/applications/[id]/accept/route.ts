import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoanStatus } from "@prisma/client";

export async function PATCH(request: Request, { params }: { params: { id: string; }; }) {
    try {


        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            console.log("Unauthorized - no user in session");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;

        const application = await prisma.application.findUnique({
            where: { id },
        });

        if (!application) {

            return new NextResponse("Application not found", { status: 404 });
        }

        const updatedApplication = await prisma.application.update({
            where: { id },
            data: {
                status: LoanStatus.IN_PROGRESS,
                lender: {
                    connect: { userId: session.user.id },
                },
            },
        });

        return NextResponse.json({
            message: "Application accepted successfully",
            application: updatedApplication,
        });
    } catch (error) {
        console.error("[LENDER_ACCEPT_APPLICATION_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

