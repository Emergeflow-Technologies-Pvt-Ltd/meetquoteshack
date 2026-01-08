"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BillingSuccessChecker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billing = searchParams.get("billing");

  const [status, setStatus] = useState<"checking" | "done" | "failed">(
    "checking"
  );
  const attemptsRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (billing !== "success") return;

    const maxTries = 8;
    const pollIntervalMs = 1500;
    let timer: ReturnType<typeof setTimeout>;

    const check = async () => {
      try {
        const res = await fetch("/api/subscription/check", {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!res.ok) throw new Error("check failed");

        const data = await res.json();

        if (data.hasAccess === true || data.freeTierActive === true) {
          if (!mountedRef.current) return;
          setStatus("done");

          // ✅ let user SEE success screen before redirect
          setTimeout(() => {
            router.replace("/lender/dashboard");
          }, 2000);

          return;
        }
      } catch (err) {
        console.error("subscription check error", err);
      }

      attemptsRef.current += 1;
      if (attemptsRef.current >= maxTries) {
        if (!mountedRef.current) return;
        setStatus("failed");
        return;
      }

      timer = setTimeout(check, pollIntervalMs);
    };

    timer = setTimeout(check, 600);
    return () => clearTimeout(timer);
  }, [billing, router]);

  if (billing !== "success") return null;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* CHECKING */}
      {status === "checking" && (
        <>
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
            <svg
              className="h-5 w-5 animate-spin text-violet-600"
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
          </div>

          <p className="text-[14px] text-[#64748B]">
            Payment successful — activating access…
          </p>
        </>
      )}

      {/* SUCCESS */}
      {status === "done" && (
        <>
          {/* ICON */}
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
            <svg
              className="h-5 w-5 text-violet-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.72a.75.75 0 10-1.22-.86l-3.4 4.81-1.65-1.65a.75.75 0 10-1.06 1.06l2.3 2.3c.3.3.8.27 1.06-.11l3.97-5.55z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* TITLE */}
          <h2 className="mb-2 text-[16px] font-medium text-gray-900">
            Subscription Activated
          </h2>

          {/* DESCRIPTION */}
          <p className="mb-6 max-w-sm text-[14px] leading-6 text-[#64748B]">
            You’re all set! Enjoy uninterrupted access to all platform features
            without restrictions.
          </p>

          {/* BUTTON */}
          <button
            onClick={() => router.replace("/lender/dashboard")}
            className="rounded-md border border-violet-600 px-6 py-2 text-[13px] font-medium text-violet-600 transition hover:bg-violet-50"
          >
            Start
          </button>
        </>
      )}

      {/* FAILED */}
      {status === "failed" && (
        <>
          <p className="mb-2 text-[14px] font-medium text-red-600">
            We couldn&apos;t confirm your subscription yet.
          </p>
          <p className="text-[14px] text-[#64748B]">
            Please refresh the page or contact support if the issue persists.
          </p>
        </>
      )}
    </div>
  );
}
