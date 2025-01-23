import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
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
        userId: session.user.id
      },
      include: {
        documents: true
      }
    });

    if (!application) {
      return new NextResponse("Not found", { status: 404 }); 
    }

    return NextResponse.json(application);

  } catch (error) {
    console.error("[APPLICATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    const id = (await params).id;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileKey, fileUrl, docId, status } = body;

    const application = await prisma.application.findUnique({
      where: {
        id: id,
        userId: status ? undefined : session.user.id // Allow admin to update status
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
        data: { status }
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