import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface LoaneeChatProps {
  application: any;
  applicationId: string;
  messages: any[];
  setMessages: (msgs: any[]) => void;
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
      setMessages([...messages, res.data]);
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
    <div className="lg:w-1/3 bg-white rounded-lg shadow-md flex flex-col">
      <div className="p-4 border-b font-semibold text-gray-700">
        Chat with Lender
      </div>

      <div className="flex-1 p-4 overflow-y-auto text-gray-600">
        <div className="space-y-2">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet...</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-md max-w-[80%] ${
                  msg.senderRole === "LOANEE"
                    ? "bg-blue-100 ml-auto text-right"
                    : "bg-purple-100 mr-auto text-left"
                }`}
              >
                <p className="text-sm font-medium">{msg.content}</p>
                <span className="block text-xs text-gray-500 mt-1">
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

      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-md px-3 py-2 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="default"
          disabled={sending || !message.trim()}
          onClick={handleSendMessage}
        >
          {sending ? "..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default LoaneeChat;
