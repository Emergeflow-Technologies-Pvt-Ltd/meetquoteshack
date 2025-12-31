import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure user is an AGENT
    if (session.user.role !== UserRole.AGENT) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const agent = await prisma.agent.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        agentCode: true,
        calendlyUrl: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (err) {
    console.error("GET /api/agent/profile error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
