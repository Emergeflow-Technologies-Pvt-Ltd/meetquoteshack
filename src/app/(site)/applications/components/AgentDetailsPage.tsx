import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import BookCallButton from "@/components/shared/BookCallButton";
import LeaveReviewAction from "./LeaveReviewAction";

type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  applicationId: string;
  loanee: {
    name: string | null;
  };
};

type Props = {
  agent: {
    id: string;
    name: string;
    email: string;
    phone: string;
    applicationsCount: number;
    calendlyUrl?: string | null;
  };
  reviews: Review[];
  applicationId?: string | null;
};

export default function AgentDetailsPage({
  agent,
  reviews,
  applicationId,
}: Props) {
  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const hasReviewed = reviews.some(
    (review) => review.applicationId === applicationId
  );

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : Number(
          (
            reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          ).toFixed(1)
        );

  return (
    <div className="mx-auto max-w-[1350px] space-y-10 py-12">
      <h1 className="mb-6 bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
        Agent Details
      </h1>
      <Card className="border-gray-200">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-2xl font-semibold text-white">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{agent.name}</h2>
                  <Badge variant="secondary">Assigned Agent</Badge>
                </div>
                <p className="text-sm text-gray-600">Email: {agent.email}</p>
                <p className="text-sm text-gray-600">Phone: {agent.phone}</p>
              </div>
            </div>
            {agent.calendlyUrl && (
              <div className="flex justify-start sm:justify-end">
                <BookCallButton calendlyUrl={agent.calendlyUrl} />
              </div>
            )}
          </div>

          <div className="ml-20 flex w-[1220px] flex-col gap-4 rounded-lg border border-violet-400 bg-violet-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Share Your Experience</h3>
              <p className="text-sm text-gray-600">
                How was your experience working with {agent.name}?
              </p>
            </div>

            {applicationId && (
              <LeaveReviewAction
                agent={{
                  id: agent.id,
                  name: agent.name,
                }}
                applicationId={applicationId}
                hasReviewed={hasReviewed}
              />
            )}
          </div>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Agent Performance</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard label="Average Rating" value={averageRating} stars />

              <StatCard label="Total Reviews" value={totalReviews} />

              <StatCard
                label="Clients Served"
                value={agent.applicationsCount}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Reviews</h3>

            {reviews.length === 0 && (
              <p className="text-sm text-gray-500">No reviews yet</p>
            )}

            {reviews.map((review) => (
              <div
                key={review.id}
                className="space-y-2 rounded-lg border bg-gray-100 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {review.loanee.name ?? "Anonymous"}
                  </span>
                  <div className="flex text-yellow-400">
                    {"★".repeat(review.rating)}
                  </div>
                </div>

                {review.comment && (
                  <p className="text-gray-600">{review.comment}</p>
                )}

                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toDateString()}
                </p>
              </div>
            ))}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  stars,
}: {
  label: string;
  value: number;
  stars?: boolean;
}) {
  return (
    <Card>
      <CardContent className="space-y-2 bg-gray-100 p-5">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-3xl font-semibold">{value}</p>
          {stars && (
            <div className="flex text-yellow-400">
              {Array.from({ length: Math.round(value) }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400" />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
