//components/shared/PaywallClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";



type Props = {
  fullscreen?: boolean;
};

export default function PaywallClient({
  fullscreen = false,
}: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const role = session?.user?.role as "LENDER" | "LOANEE" | undefined;

  // 🔹 Role-aware destinations
  const DASHBOARD_ROUTE =
    role === "LENDER" ? "/lender/dashboard" : "/applications";

  const PLANS_ROUTE =
    role === "LENDER" ? "/lender/plans" : "/loanee/subscription";


  const [trialEndedAt, setTrialEndedAt] = useState<string | null>(null);
  const [subscriptionEndedAt, setSubscriptionEndedAt] = useState<string | null>(null);

  // Prevent background scroll only in modal mode
  useEffect(() => {
    if (!fullscreen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [fullscreen]);

  const trialDays = role === "LENDER" ? 60 : 90;
  

  useEffect(() => {
    async function fetchAccess() {
      try {
        const res = await fetch("/api/subscription/access");
        if (!res.ok) return;

        const data = await res.json();

        // Trial ended
        if (!data.freeTierActive && data.freeTierEndsAt) {
          setTrialEndedAt(data.freeTierEndsAt);
        }

        // Subscription expired
        if (!data.subscriptionActive && data.subscription?.currentPeriodEnd) {
          setSubscriptionEndedAt(data.subscription.currentPeriodEnd);
        }
      } catch (e) {
        console.error("Failed to fetch subscription access", e);
      }
    }

    fetchAccess();
  }, []);


async function handleTrial() {
  try {
    const res = await fetch("/api/subscription/access");
    if (!res.ok) {
      router.push(PLANS_ROUTE);
      return;
    }

    const data = await res.json();

    if (data.freeTierActive) {
      router.replace(DASHBOARD_ROUTE);
      return;
    }

    router.push(PLANS_ROUTE);
  } catch (e) {
    console.error(e);
    router.push(PLANS_ROUTE);
  }
}

  function goToPlansPage() {
    router.push(PLANS_ROUTE);
  }

  const outerClass = fullscreen
    ? "min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12"
    : "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4";

  const boxClass =
    "mx-auto bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-xl";

  return (
    <div className={outerClass}>
      <div className="w-full max-w-4xl">
          <div className={boxClass}>
            <div className="flex justify-center mb-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100/70 mb-3">
                <Image
                  src="/tick.svg"
                  alt="Tick"
                  width={52}
                  height={52}
                  priority
                />
              </div>
            </div>

            <p className="text-gray-600 text-md mb-6">
              {subscriptionEndedAt ? (
                <>
                  Subscription expired on{" "}
                  <span className="font-semibold">
                    {formatDate(subscriptionEndedAt)}
                  </span>
                  . Please subscribe to continue.
                </>
              ) : trialEndedAt ? (
                <>
                  Your trial ended on{" "}
                  <span className="font-semibold">
                    {formatDate(trialEndedAt)}
                  </span>
                  . A subscription is required.
                </>
              ) : (
                <>
                  Enjoy full access for the first{" "}
                  <span className="font-semibold">{trialDays} days</span>.
                  After your trial ends, a subscription is required.
                </>
              )}
            </p>



            <div className="flex flex-col items-center">
              <button
                onClick={handleTrial}
                className="w-[450px] bg-violet-600 text-white font-semibold py-2 rounded-md mb-6 hover:bg-violet-700 transition"
              >
                Get Started
              </button>

              <button
                onClick={goToPlansPage}
                className="w-[450px] bg-white text-violet-600 font-semibold py-2 rounded-md border border-violet-600 hover:bg-violet-50 transition"
              >
                View Plans
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <button
                onClick={() => (window.location.href = "/api/auth/signout")}
                className="mr-3 text-gray-400 hover:underline"
              >
                Logout
              </button>
              <button
                onClick={() => alert("implement delete account flow")}
                className="text-red-500 hover:underline"
              >
                Delete account
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}
function formatDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
