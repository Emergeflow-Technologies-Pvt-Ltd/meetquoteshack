import { NextResponse } from "next/server";
import prisma from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id: applicationId } = await params;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            agentCode: true,
            calendlyUrl: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      agent: application.agent ?? null,
    });
  } catch (err) {
    console.error("GET /api/applications/[id]/agent error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id: applicationId } = await params;

    const body = await request.json();
    const agentId: string | undefined = body?.agentId;

    if (!agentId) {
      return NextResponse.json(
        { error: "agentId is required in request body" },
        { status: 400 }
      );
    }

    const existingApp = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!existingApp) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: { agentId },
    });

    console.log(`Assigned agent ${agentId} -> application ${applicationId}`);

    const updatedApp = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        agent: true,
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
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
