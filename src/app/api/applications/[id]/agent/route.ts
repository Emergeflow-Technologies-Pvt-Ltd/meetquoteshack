// app/api/applications/[id]/agent/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request, { params }: { params: any }) {
  try {
    // Must await params in App Router API routes
    const { id: applicationId } = await params;

    const body = await request.json();
    const agentId: string | undefined = body?.agentId;

    if (!agentId) {
      return NextResponse.json(
        { error: "agentId is required in request body" },
        { status: 400 }
      );
    }

    // Validate application exists
    const existingApp = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!existingApp) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Validate agent exists
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Assign agent to application
    await prisma.application.update({
      where: { id: applicationId },
      data: { agentId },
    });

    console.log(
      `Assigned agent ${agentId} -> application ${applicationId}`
    );

    // Return full hydrated application (optional but recommended)
    const updatedApp = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        agent: true, // <-- ensures agent is returned
        user: true,
        documents: true,
      },
    });

    return NextResponse.json({
      ok: true,
      application: updatedApp,
    });
  } catch (err) {
    console.error("POST /api/applications/[id]/agent error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
