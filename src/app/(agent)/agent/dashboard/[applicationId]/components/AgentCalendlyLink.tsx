"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Pencil, XCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AgentCalendlyLinkProps {
  calendlyUrl: string;
}

const AgentCalendlyLink: React.FC<AgentCalendlyLinkProps> = ({
  calendlyUrl,
}) => {
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
    <Card className="rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Your Calendly Link</h2>

        {!isEditing && (
          <Button
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="flex gap-2 text-gray-600 hover:text-gray-900"
          >
            <Pencil size={18} /> Edit
          </Button>
        )}
      </div>

      <div className="mb-6 rounded-xl border border-gray-300 bg-gray-100 p-4">
        <p className="mb-1 text-sm text-gray-600">Calendly Link</p>

        {isEditing ? (
          <input
            type="text"
            placeholder="https://calendly.com/your-name/30min"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base font-medium text-blue-600 outline-none"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
          />
        ) : url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-base font-semibold text-blue-600 underline"
          >
            {url}
          </a>
        ) : (
          <p className="text-sm text-gray-600">
            No Calendly link added yet. Click{" "}
            <span className="font-medium text-gray-700">Edit</span> to add your
            meeting link (e.g.{" "}
            <span className="font-mono">
              https://calendly.com/your-name/30min
            </span>
            ).
          </p>
        )}
      </div>

      {isEditing && (
        <div className="mb-6 flex gap-4">
          <Button
            onClick={saveCalendlyUrl}
            className="flex gap-2 bg-green-600 text-white hover:bg-green-700"
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
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-5 text-white hover:bg-purple-700"
          >
            <Copy size={18} />
            {copied ? "Copied!" : "Copy Link"}
          </Button>

          <Button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-5 text-white hover:bg-blue-700"
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
