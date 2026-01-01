"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Crown, Zap, X } from "lucide-react";
import { LENDER_PRICES } from "@/lib/lender-prices";

type PlanType = "simple" | "standard";
type IntervalType = "monthly" | "yearly" | "twoYear";

export default function LenderPlans() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [interval, setInterval] = useState<IntervalType>("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const openModal = (plan: PlanType) => {
    setSelectedPlan(plan);
    setInterval("monthly");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  const INTERVAL_LABELS: Record<IntervalType, string> = {
    monthly: "Monthly",
    yearly: "1-Year Subscription",
    twoYear: "2-Year Subscription",
  };

  const SAVINGS_BADGE: Partial<Record<IntervalType, string>> = {
    yearly: "Save 30%",
    twoYear: "Save 50%",
  };

  const proceedToPayment = async () => {
    if (!selectedPlan || isProcessing) return;

    try {
      setIsProcessing(true);

      const res = await fetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          interval,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // redirect to Stripe
      } else {
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* ================= EXISTING UI (UNCHANGED) ================= */}
      <div className="mx-auto flex max-w-3xl justify-center">
        <div className="grid w-full justify-center gap-8 md:grid-cols-2">
          {/* BASIC PLAN */}
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
                  Perfect for getting started
                </CardDescription>
              </div>

              <div className="mb-6">
                <span className="text-[38px] font-bold text-[#22C55E]">
                  $25
                </span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between px-4 pb-10 pt-4">
              <ul className="space-y-2 text-sm text-[#111827]">
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-[#10B981]" /> Access to lending
                  pool
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-[#10B981]" /> Collect borrower
                  documents
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-[#10B981]" /> Chat with
                  borrowers
                </li>
              </ul>

              <button
                onClick={() => openModal("simple")}
                className="mt-6 inline-flex w-full justify-center rounded-md border border-[#22C55E] px-4 py-3 font-semibold text-[#22C55E] hover:bg-[#ECFDF3]"
              >
                Subscribe
              </button>
            </CardContent>
          </Card>

          {/* STANDARD PLAN */}
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
                Standard
              </CardTitle>
              <CardDescription className="mb-5 text-sm text-gray-500">
                Most popular for growing lenders
              </CardDescription>

              <div className="mt-4">
                <span className="text-[38px] font-bold text-violet-600">
                  $49
                </span>
                <span className="ml-1 text-gray-500">/month</span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between px-4 pb-10 pt-4">
              <ul className="space-y-2 text-sm text-[#111827]">
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-violet-500" /> Access to
                  lending pool
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-violet-500" /> Collect borrower
                  documents
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-violet-500" /> Chat with
                  borrowers
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-violet-500" /> Risk assessment
                  reports
                </li>
                <li className="flex gap-3">
                  <Check className="h-4 w-4 text-violet-500" /> Analytics
                  reports
                </li>
              </ul>

              <button
                onClick={() => openModal("standard")}
                className="mt-6 inline-flex w-full justify-center rounded-md bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-700"
              >
                Subscribe
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================= MODAL (NEW, UI SEPARATE) ================= */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="h-[484px] w-[425px] max-w-lg rounded-md bg-white p-5 shadow-xl">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Select Plan Type
                </h2>

                <button
                  onClick={closeModal}
                  className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Choose the plan that best fits your lending needs
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(LENDER_PRICES[selectedPlan]).map(([key, opt]) => {
                const k = key as IntervalType;
                const selected = interval === k;

                return (
                  <button
                    key={key}
                    onClick={() => setInterval(k)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                      selected
                        ? "border-violet-600 ring-2 ring-violet-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      {/* LEFT CONTENT */}
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-base font-semibold text-gray-900">
                            {INTERVAL_LABELS[k]}
                          </span>

                          {SAVINGS_BADGE[k] && (
                            <span
                              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                                k === "yearly"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-violet-100 text-violet-700"
                              }`}
                            >
                              {SAVINGS_BADGE[k]}
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-bold text-violet-600">
                            {opt.label}
                          </span>

                          {"original" in opt && (
                            <span className="text-sm text-gray-400 line-through">
                              {opt.original}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* RADIO BUTTON */}
                      <div className="pt-1">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            selected ? "border-violet-600" : "border-gray-300"
                          }`}
                        >
                          {selected && (
                            <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />
                          )}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={proceedToPayment}
              disabled={isProcessing}
              className={`mt-6 w-full rounded-sm px-4 py-2 font-medium text-white transition ${
                isProcessing
                  ? "cursor-not-allowed bg-violet-400"
                  : "bg-violet-600 hover:bg-violet-700"
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <svg
                    className="h-4 w-4 animate-spin text-white"
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
                </div>
              ) : (
                <span className="text-sm">Proceed to Payment</span>
              )}
            </button>

            <button
              onClick={closeModal}
              className="mt-3 w-full text-center text-sm text-violet-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
