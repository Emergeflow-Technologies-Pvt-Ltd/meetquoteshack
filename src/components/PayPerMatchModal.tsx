"use client";

import React, { useState } from "react";
import axios from "axios";
import { Check } from 'lucide-react';

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
            if (!url) throw new Error("No checkout URL returned");

            window.location.href = url;
        } catch (err: unknown) {
            console.error("PayPerMatch error", err);

            let msg = "Failed to start payment";

            if (axios.isAxiosError(err)) {
                const data = err.response?.data as { error?: string } | undefined;
                msg = data?.error ?? err.message;
            } else if (err instanceof Error) {
                msg = err.message;
            }

            alert("Payment Error: " + msg);
            setLoading(false);
        }

    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 w-[400px] max-w-lg bg-white rounded-lg shadow-xl h-[550px]">
                <div className="px-6 py-3 border-b">
                    <h2 className="text-xl font-semibold text-purple-600">Pay Per Match</h2>
                    <p className="text-sm text-gray-500 mt-1">Unlock this qualified lead with a one-time match fee</p>
                </div>

                <div className="px-6 py-2 space-y-2 mt-4 ">
                    <div className="w-full rounded-xl bg-[#F3E8FF] p-4 flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-600">
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
                                <span className="text-purple-700 text-base">
                                    per qualified application
                                </span>
                            </div>
                            <span className="text-gray-500 text-sm mt-1">
                                One-time fee to unlock this lead
                            </span>
                        </div>
                    </div>



                    <div className="border rounded-lg h-[150px] p-3 bg-white">
                        <h3 className="font-semibold text-md mb-3">What&apos;s included in this match?</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-500 font-bold "><Check /></span>
                                <span className="text-sm">Soft Credit Check</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-500 font-bold"><Check /></span>
                                <span className="text-sm">Income Verification</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-500 font-bold"><Check /></span>
                                <span className="text-sm">Identity Verification</span>
                            </li>
                        </ul>
                    </div>

                    <div className="text-sm text-gray-500 bg-gray-50 p-2 border rounded">
                        You pay a match fee each time QuoteShack connects you with a qualified borrower.
                    </div>
                </div>

                <div className="px-6 py-2 border-t flex flex-col gap-3">
                    <button
                        onClick={handleProceed}
                        disabled={loading}
                        className="w-full bg-purple-600 text-white text-sm py-1.5 rounded-md font-medium hover:bg-purple-700 transition"
                    >
                        {loading ? "Processing..." : "Proceed to Payment"}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full text-center text-sm text-gray-600 py-1.5"
                        aria-label="Cancel"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
