"use client"

import { useState, useEffect } from "react"
import ChatList from "@/components/agent/ChatList"
import ChatWindow from "@/components/agent/ChatWindow"
import { AdvisorMessage, UserRole } from "@prisma/client"

interface AgentChatPageProps {
  currentUserId: string
}

interface Conversation {
  userId: string
  userName: string
  userEmail: string
  userRole: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function AgentChatPage({ currentUserId }: AgentChatPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<
    (AdvisorMessage & { sender: { role: UserRole } })[]
  >([])

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/advisor/conversations")
        if (res.ok) {
          const data = await res.json()
          setConversations(data)
        }
      } catch (error) {
        console.error("Error fetching conversations:", error)
      }
    }

    fetchConversations()

    // Poll for new conversations
    const interval = setInterval(fetchConversations, 10000)
    return () => clearInterval(interval)
  }, [])

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUserId) {
        setMessages([])
        return
      }

      try {
        const res = await fetch(
          `/api/advisor/messages?counterpartId=${selectedUserId}`
        )
        if (res.ok) {
          const data = await res.json()
          setMessages(data)
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()
  }, [selectedUserId])

  const selectedUser = conversations.find((c) => c.userId === selectedUserId)

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="w-full max-w-sm">
        <ChatList
          conversations={conversations}
          selectedUserId={selectedUserId}
          onSelectConversation={setSelectedUserId}
        />
      </div>
      <div className="flex-1">
        <ChatWindow
          selectedUser={
            selectedUser
              ? {
                  userId: selectedUser.userId,
                  userName: selectedUser.userName,
                  userEmail: selectedUser.userEmail,
                }
              : null
          }
          currentUserId={currentUserId}
          initialMessages={messages}
        />
      </div>
    </div>
  )
}
