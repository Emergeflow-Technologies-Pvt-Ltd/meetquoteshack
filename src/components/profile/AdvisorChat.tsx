"use client"

import { AdvisorMessage, UserRole } from "@prisma/client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface AdvisorChatProps {
  messages: (AdvisorMessage & { sender: { role: UserRole } })[]
  counterpartId: string
  currentUserId: string
}

export default function AdvisorChat({
  messages: initialMessages,
  counterpartId,
  currentUserId,
}: AdvisorChatProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Poll for new messages (simple implementation)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/advisor/messages?counterpartId=${counterpartId}`
        )
        if (res.ok) {
          const latestMessages = await res.json()
          // Ideally check for diffs, but replacing is fine for small chat
          setMessages(latestMessages)
        }
      } catch (err) {
        console.error("Polling error", err)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [counterpartId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return

    setLoading(true)
    try {
      const response = await fetch("/api/advisor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          receiverId: counterpartId,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")
      setNewMessage("")

      // Refresh immediately
      const res = await fetch(
        `/api/advisor/messages?counterpartId=${counterpartId}`
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

  return (
    <div className="flex h-full flex-col rounded-lg border bg-gray-50 shadow-sm">
      <div className="border-b bg-white p-4 font-semibold text-gray-700">
        Chat with Advisor
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => {
          const isMe = message.senderId === currentUserId
          return (
            <div
              key={message.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "border bg-white text-gray-800"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div
                  className={`mt-1 text-xs ${isMe ? "text-blue-200" : "text-gray-400"}`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          )
        })}
        {messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-gray-500">
            Start the conversation...
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t bg-white p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            disabled={loading}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}
