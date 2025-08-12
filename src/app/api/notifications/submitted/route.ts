// app/api/notifications/document-submitted/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { applicationId, lenderUserId } = await req.json();

        if (!applicationId || !lenderUserId) {
            return NextResponse.json(
                { error: "Missing applicationId or lenderUserId" },
                { status: 400 }
            );
        }

        // Mark previous DOCUMENT_REQUEST notifications for this application as read
        await prisma.notification.updateMany({
            where: {
                applicationId,
                type: "DOCUMENT_REQUEST",
                read: false,
            },
            data: { read: true },
        });

        // Create a new DOCUMENT_SUBMITTED notification for the lender
        const notification = await prisma.notification.create({
            data: {
                userId: lenderUserId,  // <-- use lenderUserId here
                applicationId,
                type: "DOCUMENT_SUBMITTED",
                read: false,
            },
        });

        return NextResponse.json(notification, { status: 201 });
    } catch (error) {
        console.error("Error creating document submitted notification:", error);
        return NextResponse.json(
            { error: "Error creating notification" },
            { status: 500 }
        );
    }
}

