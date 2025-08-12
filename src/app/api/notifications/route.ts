import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string; }>; }
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!id) {
            return new NextResponse("Missing user ID", { status: 400 });
        }

        // Optional: only allow users to fetch their own notifications
        if (id !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: id,
                read: false,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("[NOTIFICATIONS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
