"use client";

import { Message, UserRole } from "@prisma/client";
import { useState, useRef, useEffect } from "react";

interface MessagesProps {
  messages: Message[];
  applicationId: string;
}

export function Messages({ messages, applicationId }: MessagesProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          applicationId,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-lg my-4 py-4">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderRole === UserRole.LOANEE ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderRole === UserRole.LOANEE
                  ? "bg-gray-200"
                  : "bg-blue-500 text-white"
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {message.senderRole.toLowerCase()}
              </div>
              <p className="text-sm">{message.content}</p>
              <div className="text-xs opacity-70 mt-1">
                {new Date(message.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}