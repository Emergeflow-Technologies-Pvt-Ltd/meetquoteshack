// src/components/SubscribeModalLoanee.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import axios from "axios";

type Plan = {
  id: string;
  title: string;
  subtitle?: string;
  priceLabel: string;
  priceSuffix?: string;
  badge?: { text: string; bg?: string; textColor?: string };
  features: string[];
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "basic",
    title: "Basic",
    subtitle: "Perfect for getting started",
    priceLabel: "$25",
    priceSuffix: "/month",
    features: ["Access to lending pool", "Collect borrower document", "Chat with borrowers"],
  },
  {
    id: "smart",
    title: "Standard",
    subtitle: "Most popular for growing lenders",
    priceLabel: "$49",
    priceSuffix: "/month",
    features: ["Access to lending pool", "Collect borrower document", "Chat with borrowers", "Risk assessment report", "Analytics reports"],
    badge: { text: "Most Popular", bg: "#7C3AED", textColor: "#fff" },
    featured: true,
  },
];

export default function SubscribeModalLoanee({
  open,
  onClose,
  initialPlanId,
}: {
  open: boolean;
  onClose: () => void;
  initialPlanId?: string;
}) {
  const [selectedId, setSelectedId] = useState<string | undefined>(initialPlanId ?? PLANS[0].id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const original = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (open && initialPlanId) setSelectedId(initialPlanId);
  }, [open, initialPlanId]);

  if (!open) return null;

  const selected = PLANS.find((p) => p.id === selectedId);

  const startCheckout = async (planId: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/checkout/subscription", {
        role: "LOANEE",
        plan: planId === "smart" ? "stay_smart" : "basic",
        interval: "monthly",
      });
      const url = res.data?.url as string | undefined;
      if (!url) throw new Error("No checkout URL returned");
      window.location.href = url;
    } catch (err: unknown) {
      console.error("Checkout error", err);

      let msg = "Failed to start checkout";

      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.error ?? err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }

      alert("Checkout error: " + msg);
      setLoading(false);
    }

  };

  const handleProceed = async () => {
    if (!selected) return;
    if (selected.id === "basic") {
      window.location.href = "/applications";
      return;
    }
    await startCheckout(selected.id);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Select Plan Type</h2>
            <p className="text-sm text-gray-500 mt-1">Choose the plan that best fits your needs</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <X />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="max-w-3xl mx-auto flex justify-center">
            <div className="grid w-full justify-center gap-8 md:grid-cols-2">
              {PLANS.map((plan) => {
                const active = plan.id === selectedId;

                if (plan.id === "basic") {
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedId(plan.id)}
                      className={`relative w-[368px] min-h-[539px] rounded-[8.44px] border ${active ? "border-violet-400 shadow-lg" : "border-[#E5E7EB]"} bg-white flex flex-col justify-between cursor-pointer`}
                    >
                      <div className="px-5 pt-5 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#D1FAE5] text-[#10B981]">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                          </div>
                        </div>

                        <div className="text-left">
                          <div className="text-[18px] font-semibold text-[#111827]">{plan.title}</div>
                          <div className="text-[14px] text-[#6B7280] mt-1 mb-5">{plan.subtitle}</div>
                        </div>

                        <div className="mb-6">
                          <span className="text-[38px] mt-3 font-bold leading-tight text-[#22C55E]">{plan.priceLabel}</span>
                          <span className="relative -top-[6px] text-[16px] text-gray-500 ml-1 align-baseline">{plan.priceSuffix}</span>
                        </div>
                      </div>

                      <div className="px-4 pb-10 pt-4 flex flex-col justify-between flex-1">
                        <ul className="space-y-2 text-[15px] text-[#111827]">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-start gap-3">
                              <Check className="mt-1 h-4 w-4 text-[#10B981]" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>

                        <div>
                          <button
                            onClick={() => {
                              setSelectedId(plan.id);
                              window.location.href = "/applications";
                            }}
                            className="mt-5 mb-8 inline-flex w-full items-center justify-center rounded-md border border-[#22C55E] px-4 py-3 text-[15px] font-semibold text-[#22C55E] hover:bg-[#ECFDF3] transition"
                          >
                            Continue Free
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedId(plan.id)}
                    className={`relative w-[368px] min-h-[539px] flex flex-col justify-between ${plan.featured ? "border-2 border-violet-400 shadow-lg" : "border border-[#E5E7EB]"} bg-white rounded-[8.44px] cursor-pointer`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center rounded-full bg-violet-600 px-4 py-1 text-xs font-medium text-white shadow">
                          {plan.badge.text}
                        </span>
                      </div>
                    )}

                    <div className="pb-4 pt-5 px-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-violet-100 text-violet-600">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2l3 7h7l-5.5 4 2 7L12 16 6.5 20l2-7L3 9h7z" />
                          </svg>
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="text-[18px] font-semibold text-gray-900">{plan.title}</div>
                        <div className="text-sm text-gray-500 mb-5">{plan.subtitle}</div>
                      </div>

                      <div className="mt-7">
                        <span className="text-[38px] mt-3 font-bold leading-tight text-violet-600">{plan.priceLabel}</span>
                        <span className="relative -top-[6px] text-[16px] text-gray-500 ml-1 align-baseline">{plan.priceSuffix}</span>
                      </div>
                    </div>

                    <div className="px-4 pb-10 pt-4 flex flex-col justify-between flex-1">
                      <ul className="space-y-2 text-[15px] text-[#111827]">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-3">
                            <Check className="mt-0.5 h-4 w-4 text-violet-500" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <div>
                        <button
                          onClick={() => startCheckout(plan.id)}
                          className="mt-5 mb-8 inline-flex w-full items-center justify-center rounded-md bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-violet-700 transition"
                        >
                          Subscribe
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-5">
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleProceed}
              disabled={loading}
              className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition disabled:opacity-60"
            >
              {loading ? "Processing..." : selected?.id === "basic" ? "Continue Free" : "Proceed to Payment"}
            </button>

            <div className="text-center">
              <button onClick={onClose} className="text-violet-600 mt-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
