import { Badge } from "@/components/ui/badge";

type Props = {
  freeTierActive: boolean;
  freeTierEndsAt?: string | null;
};

export default function SubscriptionStartBanner({
  freeTierActive,
  freeTierEndsAt,
}: Props) {
  if (!freeTierActive || !freeTierEndsAt) return null;

  const startDate = new Date(freeTierEndsAt);

  return (
    <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3">
      <div className="flex items-start gap-3">
        <Badge className="bg-blue-100 text-blue-800">Subscription Status</Badge>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            Your will need susbcription after{" "}
            <span className="text-blue-700">
              {startDate.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>

          <p className="text-xs text-gray-600">
            You won’t be charged until this date.
          </p>
        </div>
      </div>
    </div>
  );
}
