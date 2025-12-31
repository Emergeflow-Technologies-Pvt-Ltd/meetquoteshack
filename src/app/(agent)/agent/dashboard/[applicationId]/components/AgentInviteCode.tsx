"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";

interface AgentInviteCodeProps {
  inviteCode?: string;
}

function generateAgentCode() {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    randomPart += chars[Math.floor(Math.random() * chars.length)];
  }
  return `AGENT-${year}-${randomPart}`;
}

const AgentInviteCode: React.FC<AgentInviteCodeProps> = ({ inviteCode }) => {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(inviteCode || generateAgentCode());
  }, [inviteCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareCode = async () => {
    const shareText = `Here is my Agent Invite Code: ${code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Agent Invite Code",
          text: shareText,
        });
      } catch (err) {
        console.error("Share cancelled or failed", err);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };



  return (
    <Card className="p-8 rounded-2xl shadow-sm border border-gray-200">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Your Agent Code
        </h2>
      </div>

      <div className="bg-purple-100 border border-purple-400 rounded-xl py-6 px-4 mb-6 text-center">
        <p className="text-3xl font-bold text-purple-700 tracking-wide">
          {code}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={handleCopy}
          className="px-5 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
        >
          <Copy size={18} />
          {copied ? "Copied!" : "Copy Code"}
        </Button>

        <Button
          onClick={handleShareCode}
          className="px-5 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
        >
          <Share2 size={18} />
          Share Code
        </Button>
      </div>
    </Card>
  );
};

export default AgentInviteCode;
