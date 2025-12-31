// app/api/agent/register/route.ts
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { BecomeAgentProps } from "@/lib/schema";
import { hash } from "bcrypt";

// Generate a unique agent code: AGENT-2024-JD847
function generateAgentCode() {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    randomPart += chars[Math.floor(Math.random() * chars.length)];
  }

  return `AGENT-${year}-${randomPart}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: BecomeAgentProps = await request.json();

    if (!body.email || !body.password || !body.name || !body.phone) {
      return new NextResponse("Missing required fields.", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return new NextResponse("User already exists.", { status: 400 });
    }

    const hashedPassword = await hash(body.password, 10);

    // Create user (AGENT)
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: "AGENT",
      },
    });

    // Generate and validate unique agent code
    let agentCode = generateAgentCode();
    let exists = await prisma.agent.findUnique({
      where: { agentCode },
    });

    while (exists) {
      agentCode = generateAgentCode();
      exists = await prisma.agent.findUnique({ where: { agentCode } });
    }

    // Create agent with permanent agentCode
    await prisma.agent.create({
      data: {
        userId: user.id,
        name: body.name,
        phone: body.phone,
        email: body.email,
        business: body.business,
        agentCode: agentCode, // <- permanently saved
      },
    });

    return new NextResponse(
      "Agent registration received. Quoteshack admin will reach out to you soon.",
      { status: 201 }
    );
  } catch (error) {
    console.error("Agent register error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
