// // "use client";

// // import React from "react";
// // import { Calendar, CheckCircle } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import Image from "next/image";

// // type Props = {
// //   plan?: "LOANEE_STAY_SMART" | null;
// //   billingInterval?: "MONTHLY" | "YEARLY" | null;
// //   status?: "ACTIVE" | "TRIAL" | "INACTIVE";
// //   freeTierDaysLeft?: number | null;
// //   trialEndsAt?: string | Date | null;
// //   currentPeriodEnd?: string | Date | null;
// // };

// // export default function ManageSubscriptionOpener({
// //   plan,
// //   status = "TRIAL",
// //   freeTierDaysLeft = null,
// //   trialEndsAt,
// //   currentPeriodEnd,
// // }: Props) {
// //   const router = useRouter();

// //   const isPaid = status === "ACTIVE" && plan === "LOANEE_STAY_SMART";

// //   const formatDate = (date?: string | Date | null) => {
// //     if (!date) return "—";
// //     const d = typeof date === "string" ? new Date(date) : date;
// //     return new Intl.DateTimeFormat(undefined, {
// //       month: "short",
// //       day: "numeric",
// //       year: "numeric",
// //     }).format(d);
// //   };

// //   if (isPaid) {
// //     return (
// //       <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
// //         <div className="flex items-start justify-between">
// //           <h3 className="text-lg font-semibold">Subscription Status</h3>

// //           <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
// //             <CheckCircle className="h-4 w-4" />
// //             Active
// //           </span>
// //         </div>

// //         <div className="mt-6 grid grid-cols-2 gap-y-4 text-sm">
// //           <div className="text-slate-500">Plan:</div>
// //           <div className="font-semibold">Smart (Yearly)</div>

// //           <div className="text-slate-500">Billing:</div>
// //           <div className="font-semibold">
// //             Prepaid subscription
// //           </div>

// //           <div className="text-slate-500">Access valid until:</div>
// //           <div className="flex items-center gap-2 font-semibold">
// //             <Calendar className="h-4 w-4" />
// //             {formatDate(currentPeriodEnd)}
// //           </div>
// //         </div>

// //         <div className="mt-4 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-700">
// //           You’ve prepaid for extended access. Your subscription will renew on the
// //           date above unless cancelled.
// //         </div>

// //         <div className="mt-6">
// //           <button
// //             onClick={() => router.push("/loanee/subscription")}
// //             className="rounded-lg border px-5 py-2 font-semibold hover:bg-gray-50"
// //           >
// //             Change Subscription
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full bg-white p-1 mt-5 shadow-sm">
// //       <div className="flex items-start justify-between">
// //         <div className="flex items-center gap-3">
// //           <div className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
// //             <Image
// //               src="/subscripstatus.svg"
// //               alt="status"
// //               width={45}
// //               height={45}
// //               priority
// //             />
// //           </div>

// //           <h3 className="text-lg font-semibold">Subscription Status</h3>
// //         </div>

// //         <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
// //           <CheckCircle className="h-4 w-4" />
// //           Active
// //         </span>
// //       </div>

// //       <div className="mt-6 flex items-center justify-between rounded-lg border border-yellow-200 bg-[#FEF3C7] px-4 py-3">
// //         <div className="flex items-center gap-3">
// //           <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F59E0B] text-[#FFFFFF]">
// //             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg>
// //           </div>
// //           <span className="text-sm font-semibold text-yellow-800">
// //             Free Trial
// //           </span>
// //         </div>

// //         {typeof freeTierDaysLeft === "number" && (
// //           <span className="rounded-md bg-yellow-600 px-3 py-1 text-sm font-semibold text-white">
// //             {freeTierDaysLeft} days left
// //           </span>
// //         )}
// //       </div>

// //       <div className="mt-6 grid grid-cols-1 gap-y-4 text-sm">
// //         <div className="grid grid-cols-2 gap-x-6">
// //           <span className="text-slate-500">Trial Plan:</span>
// //           <span className="font-semibold text-slate-900">Free Trial</span>
// //         </div>

// //         <div className="grid grid-cols-2 gap-x-6">
// //           <span className="text-slate-500">Access Info:</span>
// //           <span className="text-slate-700">
// //             You currently have full access to free tools during your trial.
// //           </span>
// //         </div>

// //         {trialEndsAt && (
// //           <div className="grid grid-cols-2 gap-x-6 items-center">
// //             <span className="text-slate-500">Trial End Date:</span>
// //             <span className="flex items-center gap-2 text-slate-700">
// //               <Calendar className="h-4 w-4 text-slate-500" />
// //               {formatDate(trialEndsAt)}
// //             </span>
// //           </div>
// //         )}
// //       </div>

// //       <div className="mt-8">
// //         <button
// //           type="button"
// //           onClick={() => router.push("/loanee/subscription")}
// //           className="
// //           inline-flex items-center gap-2
// //           rounded-md bg-[#7C3AED]
// //           px-6 py-3
// //           text-sm font-semibold text-white
// //           shadow-sm transition
// //           hover:bg-[#6D28D9]
// //           focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
// //         "
// //         >
// //           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg> Upgrade Plan
// //         </button>
// //       </div>
// //     </div>
// //   );

// // }

// "use client";

// import React from "react";
// import { Calendar, CheckCircle } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { LOANEE_PRICES } from "@/lib/loanee-prices";
// import ManageSubscriptionButton from "./shared/ManageSubscriptionButton";
// import { Card, CardContent } from "./ui/card";

// type Props = {
//   plan?: "LOANEE_STAY_SMART" | null;
//   billingInterval?: "MONTHLY" | "YEARLY" | null;
//   status?: "ACTIVE" | "TRIAL" | "INACTIVE";
//   freeTierDaysLeft?: number | null;
//   trialEndsAt?: string | Date | null;
//   currentPeriodEnd?: string | Date | null;
// };

// export default function ManageSubscriptionOpener({
//   plan,
//   billingInterval,
//   status = "TRIAL",
//   freeTierDaysLeft = null,
//   trialEndsAt,
//   currentPeriodEnd,
// }: Props) {
//   const router = useRouter();

//   const isPaid = status === "ACTIVE" && plan === "LOANEE_STAY_SMART";

//   const formatDate = (date?: string | Date | null) => {
//     if (!date) return "—";
//     const d = typeof date === "string" ? new Date(date) : date;
//     return new Intl.DateTimeFormat("en-US", {
//       month: "short",
//       day: "2-digit",
//       year: "numeric",
//     }).format(d);
//   };

//   /* =========================
//      PAID (SMART PLAN)
//      ========================= */
// //   if (isPaid) {
// //     // resolve interval key used by loanee plans
// //     const intervalKey =
// //       billingInterval === "MONTHLY"
// //         ? "monthly"
// //         : billingInterval === "YEARLY"
// //         ? "yearly"
// //         : "twoYear";

// //     const priceMeta =
// //       LOANEE_PRICES.smart[
// //         intervalKey as keyof typeof LOANEE_PRICES.smart
// //       ];

// //     const billingLabel =
// //       intervalKey === "monthly"
// //         ? "Monthly"
// //         : intervalKey === "yearly"
// //         ? "1-Year"
// //         : "2-Year";

// //     return (
// //       // <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
// //       <Card className="border-2">
// //         <CardContent className="pt-6">

// //         {/* Header */}
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <Image
// //               src="/subscripstatus.svg"
// //               alt="Subscription status"
// //               width={20}
// //               height={20}
// //             />
// //             <h3 className="text-lg font-semibold">Subscription Status</h3>
// //           </div>

// //           <span className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-800 cursor-default">
// //             <CheckCircle size={14} /> Active
// //           </span>
// //         </div>

// //         {/* Details (aligned with UI image) */}
// //         <div className="mt-8 grid grid-cols-2 gap-y-6 text-sm">
// //           <span className="text-[#64748B]">Plan Name:</span>
// //           <span className="font-semibold text-[#0F172A]">
// //             Stay Smart
// //           </span>

// //           <span className="text-[#64748B]">Price:</span>
// //           <span className="font-semibold text-[#0F172A]">
// //             {priceMeta?.label ?? "—"}
// //           </span>

// //           <span className="text-[#64748B]">Billing Cycle:</span>
// //           <span className="font-medium text-[#0F172A]">
// //             {billingLabel}
// //           </span>

// //           <span className="text-[#64748B]">Next Billing Date:</span>
// //           <span className="flex items-center gap-2 font-medium text-[#0F172A]">
// //             <Calendar size={16} className="text-[#64748B]" />
// //             Renews on {formatDate(currentPeriodEnd)}
// //           </span>
// //         </div>

// //         {/* CTA */}
// //         <ManageSubscriptionButton />

// //         {/* <div className="mt-8">
// //           <button
// //             onClick={() => router.push("/loanee/subscription")}
// //             className="rounded-lg border px-5 py-2 font-semibold hover:bg-gray-50"
// //           >
// //             Manage Subscription
// //           </button>
// //         </div> */}
// //       {/* </div> */}
// // </CardContent>
// //       </Card>
// //     );
// //   }

// if (isPaid) {
//   const intervalKey =
//     billingInterval === "MONTHLY"
//       ? "monthly"
//       : billingInterval === "YEARLY"
//       ? "yearly"
//       : "twoYear";

//   const priceMeta =
//     LOANEE_PRICES.smart[
//       intervalKey as keyof typeof LOANEE_PRICES.smart
//     ];

//   const billingLabel =
//     intervalKey === "monthly"
//       ? "Monthly"
//       : intervalKey === "yearly"
//       ? "1-Year"
//       : "2-Year";

//   return (
//     <Card className="border">
//       <CardContent className="px-8 py-7">
//         {/* Header */}
//         <div className="flex flex-row items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Image
//               src="/subscripstatus.svg"
//               alt="Subscription status"
//               width={20}
//               height={20}
//             />
//             <h3 className="text-lg font-semibold text-[#0F172A]">
//               Subscription Status
//             </h3>
//           </div>

//           <span className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-800 cursor-default">
//             <CheckCircle size={14} /> Active
//           </span>
//         </div>

//         {/* Details */}
//         <div className="mt-10 grid grid-cols-[220px_1fr] gap-y-6">
//           <span className="text-sm text-[#64748B]">Plan Name:</span>
//           <span className="text-base font-semibold text-[#0F172A]">
//             Stay Smart
//           </span>

//           <span className="text-sm text-[#64748B]">Price:</span>
//           <span className="text-base font-semibold text-[#0F172A]">
//             {priceMeta?.label ?? "—"}
//           </span>

//           <span className="text-sm text-[#64748B]">Billing Cycle:</span>
//           <span className="text-base font-medium text-[#0F172A]">
//             {billingLabel}
//           </span>

//           <span className="text-sm text-[#64748B]">Next Billing Date:</span>
//           <span className="flex items-center gap-2 text-base font-medium text-[#0F172A]">
//             <Calendar size={16} className="text-[#64748B]" />
//             Renews on {formatDate(currentPeriodEnd)}
//           </span>
//         </div>

//         {/* CTA */}
//         <div className="mt-10">
//           <ManageSubscriptionButton />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

//   /* =========================
//      FREE TRIAL
//      ========================= */
//   return (
//     <div className="w-full bg-white p-6 shadow-sm rounded-xl border">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-3">
//           <Image
//             src="/subscripstatus.svg"
//             alt="status"
//             width={20}
//             height={20}
//           />
//           <h3 className="text-lg font-semibold">Subscription Status</h3>
//         </div>

//         <span className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-800 cursor-default">
//           <CheckCircle size={14} /> Active
//         </span>
//       </div>

//       {/* Trial banner */}
//       <div className="mt-6 flex items-center justify-between rounded-lg border border-yellow-200 bg-[#FEF3C7] px-4 py-3">
//         <div className="flex items-center gap-3">
//           <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F59E0B] text-white">
//             ✨
//           </div>
//           <span className="text-sm font-semibold text-yellow-800">
//             Free Trial
//           </span>
//         </div>

//         {typeof freeTierDaysLeft === "number" && (
//           <span className="rounded-md bg-yellow-600 px-3 py-1 text-sm font-semibold text-white">
//             {freeTierDaysLeft} days left
//           </span>
//         )}
//       </div>

//       {/* Trial details */}
//       <div className="mt-6 grid gap-y-4 text-sm">
//         <div className="grid grid-cols-2">
//           <span className="text-slate-500">Trial Plan:</span>
//           <span className="font-semibold">Free Trial</span>
//         </div>

//         <div className="grid grid-cols-2">
//           <span className="text-slate-500">Access Info:</span>
//           <span className="text-slate-700">
//             You currently have full access to free tools during your trial.
//           </span>
//         </div>

//         {trialEndsAt && (
//           <div className="grid grid-cols-2 items-center">
//             <span className="text-slate-500">Trial End Date:</span>
//             <span className="flex items-center gap-2 text-slate-700">
//               <Calendar size={16} className="text-slate-500" />
//               {formatDate(trialEndsAt)}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* CTA */}
//       <div className="mt-8">
//         <button
//           type="button"
//           onClick={() => router.push("/loanee/subscription")}
//           className="inline-flex items-center gap-2 rounded-md bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6D28D9]"
//         >
//           ✨ Upgrade Plan
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { Calendar, CheckCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ManageSubscriptionButton from "@/components/shared/ManageSubscriptionButton";
import { LOANEE_PRICES } from "@/lib/loanee-prices";

type Role = "LOANEE" | "LENDER";

interface Props {
  role: Role;
  data: any;
}

function formatDate(date?: string | Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function ManageSubscriptionOpener({ role, data }: Props) {
  /* ================================
     LOANEE LOGIC
     ================================ */
  if (role === "LOANEE") {
    const sub = data?.subscription;
    const free = data?.freeTier;

    const isPaid = sub?.status === "ACTIVE";

    // -------- PAID LOANEE ----------
    if (isPaid) {
      const intervalKey =
        sub.billingInterval === "MONTHLY"
          ? "monthly"
          : sub.billingInterval === "YEARLY"
            ? "yearly"
            : "twoYear";

      const priceMeta =
        LOANEE_PRICES.smart[intervalKey as keyof typeof LOANEE_PRICES.smart];

      const billingLabel =
        intervalKey === "monthly"
          ? "Monthly"
          : intervalKey === "yearly"
            ? "1-Year"
            : "2-Year";

      return (
        <Card>
          <CardContent className="px-8 py-7">
            <Header />

            <Details
              rows={[
                ["Plan Name:", "Stay Smart"],
                ["Price:", priceMeta?.label ?? "—"],
                ["Billing Cycle:", billingLabel],
                [
                  "Next Billing Date:",
                  <>
                    <Calendar size={16} className="text-[#64748B]" />
                    Renews on {formatDate(sub.currentPeriodEnd)}
                  </>,
                ],
              ]}
            />

            <div className="mt-10">
              <ManageSubscriptionButton />
            </div>
          </CardContent>
        </Card>
      );
    }

    // -------- FREE TRIAL LOANEE ----------
    return (
      <Card>
        <CardContent className="px-8 py-7">
          <Header />

          <TrialBanner daysLeft={free?.daysLeft} />

          <Details
            rows={[
              ["Trial Plan:", "Free Trial"],
              [
                "Access Info:",
                "You currently have full access to free tools during your trial.",
              ],
              [
                "Trial End Date:",
                <>
                  <Calendar size={16} className="text-[#64748B]" />
                  {formatDate(free?.endsAt)}
                </>,
              ],
            ]}
          />

          <UpgradeCTA href="/loanee/subscription" />
        </CardContent>
      </Card>
    );
  }

  /* ================================
     LENDER LOGIC
     ================================ */
  if (role === "LENDER") {
    // -------- FREE TRIAL ----------
    if (data?.freeTierActive && !data.subscription) {
      return (
        <Card>
          <CardContent className="px-8 py-7">
            <Header />

            <TrialBanner daysLeft={data.freeTierDaysLeft} />

            <Details
              rows={[
                ["Trial Plan:", "Free Trial"],
                [
                  "Access Info:",
                  "You currently have full access to lender tools during your trial.",
                ],
                [
                  "Trial End Date:",
                  <>
                    <Calendar size={16} className="text-[#64748B]" />
                    {formatDate(data.freeTierEndsAt)}
                  </>,
                ],
              ]}
            />

            <UpgradeCTA href="/lender/plans" />
          </CardContent>
        </Card>
      );
    }

    // -------- PAID LENDER ----------
    // -------- PAID LENDER ----------
    const sub = data?.subscription;

    if (!sub) {
      return (
        <Card>
          <CardContent className="px-8 py-7">
            <Header />

            <Details
              rows={[
                ["Plan Name:", "—"],
                ["Status:", "No active subscription"],
              ]}
            />

            <UpgradeCTA href="/lender/plans" />
          </CardContent>
        </Card>
      );
    }

    const planLabelMap: Record<string, string> = {
      LENDER_SIMPLE: "Simple",
      LENDER_STANDARD: "Standard",
    };

    const planBase = (sub.plan && planLabelMap[sub.plan]) ?? "—";
    const end = sub.currentPeriodEnd
      ? new Date(sub.currentPeriodEnd).getTime()
      : null;

    const daysLeft = end
      ? Math.round((end - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    let billingCycle = "Monthly";
    let price = "—";

    if (sub.billingInterval === "YEARLY") {
      billingCycle = daysLeft && daysLeft > 500 ? "2 Years" : "1 Year";
      price =
        sub.plan === "LENDER_SIMPLE"
          ? billingCycle === "2 Years"
            ? "$360 / 2 years"
            : "$210 / year"
          : billingCycle === "2 Years"
            ? "$588 / 2 years"
            : "$411 / year";
    } else {
      price = sub.plan === "LENDER_SIMPLE" ? "$25 / month" : "$49 / month";
    }

    return (
      <Card>
        <CardContent className="px-8 py-7">
          <Header />

          <Details
            rows={[
              ["Plan Name:", `${planBase}`],
              ["Price:", price],
              ["Billing Cycle:", billingCycle],
              [
                "Next Billing Date:",
                <>
                  <Calendar size={16} className="text-[#64748B]" />
                  Renews on {formatDate(sub.currentPeriodEnd)}
                </>,
              ],
            ]}
          />

          <div className="mt-10">
            <ManageSubscriptionButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

/* ================================
   SMALL INTERNAL COMPONENTS
   ================================ */

function Header() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src="/subscripstatus.svg" alt="" width={20} height={20} />
        <h3 className="text-lg font-semibold">Subscription Status</h3>
      </div>

      <span className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
        <CheckCircle size={14} /> Active
      </span>
    </div>
  );
}

function Details({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <div className="mt-10 grid grid-cols-[220px_1fr] gap-y-6">
      {rows.map(([label, value], i) => (
        <div key={i} className="contents">
          <span className="text-sm text-[#64748B]">{label}</span>
          <span className="flex items-center gap-2 text-base font-medium">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function TrialBanner({ daysLeft }: { daysLeft?: number }) {
  return (
    <div className="mt-6 flex items-center justify-between rounded-lg border border-yellow-200 bg-[#FEF3C7] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F59E0B] text-white">
          <Sparkles size={16} />
        </div>
        <span className="text-sm font-semibold text-yellow-800">
          Free Trial
        </span>
      </div>

      {typeof daysLeft === "number" && (
        <span className="rounded-md bg-yellow-600 px-3 py-1 text-sm font-semibold text-white">
          {daysLeft} days left
        </span>
      )}
    </div>
  );
}

function UpgradeCTA({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700"
    >
      <Sparkles size={16} /> Upgrade Plan
    </a>
  );
}
