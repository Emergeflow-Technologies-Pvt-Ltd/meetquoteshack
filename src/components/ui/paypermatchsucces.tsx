"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
      <div className="w-full max-w-md rounded-lg border border-gray-100 bg-white p-8 text-center shadow-lg animate-in fade-in zoom-in">
        <div className="mx-auto mb-6 mt-4 flex h-24 w-24 items-center justify-center rounded-3xl">
          <Image
            src="/paysuccess.svg"
            alt="Tick"
            width={89}
            height={79}
            priority
          />
        </div>

        {/* ✅ Title */}
        <h2 className="mb-2 text-2xl font-bold">Match Activated</h2>

        {/* ✅ Subtitle */}
        <p className="font-inter mb-8 text-sm leading-relaxed text-gray-500">
          Pay Per Match has been processed.
          <br />
          Loanee profile details are now unlocked.
        </p>

        {/* ✅ Button */}
        <Button
          onClick={onClose}
          className="h-12 w-full rounded-lg bg-purple-600 text-base font-semibold text-white shadow-md hover:bg-purple-700"
        >
          Okay
        </Button>
      </div>
    </div>
  );
}
