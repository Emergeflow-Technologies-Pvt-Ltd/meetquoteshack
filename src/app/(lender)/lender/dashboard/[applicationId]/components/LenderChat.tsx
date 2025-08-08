import React, { useState } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LenderChatProps {
  application: any;
  setApplication: (app: any) => void;
  applicationId: string;
  messages: any[];
  setMessages: (msgs: any[]) => void;
  missingDocumentTypes: string[];
  documentTypeLabels: Record<string, string>;
  LoanStatus: { IN_PROGRESS: string; IN_CHAT: string };
}

const LenderChat: React.FC<LenderChatProps> = ({
  application,
  setApplication,
  applicationId,
  messages,
  setMessages,
  missingDocumentTypes,
  documentTypeLabels,
  LoanStatus,
}) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const updateMessageWithSelectedDocs = (docs: string[]) => {
    if (docs.length === 0) {
      setMessage("");
      return;
    }

    const docLabels = docs.map((t) => documentTypeLabels[t]).join(", ");
    const politeMessage = `Hi, could you please upload the following document(s): ${docLabels}?`;

    setMessage(politeMessage);
  };

  const handleSendMessageAndMaybeRequestDocs = async () => {
    if (!message.trim()) return;
    try {
      setSending(true);

      // Send message
      const res = await axios.post("/api/messages", {
        content: message,
        applicationId,
      });
      setMessages([...messages, res.data]);

      toast({ title: "Message Sent" });

      // Request documents if any selected
      if (selectedDocs.length > 0 && application) {
        const docRes = await axios.post(
          `/api/applications/${application.id}/documents`,
          { documentTypes: selectedDocs }
        );
        setApplication((prev: any) =>
          prev
            ? { ...prev, documents: [...prev.documents, ...docRes.data] }
            : null
        );
        setSelectedDocs([]);
      }

      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to send message or request documents",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleStartChat = async () => {
    try {
      await axios.patch(`/api/applications/${applicationId}/startchat`, {
        status: "IN_CHAT",
      });
      setApplication((prev: any) =>
        prev ? { ...prev, status: "IN_CHAT" } : prev
      );
      toast({
        title: "Chat started",
        description: "You can now chat with the applicant",
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive",
      });
    }
  };

  if (
    application.status !== LoanStatus.IN_PROGRESS &&
    application.status !== "IN_CHAT"
  ) {
    return null;
  }

  return (
    <div className="lg:w-1/3 bg-white rounded-lg shadow-md flex flex-col relative">
      {application.status !== "IN_CHAT" && (
        <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
          <Button
            onClick={handleStartChat}
            variant="default"
            className="px-6 py-2 text-lg"
          >
            Chat Now
          </Button>
        </div>
      )}

      <div className="p-4 border-b font-semibold text-gray-700">
        Chat with Applicant
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
                  msg.senderRole === "LENDER"
                    ? "bg-purple-100 ml-auto text-right"
                    : "bg-blue-100 mr-auto text-left"
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

      <div className="p-4 border-t flex flex-col gap-2">
        <div className="flex gap-2 items-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <Plus className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              {missingDocumentTypes.length === 0 ? (
                <DropdownMenuLabel className="text-muted-foreground">
                  All documents submitted
                </DropdownMenuLabel>
              ) : (
                missingDocumentTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onSelect={(e) => {
                      e.preventDefault();
                      setSelectedDocs((prev) => {
                        const newSelection = prev.includes(type)
                          ? prev.filter((t) => t !== type)
                          : [...prev, type];
                        updateMessageWithSelectedDocs(newSelection);
                        return newSelection;
                      });
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(type)}
                        readOnly
                      />
                      {documentTypeLabels[type]}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            disabled={application.status !== "IN_CHAT"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="default"
            disabled={
              application.status !== "IN_CHAT" || sending || !message.trim()
            }
            onClick={handleSendMessageAndMaybeRequestDocs}
          >
            {sending ? "..." : "Send"}
          </Button>
        </div>

        {selectedDocs.length > 0 && (
          <p className="ml-[42px] text-xs text-muted-foreground">
            Documents will be requested when you send the message
          </p>
        )}
      </div>
    </div>
  );
};

export default LenderChat;
