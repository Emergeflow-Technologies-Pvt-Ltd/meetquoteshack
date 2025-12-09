"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PayPerMatchSuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in">

        {/* ✅ Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-purple-300/80 shadow-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
            <Check className="h-7 w-7 text-purple-600 stroke-[3]" />
          </div>
        </div>

        {/* ✅ Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Match Activated
        </h2>

        {/* ✅ Subtitle */}
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Pay Per Match has been processed.
          <br />
          Loanee profile details are now unlocked.
        </p>

        {/* ✅ Button */}
        <Button
          onClick={onClose}
          className="w-full h-12 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold shadow-md"
        >
          Okay
        </Button>
      </div>
    </div>
  );
}
