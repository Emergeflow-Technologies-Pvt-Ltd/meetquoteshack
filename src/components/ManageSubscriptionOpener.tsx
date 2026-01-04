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
            ? "$300 / 2 years"
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

function TrialBanner({ daysLeft }: { daysLeft?: number | null }) {
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
