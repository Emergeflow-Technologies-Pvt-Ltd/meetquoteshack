import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, receiverId } = await req.json()

    if (!content || !receiverId) {
      return NextResponse.json(
        { error: "Missing content or receiverId" },
        { status: 400 }
      )
    }

    const message = await prisma.advisorMessage.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId,
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error creating advisor message:", error)
    return NextResponse.json(
      { error: "Error creating message" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const counterpartId = searchParams.get("counterpartId")

    if (!counterpartId) {
      return NextResponse.json(
        { error: "counterpartId is required" },
        { status: 400 }
      )
    }

    // Fetch messages where (sender is me AND receiver is counterpart) OR (sender is counterpart AND receiver is me)
    const messages = await prisma.advisorMessage.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: counterpartId },
          { senderId: counterpartId, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { role: true } },
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching advisor messages:", error)
    return NextResponse.json(
      { error: "Error fetching messages" },
      { status: 500 }
    )
  }
}
