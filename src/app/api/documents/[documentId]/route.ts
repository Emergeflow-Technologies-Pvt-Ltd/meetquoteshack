import { NextResponse } from "next/server";
import { getPresignedUrl } from "@/lib/upload";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    const document = await prisma.applicationDocument.findUnique({
      where: { id: documentId }
    });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!document.fileKey) {
      return NextResponse.json({ error: "No file associated with this document" }, { status: 404 });
    }

    
    const url = await getPresignedUrl(document.fileKey);

    return NextResponse.json({ url });

  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
