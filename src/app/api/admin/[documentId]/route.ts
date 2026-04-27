import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import {
  sendDocumentRejectedEmail,
  sendDocumentApprovedEmail,
} from "../../../../lib/mail.controller"

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) => {
  try {
    const { documentId } = await params
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ✅ Check admin
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: { role: true },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    // ✅ Get document with user info BEFORE update
    const docWithUser = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        application: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!docWithUser) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // ✅ Update document
    // ✅ Update document
    const document = await prisma.document.update({
      where: { id: documentId },
      data: { status },
    })

    // ✅ Avoid duplicate emails if status didn’t change
    if (docWithUser.status !== status && docWithUser.application.user?.email) {
      try {
        const email = docWithUser.application.user.email
        const name = docWithUser.application.user.name || "User"

        // ✅ Better readable name
        const documentName = docWithUser.documentType.replaceAll("_", " ")

        if (status === "REJECTED") {
          await sendDocumentRejectedEmail({
            to: email,
            name,
            documentName,
            applicationId: docWithUser.application.id,
          })
        }

        if (status === "APPROVED") {
          await sendDocumentApprovedEmail({
            to: email,
            name,
            documentName,
            applicationId: docWithUser.application.id,
          })
        }
      } catch (err) {
        console.error("Email failed:", err)
      }
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
