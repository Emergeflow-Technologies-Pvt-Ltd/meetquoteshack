import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ✅ GET reviews
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;

    const reviews = await prisma.agentReview.findMany({
      where: { agentId },
      include: {
        loanee: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET agent reviews error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ POST review
export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "LOANEE") {
      return NextResponse.json(
        { error: "Only loanees can submit reviews" },
        { status: 403 }
      );
    }

    const { applicationId, rating, comment } = await req.json();

    if (!applicationId || !rating) {
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

    // ✅ Ensure loanee owns the application
    if (application.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not your application" },
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
    console.error("POST agent review error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
