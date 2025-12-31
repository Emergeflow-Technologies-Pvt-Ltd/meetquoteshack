"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
}

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

    const res = await fetch(
      `/api/agent/${agentId}/reviews`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          rating,
          comment,
        }),
      }
    );

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
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Rate Your Agent
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mt-1">
            Your feedback helps us improve the experience.
          </p>
        </div>

        <div className="px-6">
          <div className="flex items-center gap-4 bg-violet-50 rounded-lg p-4">
            <div className="h-10 w-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold">
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

        <div className="px-6 py-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Star Rating <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  onClick={() => setRating(i)}
                  className={`w-7 h-7 cursor-pointer transition ${i <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                    }`}
                />
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Select a rating from 1 to 5
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
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

        <div className="px-6 pb-6 space-y-3">
          <Button
            className="w-full bg-violet-600 hover:bg-violet-700 text-white text-base py-6"
            onClick={submitReview}
            disabled={rating === 0 || loading}
          >
            Submit Review
          </Button>

          <button
            onClick={onClose}
            className="w-full text-center text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>

  );
}
