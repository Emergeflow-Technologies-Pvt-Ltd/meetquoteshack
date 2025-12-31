"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

type AgentReview = {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string | Date;
    application?: {
        loanType?: string | null;
    };
    loanee: {
        name: string | null;
    };
};

type Props = {
    reviews: AgentReview[];
};

export default function AgentReviewsPanel({ reviews }: Props) {
    const totalReviews = reviews.length;

    const avgRating =
        totalReviews === 0
            ? 0
            : reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    return (
        <Card className="border rounded-xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    My Reviews
                </CardTitle>
                <CardDescription>
                    View feedback and ratings shared by loanees you assisted.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <Card className="border rounded-lg">
                    <CardContent className="p-6 space-y-3">
                        <p className="text-sm font-medium text-violet-600">
                            Review Summary
                        </p>

                        <div className="flex items-end gap-4">
                            <span className="text-4xl font-bold text-violet-600">
                                {avgRating.toFixed(1)}
                            </span>

                            <div className="flex gap-1 pb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.round(avgRating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <p className="text-sm text-gray-500">
                            Based on {totalReviews} review{totalReviews !== 1 && "s"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border rounded-lg">
                    <CardContent className="p-0 divide-y">
                        {reviews.length === 0 && (
                            <div className="p-8 text-center text-sm text-gray-500">
                                No reviews received yet.
                            </div>
                        )}

                        {reviews.map((review) => {
                            const initials =
                                review.loanee.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2) ?? "U";

                            return (
                                <div key={review.id} className="p-6 flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold">
                                        {initials}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium">
                                                {review.loanee.name ?? "Anonymous"}
                                            </p>

                                            {review.application?.loanType && (
                                                <Badge variant="secondary">
                                                    {review.application.loanType
                                                        .replace(/_/g, " ")
                                                        .toLowerCase()
                                                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {review.comment && (
                                            <p className="text-sm text-gray-600">
                                                {review.comment}
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            Submitted on{" "}
                                            {new Date(review.createdAt)
                                                .toISOString()
                                                .split("T")[0]}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </CardContent>
        </Card>

    );
}
