"use client";

import React from "react";
import { Calendar, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  plan?: "LOANEE_STAY_SMART" | null;
  billingInterval?: "MONTHLY" | "YEARLY" | null;
  status?: "ACTIVE" | "TRIAL" | "INACTIVE";
  freeTierDaysLeft?: number | null;
  trialEndsAt?: string | Date | null;
  currentPeriodEnd?: string | Date | null;
};

export default function ManageSubscriptionOpener({
  plan,
  status = "TRIAL",
  freeTierDaysLeft = null,
  trialEndsAt,
  currentPeriodEnd,
}: Props) {
  const router = useRouter();

  const isPaid = status === "ACTIVE" && plan === "LOANEE_STAY_SMART";

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "—";
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };


  if (isPaid) {
    return (
      <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Subscription Status</h3>

          <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <CheckCircle className="h-4 w-4" />
            Active
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
          <div className="text-slate-500">Plan:</div>
          <div className="font-semibold">Smart (Yearly)</div>

          <div className="text-slate-500">Billing:</div>
          <div className="font-semibold">
            Prepaid subscription
          </div>

          <div className="text-slate-500">Access valid until:</div>
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4" />
            {formatDate(currentPeriodEnd)}
          </div>
        </div>

        <div className="mt-4 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-700">
          You’ve prepaid for extended access. Your subscription will renew on the
          date above unless cancelled.
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push("/loanee/subscription")}
            className="rounded-lg border px-5 py-2 font-semibold hover:bg-gray-50"
          >
            Change Subscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-1 mt-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <Image
              src="/subscripstatus.svg"
              alt="status"
              width={45}
              height={45}
              priority
            />
          </div>

          <h3 className="text-lg font-semibold">Subscription Status</h3>
        </div>

        <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          <CheckCircle className="h-4 w-4" />
          Active
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg border border-yellow-200 bg-[#FEF3C7] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F59E0B] text-[#FFFFFF]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg>
          </div>
          <span className="text-sm font-semibold text-yellow-800">
            Free Trial
          </span>
        </div>

        {typeof freeTierDaysLeft === "number" && (
          <span className="rounded-md bg-yellow-600 px-3 py-1 text-sm font-semibold text-white">
            {freeTierDaysLeft} days left
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-4 text-sm">
        <div className="grid grid-cols-2 gap-x-6">
          <span className="text-slate-500">Trial Plan:</span>
          <span className="font-semibold text-slate-900">Free Trial</span>
        </div>

        <div className="grid grid-cols-2 gap-x-6">
          <span className="text-slate-500">Access Info:</span>
          <span className="text-slate-700">
            You currently have full access to free tools during your trial.
          </span>
        </div>

        {trialEndsAt && (
          <div className="grid grid-cols-2 gap-x-6 items-center">
            <span className="text-slate-500">Trial End Date:</span>
            <span className="flex items-center gap-2 text-slate-700">
              <Calendar className="h-4 w-4 text-slate-500" />
              {formatDate(trialEndsAt)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => router.push("/loanee/subscription")}
          className="
          inline-flex items-center gap-2
          rounded-md bg-[#7C3AED]
          px-6 py-3
          text-sm font-semibold text-white
          shadow-sm transition
          hover:bg-[#6D28D9]
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
        "
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg> Upgrade Plan
        </button>
      </div>
    </div>
  );

}
