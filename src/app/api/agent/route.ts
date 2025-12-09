// app/api/agent/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    console.log("GET /api/agent -> found agents:", agents.length);
    return NextResponse.json(agents);
  } catch (err) {
    console.error("GET /api/agent error:", err);
    return NextResponse.json({ error: "Failed to load agents" }, { status: 500 });
  }
}
