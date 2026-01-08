"use client";
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
import { Prisma } from "@prisma/client";

interface LenderChatProps {
  application: Prisma.ApplicationGetPayload<{
    include: {
      documents: true;
      messages: true;
    };
  }>;
  setApplication: React.Dispatch<
    React.SetStateAction<Prisma.ApplicationGetPayload<{
      include: {
        documents: true;
        messages: true;
      };
    }> | null>
  >;
  applicationId: string;
  messages: Prisma.MessageGetPayload<object>[];
  setMessages: React.Dispatch<
    React.SetStateAction<Prisma.MessageGetPayload<object>[]>
  >;
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
      const { data: newMessage } = await axios.post("/api/messages", {
        content: message,
        applicationId,
      });
      setMessages([...messages, newMessage]);

      toast({ title: "Message Sent" });

      // Request documents if any selected
      if (selectedDocs.length > 0 && application) {
        const { data: newDocuments } = await axios.post(
          `/api/applications/${application.id}/documents`,
          { documentTypes: selectedDocs }
        );

        setApplication((prev) =>
          prev
            ? { ...prev, documents: [...prev.documents, ...newDocuments] }
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

      setApplication((prev) => (prev ? { ...prev, status: "IN_CHAT" } : null));

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
    <div className="relative flex flex-col rounded-lg bg-white shadow-md lg:w-1/3">
      {application.status !== "IN_CHAT" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
          <Button
            onClick={handleStartChat}
            variant="default"
            className="px-6 py-2 text-lg"
          >
            Chat Now
          </Button>
        </div>
      )}

      <div className="border-b p-4 font-semibold text-gray-700">
        Chat with Applicant
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
                  msg.senderRole === "LENDER"
                    ? "ml-auto bg-purple-100 text-right"
                    : "mr-auto bg-blue-100 text-left"
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

      <div className="flex flex-col gap-2 border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              application.status === "IN_CHAT" &&
              !sending &&
              message.trim()
            ) {
              handleSendMessageAndMaybeRequestDocs();
            }
          }}
          className="flex items-start gap-2"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <Plus className="h-5 w-5" />
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
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            disabled={application.status !== "IN_CHAT"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (
                  application.status === "IN_CHAT" &&
                  !sending &&
                  message.trim()
                ) {
                  handleSendMessageAndMaybeRequestDocs();
                }
              }
            }}
          />

          <Button
            type="submit"
            variant="default"
            disabled={
              application.status !== "IN_CHAT" || sending || !message.trim()
            }
          >
            {sending ? "..." : "Send"}
          </Button>
        </form>

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
