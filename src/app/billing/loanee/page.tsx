"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoaneeBillingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const plan = (searchParams.get("plan") ?? "basic") as
    | "basic"
    | "smart";

  const interval = (searchParams.get("interval") ?? "monthly") as
    | "monthly"
    | "yearly";

  useEffect(() => {
    const startCheckout = async () => {
      try {
        const res = await fetch("/api/checkout/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,
            interval,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.message ?? data.error ?? "Something went wrong");
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Back to previous page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-sm text-gray-500">
          Redirecting to secure checkout…
        </p>
        <p className="text-xs text-gray-400">
          Plan: <span className="font-medium">{plan}</span> • Interval:{" "}
          <span className="font-medium">{interval}</span>
        </p>
      </div>
    </div>
  );
}
