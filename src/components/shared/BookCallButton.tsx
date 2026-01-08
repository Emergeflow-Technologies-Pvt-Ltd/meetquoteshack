"use client";

import { Button } from "@/components/ui/button";

export default function BookCallButton({
  calendlyUrl,
}: {
  calendlyUrl: string;
}) {
  return (
    <Button
      variant="outline"
      className="border-violet-600 text-violet-600 hover:bg-violet-50"
      onClick={() => window.open(calendlyUrl, "_blank")}
    >
      Book Call
    </Button>
  );
}
