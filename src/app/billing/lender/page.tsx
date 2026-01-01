"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LenderBillingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [freeTierEndsAt, setFreeTierEndsAt] = useState<string | null>(null);

  const plan = (searchParams.get("plan") ?? "simple") as "simple" | "standard";
  const interval = (searchParams.get("interval") ?? "monthly") as
    | "monthly"
    | "yearly";

  useEffect(() => {
    const startCheckout = async () => {
      try {
        // 1️⃣ Ensure free tier is started
        await fetch("/api/subscription/start-trial", {
          method: "POST",
        });

        // 2️⃣ Then try checkout
        const res = await fetch("/api/checkout/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, interval }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));

          setError(data.error ?? "Something went wrong");
          setMessage(data.message ?? null);
          setFreeTierEndsAt(data.freeTierEndsAt ?? null);
          return;
        }

        const data = (await res.json()) as { url?: string };
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError("Missing checkout URL");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to start checkout");
      }
    };

    startCheckout();
  }, [plan, interval]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md space-y-3 text-center">
          <p className="font-semibold text-red-600">{error}</p>

          {message && <p className="text-sm text-gray-600">{message}</p>}

          {freeTierEndsAt && (
            <p className="text-xs text-gray-500">
              Free access ends on{" "}
              <span className="font-medium">
                {new Date(freeTierEndsAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
          )}

          <button
            onClick={() => router.push("/lender/dashboard")}
            className="mt-4 inline-flex items-center rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="space-y-3 text-center">
        <p className="text-sm text-gray-500">
          Redirecting to secure checkout...
        </p>
        <p className="text-xs text-gray-400">
          Plan: <span className="font-medium">{plan}</span> • Interval:{" "}
          <span className="font-medium">{interval}</span>
        </p>
      </div>
    </div>
  );
}
