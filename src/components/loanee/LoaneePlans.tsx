"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Crown, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { LOANEE_PRICES } from "@/lib/loanee-prices";

type IntervalType = "monthly" | "yearly" | "twoYear";

export default function LoaneePlans() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [interval, setInterval] = useState<IntervalType>("monthly");
  const [freeTierActive, setFreeTierActive] = useState<boolean | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const openModal = () => {
    setInterval("monthly");
    setShowModal(true);
  };

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const res = await fetch("/api/subscription/access");
        const data = await res.json();
        setFreeTierActive(Boolean(data.freeTierActive));
      } catch (e) {
        console.error("Failed to fetch access", e);
        setFreeTierActive(false);
      }
    };

    fetchAccess();
  }, []);
  const closeModal = () => setShowModal(false);

  const proceedToPayment = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // small delay so loader is visible even on fast redirects
      await new Promise((res) => setTimeout(res, 300));

      router.push(`/billing/loanee?plan=smart&interval=${interval}`);
    } catch (err) {
      console.error("Failed to proceed to payment", err);
      setIsProcessing(false);
    }
  };

  const INTERVAL_LABELS: Record<IntervalType, string> = {
    monthly: "Monthly",
    yearly: "1-Year Subscription",
    twoYear: "2-Year Subscription",
  };

  const SAVINGS_BADGE: Partial<Record<IntervalType, string>> = {
    yearly: "Save 15%",
    twoYear: "Save 30%",
  };

  return (
    <>
      <div className="mx-auto flex max-w-3xl justify-center">
        <div className="grid w-full justify-center gap-8 md:grid-cols-2">
          <Card className="relative flex min-h-[539px] w-[368px] flex-col justify-between rounded-[8.44px] border border-[#E5E7EB] bg-white">
            <CardHeader className="px-5 pb-4 pt-5">
              <div className="mb-2 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#D1FAE5] text-[#10B981]">
                  <Zap className="h-5 w-5" />
                </div>
              </div>

              <div className="text-left">
                <CardTitle className="text-[18px] font-semibold text-[#111827]">
                  Basic
                </CardTitle>
                <CardDescription className="mb-5 mt-1 text-[14px] text-[#6B7280]">
                  Everything you need to begin
                </CardDescription>
              </div>

              <div className="mb-6">
                <span className="text-[38px] font-bold text-[#22C55E]">$0</span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between px-4 pb-10 pt-4">
              <ul className="space-y-2 text-sm text-[#111827]">
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  Apply for loans
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  Upload & send documents
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-[#10B981]" />
                  Chat with lenders
                </li>
              </ul>

              <button
                onClick={() => {
                  if (freeTierActive) {
                    router.push("/loanee/start");
                  } else {
                    router.push("/applications");
                  }
                }}
                className="mt-6 inline-flex w-full justify-center rounded-md border border-[#22C55E] px-4 py-3 font-semibold text-[#22C55E] hover:bg-[#ECFDF3]"
              >
                Continue Free
              </button>
            </CardContent>
          </Card>

          <Card className="relative flex min-h-[539px] w-[368px] flex-col justify-between border-2 border-violet-400 bg-white">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-violet-600 px-4 py-1 text-xs font-medium text-white">
                Most Popular
              </span>
            </div>

            <CardHeader className="px-5 pb-4 pt-5">
              <div className="mb-2 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-violet-100 text-violet-600">
                  <Crown className="h-5 w-5" />
                </div>
              </div>

              <CardTitle className="text-[18px] font-semibold text-gray-900">
                Smart
              </CardTitle>
              <CardDescription className="mb-5 text-sm text-gray-500">
                Proactive borrowers
              </CardDescription>

              <div className="mt-4">
                <span className="text-[38px] font-bold text-violet-600">
                  $2.99
                </span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between px-4 pb-10 pt-4">
              <ul className="space-y-2 text-sm text-[#111827]">
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-violet-500" />
                  Pre-qualification check
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-violet-500" />
                  Unlimited lender matching
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-violet-500" />
                  Credit score monitoring
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-violet-500" />
                  Analytics reports
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-violet-500" />
                  Expert loan advice
                </li>
              </ul>

              <button
                onClick={openModal}
                className="mt-6 inline-flex w-full justify-center rounded-md bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-700"
              >
                Subscribe
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="w-[425px] rounded-md bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Select Plan Type</h2>
              <button onClick={closeModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(LOANEE_PRICES.smart).map(([key, opt]) => {
                const k = key as IntervalType;
                const selected = interval === k;

                return (
                  <button
                    key={k}
                    onClick={() => setInterval(k)}
                    className={`w-full rounded-lg border px-4 py-3 text-left ${
                      selected
                        ? "border-violet-600 ring-2 ring-violet-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="flex gap-2">
                          <span className="font-semibold">
                            {INTERVAL_LABELS[k]}
                          </span>
                          {SAVINGS_BADGE[k] && (
                            <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                              {SAVINGS_BADGE[k]}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 font-bold text-violet-600">
                          {opt.label}
                        </div>
                      </div>

                      <span
                        className={`h-5 w-5 rounded-full border-2 ${
                          selected ? "border-violet-600" : "border-gray-300"
                        }`}
                      >
                        {selected && (
                          <span className="mx-auto mt-1 block h-2.5 w-2.5 rounded-full bg-violet-600" />
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={proceedToPayment}
              disabled={isProcessing}
              className={`mt-6 w-full bg-violet-600 hover:bg-violet-700 ${
                isProcessing ? "cursor-not-allowed opacity-90" : ""
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Redirecting…
                </span>
              ) : (
                "Proceed to Payment"
              )}
            </Button>

            <button
              onClick={closeModal}
              className="mt-3 w-full text-sm text-violet-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
