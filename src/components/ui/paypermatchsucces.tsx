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
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg border border-gray-100 text-center animate-in fade-in zoom-in">


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
        <h2 className="text-2xl font-bold  mb-2">
          Match Activated
        </h2>

        {/* ✅ Subtitle */}
        <p className="text-sm text-gray-500 leading-relaxed mb-8 font-inter">
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
