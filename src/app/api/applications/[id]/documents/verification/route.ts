import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { DocumentType, DocumentStatus } from "@prisma/client"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { fileName, fileKey, fileType, documentType } = body

    if (!fileName || !fileKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create verification document record
    const document = await prisma.document.create({
      data: {
        applicationId: id,
        documentType: documentType || DocumentType.VERIFICATION_RECORD,
        fileName,
        fileKey,
        fileType,
        status: DocumentStatus.UPLOADED,
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Error creating verification document:", error)
    return NextResponse.json(
      { error: "Failed to create verification document" },
      { status: 500 }
    )
  }
}
