import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agentId, applicationId, rating, comment } = await req.json();

    if (!agentId || !applicationId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // ✅ Only loanee can review
    if (session.user.role !== "LOANEE") {
      return NextResponse.json(
        { error: "Only loanees can submit reviews" },
        { status: 403 }
      );
    }

    // ✅ Validate application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // ✅ Ensure this loanee owns the application
    if (application.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not own this application" },
        { status: 403 }
      );
    }

    // ✅ Ensure agent is assigned
    if (application.agentId !== agentId) {
      return NextResponse.json(
        { error: "Agent not assigned to this application" },
        { status: 403 }
      );
    }

    // ✅ Prevent duplicate review
    const existingReview = await prisma.agentReview.findUnique({
      where: { applicationId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Review already submitted" },
        { status: 400 }
      );
    }

    const review = await prisma.agentReview.create({
      data: {
        agentId,
        applicationId,
        loaneeId: session.user.id,
        rating,
        comment,
      },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("POST /agent-reviews error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
