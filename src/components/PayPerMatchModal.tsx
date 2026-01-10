"use client";

import React, { useState } from "react";
import axios from "axios";
import { Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function PayPerMatchModal({
  open,
  onClose,
  applicationId,
  role,
}: {
  open: boolean;
  onClose: () => void;
  applicationId: string;
  role: "LENDER" | "AGENT";
}) {
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  if (!open) return null;

const handleProceed = async () => {
  setLoading(true);

  try {
    const endpoint =
      role === "AGENT"
        ? "/api/checkout/agent-paypermatch"
        : "/api/checkout/paypermatch";

    const res = await axios.post(endpoint, {
      applicationId,
    });

    const url = res.data?.url as string | undefined;

    if (!url) {
      throw new Error("No checkout URL returned");
    }

    window.location.href = url;
  } catch (err: unknown) {
    console.error("PayPerMatch error", err);

    let description =
      "We couldn’t start the payment. Please try again in a moment.";

    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data as { error?: string } | undefined;

      if (status === 400) {
        description = data?.error ?? "This application is already unlocked.";
      } else if (status === 401) {
        description = "Please sign in again.";
      } else if (status === 404) {
        description = "Profile not found.";
      } else if (status === 500) {
        description =
          "Payment service is temporarily unavailable. Please try again later.";
      }
    }

    toast({
      title: "Payment failed",
      description,
      variant: "destructive",
    });

    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 h-[550px] w-[400px] max-w-lg rounded-lg bg-white shadow-xl">
        <div className="border-b px-6 py-3">
          <h2 className="text-xl font-semibold text-purple-600">
            Pay Per Match
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Unlock this qualified lead with a one-time match fee
          </p>
        </div>

        <div className="mt-4 space-y-2 px-6 py-2">
          <div className="mb-4 flex w-full items-center gap-4 rounded-xl bg-[#F3E8FF] p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-purple-700">$70</span>
                <span className="text-base text-purple-700">
                  per qualified application
                </span>
              </div>
              <span className="mt-1 text-sm text-gray-500">
                One-time fee to unlock this lead
              </span>
            </div>
          </div>

          <div className="h-[150px] rounded-lg border bg-white p-3">
            <h3 className="text-md mb-3 font-semibold">
              What&apos;s included in this match?
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="font-bold text-emerald-500">
                  <Check />
                </span>
                <span className="text-sm">Identity Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold text-emerald-500">
                  <Check />
                </span>
                <span className="text-sm">Pre-Qualification Check</span>
              </li>
            </ul>
          </div>

          <div className="rounded border bg-gray-50 p-2 text-sm text-gray-500">
            You pay a match fee each time QuoteShack connects you with a
            qualified borrower.
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t px-6 py-2">
          <button
            onClick={handleProceed}
            disabled={loading}
            className="w-full rounded-md bg-purple-600 py-1.5 text-sm font-medium text-white transition hover:bg-purple-700"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>

          <button
            onClick={onClose}
            className="w-full py-1.5 text-center text-sm text-gray-600"
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
