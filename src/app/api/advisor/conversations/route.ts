import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all unique users who have messaged with the current user (agent)
    const messages = await prisma.advisorMessage.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    // Group messages by conversation partner
    const conversationMap = new Map()

    messages.forEach((message) => {
      const partnerId =
        message.senderId === session.user.id
          ? message.receiverId
          : message.senderId
      const partner =
        message.senderId === session.user.id ? message.receiver : message.sender

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          userId: partner.id,
          userName: partner.name,
          userEmail: partner.email,
          userRole: partner.role,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unreadCount: 0,
        })
      }
    })

    const conversations = Array.from(conversationMap.values()).sort(
      (a, b) =>
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
    )

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json(
      { error: "Error fetching conversations" },
      { status: 500 }
    )
  }
}
