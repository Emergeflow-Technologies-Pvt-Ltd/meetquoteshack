"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  open: boolean;
  onClose: () => void;
  agentId: string;
  applicationId: string;
  agent: {
    id: string;
    name: string;
  };
};

export default function LeaveReviewModal({
  open,
  onClose,
  agentId,
  applicationId,
  agent,
}: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  async function submitReview() {
    if (rating === 0) return;

    setLoading(true);

    const res = await fetch(`/api/agent/${agentId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId,
        rating,
        comment,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to submit review");
      return;
    }

    onClose();
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg overflow-hidden p-0">
        <div className="px-6 pb-2 pt-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Rate Your Agent
            </DialogTitle>
          </DialogHeader>
          <p className="mt-1 text-sm text-gray-500">
            Your feedback helps us improve the experience.
          </p>
        </div>

        <div className="px-6">
          <div className="flex items-center gap-4 rounded-lg bg-violet-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
              {initials}
            </div>
            <div>
              <p className="font-semibold">{agent.name}</p>
              <Badge variant="secondary" className="mt-1">
                Assigned Agent
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Star Rating <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  onClick={() => setRating(i)}
                  className={`h-7 w-7 cursor-pointer transition ${
                    i <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Select a rating from 1 to 5
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Your Feedback <span className="text-red-500">*</span>
            </label>

            <Textarea
              placeholder="Share your experience working with this agent..."
              className="min-h-[120px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3 px-6 pb-6">
          <Button
            className="w-full bg-violet-600 py-6 text-base text-white hover:bg-violet-700"
            onClick={submitReview}
            disabled={rating === 0 || loading}
          >
            Submit Review
          </Button>

          <button
            onClick={onClose}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
