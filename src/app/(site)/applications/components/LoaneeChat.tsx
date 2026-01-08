"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Message, Application } from "@prisma/client";

interface LoaneeChatProps {
  application: Application | null;
  applicationId: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const LoaneeChat: React.FC<LoaneeChatProps> = ({
  applicationId,
  messages,
  setMessages,
}) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      setSending(true);
      const res = await axios.post("/api/messages", {
        content: message,
        applicationId,
      });
      setMessages((prev) => [...prev, res.data]);
      setMessage("");
      toast({ title: "Message Sent" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col rounded-lg bg-white shadow-md lg:w-1/3">
      <div className="border-b p-4 font-semibold text-gray-700">
        Chat with Lender
      </div>

      <div className="flex-1 overflow-y-auto p-4 text-gray-600">
        <div className="space-y-2">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet...</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] rounded-md p-2 ${
                  msg.senderRole === "LOANEE"
                    ? "ml-auto bg-blue-100 text-right"
                    : "mr-auto bg-purple-100 text-left"
                }`}
              >
                <p className="text-sm font-medium">{msg.content}</p>
                <span className="mt-1 block text-xs text-gray-500">
                  {msg.senderRole} •{" "}
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!sending && message.trim()) {
            handleSendMessage();
          }
        }}
        className="flex gap-2 border-t p-4"
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded-md border px-3 py-2 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!sending && message.trim()) {
                handleSendMessage();
              }
            }
          }}
        />
        <Button
          type="submit"
          variant="default"
          disabled={sending || !message.trim()}
        >
          {sending ? "..." : "Send"}
        </Button>
      </form>
    </div>
  );
};

export default LoaneeChat;
