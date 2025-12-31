"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import LeaveReviewModal from "./LeaveReviewModal";

type Props = {
  agent: {
    id: string;
    name: string;
  };
  applicationId: string;
  hasReviewed: boolean;
};

export default function LeaveReviewAction({
  agent,
  applicationId,
  hasReviewed,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        disabled={hasReviewed}
        className="bg-violet-600 hover:bg-violet-700 text-white gap-2 disabled:opacity-50"
        onClick={() => {
          if (hasReviewed) {
            alert("You have already submitted a review for this agent.");
            return;
          }
          setOpen(true);
        }}
      >
        <Star className="w-4 h-4" />
        {hasReviewed ? "Review Submitted" : "Leave a Review"}
      </Button>


      <LeaveReviewModal
        open={open}
        onClose={() => setOpen(false)}
        agentId={agent.id}
        applicationId={applicationId}
        agent={agent}
      />
    </>
  );
}

