"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdvisorMessage, UserRole } from "@prisma/client"

interface ChatWindowProps {
  selectedUser: {
    userId: string
    userName: string
    userEmail: string
  } | null
  currentUserId: string
  initialMessages: (AdvisorMessage & { sender: { role: UserRole } })[]
}

export default function ChatWindow({
  selectedUser,
  currentUserId,
  initialMessages,
}: ChatWindowProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Poll for new messages
  useEffect(() => {
    if (!selectedUser) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/advisor/messages?counterpartId=${selectedUser.userId}`
        )
        if (res.ok) {
          const latestMessages = await res.json()
          setMessages(latestMessages)
        }
      } catch (err) {
        console.error("Polling error", err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedUser])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading || !selectedUser) return

    setLoading(true)
    try {
      const response = await fetch("/api/advisor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedUser.userId,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")
      setNewMessage("")

      // Refresh immediately
      const res = await fetch(
        `/api/advisor/messages?counterpartId=${selectedUser.userId}`
      )
      if (res.ok) {
        const latestMessages = await res.json()
        setMessages(latestMessages)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!selectedUser) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-white p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-200 text-sm font-semibold text-purple-700">
          {getInitials(selectedUser.userName)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            {selectedUser.userName}
          </h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="mt-10 text-center text-sm text-gray-500">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((message, index) => {
            const isMe = message.senderId === currentUserId
            const showDateSeparator =
              index === 0 ||
              new Date(messages[index - 1].createdAt).toDateString() !==
                new Date(message.createdAt).toDateString()

            return (
              <div key={message.id}>
                {/* Date separator */}
                {showDateSeparator && (
                  <div className="mb-4 mt-2 text-center text-xs text-gray-400">
                    {new Date(message.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                )}

                <div
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isMe
                        ? "bg-white text-gray-800 border"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {!isMe && (
                      <div className="mb-1 text-xs text-gray-500">
                        ~ {selectedUser.userName}
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div
                      className={`mt-1 text-xs ${isMe ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t bg-white p-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            disabled={loading}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}
