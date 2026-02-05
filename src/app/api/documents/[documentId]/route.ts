import { NextResponse } from "next/server"
import { getPresignedUrl } from "@/lib/upload"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    })
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    if (!document.fileKey) {
      return NextResponse.json(
        { error: "No file associated with this document" },
        { status: 404 }
      )
    }

    const url = await getPresignedUrl(document.fileKey)

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentId } = await params
    // Find the document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        application: true,
      },
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check if user is admin or owns the application
    const isAdmin = session.user.role === "ADMIN"
    const isOwner = document.application?.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        {
          error:
            "Forbidden - you don't have permission to delete this document",
        },
        { status: 403 }
      )
    }

    // Delete the document
    await prisma.document.delete({
      where: { id: documentId },
    })
    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
