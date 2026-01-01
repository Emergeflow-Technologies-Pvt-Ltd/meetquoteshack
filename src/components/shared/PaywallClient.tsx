//components/shared/PaywallClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  fullscreen?: boolean;
};

export default function PaywallClient({ fullscreen = false }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const role = session?.user?.role as "LENDER" | "LOANEE" | undefined;

  // 🔹 Role-aware destinations
  const DASHBOARD_ROUTE =
    role === "LENDER" ? "/lender/dashboard" : "/applications";

  const PLANS_ROUTE =
    role === "LENDER" ? "/lender/plans" : "/loanee/subscription";

  const [trialEndedAt, setTrialEndedAt] = useState<string | null>(null);
  const [subscriptionEndedAt, setSubscriptionEndedAt] = useState<string | null>(
    null
  );

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

  async function markModalSeen() {
    await fetch("/api/user/markfreetrial", {
      method: "POST",
    });
  }

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
      await markModalSeen();

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
    markModalSeen();

    router.push(PLANS_ROUTE);
  }

  const outerClass =
    "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4";

  const boxClass =
    "mx-auto w-full max-w-md rounded-xl bg-white px-8 py-10 text-center shadow-xl";

  return (
    <div className={outerClass}>
      <div className={boxClass}>
        {/* ICON */}
        <div className="mb-5 flex justify-center">
          {/* <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100"> */}
          <Image
            src="/tick.svg"
            alt="Success"
            width={40}
            height={40}
            priority
          />
          {/* </div> */}
        </div>

        {/* TEXT */}
        <p className="mb-7 px-1 text-[14px] leading-6 text-[#64748B]">
          Enjoy full access for the first{" "}
          <span className="font-medium">{trialDays} days</span>.
          <br />
          After your trial ends, a subscription is required.
        </p>

        {/* PRIMARY CTA */}
        <button
          onClick={handleTrial}
          className="mx-auto flex h-8 w-[320px] items-center justify-center rounded-md bg-violet-600 text-[14px] font-medium text-white transition hover:bg-violet-700"
        >
          Start free trial
        </button>

        {/* SECONDARY CTA */}
        <button
          onClick={goToPlansPage}
          className="mx-auto mt-5 flex h-8 w-[320px] items-center justify-center rounded-md border border-violet-600 text-[14px] font-medium text-violet-600 transition hover:bg-violet-50"
        >
          View Plans
        </button>
      </div>
    </div>
  );
}
