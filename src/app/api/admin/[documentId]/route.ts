import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) => {
  try {
    const { documentId } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists and has admin role
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    try {
      const document = await prisma.document.update({
        where: { id: documentId },
        data: {
          status,
        },
      });

      return NextResponse.json(document);
    } catch (error) {
      console.error("Error updating document status:", error);
      return NextResponse.json(
        { error: "Failed to update document status" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
