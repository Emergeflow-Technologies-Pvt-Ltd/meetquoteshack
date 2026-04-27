import { NextResponse } from "next/server"
import { DocumentType, UserRole } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { sendDocumentRequestEmail } from "../../../../../lib/mail.controller" // ✅ fixed path

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id

  try {
    const session = await getServerSession(authOptions)

    if (
      session?.user?.role !== UserRole.ADMIN &&
      session?.user?.role !== UserRole.LENDER
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentTypes } = (await request.json()) || {}

    if (
      !Array.isArray(documentTypes) ||
      !documentTypes.every((type) => Object.values(DocumentType).includes(type))
    ) {
      return NextResponse.json(
        { error: "Invalid document types" },
        { status: 400 }
      )
    }

    // ✅ FIXED: only include (no select)
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      )
    }

    // ✅ Create documents + notification
    const newDocuments = await prisma.$transaction([
      ...documentTypes.map((documentType) =>
        prisma.document.create({
          data: {
            applicationId: id,
            documentType,
          },
        })
      ),

      prisma.notification.create({
        data: {
          userId: application.userId,
          applicationId: application.id,
          type: "DOCUMENT_REQUEST",
        },
      }),
    ])

    // ✅ SEND EMAIL (THIS WAS MISSING)
    if (application.user?.email) {
      await sendDocumentRequestEmail({
        to: application.user.email,
        name: application.user.name || "User",
        applicationId: application.id,
        documents: documentTypes.map((type) => type.toString()),
      })
    }

    const createdDocuments = newDocuments.slice(0, documentTypes.length)

    return NextResponse.json(createdDocuments)
  } catch (error) {
    console.error("Failed to create document requirements:", error)
    return NextResponse.json(
      { error: "Failed to create document requirements" },
      { status: 500 }
    )
  }
}
