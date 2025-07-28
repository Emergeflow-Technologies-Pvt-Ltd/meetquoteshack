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
        status: { in: ["OPEN", "ASSIGNED_TO_LENDER", "IN_PROGRESS"] }
      },
      include: {
        documents: true
      }
    });


    const lenderList = await prisma.lender.findMany({
      select: {
        name: true,
        id: true
      }

    });

    if (!application) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json({ application, lenderList });

  } catch (error) {
    console.error("[APPLICATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; lenderId?: string; }>; }) {
  try {
    const session = await getServerSession(authOptions);
    const id = (await params).id;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileKey, fileUrl, docId, status, lenderId } = body;

    const application = await prisma.application.findUnique({
      where: {
        id: id,

      },
      include: {
        documents: true
      }
    });

    if (!application) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (status) {
      // Handle status update (admin only)
      const updatedApplication = await prisma.application.update({
        where: { id },
        data: {
          status,
          // Connect to particular lender based on userId
          lender: {
            connect: {
              id: lenderId
            }
          }
        }
      });
      return NextResponse.json(updatedApplication);

    } else {
      // Handle document update
      const updatedDoc = await prisma.document.update({
        where: {
          id: docId
        },
        data: {
          fileName,
          fileKey,
          fileUrl,
          status: "UPLOADED"
        }
      });
      return NextResponse.json({ message: "Document updated", document: updatedDoc });
    }

  } catch (error) {
    console.error("[APPLICATION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}