"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Pencil, XCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AgentCalendlyLinkProps {
  calendlyUrl: string;
}

const AgentCalendlyLink: React.FC<AgentCalendlyLinkProps> = ({ calendlyUrl }) => {
  const [url, setUrl] = useState(calendlyUrl || "");
  const [editUrl, setEditUrl] = useState(calendlyUrl || "");
  const [isEditing, setIsEditing] = useState(false);

  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "My Calendly Link",
        url,
      });
    }
  };

  const saveCalendlyUrl = async () => {
    setSaving(true);

    const res = await fetch("/api/agent/update-calendly", {
      method: "POST",
      body: JSON.stringify({ calendlyUrl: editUrl }),
    });

    setSaving(false);

    if (res.ok) {
      setUrl(editUrl);
      setIsEditing(false);

      toast({
        title: "Saved!",
        description: "Your Calendly link has been updated.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save Calendly link.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-8 rounded-2xl shadow-sm border border-gray-200">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Your Calendly Link</h2>

        {!isEditing && (
          <Button
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="text-gray-600 hover:text-gray-900 flex gap-2"
          >
            <Pencil size={18} /> Edit
          </Button>
        )}
      </div>

      <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-600 mb-1">Calendly Link</p>

        {isEditing ? (
          <input
            type="text"
            placeholder="https://calendly.com/your-name/30min"
            className="w-full bg-white rounded-lg px-3 py-2 border border-gray-300 outline-none text-blue-600 text-base font-medium"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
          />
        ) : url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-base font-semibold underline break-all"
          >
            {url}
          </a>
        ) : (
          <p className="text-gray-600 text-sm">
            No Calendly link added yet.
            Click <span className="font-medium text-gray-700">Edit</span> to add your meeting link
            (e.g. <span className="font-mono">https://calendly.com/your-name/30min</span>).
          </p>
        )}
      </div>


      {isEditing && (
        <div className="flex gap-4 mb-6">
          <Button
            onClick={saveCalendlyUrl}
            className="bg-green-600 hover:bg-green-700 text-white flex gap-2"
            disabled={saving}
          >
            <CheckCircle size={18} />
            {saving ? "Saving..." : "Save"}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setEditUrl(url);
              setIsEditing(false);
            }}
            className="flex gap-2"
          >
            <XCircle size={18} /> Cancel
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      {!isEditing && url && (
        <div className="flex gap-4">
          <Button
            onClick={handleCopy}
            className="px-5 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
          >
            <Copy size={18} />
            {copied ? "Copied!" : "Copy Link"}
          </Button>

          <Button
            onClick={handleShare}
            className="px-5 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <Share2 size={18} />
            Share Link
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AgentCalendlyLink;
