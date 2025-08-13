import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; }>; }
) {
  try {
    const session = await getServerSession(authOptions);
    const id = (await params).id;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!id) {
      return new NextResponse("Missing application ID", { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: {
        id: id,
        status: { in: ["OPEN", "ASSIGNED_TO_LENDER", "IN_PROGRESS", "IN_CHAT", "REJECTED", "APPROVED"] },
      },
      include: {
        documents: true,
        messages: true,
        lender: {
          include: {
            user: {
              select: {
                id: true
              }
            }
          }
        },
        ApplicationStatusHistory: {
          orderBy: { changedAt: "desc" },
          include: {
            changedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const lenderList = await prisma.lender.findMany({
      select: {
        name: true,
        id: true,
      },
    });

    if (!application) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Destructure ApplicationStatusHistory and remap to applicationStatusHistory
    const { ApplicationStatusHistory, ...rest } = application;

    return NextResponse.json({
      application: {
        ...rest,
        applicationStatusHistory: ApplicationStatusHistory,
      },
      lenderList,
    });
  } catch (error) {
    console.error("[APPLICATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; lenderId?: string; }>; }
) {
  try {
    const session = await getServerSession(authOptions);
    const id = (await params).id;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileKey, fileUrl, docId, status, lenderId } = body;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!application) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (status) {
      // Update application status
      const updatedApplication = await prisma.application.update({
        where: { id },
        data: {
          status,
          lender: lenderId
            ? {
              connect: { id: lenderId },
            }
            : undefined,
        },
      });

      // Log status change in history table
      await prisma.applicationStatusHistory.create({
        data: {
          applicationId: id,
          oldStatus: application.status, // from before update
          newStatus: status,
          changedById: session.user.id, // who made the change
        },
      });

      return NextResponse.json(updatedApplication);
    } else {
      // Handle document update
      const updatedDoc = await prisma.document.update({
        where: { id: docId },
        data: {
          fileName,
          fileKey,
          fileUrl,
          status: "UPLOADED",
        },
      });

      return NextResponse.json({
        message: "Document updated",
        document: updatedDoc,
      });
    }
  } catch (error) {
    console.error("[APPLICATION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
