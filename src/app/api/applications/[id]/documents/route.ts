import { NextResponse } from "next/server";
import { DocumentType, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentTypes } = await request.json() || {};
    if (!Array.isArray(documentTypes) || !documentTypes.every((type) => Object.values(DocumentType).includes(type))) {
      return NextResponse.json({ error: "Invalid document types" }, { status: 400 });
    }

    const newDocuments = await prisma.$transaction(
      documentTypes.map((documentType) =>
        prisma.document.create({
          data: {
            application: { connect: { id } },
            documentType,
          },
        })
      )
    );

    return NextResponse.json(newDocuments);
  } catch (error) {
    console.error("Failed to create document requirements:", error);
    return NextResponse.json(
      { error: "Failed to create document requirements" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const applicationId = (await params).id;
  const { documentId } = await request.json();

  try {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        applicationId: applicationId
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found or does not belong to this application" },
        { status: 404 }
      );
    }

    if (document.fileKey) {
      return NextResponse.json(
        { error: "Cannot delete document with uploaded file" },
        { status: 400 }
      );
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ message: "Document deleted" });
  } catch (error) {
    console.error("Failed to delete document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}