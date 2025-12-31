"use client";

import { useRouter } from "next/navigation";

type Props = {
  isLoanee: boolean;
};

export default function UpgradePlanButton({ isLoanee }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() =>
        router.push(isLoanee ? "/loanee/subscription" : "/lender/plans")
      }
      className="inline-flex w-full items-center justify-center rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
    >
      Upgrade Plan
    </button>
  );
}
