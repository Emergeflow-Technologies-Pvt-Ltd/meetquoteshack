import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, applicationId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const application = await prisma.mortgageApplication.findUnique({
      where: { id: applicationId },
      select: { userId: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const isOwner = application.userId === session.user.id;
    const isAdminOrLender = user.role === "ADMIN" || user.role === "LENDER";

    if (!isOwner && !isAdminOrLender) {
      return NextResponse.json(
        { error: "Not authorized to send messages for this application" },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        senderRole: user.role,
        applicationId,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Error creating message" },
      { status: 500 }
    );
  }
}