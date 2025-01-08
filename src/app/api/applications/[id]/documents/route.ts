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
        prisma.applicationDocument.create({
          data: {
            mortgageApplication: { connect: { id } },
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