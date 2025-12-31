"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BillingSuccessChecker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billing = searchParams.get("billing");

  const [status, setStatus] = useState<"checking" | "done" | "failed">("checking");
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
          router.replace("/lender/dashboard");
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

    // small delay so webhook has time if needed
    timer = setTimeout(check, 600);

    return () => clearTimeout(timer);
  }, [billing, router]);

  if (billing !== "success") return null;

  return (
    <div className="w-full text-center py-6">
      {status === "checking" && (
        <p className="text-sm text-gray-600">
          Payment successful — activating access…
        </p>
      )}

      {status === "failed" && (
        <div>
          <p className="text-sm text-red-600">
            We couldn&apost confirm your subscription yet.
          </p>
          <p className="text-sm text-gray-500">
            Please refresh the page or contact support if the issue persists.
          </p>
        </div>
      )}
    </div>
  );
}
